# Phase 6 Implementation Plan: TypeScript Definitions

Concrete, step-by-step plan for adding TypeScript type definitions to the jStat
library. Every change is either a new file (`.d.ts`, `.ts`, `.json`), a minor
`package.json` update, or a configuration tweak. Zero source code changes, zero
public API changes, one new dev dependency (`typescript`).

**Prerequisite:** Phase 5 (CI/CD) is complete. The test suite has 382 tests, all
passing. ESLint, Prettier, and GitHub Actions CI are configured and green. The
project has five dev dependencies.

**Authoritative reference:** `doc/other/phase6-research.md` contains the full API
surface catalog, typing challenge analysis, and type architecture design. This
plan distills it into executable steps.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1: Install TypeScript](#2-step-1-install-typescript)
3. [Step 2: Create TypeScript Configuration](#3-step-2-create-typescript-configuration)
4. [Step 3: Create Type Definition File](#4-step-3-create-type-definition-file)
5. [Step 4: Create Type Tests](#5-step-4-create-type-tests)
6. [Step 5: Update package.json](#6-step-5-update-packagejson)
7. [Step 6: Update .prettierignore](#7-step-6-update-prettierignore)
8. [Step 7: Update ESLint Configuration](#8-step-7-update-eslint-configuration)
9. [Step 8: Update .gitignore](#9-step-8-update-gitignore)
10. [Step 9: Run Type Check and Verify](#10-step-9-run-type-check-and-verify)
11. [Step 10: Update CI Workflow](#11-step-10-update-ci-workflow)
12. [Step 11: Final Verification](#12-step-11-final-verification)
13. [Completion Criteria](#13-completion-criteria)

---

## 1. Prerequisites

### 1.1 Verify Baseline

Before making any changes, confirm the build, tests, lint, and format all work:

```bash
npm run build
npm test
npm run lint
npm run format:check
```

Expected:
- Build succeeds, producing four dist files.
- 382 tests, 382 passing, 0 failing.
- ESLint exits 0 (no errors, `no-shadow` warnings acceptable).
- Prettier exits 0 (all files formatted).

### 1.2 Current Dev Dependencies

The project should have exactly five dev dependencies:

```json
{
    "@rollup/plugin-terser": "^0.4.4",
    "eslint": "^10.0.2",
    "eslint-config-prettier": "^10.1.8",
    "prettier": "^3.8.1",
    "rollup": "^4.59.0"
}
```

Phase 6 adds **one** new dev dependency: `typescript`.

### 1.3 Current npm Scripts

```json
{
    "build": "rollup -c",
    "test": "npm run build && node --test \"test/**/*-test.js\"",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
}
```

Phase 6 adds **one** new script: `typecheck`.

### 1.4 Current package.json exports

```json
{
    "main": "./dist/jstat.js",
    "module": "./dist/jstat.esm.mjs",
    "exports": {
        ".": {
            "import": "./dist/jstat.esm.mjs",
            "require": "./dist/jstat.cjs.js",
            "default": "./dist/jstat.js"
        }
    }
}
```

No `types` field exists. No `.d.ts` files exist anywhere in the project.

### 1.5 Files to Create

| File | Purpose |
|------|---------|
| `dist/jstat.d.ts` | Complete TypeScript type definitions |
| `test/types/jstat-test.ts` | Type tests (compile-only, no runtime) |
| `tsconfig.types.json` | TypeScript config for type-checking only |

### 1.6 Files to Modify

| File | Change |
|------|--------|
| `package.json` | Add `types` field, update `exports` map, add `typescript` dev dependency, add `typecheck` script |
| `.prettierignore` | Add `*.d.ts` (Prettier should not reformat the type definitions) |
| `.gitignore` | Add exception for `dist/jstat.d.ts` |
| `eslint.config.js` | Add `test/types/**` to global ignores |
| `.github/workflows/ci.yml` | Add type-check step to `lint-and-format` job |

---

## 2. Step 1: Install TypeScript

```bash
npm install --save-dev typescript
```

This adds 1 new dev dependency. TypeScript is only used for type-checking the
definition file and type tests -- it is NOT used to compile any source code.

### 2.1 Verify Installation

```bash
npx tsc --version
```

Expected: TypeScript 5.x.

### 2.2 Verify `package.json` Updated

```bash
node -e "const p = require('./package.json'); console.log(Object.keys(p.devDependencies).sort().join('\n'))"
```

Expected output:

```
@rollup/plugin-terser
eslint
eslint-config-prettier
prettier
rollup
typescript
```

Six dev dependencies total.

### 2.3 Do NOT Commit Yet

This change will be committed together with all other Phase 6 changes.

---

## 3. Step 2: Create TypeScript Configuration

### 3.1 Create `tsconfig.types.json`

Create the file at the project root with the following exact contents:

```json
{
    "compilerOptions": {
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "moduleResolution": "node",
        "target": "ES2020",
        "module": "commonjs",
        "baseUrl": ".",
        "paths": {
            "jstat": ["./dist/jstat"]
        }
    },
    "include": ["test/types/**/*.ts", "dist/jstat.d.ts"]
}
```

### 3.2 Design Decisions

| Decision | Rationale |
|----------|-----------|
| `strict: true` | Maximum type safety -- ensures the definitions work under the strictest consumer settings |
| `noEmit: true` | Type-checking only, no JavaScript output. The `.ts` files are never compiled to `.js`. |
| `esModuleInterop: true` | Required for `import jStat from 'jstat'` to work with `export = jStat`. This is the default in modern TypeScript configs. |
| `moduleResolution: "node"` | Standard Node.js module resolution. Finds types via `package.json` `"types"` field. |
| `paths` mapping | Maps `import ... from 'jstat'` to the local `dist/jstat.d.ts` during development. In published packages, TypeScript resolves via `package.json` `"types"` instead. |
| `include` array | Only type-checks the type test files and the `.d.ts` file. Does not touch source or regular test files. |
| Named `tsconfig.types.json` | Separate from any future `tsconfig.json` (which might be created if the source is ever converted to TypeScript). The `--project` flag targets this specific config. |

### 3.3 Verify the File

```bash
node -e "const c = require('./tsconfig.types.json'); console.log(JSON.stringify(c.compilerOptions.strict))"
```

Expected: `true`

---

## 4. Step 3: Create Type Definition File

### 4.1 Create `dist/jstat.d.ts`

Create the file with the following exact contents. This is the complete type
definition for the entire jStat public API:

```typescript
// Type definitions for jStat 1.x
// Project: https://github.com/jstat/jstat
// Definitions by: jStat Contributors

// --- Helper Types ---

type Matrix = number[][];
type Vector = number[];
type MapFunc = (value: number, row: number, col: number) => number;
type ReduceFunc = (prev: number, curr: number) => number;

interface RCSlice {
  row?: number | { start?: number; end?: number; step?: number };
  col?: number | { start?: number; end?: number; step?: number };
}

// --- OLS Model ---

interface OLSModel {
  exog: Matrix;
  endog: Vector;
  nobs: number;
  df_model: number;
  df_resid: number;
  coef: Vector;
  predict: Vector;
  resid: Vector;
  ybar: number;
  SST: number;
  SSE: number;
  SSR: number;
  R2: number;
  adjust_R2: number;
  t: {
    se: Vector;
    t: Vector;
    p: Vector;
    sigmaHat: number;
    interval95: [number, number][];
  };
  f: {
    F_statistic: number;
    pvalue: number;
  };
}

// --- Regression Result ---

interface RegressTResult {
  regress: jStat;
  anova: {
    residuals: jStat;
    ssr: number;
    msr: number;
    sse: number;
    mse: number;
    sst: number;
    mst: number;
    r2: number;
    fratio: number;
    pvalue: number;
    rmse: number;
    r2adj: number;
  };
  yBar: jStat;
  stats: [number, number, number, number][];
}

// --- Distribution Instance (created by jStat.dist(params)) ---

interface DistributionInstance {
  pdf(x: number): number;
  pdf(x?: number | Vector | Matrix | jStat): number | jStat;
  cdf(x: number): number;
  cdf(x?: number | Vector | Matrix | jStat): number | jStat;
  inv(p: number): number;
  inv(p?: number | Vector | Matrix | jStat): number | jStat;
  mean(): number;
  median(): number;
  mode(): number;
  variance(): number;
  sample(): number;
  sample(arr: Matrix): Matrix;
  data?: jStat;
  _a: number;
  _b: number;
  _c: number;
}

// --- Distribution Static Interfaces ---

// Full 2-parameter distribution (most common)
interface Distribution2ParamFull {
  (p1: number, p2: number): DistributionInstance;
  pdf(x: number, p1: number, p2: number): number;
  cdf(x: number, p1: number, p2: number): number;
  inv(p: number, p1: number, p2: number): number;
  mean(p1: number, p2: number): number;
  median(p1: number, p2: number): number;
  mode(p1: number, p2: number): number;
  variance(p1: number, p2: number): number;
  sample(p1: number, p2: number): number;
}

// Full 1-parameter distribution
interface Distribution1ParamFull {
  (p1: number): DistributionInstance;
  pdf(x: number, p1: number): number;
  cdf(x: number, p1: number): number;
  inv(p: number, p1: number): number;
  mean(p1: number): number;
  median(p1: number): number;
  mode(p1: number): number;
  variance(p1: number): number;
  sample(p1: number): number;
}

// Full 3-parameter distribution
interface Distribution3ParamFull {
  (p1: number, p2: number, p3: number): DistributionInstance;
  pdf(x: number, p1: number, p2: number, p3: number): number;
  cdf(x: number, p1: number, p2: number, p3: number): number;
  inv(p: number, p1: number, p2: number, p3: number): number;
  mean(p1: number, p2: number, p3: number): number;
  median(p1: number, p2: number, p3: number): number;
  mode(p1: number, p2: number, p3: number): number;
  variance(p1: number, p2: number, p3: number): number;
  sample(p1: number, p2: number, p3: number): number;
}

// Cauchy: no mean or variance
interface CauchyStatic {
  (local: number, scale: number): DistributionInstance;
  pdf(x: number, local: number, scale: number): number;
  cdf(x: number, local: number, scale: number): number;
  inv(p: number, local: number, scale: number): number;
  median(local: number, scale: number): number;
  mode(local: number, scale: number): number;
  sample(local: number, scale: number): number;
}

// CentralF: no median
interface CentralFStatic {
  (df1: number, df2: number): DistributionInstance;
  pdf(x: number, df1: number, df2: number): number;
  cdf(x: number, df1: number, df2: number): number;
  inv(p: number, df1: number, df2: number): number;
  mean(df1: number, df2: number): number | undefined;
  mode(df1: number, df2: number): number | undefined;
  variance(df1: number, df2: number): number | undefined;
  sample(df1: number, df2: number): number;
}

// Noncentralt: only pdf and cdf
interface NoncentraltStatic {
  (dof: number, ncp: number): DistributionInstance;
  pdf(x: number, dof: number, ncp: number): number;
  cdf(x: number, dof: number, ncp: number): number;
}

// Binomial: only pdf and cdf
interface BinomialStatic {
  (n: number, p: number): DistributionInstance;
  pdf(k: number, n: number, p: number): number;
  cdf(x: number, n: number, p: number): number;
}

// Negbin: only pdf and cdf
interface NegbinStatic {
  (r: number, p: number): DistributionInstance;
  pdf(k: number, r: number, p: number): number;
  cdf(x: number, r: number, p: number): number;
}

// Hypgeom: 3-param distribution, pdf/cdf only (pdf/cdf take 4 args: k/x + N + m + n)
interface HypgeomStatic {
  (N: number, m: number, n: number): DistributionInstance;
  pdf(k: number, N: number, m: number, n: number): number;
  cdf(x: number, N: number, m: number, n: number): number;
}

// Poisson: pdf, cdf, mean, variance, sample (+ sampleSmall, sampleLarge)
interface PoissonStatic {
  (l: number): DistributionInstance;
  pdf(k: number, l: number): number;
  cdf(x: number, l: number): number;
  mean(l: number): number;
  variance(l: number): number;
  sample(l: number): number;
  sampleSmall(l: number): number;
  sampleLarge(l: number): number;
}

// Tukey: only cdf and inv
interface TukeyStatic {
  (nmeans: number, df: number): DistributionInstance;
  cdf(q: number, nmeans: number, df: number): number;
  inv(p: number, nmeans: number, df: number): number;
}

// Gamma: no median
interface GammaStatic {
  (shape: number, scale: number): DistributionInstance;
  pdf(x: number, shape: number, scale: number): number;
  cdf(x: number, shape: number, scale: number): number;
  inv(p: number, shape: number, scale: number): number;
  mean(shape: number, scale: number): number;
  mode(shape: number, scale: number): number | undefined;
  variance(shape: number, scale: number): number;
  sample(shape: number, scale: number): number;
}

// InvGamma: no median
interface InvgammaStatic {
  (shape: number, scale: number): DistributionInstance;
  pdf(x: number, shape: number, scale: number): number;
  cdf(x: number, shape: number, scale: number): number;
  inv(p: number, shape: number, scale: number): number;
  mean(shape: number, scale: number): number | undefined;
  mode(shape: number, scale: number): number;
  variance(shape: number, scale: number): number | undefined;
  sample(shape: number, scale: number): number;
}

// Kumaraswamy: variance throws, no sample
interface KumaraswamyStatic {
  (alpha: number, beta: number): DistributionInstance;
  pdf(x: number, alpha: number, beta: number): number;
  cdf(x: number, alpha: number, beta: number): number;
  inv(p: number, alpha: number, beta: number): number;
  mean(alpha: number, beta: number): number;
  median(alpha: number, beta: number): number;
  mode(alpha: number, beta: number): number | undefined;
  variance(alpha: number, beta: number): never;
}

// Pareto: no sample
interface ParetoStatic {
  (scale: number, shape: number): DistributionInstance;
  pdf(x: number, scale: number, shape: number): number;
  cdf(x: number, scale: number, shape: number): number;
  inv(p: number, scale: number, shape: number): number;
  mean(scale: number, shape: number): number | undefined;
  median(scale: number, shape: number): number;
  mode(scale: number, shape: number): number;
  variance(scale: number, shape: number): number | undefined;
}

// Laplace: no inv
interface LaplaceStatic {
  (mu: number, b: number): DistributionInstance;
  pdf(x: number, mu: number, b: number): number;
  cdf(x: number, mu: number, b: number): number;
  mean(mu: number, b: number): number;
  median(mu: number, b: number): number;
  mode(mu: number, b: number): number;
  variance(mu: number, b: number): number;
  sample(mu: number, b: number): number;
}

// Uniform: mode throws
interface UniformStatic {
  (a: number, b: number): DistributionInstance;
  pdf(x: number, a: number, b: number): number;
  cdf(x: number, a: number, b: number): number;
  inv(p: number, a: number, b: number): number;
  mean(a: number, b: number): number;
  median(a: number, b: number): number;
  mode(a: number, b: number): never;
  variance(a: number, b: number): number;
  sample(a: number, b: number): number;
}

// Arcsine: mode throws
interface ArcsineStatic {
  (a: number, b: number): DistributionInstance;
  pdf(x: number, a: number, b: number): number;
  cdf(x: number, a: number, b: number): number;
  inv(p: number, a: number, b: number): number;
  mean(a: number, b: number): number;
  median(a: number, b: number): number;
  mode(a: number, b: number): never;
  variance(a: number, b: number): number;
  sample(a: number, b: number): number;
}

// --- jStat Instance Interface ---

interface jStat {
  // Array-like indexing
  [index: number]: Vector;
  length: number;

  // Array methods
  push(...items: any[]): number;
  sort(compareFn?: (a: any, b: any) => number): this;
  splice(start: number, deleteCount?: number, ...items: any[]): any[];
  slice(start?: number, end?: number): any[];

  // Core instance methods
  toArray(): Vector | Matrix;
  map(func: MapFunc, toAlter?: boolean): jStat;
  cumreduce(func: ReduceFunc, toAlter?: boolean): jStat;
  alter(func: MapFunc): jStat;

  // No-argument instance methods (with optional callback)
  transpose(): jStat;
  transpose(callback: (this: jStat, value: jStat) => void): jStat;
  clear(): jStat;
  clear(callback: (this: jStat, value: jStat) => void): jStat;
  symmetric(): boolean;
  symmetric(callback: (this: jStat, value: boolean) => void): jStat;
  rows(): number;
  rows(callback: (this: jStat, value: number) => void): jStat;
  cols(): number;
  cols(callback: (this: jStat, value: number) => void): jStat;
  dimensions(): { rows: number; cols: number };
  dimensions(
    callback: (this: jStat, value: { rows: number; cols: number }) => void
  ): jStat;
  diag(): jStat;
  diag(callback: (this: jStat, value: jStat) => void): jStat;
  antidiag(): jStat;
  antidiag(callback: (this: jStat, value: jStat) => void): jStat;

  // One-argument instance methods (with optional callback)
  row(index: number): jStat;
  row(
    index: number,
    callback: (this: jStat, value: jStat) => void
  ): jStat;
  col(index: number): jStat;
  col(
    index: number,
    callback: (this: jStat, value: jStat) => void
  ): jStat;

  // Factory instance methods
  create(rows: number, cols: number, func: (i: number, j: number) => number): jStat;
  create(rows: number, func: (i: number, j: number) => number): jStat;
  zeros(rows: number, cols?: number): jStat;
  ones(rows: number, cols?: number): jStat;
  rand(rows: number, cols?: number): jStat;
  identity(rows: number, cols?: number): jStat;

  // Vector statistics instance methods (with optional callback/flag)
  sum(): number | Vector;
  sum(callback: (this: jStat, value: number | Vector) => void): jStat;
  sum(fullbool: boolean): number | Vector;
  sumsqrd(): number | Vector;
  sumsqrd(callback: (this: jStat, value: number | Vector) => void): jStat;
  sumsqerr(): number | Vector;
  sumsqerr(callback: (this: jStat, value: number | Vector) => void): jStat;
  sumrow(): number | Vector;
  sumrow(callback: (this: jStat, value: number | Vector) => void): jStat;
  product(): number | Vector;
  product(callback: (this: jStat, value: number | Vector) => void): jStat;
  min(): number | Vector;
  min(callback: (this: jStat, value: number | Vector) => void): jStat;
  max(): number | Vector;
  max(callback: (this: jStat, value: number | Vector) => void): jStat;
  unique(): Vector | Vector[];
  unique(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  mean(): number | Vector;
  mean(callback: (this: jStat, value: number | Vector) => void): jStat;
  meansqerr(): number | Vector;
  meansqerr(callback: (this: jStat, value: number | Vector) => void): jStat;
  geomean(): number | Vector;
  geomean(callback: (this: jStat, value: number | Vector) => void): jStat;
  median(): number | Vector;
  median(callback: (this: jStat, value: number | Vector) => void): jStat;
  diff(): Vector | Vector[];
  diff(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  rank(): Vector | Vector[];
  rank(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  mode(): number | number[] | (number | number[])[];
  mode(callback: (this: jStat, value: any) => void): jStat;
  range(): number | Vector;
  range(callback: (this: jStat, value: number | Vector) => void): jStat;
  variance(): number | Vector;
  variance(flag: boolean): number | Vector;
  variance(callback: (this: jStat, value: number | Vector) => void): jStat;
  deviation(): Vector | Vector[];
  deviation(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  stdev(): number | Vector;
  stdev(flag: boolean): number | Vector;
  stdev(callback: (this: jStat, value: number | Vector) => void): jStat;
  meandev(): number | Vector;
  meandev(callback: (this: jStat, value: number | Vector) => void): jStat;
  meddev(): number | Vector;
  meddev(callback: (this: jStat, value: number | Vector) => void): jStat;
  coeffvar(): number | Vector;
  coeffvar(callback: (this: jStat, value: number | Vector) => void): jStat;
  quartiles(): [number, number, number] | [number, number, number][];
  quartiles(callback: (this: jStat, value: any) => void): jStat;
  histogram(): Vector | Vector[];
  histogram(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  skewness(): number | Vector;
  skewness(callback: (this: jStat, value: number | Vector) => void): jStat;
  kurtosis(): number | Vector;
  kurtosis(callback: (this: jStat, value: number | Vector) => void): jStat;

  // Cumulative instance methods
  cumsum(): Vector | Vector[];
  cumsum(fullbool: boolean): Vector | Vector[];
  cumsum(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;
  cumprod(): Vector | Vector[];
  cumprod(fullbool: boolean): Vector | Vector[];
  cumprod(callback: (this: jStat, value: Vector | Vector[]) => void): jStat;

  // Extra-argument instance methods
  quantiles(
    quantilesArray: Vector,
    alphap?: number,
    betap?: number
  ): Vector | Vector[];
  quantiles(
    quantilesArray: Vector,
    alphap: number,
    betap: number,
    callback: (this: jStat, value: Vector | Vector[]) => void
  ): jStat;
  percentileOfScore(score: number, kind?: string): number | Vector;
  percentileOfScore(
    score: number,
    kind: string,
    callback: (this: jStat, value: number | Vector) => void
  ): jStat;

  // Special function instance methods
  gammaln(): jStat;
  gammafn(): jStat;
  factorial(): jStat;
  factorialln(): jStat;
  randn(...args: number[]): jStat;

  // Linear algebra instance methods (with optional callback)
  add(arg: Matrix | number): jStat;
  add(arg: Matrix | number, callback: (this: jStat, value: jStat) => void): jStat;
  subtract(arg: Matrix | number): jStat;
  subtract(arg: Matrix | number, callback: (this: jStat, value: jStat) => void): jStat;
  divide(arg: Matrix | number): jStat;
  divide(arg: Matrix | number, callback: (this: jStat, value: jStat) => void): jStat;
  multiply(arg: Matrix | number): jStat | number;
  multiply(arg: Matrix | number, callback: (this: jStat, value: jStat | number) => void): jStat;
  dot(arg: Matrix | Vector): jStat | number;
  dot(arg: Matrix | Vector, callback: (this: jStat, value: jStat | number) => void): jStat;
  pow(arg: number): jStat;
  pow(arg: number, callback: (this: jStat, value: jStat) => void): jStat;
  exp(): jStat;
  exp(callback: (this: jStat, value: jStat) => void): jStat;
  log(): jStat;
  log(callback: (this: jStat, value: jStat) => void): jStat;
  abs(): jStat;
  abs(callback: (this: jStat, value: jStat) => void): jStat;
  norm(p?: number): number;
  norm(p: number, callback: (this: jStat, value: number) => void): jStat;
  angle(arg: Matrix | Vector): number;
  angle(arg: Matrix | Vector, callback: (this: jStat, value: number) => void): jStat;

  // Statistical test instance methods
  zscore(value: number, flag?: boolean): number;
  ztest(value: number, sides: number, flag?: boolean): number;
  tscore(value: number): number;
  ttest(value: number, sides: number): number;
  anovafscore(): number;
  anovaftes(): number;
  normalci(value: number, alpha: number): [number, number];
  tci(value: number, alpha: number): [number, number];
  oneSidedDifferenceOfProportions(
    p1: number,
    n1: number,
    p2: number,
    n2: number
  ): number;
  twoSidedDifferenceOfProportions(
    p1: number,
    n1: number,
    p2: number,
    n2: number
  ): number;

  // Distribution instance methods (data-bound)
  beta(alpha: number, beta: number): DistributionInstance;
  centralF(df1: number, df2: number): DistributionInstance;
  cauchy(local: number, scale: number): DistributionInstance;
  chisquare(dof: number): DistributionInstance;
  exponential(rate: number): DistributionInstance;
  gamma(shape: number, scale: number): DistributionInstance;
  invgamma(shape: number, scale: number): DistributionInstance;
  kumaraswamy(alpha: number, beta: number): DistributionInstance;
  laplace(mu: number, b: number): DistributionInstance;
  lognormal(mu: number, sigma: number): DistributionInstance;
  noncentralt(dof: number, ncp: number): DistributionInstance;
  normal(mean: number, std: number): DistributionInstance;
  pareto(scale: number, shape: number): DistributionInstance;
  studentt(dof: number): DistributionInstance;
  weibull(scale: number, shape: number): DistributionInstance;
  uniform(a: number, b: number): DistributionInstance;
  binomial(n: number, p: number): DistributionInstance;
  negbin(r: number, p: number): DistributionInstance;
  hypgeom(N: number, m: number, n: number): DistributionInstance;
  poisson(l: number): DistributionInstance;
  triangular(a: number, b: number, c: number): DistributionInstance;
  tukey(nmeans: number, df: number): DistributionInstance;
  arcsine(a: number, b: number): DistributionInstance;
}

// --- jStat Static Interface ---

declare function jStat(): jStat;
declare function jStat(data: Vector): jStat;
declare function jStat(data: Vector, mapFunc: (value: number) => number): jStat;
declare function jStat(data: Matrix): jStat;
declare function jStat(data: Matrix, mapFunc: (value: number) => number): jStat;
declare function jStat(
  min: number,
  max: number,
  length: number,
  func?: (val: number, i: number) => number
): jStat;
declare function jStat(instance: jStat): jStat;

declare namespace jStat {
  // Self-reference for CJS backwards compat
  const jStat: typeof import('./jstat');

  // Prototype alias
  const fn: jStat;

  // Internal constructor
  const _init: {
    new (args: any[]): jStat;
    prototype: jStat;
    constructor: typeof jStat;
  };

  // Random
  let _random_fn: () => number;
  function setRandom(fn: () => number): void;

  // Utilities
  namespace utils {
    function calcRdx(a: number, b: number): number;
    function isArray(arg: any): arg is any[];
    function isFunction(arg: any): arg is Function;
    function isNumber(arg: any): arg is number;
    function toVector(arr: Matrix): Vector;
  }

  // Extend
  function extend(obj: object, ...sources: object[]): any;

  // Matrix construction
  function create(
    rows: number,
    cols: number,
    func: (i: number, j: number) => number
  ): Matrix;
  function create(
    rows: number,
    func: (i: number, j: number) => number
  ): Matrix;
  function zeros(rows: number, cols?: number): Matrix;
  function ones(rows: number, cols?: number): Matrix;
  function rand(rows: number, cols?: number): Matrix;
  function identity(rows: number, cols?: number): Matrix;

  // Matrix access
  function rows(arr: Matrix): number;
  function cols(arr: Matrix): number;
  function dimensions(arr: Matrix): { rows: number; cols: number };
  function row(arr: Matrix, index: number): Vector;
  function row(arr: Matrix, index: number[]): Matrix;
  function rowa(arr: Matrix, i: number): Vector;
  function col(arr: Matrix, index: number): Matrix;
  function col(arr: Matrix, index: number[]): Matrix;
  function cola(arr: Matrix, i: number): Vector;
  function diag(arr: Matrix): Matrix;
  function antidiag(arr: Matrix): Matrix;

  // Matrix transformation
  function transpose(arr: Matrix | Vector): Matrix | Vector;
  function map(
    arr: Matrix | Vector,
    func: MapFunc,
    toAlter?: boolean
  ): Matrix | Vector;
  function cumreduce(
    arr: Matrix | Vector,
    func: ReduceFunc,
    toAlter?: boolean
  ): Matrix | Vector;
  function alter(arr: Matrix | Vector, func: MapFunc): Matrix | Vector;
  function copy(arr: Matrix): Matrix;
  function slice(list: Matrix, rcSlice?: RCSlice): any;
  function sliceAssign(A: Matrix, rcSlice: RCSlice, B: any): Matrix;

  // Matrix utilities
  function symmetric(arr: Matrix): boolean;
  function clear(arr: Matrix): Matrix;
  function diagonal(diagArray: Vector): Matrix;
  function seq(
    min: number,
    max: number,
    length: number,
    func?: (val: number, i: number) => number
  ): Vector;
  function arange(end: number): Vector;
  function arange(start: number, end: number, step?: number): Vector;

  // Vector statistics
  function sum(arr: Vector): number;
  function sumsqrd(arr: Vector): number;
  function sumsqerr(arr: Vector): number;
  function sumrow(arr: Vector): number;
  function product(arr: Vector): number;
  function min(arr: Vector): number;
  function max(arr: Vector): number;
  function unique(arr: Vector): Vector;
  function mean(arr: Vector): number;
  function meansqerr(arr: Vector): number;
  function geomean(arr: Vector): number;
  function median(arr: Vector): number;
  function cumsum(arr: Vector): Vector;
  function cumprod(arr: Vector): Vector;
  function diff(arr: Vector): Vector;
  function rank(arr: Vector): Vector;
  function mode(arr: Vector): number | Vector;
  function range(arr: Vector): number;
  function variance(arr: Vector, flag?: boolean): number;
  function pooledvariance(arr: Matrix): number;
  function deviation(arr: Vector): Vector;
  function stdev(arr: Vector, flag?: boolean): number;
  function pooledstdev(arr: Matrix): number;
  function meandev(arr: Vector): number;
  function meddev(arr: Vector): number;
  function coeffvar(arr: Vector): number;
  function quartiles(arr: Vector): [number, number, number];
  function quantiles(
    arr: Vector,
    quantilesArray: Vector,
    alphap?: number,
    betap?: number
  ): Vector;
  function percentile(arr: Vector, k: number, exclusive?: boolean): number;
  function percentileOfScore(
    arr: Vector,
    score: number,
    kind?: string
  ): number;
  function histogram(arr: Vector, binCnt?: number): Vector;
  function covariance(arr1: Vector, arr2: Vector): number;
  function corrcoeff(arr1: Vector, arr2: Vector): number;
  function spearmancoeff(arr1: Vector, arr2: Vector): number;
  function stanMoment(arr: Vector, n: number): number;
  function skewness(arr: Vector): number;
  function kurtosis(arr: Vector): number;

  // Special functions
  function gammaln(x: number): number;
  function loggam(x: number): number;
  function gammafn(x: number): number;
  function gammap(a: number, x: number): number;
  function lowRegGamma(a: number, x: number): number;
  function gammapinv(p: number, a: number): number;
  function factorial(n: number): number;
  function factorialln(n: number): number;
  function combination(n: number, m: number): number;
  function combinationln(n: number, m: number): number;
  function permutation(n: number, m: number): number;
  function betafn(x: number, y: number): number | undefined;
  function betaln(x: number, y: number): number;
  function betacf(x: number, a: number, b: number): number;
  function ibeta(x: number, a: number, b: number): number | boolean;
  function ibetainv(p: number, a: number, b: number): number;
  function erf(x: number): number;
  function erfc(x: number): number;
  function erfcinv(p: number): number;
  function randn(): number;
  function randn(n: number, m?: number): Matrix;
  function randg(shape?: number): number;
  function randg(shape: number, n: number, m?: number): Matrix;

  // Linear algebra
  function add(arr: Matrix, arg: Matrix | number): Matrix;
  function subtract(arr: Matrix, arg: Matrix | number): Matrix;
  function divide(arr: Matrix, arg: Matrix | number): Matrix;
  function multiply(arr: Matrix, arg: Matrix | number): Matrix | number;
  function outer(A: Vector, B: Vector): Matrix;
  function dot(
    arr: Matrix | Vector,
    arg: Matrix | Vector
  ): number | Vector;
  function pow(arr: Matrix, arg: number): Matrix;
  function exp(arr: Matrix): Matrix;
  function log(arr: Matrix): Matrix;
  function abs(arr: Matrix): Matrix;
  function norm(arr: Matrix | Vector, p?: number): number;
  function angle(arr: Matrix | Vector, arg: Matrix | Vector): number;
  function aug(a: Matrix, b: Matrix): Matrix;
  function inv(a: Matrix): Matrix;
  function det(a: Matrix): number;
  function gauss_elimination(a: Matrix, b: Matrix): Vector;
  function gauss_jordan(a: Matrix, b: Matrix): Matrix;
  function triaUpSolve(A: Matrix, b: Vector | Matrix): Vector | Matrix;
  function triaLowSolve(A: Matrix, b: Vector | Matrix): Vector | Matrix;
  function lu(A: Matrix): [Matrix, Matrix];
  function cholesky(A: Matrix): Matrix;
  function householder(a: Matrix): Matrix;
  function QR(A: Matrix): [Matrix, Matrix];
  function lstsq(A: Matrix, b: Vector | Matrix): Vector | Matrix;
  function gauss_jacobi(
    a: Matrix,
    b: Matrix,
    x: Matrix,
    r: number
  ): Matrix;
  function gauss_seidel(
    a: Matrix,
    b: Matrix,
    x: Matrix,
    r: number
  ): Matrix;
  function SOR(
    a: Matrix,
    b: Matrix,
    x: Matrix,
    r: number,
    w: number
  ): Matrix;
  function jacobi(a: Matrix): [Matrix, Vector];
  function rungekutta(
    f: (t: number, u: number) => number,
    h: number,
    p: number,
    t_j: number,
    u_j: number,
    order: number
  ): number;
  function romberg(
    f: (x: number) => number,
    a: number,
    b: number,
    order: number
  ): Vector;
  function richardson(
    X: Vector,
    f: Vector,
    x: number,
    h: number
  ): Vector;
  function simpson(
    f: (x: number) => number,
    a: number,
    b: number,
    n: number
  ): number;
  function gauss_quadrature(): never;
  function hermite(
    X: Vector,
    F: Vector,
    dF: Vector,
    value: number
  ): number;
  function lagrange(X: Vector, F: Vector, value: number): number;
  function cubic_spline(X: Vector, F: Vector, value: number): number;
  function PCA(X: Matrix): [Matrix, Vector, Matrix, Matrix];

  // Statistical tests
  function zscore(value: number, mean: number, sd: number): number;
  function zscore(value: number, array: Vector, flag?: boolean): number;
  function ztest(
    value: number,
    mean: number,
    sd: number,
    sides: number
  ): number;
  function ztest(zscore: number, sides: number): number;
  function ztest(
    value: number,
    array: Vector,
    sides: number,
    flag?: boolean
  ): number;
  function tscore(
    value: number,
    mean: number,
    sd: number,
    n: number
  ): number;
  function tscore(value: number, array: Vector): number;
  function ttest(
    value: number,
    mean: number,
    sd: number,
    n: number,
    sides: number
  ): number;
  function ttest(tscore: number, n: number, sides: number): number;
  function ttest(value: number, array: Vector, sides: number): number;
  function anovafscore(...arrays: Vector[]): number;
  function anovaftest(...arrays: Vector[]): number;
  function anovaftest(
    fscore: number,
    df1: number,
    df2: number
  ): number;
  function ftest(fscore: number, df1: number, df2: number): number;
  function qscore(
    mean1: number,
    mean2: number,
    n1: number,
    n2: number,
    sd: number
  ): number;
  function qscore(
    array1: Vector,
    array2: Vector,
    sd: number
  ): number;
  function qtest(qscore: number, n: number, k: number): number;
  function qtest(
    mean1: number,
    mean2: number,
    n1: number,
    n2: number,
    sd: number,
    n: number,
    k: number
  ): number;
  function qtest(
    array1: Vector,
    array2: Vector,
    sd: number,
    n: number,
    k: number
  ): number;
  function tukeyhsd(arrays: Matrix): Array<[[number, number], number]>;
  function normalci(
    value: number,
    alpha: number,
    sd: number,
    n: number
  ): [number, number];
  function normalci(
    value: number,
    alpha: number,
    array: Vector
  ): [number, number];
  function tci(
    value: number,
    alpha: number,
    sd: number,
    n: number
  ): [number, number];
  function tci(
    value: number,
    alpha: number,
    array: Vector
  ): [number, number];
  function significant(pvalue: number, alpha: number): boolean;

  // Models
  namespace models {
    function ols(endog: Vector, exog: Matrix): OLSModel;
  }

  // Regression utilities
  function buildxmatrix(...arrays: Vector[]): jStat;
  function builddxmatrix(arrayOfArrays: Matrix): jStat;
  function buildjxmatrix(jMatX: jStat): jStat;
  function buildymatrix(array: Vector): jStat;
  function buildjymatrix(jMat: jStat): jStat;
  function matrixmult(A: jStat, B: jStat): jStat;
  function xtranspx(jMatX: jStat): jStat;
  function xtranspxinv(jMatX: jStat): Matrix;
  function regress(jMatX: jStat, jMatY: jStat): jStat;
  function regresst(
    jMatX: jStat,
    jMatY: jStat,
    sides: number
  ): RegressTResult;
  function jMatYBar(jMatX: jStat, beta: jStat): jStat;
  function residuals(jMatY: jStat, jMatYBar: jStat): jStat;
  function ssr(jMatYBar: jStat, yAverage: number): number;
  function sse(jMatY: jStat, jMatYBar: jStat): number;
  function sst(jMatY: jStat, yAverage: number): number;
  function matrixsubtract(A: jStat, B: jStat): jStat;

  // Distributions
  const beta: Distribution2ParamFull;
  const centralF: CentralFStatic;
  const cauchy: CauchyStatic;
  const chisquare: Distribution1ParamFull;
  const exponential: Distribution1ParamFull;
  const gamma: GammaStatic;
  const invgamma: InvgammaStatic;
  const kumaraswamy: KumaraswamyStatic;
  const laplace: LaplaceStatic;
  const lognormal: Distribution2ParamFull;
  const noncentralt: NoncentraltStatic;
  const normal: Distribution2ParamFull;
  const pareto: ParetoStatic;
  const studentt: Distribution1ParamFull;
  const weibull: Distribution2ParamFull;
  const uniform: UniformStatic;
  const binomial: BinomialStatic;
  const negbin: NegbinStatic;
  const hypgeom: HypgeomStatic;
  const poisson: PoissonStatic;
  const triangular: Distribution3ParamFull;
  const tukey: TukeyStatic;
  const arcsine: ArcsineStatic;
}

export = jStat;
export as namespace jStat;
```

### 4.2 Why `dist/jstat.d.ts`

The type definition file is placed in `dist/` because:

- It matches the `"types"` field convention used by most libraries (lodash,
  express, etc.)
- It sits alongside the JavaScript bundles it describes
- TypeScript resolves types via `package.json` `"types"` field, which points
  to `dist/jstat.d.ts`

The file is hand-authored and version-controlled, not a build artifact.

### 4.3 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `export = jStat` with `export as namespace jStat` | Supports CJS `require()`, ESM `import` (with `esModuleInterop`), and global `<script>` usage |
| Single `DistributionInstance` interface | All 23 distributions share one instance interface. Methods that do not exist on certain distributions will throw at runtime. Simpler than 23 separate interfaces for minimal practical difference. |
| Per-distribution static interfaces | Static interfaces are accurate per-distribution because parameter counts differ and method availability varies (e.g., `noncentralt` only has `pdf`/`cdf`). |
| Generic `Distribution1/2/3ParamFull` for complete distributions | Avoids repeating identical interface patterns for the 14+ complete distributions. |
| Explicit interfaces for incomplete distributions | `CauchyStatic`, `NoncentraltStatic`, `BinomialStatic`, `UniformStatic`, `ArcsineStatic`, etc. -- each only declares the methods that actually exist (or types throwing methods as `never`). |
| `number \| Vector` return types on instance methods | Cannot distinguish vector from matrix at compile time. Union type is accurate and forces proper narrowing. |
| Callback overloads on instance methods | `mean()` returns `number \| Vector`, `mean(callback)` returns `jStat`. Separate overloads give correct return types based on usage. |
| `this: jStat` in callback parameters | Correctly types the `this` context inside callbacks, matching the runtime behavior. |

### 4.4 Do NOT Commit Yet

Continue to the next step. All changes will be committed together.

---

## 5. Step 4: Create Type Tests

### 5.1 Create Directory

```bash
mkdir -p test/types
```

### 5.2 Create `test/types/jstat-test.ts`

Create the file with the following exact contents:

```typescript
import jStat = require('jstat');

// --- Constructor overloads ---
const empty: jStat = jStat();
const vector: jStat = jStat([1, 2, 3]);
const matrix: jStat = jStat([[1, 2], [3, 4]]);
const mapped: jStat = jStat([1, 2, 3], (x) => x * 2);
const seq: jStat = jStat(1, 5, 11);
const clone: jStat = jStat(vector);

// --- Core static methods ---
const r: number = jStat.rows([[1, 2], [3, 4]]);
const c: number = jStat.cols([[1, 2], [3, 4]]);
const dims: { rows: number; cols: number } = jStat.dimensions([[1, 2]]);
const z: number[][] = jStat.zeros(3, 3);
const id: number[][] = jStat.identity(3);
const s: boolean = jStat.symmetric([[1, 0], [0, 1]]);

// --- Vector statistics ---
const total: number = jStat.sum([1, 2, 3]);
const avg: number = jStat.mean([1, 2, 3]);
const sd: number = jStat.stdev([1, 2, 3], true);
const q: [number, number, number] = jStat.quartiles([1, 2, 3, 4]);
const pct: number = jStat.percentile([1, 2, 3, 4], 0.5);
const cov: number = jStat.covariance([1, 2], [3, 4]);
const corr: number = jStat.corrcoeff([1, 2, 3], [4, 5, 6]);

// --- Instance methods ---
const m: number | number[] = jStat([1, 2, 3]).mean();
const chained: jStat = jStat([1, 2, 3]).mean(function (val) {
    const self: jStat = this;
});

// --- Special functions ---
const gl: number = jStat.gammaln(5);
const fact: number = jStat.factorial(10);
const comb: number = jStat.combination(10, 3);
const errfn: number = jStat.erf(1);

// --- Distributions (static) ---
const npdf: number = jStat.normal.pdf(0, 0, 1);
const ncdf: number = jStat.normal.cdf(0, 0, 1);
const ninv: number = jStat.normal.inv(0.5, 0, 1);
const nmean: number = jStat.normal.mean(0, 1);
const nsample: number = jStat.normal.sample(0, 1);

// --- Distributions (instance) ---
const d = jStat.normal(0, 1);
const dpdf: number = d.pdf(0);
const dcdf: number = d.cdf(0);
const dinv: number = d.inv(0.5);
const dmean: number = d.mean();
const dsample: number = d.sample();

// --- Linear algebra ---
const added: number[][] = jStat.add([[1, 2]], [[3, 4]]);
const det: number = jStat.det([[1, 2], [3, 4]]);
const decomp: [number[][], number[][]] = jStat.lu([[1, 2], [3, 4]]);
const qr: [number[][], number[][]] = jStat.QR([[1, 2], [3, 4]]);

// --- Statistical tests ---
const zs: number = jStat.zscore(1, 0, 1);
const zs2: number = jStat.zscore(1, [1, 2, 3]);
const zt: number = jStat.ztest(1.5, 0, 1, 2);
const sig: boolean = jStat.significant(0.04, 0.05);

// --- Models ---
const model = jStat.models.ols([1, 2, 3], [[1, 1], [1, 2], [1, 3]]);
const r2: number = model.R2;
const coefs: number[] = model.coef;
const fstat: number = model.f.F_statistic;
const tse: number[] = model.t.se;

// --- Regression ---
const xmat: jStat = jStat.buildxmatrix([1, 2], [3, 4]);
const ymat: jStat = jStat.buildymatrix([1, 2, 3]);

// --- Type errors (should fail) ---
// @ts-expect-error: sum requires an array, not a number
jStat.sum(5);
// @ts-expect-error: mean requires an array, not a string
jStat.mean('hello');
// @ts-expect-error: normal.pdf requires 3 arguments
jStat.normal.pdf(0, 0);
```

### 5.3 What the Type Tests Verify

| Category | Tests |
|----------|-------|
| Constructor overloads | 6 patterns (empty, vector, matrix, mapped, sequence, clone) |
| Core static methods | Matrix creation (`zeros`, `identity`), access (`rows`, `cols`, `dimensions`), and properties (`symmetric`) |
| Vector statistics | `sum`, `mean`, `stdev` (with flag), `quartiles`, `percentile`, `covariance`, `corrcoeff` |
| Instance methods | Non-callback form returns `number \| number[]`; callback form returns `jStat` with correct `this` |
| Special functions | `gammaln`, `factorial`, `combination`, `erf` |
| Distributions (static) | `normal.pdf`, `.cdf`, `.inv`, `.mean`, `.sample` -- all return `number` |
| Distributions (instance) | Constructor `jStat.normal(0, 1)` returns `DistributionInstance`; methods return `number` |
| Linear algebra | `add`, `det`, `lu`, `QR` with correct return types |
| Statistical tests | `zscore` (both overloads), `ztest`, `significant` |
| Models | OLS model with nested `R2`, `coef`, `f.F_statistic`, `t.se` |
| Regression | `buildxmatrix`, `buildymatrix` return `jStat` |
| Negative tests | `@ts-expect-error` on 3 incorrect usages |

### 5.4 Do NOT Commit Yet

Continue to the next step. All changes will be committed together.

---

## 6. Step 5: Update package.json

### 6.1 Add `types` Field

Add the top-level `types` field. Place it after `module` and before `exports`:

**Before:**

```json
  "module": "./dist/jstat.esm.mjs",
  "exports": {
```

**After:**

```json
  "module": "./dist/jstat.esm.mjs",
  "types": "./dist/jstat.d.ts",
  "exports": {
```

### 6.2 Add `types` to Exports Map

Add the `"types"` condition as the **first** entry in the exports map (TypeScript
requires it to be first):

**Before:**

```json
  "exports": {
    ".": {
      "import": "./dist/jstat.esm.mjs",
      "require": "./dist/jstat.cjs.js",
      "default": "./dist/jstat.js"
    }
  },
```

**After:**

```json
  "exports": {
    ".": {
      "types": "./dist/jstat.d.ts",
      "import": "./dist/jstat.esm.mjs",
      "require": "./dist/jstat.cjs.js",
      "default": "./dist/jstat.js"
    }
  },
```

### 6.3 Add `typecheck` Script

Add the `typecheck` script to the `scripts` section:

**Before:**

```json
  "scripts": {
    "build": "rollup -c",
    "test": "npm run build && node --test \"test/**/*-test.js\"",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
```

**After:**

```json
  "scripts": {
    "build": "rollup -c",
    "test": "npm run build && node --test \"test/**/*-test.js\"",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --project tsconfig.types.json"
  }
```

### 6.4 Add `dist/jstat.d.ts` to `files` Array

The `files` array already includes `"dist/"`, which covers `dist/jstat.d.ts`.
No change needed.

### 6.5 Verify `package.json` Changes

```bash
node -e "
const p = require('./package.json');
console.log('types:', p.types);
console.log('exports.types:', p.exports['.'].types);
console.log('typecheck script:', p.scripts.typecheck);
console.log('devDeps count:', Object.keys(p.devDependencies).length);
"
```

Expected:

```
types: ./dist/jstat.d.ts
exports.types: ./dist/jstat.d.ts
typecheck script: tsc --project tsconfig.types.json
devDeps count: 6
```

### 6.6 Why Both `types` and `exports.types`

| Field | Purpose |
|-------|---------|
| Top-level `"types"` | Fallback for TypeScript < 4.7 which does not support the `exports` map for type resolution |
| `exports["."].types` | Modern TypeScript (>= 4.7) uses this. Must be the first condition in the exports entry. |

Both should be specified for maximum compatibility.

---

## 7. Step 6: Update .prettierignore

### 7.1 Why

Prettier should not reformat the type definition file. The `.d.ts` file is
hand-authored with deliberate formatting for readability (aligned properties,
specific line breaks). Prettier would aggressively reformat it.

### 7.2 Change

Add `*.d.ts` to `.prettierignore`.

**Before:**

```
dist/
node_modules/
build/
doc/
*.min.js
```

**After:**

```
dist/
node_modules/
build/
doc/
*.min.js
*.d.ts
```

### 7.3 Verify

```bash
npx prettier --check dist/jstat.d.ts 2>&1 || echo "Expected: file is ignored by Prettier"
```

Prettier should report that the file is ignored (not that it needs formatting).

---

## 8. Step 7: Update ESLint Configuration

### 8.1 Why

ESLint should ignore the `.ts` type test file because it is TypeScript and
cannot be linted by the current ESLint configuration (which has no TypeScript
parser). ESLint would produce parse errors on `.ts` syntax.

### 8.2 Change

Add `'test/types/**'` to the global ignores array in `eslint.config.js`.

**Before:**

```javascript
  {
    // Global ignores (equivalent to .eslintignore)
    ignores: ['dist/**', 'node_modules/**', 'build/**', 'doc/**']
  },
```

**After:**

```javascript
  {
    // Global ignores (equivalent to .eslintignore)
    ignores: ['dist/**', 'node_modules/**', 'build/**', 'doc/**', 'test/types/**']
  },
```

### 8.3 Verify

```bash
npm run lint
```

Expected: exits 0. No errors from the `.ts` file. Existing `no-shadow`
warnings are acceptable.

---

## 9. Step 8: Update .gitignore

### 9.1 Why

The current `.gitignore` does not ignore `dist/jstat.d.ts` (the existing
patterns are `dist/docs`, `dist/*.map`, `dist/*.mjs`, `dist/*.cjs.js`), so
`dist/jstat.d.ts` is already tracked by default. However, it is important to
verify this and add an explicit exception if the patterns change in the future.

### 9.2 Verify Current State

```bash
git check-ignore -v dist/jstat.d.ts 2>&1 || echo "Not ignored (good)"
```

If the file is **not** ignored, no change is needed. If it **is** ignored, add
an exception:

```
!dist/jstat.d.ts
```

### 9.3 Current `.gitignore`

```
dist/docs
dist/*.map
dist/*.mjs
dist/*.cjs.js
node_modules
package-lock.json
.idea
```

The pattern `dist/*.mjs` matches `.mjs` files and `dist/*.cjs.js` matches
`.cjs.js` files. Neither pattern matches `dist/jstat.d.ts`. The `.d.ts` file
will be tracked by git without any changes.

**No modification needed** unless `git check-ignore` reports the file is ignored.

---

## 10. Step 9: Run Type Check and Verify

### 10.1 Run Type Check

```bash
npm run typecheck
```

Expected: exits with code 0, no errors. If there are errors, fix the `.d.ts`
file and re-run.

### 10.2 Common Type Check Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module 'jstat'` | `paths` mapping in `tsconfig.types.json` is wrong | Verify `"paths": { "jstat": ["./dist/jstat"] }` and that `dist/jstat.d.ts` exists |
| `Unused '@ts-expect-error'` | The expected error is not actually an error (type def is too permissive) | Tighten the type definition or remove the `@ts-expect-error` |
| `Type 'X' is not assignable to type 'Y'` | Return type mismatch in the `.d.ts` file | Fix the return type in the `.d.ts` file to match what the function actually returns |
| `Expected N arguments, but got M` | Incorrect parameter count in an overload | Fix the overload signature in the `.d.ts` file |

### 10.3 Run Existing Tests

```bash
npm test
```

Expected: 382 tests, 382 passing, 0 failing. Type definitions have zero runtime
effect -- the test suite must be completely unaffected.

### 10.4 Run Lint and Format

```bash
npm run lint
npm run format:check
```

Both should exit 0. The new `.ts` file is ignored by ESLint (via the
`test/types/**` ignore). The `.d.ts` file is ignored by Prettier (via
`*.d.ts` in `.prettierignore`).

---

## 11. Step 10: Update CI Workflow

### 11.1 Why

The type check should run in CI to ensure the type definitions stay in sync
with the API. If someone modifies a method signature in the source but forgets
to update the `.d.ts` file, the type tests will fail.

### 11.2 Change

Add a type-check step to the `lint-and-format` job in
`.github/workflows/ci.yml`. Insert it after the "Check formatting" step:

**Before:**

```yaml
      - name: Check formatting
        run: npm run format:check
```

**After:**

```yaml
      - name: Check formatting
        run: npm run format:check

      - name: Type-check definitions
        run: npm run typecheck
```

### 11.3 Why in `lint-and-format` Job

The type check is fast (~2-3 seconds) and is a static analysis step, like
linting and format checking. Placing it in the `lint-and-format` job means:

- It runs once (not 3 times across the Node matrix), saving runner minutes.
- It fails fast -- if types are broken, the test matrix is skipped.
- It runs on the latest Node version (24.x), which has the latest npm and
  TypeScript support.

### 11.4 Verify Updated Workflow Locally

Run the type check locally to confirm it would pass in CI:

```bash
npm run typecheck
```

Expected: exits 0.

### 11.5 Commit All Phase 6 Changes

Commit all changes in a single commit:

```
feat: add TypeScript type definitions for entire public API
```

This commit includes:

| File | Change |
|------|--------|
| `package.json` | Added `types` field, updated `exports` map, added `typescript` dev dep, added `typecheck` script |
| `tsconfig.types.json` | New file: TypeScript config for type-checking |
| `dist/jstat.d.ts` | New file: Complete type definitions |
| `test/types/jstat-test.ts` | New file: Type tests |
| `.prettierignore` | Added `*.d.ts` |
| `eslint.config.js` | Added `test/types/**` to ignores |
| `.github/workflows/ci.yml` | Added type-check step |

---

## 12. Step 11: Final Verification

### 12.1 Full Test Suite

```bash
npm test
```

Expected: 382 tests, 382 passing, 0 failing.

### 12.2 Type Check

```bash
npm run typecheck
```

Expected: exits 0, no errors.

### 12.3 Lint

```bash
npm run lint
```

Expected: exits 0, no errors (existing `no-shadow` warnings acceptable).

### 12.4 Format

```bash
npm run format:check
```

Expected: exits 0, all files formatted.

### 12.5 CJS/ESM/UMD Smoke Tests

```bash
# CJS
node -e "const j = require('./dist/jstat.cjs.js'); console.log(j.jStat.normal.pdf(0, 0, 1))"

# ESM
node --input-type=module -e "import jStat from './dist/jstat.esm.mjs'; console.log(jStat.normal.pdf(0, 0, 1))"

# UMD
node -e "const j = require('./dist/jstat.js'); console.log(j.jStat.normal.pdf(0, 0, 1))"
```

All three should output `0.3989422804014327`.

### 12.6 Verify TypeScript Consumers Can Resolve Types

Simulate a TypeScript consumer by checking that `tsc` resolves the types:

```bash
echo 'import jStat = require("jstat"); const x: number = jStat.sum([1,2,3]);' > /tmp/jstat-test.ts
npx tsc --noEmit --esModuleInterop --moduleResolution node --baseUrl . --paths '{"jstat":["./dist/jstat"]}' /tmp/jstat-test.ts
rm /tmp/jstat-test.ts
```

Expected: exits 0, no errors.

### 12.7 Verify `dist/jstat.d.ts` Is Included in npm Package

```bash
npm pack --dry-run 2>&1 | grep "jstat.d.ts"
```

Expected: `dist/jstat.d.ts` appears in the file list (the `"files"` field
includes `"dist/"`).

---

## 13. Completion Criteria

All of the following must be true before Phase 6 is considered complete:

| Criterion | How to Verify |
|-----------|---------------|
| TypeScript installed as dev dependency | `npx tsc --version` succeeds; `typescript` in `devDependencies` |
| `tsconfig.types.json` exists | `cat tsconfig.types.json` shows `strict: true`, `noEmit: true` |
| `dist/jstat.d.ts` exists and is complete | `wc -l dist/jstat.d.ts` shows ~700+ lines |
| `dist/jstat.d.ts` tracked by git | `git ls-files dist/jstat.d.ts` returns the path |
| `test/types/jstat-test.ts` exists | `cat test/types/jstat-test.ts` shows type tests |
| `types` field in `package.json` | `node -e "console.log(require('./package.json').types)"` shows `./dist/jstat.d.ts` |
| `types` in `exports` map | `node -e "console.log(require('./package.json').exports['.'].types)"` shows `./dist/jstat.d.ts` |
| `typecheck` script in `package.json` | `npm run typecheck` exits 0 |
| Type tests compile without errors | `npm run typecheck` exits 0 |
| `@ts-expect-error` negative tests work | 3 negative tests in `jstat-test.ts` are validated |
| `.prettierignore` includes `*.d.ts` | `grep '*.d.ts' .prettierignore` matches |
| ESLint ignores `test/types/**` | `npm run lint` exits 0, no `.ts` parse errors |
| CI workflow includes type-check step | `grep 'typecheck' .github/workflows/ci.yml` matches |
| All 382 tests still pass | `npm test` shows 382 passing, 0 failing |
| ESLint still clean | `npm run lint` exits 0 |
| Prettier still clean | `npm run format:check` exits 0 |
| 6 dev dependencies | `node -e "console.log(Object.keys(require('./package.json').devDependencies).length)"` shows `6` |
| 7 npm scripts | `node -e "console.log(Object.keys(require('./package.json').scripts).length)"` shows `7` |
| `.d.ts` included in npm package | `npm pack --dry-run 2>&1 \| grep jstat.d.ts` matches |
| All dist bundles load correctly | CJS/ESM/UMD smoke tests from Section 12.5 |

### Commit Summary

Phase 6 produces exactly 1 commit:

| # | Message | Files |
|---|---------|-------|
| 1 | `feat: add TypeScript type definitions for entire public API` | `package.json`, `tsconfig.types.json`, `dist/jstat.d.ts`, `test/types/jstat-test.ts`, `.prettierignore`, `eslint.config.js`, `.github/workflows/ci.yml` |

### What is NOT Done in Phase 6

| Item | Phase |
|------|-------|
| Converting source to TypeScript | Not planned (source remains JavaScript) |
| `@types/jstat` on DefinitelyTyped | Not needed (types ship with the package) |
| Documentation updates | Phase 7 |
| API changes | Never in a type-definition phase |
| Runtime type checking | Not in scope (`.d.ts` is compile-time only) |
| Source code changes | Zero (the `.d.ts` file describes the existing API) |
| Branded vector/matrix types | Future enhancement if users request it |
