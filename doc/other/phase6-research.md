# Phase 6 Research: TypeScript Definitions

Research document for creating comprehensive TypeScript type definitions for the
jStat library, following the completion of Phases 1-5 (test migration, build
system modernization, code modernization, linting & formatting, and CI/CD).

---

## Table of Contents

1. [Environment and Baseline](#1-environment-and-baseline)
2. [Scope Definition](#2-scope-definition)
3. [Current State of TypeScript Support](#3-current-state-of-typescript-support)
4. [API Surface Catalog](#4-api-surface-catalog)
5. [Typing Challenges](#5-typing-challenges)
6. [Type Architecture](#6-type-architecture)
7. [Distribution Typing Strategy](#7-distribution-typing-strategy)
8. [Complete Type Definitions](#8-complete-type-definitions)
9. [Type Testing Strategy](#9-type-testing-strategy)
10. [Migration Steps](#10-migration-steps)
11. [Risks and Open Questions](#11-risks-and-open-questions)

---

## 1. Environment and Baseline

### 1.1 Development Environment

- **Node.js version:** 22.14.0
- **npm version:** 10.9.2
- **OS:** Linux (Ubuntu-based)
- **Current build:** Rollup 4.59.0 with `@rollup/plugin-terser`
- **Current test runner:** `node:test` (Node built-in)
- **Current linter:** ESLint 10.0.2
- **Current formatter:** Prettier 3.8.1
- **Repository hosting:** GitHub (`github.com/jstat/jstat`)

### 1.2 Current Dev Dependencies

```json
{
    "@rollup/plugin-terser": "^0.4.4",
    "eslint": "^10.0.2",
    "eslint-config-prettier": "^10.1.8",
    "prettier": "^3.8.1",
    "rollup": "^4.59.0"
}
```

Zero production dependencies. Five dev dependencies. Phase 6 adds **one** new
dev dependency (`typescript`, for type-checking the definition file) and
potentially one more (`@definitelytyped/dtslint` or a lighter alternative for
type testing).

### 1.3 Current package.json Configuration

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
    },
    "files": ["dist/"]
}
```

No `types` field exists. No `.d.ts` files exist anywhere in the project.

### 1.4 Current Output Files

| File | Format | Description |
|------|--------|-------------|
| `dist/jstat.js` | UMD | Unminified UMD bundle |
| `dist/jstat.min.js` | UMD | Minified UMD bundle |
| `dist/jstat.esm.mjs` | ESM | ES module bundle |
| `dist/jstat.cjs.js` | CJS | CommonJS bundle |

### 1.5 Existing TypeScript Support

- **`@types/jstat` on npm:** Does not exist. No one has published type
  definitions to DefinitelyTyped.
- **`index.d.ts` in the repo:** Does not exist.
- **TypeScript issue on GitHub:** Issue #251 requests TypeScript support. No
  implementation has been contributed.
- **Third-party type definitions:** None found. Users who need types must write
  their own ad-hoc declarations.

This means jStat is starting from zero -- there is no prior art to extend or
be compatible with. We have full freedom to design the type definitions from
scratch.

---

## 2. Scope Definition

### 2.1 What IS Phase 6

Phase 6 provides TypeScript type definitions for the entire public API:

- Create `dist/jstat.d.ts` with complete type definitions
- Add `"types": "./dist/jstat.d.ts"` to `package.json`
- Add the `types` field to the `exports` map for proper resolution
- Types must cover every public method, property, and pattern documented in the
  architecture document Section 2
- Add type tests to verify the definitions compile correctly
- The definition file is hand-authored (not auto-generated), because the
  dynamic patterns in jStat (constructor overloads, distribution factories,
  instance method generation) cannot be inferred from source code

### 2.2 What is NOT Phase 6

- **No source code changes** -- the `.d.ts` file describes the existing API;
  nothing in `src/` changes.
- **No API changes** -- the public API surface remains 100% identical.
- **No conversion to TypeScript** -- the source remains JavaScript. Converting
  to TypeScript would be a separate, much larger effort and is not planned.
- **No runtime type checking** -- the `.d.ts` file is purely for compile-time
  type checking in TypeScript consumers.
- **No documentation changes** -- that is Phase 7.

### 2.3 Files to Create

| File | Purpose |
|------|---------|
| `dist/jstat.d.ts` | Complete TypeScript type definitions |
| `test/types/jstat-test.ts` | Type tests (compile-only, no runtime) |
| `tsconfig.types.json` | TypeScript config for type-checking only |

### 2.4 Files to Modify

| File | Change |
|------|--------|
| `package.json` | Add `types` field, update `exports` map, add `typescript` dev dependency, add `typecheck` script |
| `.prettierignore` | Add `*.d.ts` (Prettier should not reformat the type definitions) |

---

## 3. Current State of TypeScript Support

### 3.1 TypeScript Module Resolution

TypeScript resolves types for a package in this order:

1. `package.json` `"types"` or `"typings"` field
2. `package.json` `"exports"` map with `"types"` condition
3. `index.d.ts` adjacent to the `"main"` entry point
4. `@types/<package-name>` from DefinitelyTyped

jStat currently has none of these. TypeScript users see `jstat` as `any`.

### 3.2 Modern `exports` Map with Types

The recommended way to expose types in a dual CJS/ESM package is through the
`exports` map with the `"types"` condition. The `"types"` condition must come
**first** in each condition group:

```json
{
    "types": "./dist/jstat.d.ts",
    "exports": {
        ".": {
            "types": "./dist/jstat.d.ts",
            "import": "./dist/jstat.esm.mjs",
            "require": "./dist/jstat.cjs.js",
            "default": "./dist/jstat.js"
        }
    }
}
```

The top-level `"types"` field serves as a fallback for older TypeScript versions
(< 4.7) that do not support the `exports` map. Both should be specified for
maximum compatibility.

### 3.3 Single vs. Dual Type Definitions

Some packages ship separate `.d.cts` and `.d.mts` files for CJS and ESM
respectively. jStat does not need this because:

- The CJS and ESM bundles export the same object with the same API
- There is no difference in the type surface between import styles
- A single `.d.ts` file with `export = jStat` handles both (compatible with
  ESM imports when `esModuleInterop` is enabled)

Since jStat uses a default export (the `jStat` constructor/namespace object),
the type definition uses `export = jStat` for maximum compatibility with both
`import jStat from 'jstat'` and `const jStat = require('jstat')`.

---

## 4. API Surface Catalog

This section catalogs every public API member that needs a type definition. The
catalog is derived from reading every source file in `src/` and cross-referencing
with the architecture document Section 2.

### 4.1 Core (core.js)

#### Constructor

```
jStat()                          -> jStat instance (empty, this[0]=[])
jStat([1,2,3])                   -> jStat instance (vector, length=1)
jStat([[1,2],[3,4]])             -> jStat instance (matrix, length=2)
jStat([[1,2],[3,4]], mapFunc)    -> jStat instance (matrix, mapped)
jStat([1,2,3], mapFunc)          -> jStat instance (vector, mapped)
jStat(1, 5, 11)                  -> jStat instance (sequence via jStat.seq)
jStat(existingJStat)             -> jStat instance (clone)
```

#### Internal/Semi-Public

```
jStat.fn                         -> jStat.prototype (alias)
jStat._init                      -> constructor function
jStat._init.prototype            -> jStat.prototype
jStat._init.constructor          -> jStat
jStat.jStat                      -> jStat (self-reference for CJS compat)
```

#### Utilities

```
jStat.utils.calcRdx(a: number, b: number): number
jStat.utils.isArray(arg: any): arg is any[]
jStat.utils.isFunction(arg: any): arg is Function
jStat.utils.isNumber(arg: any): arg is number
jStat.utils.toVector(arr: number[][]): number[]
```

#### Random Number Control

```
jStat._random_fn: () => number
jStat.setRandom(fn: () => number): void
```

#### Matrix Construction (static)

```
jStat.create(rows: number, cols: number, func: (i: number, j: number) => number): number[][]
jStat.create(rows: number, func: (i: number, j: number) => number): number[][]
jStat.zeros(rows: number, cols?: number): number[][]
jStat.ones(rows: number, cols?: number): number[][]
jStat.rand(rows: number, cols?: number): number[][]
jStat.identity(rows: number, cols?: number): number[][]
```

#### Matrix Access (static)

```
jStat.rows(arr: number[][]): number
jStat.cols(arr: number[][]): number
jStat.dimensions(arr: number[][]): { rows: number; cols: number }
jStat.row(arr: number[][], index: number): number[]
jStat.row(arr: number[][], index: number[]): number[][]
jStat.rowa(arr: number[][], i: number): number[]
jStat.col(arr: number[][], index: number): number[][]
jStat.col(arr: number[][], index: number[]): number[][]
jStat.cola(arr: number[][], i: number): number[]
jStat.diag(arr: number[][]): number[][]
jStat.antidiag(arr: number[][]): number[][]
```

#### Matrix Transformation (static)

```
jStat.transpose(arr: number[][] | number[]): number[][] | number[]
jStat.map(arr: number[][] | number[], func: (value: number, row: number, col: number) => number, toAlter?: boolean): number[][] | number[]
jStat.cumreduce(arr: number[][] | number[], func: (prev: number, curr: number) => number, toAlter?: boolean): number[][] | number[]
jStat.alter(arr: number[][] | number[], func: (value: number, row: number, col: number) => number): number[][] | number[]
jStat.copy(arr: number[][]): number[][]
jStat.slice(list: number[][], rcSlice: RCSlice): any
jStat.sliceAssign(A: number[][], rcSlice: RCSlice, B: any): number[][]
```

#### Matrix Utilities (static)

```
jStat.symmetric(arr: number[][]): boolean
jStat.clear(arr: number[][]): number[][]
jStat.diagonal(diagArray: number[]): number[][]
jStat.seq(min: number, max: number, length: number, func?: (val: number, i: number) => number): number[]
jStat.arange(end: number): number[]
jStat.arange(start: number, end: number, step?: number): number[]
```

#### Extend

```
jStat.extend(obj: object, ...sources: object[]): any
jStat.extend(source: object): typeof jStat
```

#### Instance Methods (core)

```
.length: number
.push(...items: any[]): number
.sort(compareFn?: (a: any, b: any) => number): this
.splice(start: number, deleteCount?: number, ...items: any[]): any[]
.slice(start?: number, end?: number): any[]
.toArray(): number[] | number[][]
.map(func: Function, toAlter?: boolean): jStat
.cumreduce(func: Function, toAlter?: boolean): jStat
.alter(func: Function): jStat

// No-argument instance methods (with optional callback)
.transpose(func?: Function): jStat | this
.clear(func?: Function): jStat | this
.symmetric(func?: Function): boolean | this
.rows(func?: Function): number | this
.cols(func?: Function): number | this
.dimensions(func?: Function): { rows: number; cols: number } | this
.diag(func?: Function): jStat | this
.antidiag(func?: Function): jStat | this

// One-argument instance methods (with optional callback)
.row(index: number, func?: Function): jStat
.col(index: number, func?: Function): jStat

// Factory instance methods
.create(rows: number, cols: number, func: Function): jStat
.zeros(rows: number, cols?: number): jStat
.ones(rows: number, cols?: number): jStat
.rand(rows: number, cols?: number): jStat
.identity(rows: number, cols?: number): jStat
```

### 4.2 Vector Statistics (vector.js)

#### Static Methods

```
jStat.sum(arr: number[]): number
jStat.sumsqrd(arr: number[]): number
jStat.sumsqerr(arr: number[]): number
jStat.sumrow(arr: number[]): number
jStat.product(arr: number[]): number
jStat.min(arr: number[]): number
jStat.max(arr: number[]): number
jStat.unique(arr: number[]): number[]
jStat.mean(arr: number[]): number
jStat.meansqerr(arr: number[]): number
jStat.geomean(arr: number[]): number
jStat.median(arr: number[]): number
jStat.cumsum(arr: number[]): number[]
jStat.cumprod(arr: number[]): number[]
jStat.diff(arr: number[]): number[]
jStat.rank(arr: number[]): number[]
jStat.mode(arr: number[]): number | number[]
jStat.range(arr: number[]): number
jStat.variance(arr: number[], flag?: boolean): number
jStat.pooledvariance(arr: number[][]): number
jStat.deviation(arr: number[]): number[]
jStat.stdev(arr: number[], flag?: boolean): number
jStat.pooledstdev(arr: number[][]): number
jStat.meandev(arr: number[]): number
jStat.meddev(arr: number[]): number
jStat.coeffvar(arr: number[]): number
jStat.quartiles(arr: number[]): [number, number, number]
jStat.quantiles(arr: number[], quantilesArray: number[], alphap?: number, betap?: number): number[]
jStat.percentile(arr: number[], k: number, exclusive?: boolean): number
jStat.percentileOfScore(arr: number[], score: number, kind?: string): number
jStat.histogram(arr: number[], binCnt?: number): number[]
jStat.covariance(arr1: number[], arr2: number[]): number
jStat.corrcoeff(arr1: number[], arr2: number[]): number
jStat.spearmancoeff(arr1: number[], arr2: number[]): number
jStat.stanMoment(arr: number[], n: number): number
jStat.skewness(arr: number[]): number
jStat.kurtosis(arr: number[]): number
```

#### Instance Methods (generated dynamically)

The following are generated by loops in `vector.js`. Each has a dual calling
convention:

- **Without callback:** `jStat(data).mean()` returns a number (vector) or
  number[] (matrix columns)
- **With callback:** `jStat(data).mean(callback)` calls `callback(result)` via
  `setTimeout` and returns `this` for chaining

Generated via the "no extra args" loop:
```
.sum .sumsqrd .sumsqerr .sumrow .product .min .max .unique
.mean .meansqerr .geomean .median .diff .rank .mode .range
.variance .deviation .stdev .meandev .meddev .coeffvar
.quartiles .histogram .skewness .kurtosis
```

Generated via the "cumulative" loop:
```
.cumsum .cumprod
```

Generated via the "extra args" loop:
```
.quantiles .percentileOfScore
```

**Not generated as instance methods** (static-only):
```
jStat.pooledvariance    (static only)
jStat.pooledstdev       (static only)
jStat.percentile        (static only)
jStat.covariance        (static only)
jStat.corrcoeff         (static only)
jStat.spearmancoeff     (static only)
jStat.stanMoment        (static only)
```

### 4.3 Special Functions (special.js)

#### Static Methods

```
jStat.gammaln(x: number): number
jStat.loggam(x: number): number
jStat.gammafn(x: number): number
jStat.gammap(a: number, x: number): number
jStat.lowRegGamma(a: number, x: number): number
jStat.gammapinv(p: number, a: number): number
jStat.factorial(n: number): number
jStat.factorialln(n: number): number
jStat.combination(n: number, m: number): number
jStat.combinationln(n: number, m: number): number
jStat.permutation(n: number, m: number): number
jStat.betafn(x: number, y: number): number | undefined
jStat.betaln(x: number, y: number): number
jStat.betacf(x: number, a: number, b: number): number
jStat.ibeta(x: number, a: number, b: number): number | boolean
jStat.ibetainv(p: number, a: number, b: number): number
jStat.erf(x: number): number
jStat.erfc(x: number): number
jStat.erfcinv(p: number): number
jStat.randn(): number
jStat.randn(n: number, m?: number): number[][]
jStat.randg(shape?: number): number
jStat.randg(shape: number, n: number, m?: number): number[][]
```

#### Instance Methods (special)

Generated via loops in `special.js`:

```
// Applied element-wise to the jStat matrix/vector:
.gammaln(): jStat
.gammafn(): jStat
.factorial(): jStat
.factorialln(): jStat

// Factory-style (creates new data):
.randn(n: number, m?: number): jStat
```

### 4.4 Distributions (distribution.js)

23 distributions, each with a uniform factory pattern. The complete list:

```
beta, centralF, cauchy, chisquare, exponential, gamma, invgamma,
kumaraswamy, laplace, lognormal, noncentralt, normal, pareto,
studentt, weibull, uniform, binomial, negbin, hypgeom, poisson,
triangular, tukey, arcsine
```

#### Distribution Parameter Signatures

Each distribution has different parameter counts and names. The complete catalog:

| Distribution | Parameters | pdf | cdf | inv | mean | median | mode | variance | sample |
|-------------|-----------|:---:|:---:|:---:|:----:|:------:|:----:|:--------:|:------:|
| `beta` | `alpha, beta` | Y | Y | Y | Y | Y | Y | Y | Y |
| `centralF` | `df1, df2` | Y | Y | Y | Y | - | Y | Y | Y |
| `cauchy` | `local, scale` | Y | Y | Y | - | Y | Y | - | Y |
| `chisquare` | `dof` | Y | Y | Y | Y | Y | Y | Y | Y |
| `exponential` | `rate` | Y | Y | Y | Y | Y | Y | Y | Y |
| `gamma` | `shape, scale` | Y | Y | Y | Y | - | Y | Y | Y |
| `invgamma` | `shape, scale` | Y | Y | Y | Y | - | Y | Y | Y |
| `kumaraswamy` | `alpha, beta` | Y | Y | Y | Y | Y | Y | throws | - |
| `laplace` | `mu, b` | Y | Y | - | Y | Y | Y | Y | Y |
| `lognormal` | `mu, sigma` | Y | Y | Y | Y | Y | Y | Y | Y |
| `noncentralt` | `dof, ncp` | Y | Y | - | - | - | - | - | - |
| `normal` | `mean, std` | Y | Y | Y | Y | Y | Y | Y | Y |
| `pareto` | `scale, shape` | Y | Y | Y | Y | Y | Y | Y | - |
| `studentt` | `dof` | Y | Y | Y | Y | Y | Y | Y | Y |
| `weibull` | `scale, shape` | Y | Y | Y | Y | Y | Y | Y | Y |
| `uniform` | `a, b` | Y | Y | Y | Y | Y | throws | Y | Y |
| `binomial` | `n, p` | Y | Y | - | - | - | - | - | - |
| `negbin` | `r, p` | Y | Y | - | - | - | - | - | - |
| `hypgeom` | `N, m, n` | Y | Y | - | - | - | - | - | - |
| `poisson` | `l` | Y | Y | - | Y | - | - | Y | Y* |
| `triangular` | `a, b, c` | Y | Y | Y | Y | Y | Y | Y | Y |
| `tukey` | `nmeans, df` | - | Y | Y | - | - | - | - | - |
| `arcsine` | `a, b` | Y | Y | Y | Y | Y | throws | Y | Y |

`*` Poisson also has `sampleSmall(l)` and `sampleLarge(l)` static methods.

#### Distribution Usage Patterns

Each distribution `dist` supports three access patterns:

**Pattern 1: Static methods**
```javascript
jStat.normal.pdf(x, mean, std)    // -> number
jStat.normal.cdf(x, mean, std)    // -> number
jStat.normal.inv(p, mean, std)    // -> number
jStat.normal.mean(mean, std)      // -> number
jStat.normal.sample(mean, std)    // -> number
```

**Pattern 2: Distribution constructor (instance)**
```javascript
const d = jStat.normal(0, 1);     // -> NormalDistribution instance
d.pdf(x)                          // -> number
d.cdf(x)                          // -> number
d.inv(p)                          // -> number
d.mean()                          // -> number
d.sample()                        // -> number
d.sample(arr)                     // -> mutates arr with samples
```

**Pattern 3: Data-bound via jStat instance**
```javascript
jStat(data).normal(0, 1).pdf()    // -> jStat (pdf applied to each data element)
jStat(data).normal(0, 1).cdf()    // -> jStat (cdf applied to each data element)
```

When a distribution instance method (`pdf`, `cdf`, `inv`) is called without
arguments and the instance has a `.data` property (set by Pattern 3), it maps
over the data. When called with a numeric argument, it returns a number. When
called with a jStat instance or array, it maps over that.

### 4.5 Linear Algebra (linearalgebra.js)

#### Static Methods

```
jStat.add(arr: number[][], arg: number[][] | number): number[][]
jStat.subtract(arr: number[][], arg: number[][] | number): number[][]
jStat.divide(arr: number[][], arg: number[][] | number): number[][]
jStat.multiply(arr: number[][], arg: number[][] | number): number[][] | number
jStat.outer(A: number[], B: number[]): number[][]
jStat.dot(arr: number[][] | number[], arg: number[][] | number[]): number | number[]
jStat.pow(arr: number[][], arg: number): number[][]
jStat.exp(arr: number[][]): number[][]
jStat.log(arr: number[][]): number[][]
jStat.abs(arr: number[][]): number[][]
jStat.norm(arr: number[][] | number[], p?: number): number
jStat.angle(arr: number[][] | number[], arg: number[][] | number[]): number

jStat.aug(a: number[][], b: number[][]): number[][]
jStat.inv(a: number[][]): number[][]
jStat.det(a: number[][]): number
jStat.gauss_elimination(a: number[][], b: number[][]): number[]
jStat.gauss_jordan(a: number[][], b: number[][]): number[][]
jStat.triaUpSolve(A: number[][], b: number[] | number[][]): number[] | number[][]
jStat.triaLowSolve(A: number[][], b: number[] | number[][]): number[] | number[][]
jStat.lu(A: number[][]): [number[][], number[][]]
jStat.cholesky(A: number[][]): number[][]
jStat.householder(a: number[][]): number[][]
jStat.QR(A: number[][]): [number[][], number[][]]
jStat.lstsq(A: number[][], b: number[] | number[][]): number[] | number[][]

jStat.gauss_jacobi(a: number[][], b: number[][], x: number[][], r: number): number[][]
jStat.gauss_seidel(a: number[][], b: number[][], x: number[][], r: number): number[][]
jStat.SOR(a: number[][], b: number[][], x: number[][], r: number, w: number): number[][]

jStat.jacobi(a: number[][]): [number[][], number[]]

jStat.rungekutta(f: (t: number, u: number) => number, h: number, p: number, t_j: number, u_j: number, order: number): number
jStat.romberg(f: (x: number) => number, a: number, b: number, order: number): number[]
jStat.richardson(X: number[], f: number[], x: number, h: number): number[]
jStat.simpson(f: (x: number) => number, a: number, b: number, n: number): number
jStat.gauss_quadrature(): never  // throws, not implemented

jStat.hermite(X: number[], F: number[], dF: number[], value: number): number
jStat.lagrange(X: number[], F: number[], value: number): number
jStat.cubic_spline(X: number[], F: number[], value: number): number

jStat.PCA(X: number[][]): [number[][], number[], number[][], number[][]]
```

#### Instance Methods (linear algebra)

Generated via loop in `linearalgebra.js`:

```
.add(arg: number[][] | number, func?: Function): jStat | this
.subtract(arg: number[][] | number, func?: Function): jStat | this
.divide(arg: number[][] | number, func?: Function): jStat | this
.multiply(arg: number[][] | number, func?: Function): jStat | number | this
.dot(arg: number[][] | number[], func?: Function): jStat | number | this
.pow(arg: number, func?: Function): jStat | this
.exp(func?: Function): jStat | this
.log(func?: Function): jStat | this
.abs(func?: Function): jStat | this
.norm(p?: number, func?: Function): number | this
.angle(arg: number[][] | number[], func?: Function): number | this
```

### 4.6 Statistical Tests (test.js)

#### Static Methods

```
jStat.zscore(value: number, mean: number, sd: number): number
jStat.zscore(value: number, array: number[], flag?: boolean): number
jStat.ztest(value: number, mean: number, sd: number, sides: number): number
jStat.ztest(zscore: number, sides: number): number
jStat.ztest(value: number, array: number[], sides: number, flag?: boolean): number

jStat.tscore(value: number, mean: number, sd: number, n: number): number
jStat.tscore(value: number, array: number[]): number
jStat.ttest(value: number, mean: number, sd: number, n: number, sides: number): number
jStat.ttest(tscore: number, n: number, sides: number): number
jStat.ttest(value: number, array: number[], sides: number): number

jStat.anovafscore(...arrays: number[][]): number
jStat.anovaftest(...arrays: number[][]): number
jStat.anovaftest(fscore: number, df1: number, df2: number): number
jStat.ftest(fscore: number, df1: number, df2: number): number

jStat.qscore(mean1: number, mean2: number, n1: number, n2: number, sd: number): number
jStat.qscore(array1: number[], array2: number[], sd: number): number
jStat.qtest(qscore: number, n: number, k: number): number
jStat.qtest(mean1: number, mean2: number, n1: number, n2: number, sd: number, n: number, k: number): number
jStat.qtest(array1: number[], array2: number[], sd: number, n: number, k: number): number
jStat.tukeyhsd(arrays: number[][]): Array<[[number, number], number]>

jStat.normalci(value: number, alpha: number, sd: number, n: number): [number, number]
jStat.normalci(value: number, alpha: number, array: number[]): [number, number]
jStat.tci(value: number, alpha: number, sd: number, n: number): [number, number]
jStat.tci(value: number, alpha: number, array: number[]): [number, number]
jStat.significant(pvalue: number, alpha: number): boolean
```

#### Instance Methods (test)

```
.zscore(value: number, flag?: boolean): number
.ztest(value: number, sides: number, flag?: boolean): number
.tscore(value: number): number
.ttest(value: number, sides: number): number
.anovafscore(): number
.anovaftes(): number           // note: typo preserved for backwards compat
.normalci(value: number, alpha: number): [number, number]
.tci(value: number, alpha: number): [number, number]
.oneSidedDifferenceOfProportions(p1: number, n1: number, p2: number, n2: number): number
.twoSidedDifferenceOfProportions(p1: number, n1: number, p2: number, n2: number): number
```

### 4.7 Models (models.js)

```
jStat.models.ols(endog: number[], exog: number[][]): OLSModel
```

Where `OLSModel` is:

```typescript
interface OLSModel {
    exog: number[][];
    endog: number[];
    nobs: number;
    df_model: number;
    df_resid: number;
    coef: number[];
    predict: number[];
    resid: number[];
    ybar: number;
    SST: number;
    SSE: number;
    SSR: number;
    R2: number;
    adjust_R2: number;
    t: {
        se: number[];
        t: number[];
        p: number[];
        sigmaHat: number;
        interval95: [number, number][];
    };
    f: {
        F_statistic: number;
        pvalue: number;
    };
}
```

### 4.8 Regression Utilities (regression.js)

```
jStat.buildxmatrix(...arrays: number[][]): jStat
jStat.builddxmatrix(arrayOfArrays: number[][]): jStat
jStat.buildjxmatrix(jMatX: jStat): jStat
jStat.buildymatrix(array: number[]): jStat
jStat.buildjymatrix(jMat: jStat): jStat
jStat.matrixmult(A: jStat, B: jStat): jStat
jStat.xtranspx(jMatX: jStat): jStat
jStat.xtranspxinv(jMatX: jStat): number[][]
jStat.regress(jMatX: jStat, jMatY: jStat): jStat
jStat.regresst(jMatX: jStat, jMatY: jStat, sides: number): RegressTResult
jStat.jMatYBar(jMatX: jStat, beta: jStat): jStat
jStat.residuals(jMatY: jStat, jMatYBar: jStat): jStat
jStat.ssr(jMatYBar: jStat, yAverage: number): number
jStat.sse(jMatY: jStat, jMatYBar: jStat): number
jStat.sst(jMatY: jStat, yAverage: number): number
jStat.matrixsubtract(A: jStat, B: jStat): jStat
```

---

## 5. Typing Challenges

### 5.1 Overloaded Constructor

The `jStat()` constructor accepts wildly different argument types:

```javascript
jStat()                    // no args -> empty
jStat([1,2,3])             // number[] -> vector
jStat([[1,2],[3,4]])       // number[][] -> matrix
jStat([1,2,3], mapFunc)   // number[] + function -> mapped vector
jStat([[1,2]], mapFunc)   // number[][] + function -> mapped matrix
jStat(1, 5, 11)           // three numbers -> sequence
jStat(existingJStat)       // jStat -> clone
```

**Solution:** Use function overloads:

```typescript
declare function jStat(): jStat;
declare function jStat(arr: number[]): jStat;
declare function jStat(arr: number[], mapFunc: (value: number) => number): jStat;
declare function jStat(matrix: number[][]): jStat;
declare function jStat(matrix: number[][], mapFunc: (value: number) => number): jStat;
declare function jStat(min: number, max: number, length: number, func?: (val: number, i: number) => number): jStat;
declare function jStat(instance: jStat): jStat;
```

### 5.2 Static/Instance Method Duality with Callbacks

Many methods exist in both static and instance forms, and the instance form
supports an optional callback that changes the return type:

```javascript
// Without callback: returns computed value
jStat([1,2,3]).mean()     // -> 2

// With callback: returns `this` for chaining
jStat([1,2,3]).mean(function(val) {
    // val is 2, `this` is the jStat instance
})                         // -> jStat (this)
```

**Solution:** Use function overloads on instance methods:

```typescript
interface jStat {
    mean(): number;
    mean(callback: (this: jStat, value: number) => void): jStat;
}
```

This is verbose but accurate. The alternative (returning `number | jStat`) loses
type safety. With overloads, TypeScript can narrow the return type based on
whether a callback is provided.

### 5.3 Matrix vs. Vector Return Types

When instance methods operate on a matrix (multi-row), they return an array of
per-column results. When operating on a vector, they return a single value:

```javascript
jStat([1,2,3]).mean()           // -> 2 (number)
jStat([[1,2],[3,4]]).mean()     // -> [2, 3] (number[])
```

**Solution:** This cannot be perfectly typed at compile time because we do not
know at type-checking time whether the jStat instance is a vector or a matrix.
The practical approach is to use `number | number[]` as the return type for
these methods:

```typescript
mean(): number | number[];
```

This is accurate and forces the consumer to narrow the type, which is correct
behavior since the actual return depends on runtime data.

### 5.4 Distribution Factory Pattern

Each distribution is simultaneously:

1. A **namespace** with static methods (`jStat.normal.pdf(...)`)
2. A **constructor** that returns a distribution instance (`jStat.normal(0, 1)`)
3. An **instance method** on jStat objects (`jStat(data).normal(0, 1)`)

The constructor and static methods live on the same object. In TypeScript,
this requires a combination of an interface (for the static methods), a
constructor signature, and a class/interface for the instance:

```typescript
interface NormalDistribution {
    pdf(x: number): number;
    pdf(): jStat;  // when data-bound
    cdf(x: number): number;
    cdf(): jStat;
    inv(p: number): number;
    mean(): number;
    median(): number;
    mode(): number;
    variance(): number;
    sample(): number;
    sample(arr: number[][]): number[][];
}

interface NormalStatic {
    (mean: number, std: number): NormalDistribution;
    pdf(x: number, mean: number, std: number): number;
    cdf(x: number, mean: number, std: number): number;
    inv(p: number, mean: number, std: number): number;
    mean(mean: number, std: number): number;
    median(mean: number, std: number): number;
    mode(mean: number, std: number): number;
    variance(mean: number, std: number): number;
    sample(mean: number, std: number): number;
}
```

The challenge is doing this 23 times without excessive repetition. See
Section 7 for the strategy.

### 5.5 The `jStat.fn` Alias

`jStat.fn` is an alias for `jStat.prototype`. This is used internally and by
some consumers to extend the prototype. It needs to be typed:

```typescript
interface jStatStatic {
    fn: jStat;  // alias for jStat.prototype
}
```

### 5.6 Array-Like Indexing

jStat instances are array-like objects with numeric indices:

```javascript
const m = jStat([[1,2],[3,4]]);
m[0]    // [1, 2]
m[1]    // [3, 4]
m.length // 2
```

**Solution:** Use an index signature:

```typescript
interface jStat {
    [index: number]: number[];
    length: number;
}
```

### 5.7 The `this` Callback Context

In callback-style instance methods, `this` inside the callback refers to the
jStat instance:

```javascript
jStat([1,2,3]).mean(function(val) {
    // `this` is the jStat instance
    this.stdev(function(val2) { ... });
});
```

**Solution:** Use `this: jStat` in the callback type:

```typescript
mean(callback: (this: jStat, value: number) => void): jStat;
```

### 5.8 `export =` vs `export default`

jStat uses a UMD pattern where `module.exports = factory()` and the factory
returns the `jStat` function/object. For TypeScript:

- CJS users: `const jStat = require('jstat')` -- needs `export =`
- ESM users: `import jStat from 'jstat'` -- needs `export default`

The `export = jStat` declaration is compatible with both patterns when
`esModuleInterop` is enabled (which is the default in modern TypeScript
configs). For maximum compatibility:

```typescript
export = jStat;
export as namespace jStat;  // also provides the global for script tag usage
```

---

## 6. Type Architecture

### 6.1 Overall Structure

The type definition file uses a single-file architecture with these components:

```typescript
// 1. Helper types
type Matrix = number[][];
type Vector = number[];

// 2. Distribution interfaces (generic pattern + 23 specializations)
interface DistributionInstance { ... }
interface DistributionStatic { ... }

// 3. OLS model interface
interface OLSModel { ... }

// 4. jStat instance interface (prototype methods)
interface jStat { ... }

// 5. Constructor overloads
declare function jStat(...): jStat;

// 6. Static methods via namespace (declaration merging with function)
declare namespace jStat {
    // Static methods, distributions, models, utils, etc.
}

// 7. Export
export = jStat;
export as namespace jStat;
```

### 6.2 Type Aliases

To keep the definitions readable, define type aliases for common patterns:

```typescript
type Matrix = number[][];
type Vector = number[];
type MapFunc = (value: number, row: number, col: number) => number;
type ReduceFunc = (prev: number, curr: number) => number;
type Callback<T> = (this: jStat, value: T) => void;
```

### 6.3 RCSlice Interface

The `slice` and `sliceAssign` methods use a row/column slice descriptor:

```typescript
interface RCSlice {
    row?: number | { start?: number; end?: number; step?: number };
    col?: number | { start?: number; end?: number; step?: number };
}
```

### 6.4 Declaration Merging Strategy

TypeScript's declaration merging allows a `function` and a `namespace` (or
`interface`) to share the same name. This is the standard pattern for typing
a callable object with properties:

```typescript
// jStat is both a function (constructor) and has static properties
declare function jStat(): jStat;
declare function jStat(arr: number[]): jStat;
// ... more overloads

declare namespace jStat {
    // Static methods
    function sum(arr: number[]): number;
    function mean(arr: number[]): number;
    // ... etc

    // Distribution namespaces
    const normal: NormalStatic;
    const beta: BetaStatic;
    // ... etc

    // Nested namespaces
    namespace utils { ... }
    namespace models { ... }
}
```

---

## 7. Distribution Typing Strategy

### 7.1 The Repetition Problem

23 distributions, each with up to 8 methods, in both static and instance forms.
Naively, this would require ~23 pairs of interfaces (static + instance), most
sharing the same structure. This is unacceptable from a maintenance perspective.

### 7.2 Generic Distribution Interfaces

Use generic interfaces to define the common patterns, then specialize per
distribution only where parameters differ.

**Base distribution instance interface:**

```typescript
interface BaseDistributionInstance {
    pdf(x: number): number;
    pdf(): jStat;  // when data-bound
    cdf(x: number): number;
    cdf(): jStat;
    inv(p: number): number;
    inv(): jStat;
    mean(): number;
    median(): number;
    mode(): number;
    variance(): number;
    sample(): number;
    sample(arr: Matrix): Matrix;
}
```

**Per-distribution static interfaces** -- these must be separate because the
parameter counts differ. However, many distributions share the same 2-parameter
pattern:

```typescript
// 2-parameter distributions (14 of 23)
interface Distribution2ParamStatic {
    (p1: number, p2: number): BaseDistributionInstance;
    pdf(x: number, p1: number, p2: number): number;
    cdf(x: number, p1: number, p2: number): number;
    inv(p: number, p1: number, p2: number): number;
    mean(p1: number, p2: number): number;
    median(p1: number, p2: number): number;
    mode(p1: number, p2: number): number;
    variance(p1: number, p2: number): number;
    sample(p1: number, p2: number): number;
}

// 1-parameter distributions (chisquare, exponential, studentt, poisson)
interface Distribution1ParamStatic {
    (p1: number): BaseDistributionInstance;
    pdf(x: number, p1: number): number;
    cdf(x: number, p1: number): number;
    inv(p: number, p1: number): number;
    mean(p1: number): number;
    median(p1: number): number;
    mode(p1: number): number;
    variance(p1: number): number;
    sample(p1: number): number;
}

// 3-parameter distributions (triangular, hypgeom)
interface Distribution3ParamStatic {
    (p1: number, p2: number, p3: number): BaseDistributionInstance;
    pdf(x: number, p1: number, p2: number, p3: number): number;
    cdf(x: number, p1: number, p2: number, p3: number): number;
    inv(p: number, p1: number, p2: number, p3: number): number;
    mean(p1: number, p2: number, p3: number): number;
    median(p1: number, p2: number, p3: number): number;
    mode(p1: number, p2: number, p3: number): number;
    variance(p1: number, p2: number, p3: number): number;
    sample(p1: number, p2: number, p3: number): number;
}
```

### 7.3 Handling Incomplete Distribution APIs

Not all distributions implement every method. For example:

- `noncentralt` only has `pdf` and `cdf`
- `binomial` only has `pdf` and `cdf`
- `tukey` only has `cdf` and `inv`
- `cauchy` has no `mean` or `variance`

**Strategy:** Define the full interface for the common case and use `Partial` or
`Pick` for distributions with fewer methods. However, `Partial` makes everything
optional which is not quite right -- the methods that do exist should be
required.

A better approach: define per-distribution interfaces explicitly for the
incomplete ones and use the generic ones for the complete ones. Since most
distributions are complete (with all 8 methods), the explicit definitions
are only needed for the handful of exceptions:

```typescript
// Complete 2-param distributions: beta, lognormal, normal, weibull
// Near-complete (mode throws): uniform, arcsine
// Missing median: gamma, invgamma
// Missing sample: kumaraswamy, pareto
// Missing inv: laplace

// Exceptions (explicit):
interface NoncentraltStatic {
    (dof: number, ncp: number): Pick<BaseDistributionInstance, 'pdf' | 'cdf'>;
    pdf(x: number, dof: number, ncp: number): number;
    cdf(x: number, dof: number, ncp: number): number;
}

interface BinomialStatic {
    (n: number, p: number): Pick<BaseDistributionInstance, 'pdf' | 'cdf' | 'sample'>;
    pdf(k: number, n: number, p: number): number;
    cdf(x: number, n: number, p: number): number;
}
// ... etc
```

### 7.4 Distribution Parameter Groups

For documentation and clarity, group distributions by parameter count:

**1-parameter:** `chisquare(dof)`, `exponential(rate)`, `studentt(dof)`,
`poisson(l)`

**2-parameter:** `beta(alpha, beta)`, `centralF(df1, df2)`,
`cauchy(local, scale)`, `gamma(shape, scale)`, `invgamma(shape, scale)`,
`kumaraswamy(alpha, beta)`, `laplace(mu, b)`, `lognormal(mu, sigma)`,
`noncentralt(dof, ncp)`, `normal(mean, std)`, `pareto(scale, shape)`,
`weibull(scale, shape)`, `uniform(a, b)`, `binomial(n, p)`, `negbin(r, p)`,
`arcsine(a, b)`, `tukey(nmeans, df)`

**3-parameter:** `triangular(a, b, c)`, `hypgeom(N, m, n)`

---

## 8. Complete Type Definitions

### 8.1 File: `dist/jstat.d.ts`

The complete type definition file. This is the actual file that will be created:

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

### 8.2 Notes on the Definition Structure

1. **`export = jStat` with `export as namespace jStat`**: This combination
   supports all three consumption patterns: `require('jstat')` (CJS),
   `import jStat from 'jstat'` (ESM with `esModuleInterop`), and
   `<script src="jstat.js">` (global). Note that `export =` and
   `export as namespace` together require `--esModuleInterop` for ESM imports.

2. **Function overloads vs union types**: The definition uses function overloads
   (multiple declarations) rather than union parameter types where the return
   type depends on which overload is called. For example, `sum()` returns
   `number | Vector` because we cannot distinguish vector from matrix at
   compile time. But callback vs non-callback overloads are separate because the
   return types differ (`number | Vector` vs `jStat`).

3. **`DistributionInstance` is a single interface**: All 23 distributions share
   one instance interface. The methods that do not exist on certain distributions
   (e.g., `noncentralt` has no `mean()`) are still declared in the interface but
   will throw `TypeError` at runtime (the instance method tries to call the
   missing static method as a function). This is a pragmatic choice -- using
   23 separate instance interfaces would be overly complex for minimal benefit.
   Consumers who use the constructor pattern (`jStat.normal(0,1).pdf(x)`) will
   get the shared interface, which is accurate for the common distributions.

4. **`jStat.jStat`**: The self-reference (`jStat.jStat = jStat`) is typed as
   `typeof import('./jstat')`. This is a recursive reference that TypeScript
   handles correctly.

---

## 9. Type Testing Strategy

### 9.1 Purpose

Type tests verify that the `.d.ts` file correctly types the library's API. They
are **compile-only tests** -- they are type-checked but never executed. A type
test file contains usage examples that should compile without errors and
`@ts-expect-error` annotations for usage patterns that should fail.

### 9.2 TypeScript Configuration

Create `tsconfig.types.json` at the project root:

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

### 9.3 Type Test File Structure

Create `test/types/jstat-test.ts`:

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

### 9.4 npm Script for Type Checking

Add to `package.json`:

```json
{
    "scripts": {
        "typecheck": "tsc --project tsconfig.types.json"
    }
}
```

### 9.5 CI Integration

The type check should be added to the CI workflow in the `lint-and-format` job:

```yaml
- name: Type-check definitions
  run: npm run typecheck
```

This ensures the type definitions stay in sync with the API as the library
evolves.

### 9.6 Alternative: TSD

An alternative to raw `tsc` type testing is [tsd](https://github.com/tsdjs/tsd),
a type-testing tool that provides `expectType`, `expectError`, and other
assertion functions:

```typescript
import { expectType, expectError } from 'tsd';
import jStat = require('jstat');

expectType<number>(jStat.sum([1, 2, 3]));
expectError(jStat.sum(5));
```

**Recommendation:** Use raw `tsc` with `@ts-expect-error` annotations. This
avoids an additional dev dependency and `@ts-expect-error` is a well-understood
TypeScript feature. `tsd` adds value for complex generic type testing, which
is not needed for jStat's relatively straightforward types.

---

## 10. Migration Steps

### Step 1: Install TypeScript

```bash
npm install --save-dev typescript
```

This adds 1 new dev dependency. TypeScript is only used for type-checking the
definition file and type tests -- it is NOT used to compile any source code.

### Step 2: Create TypeScript Configuration

Create `tsconfig.types.json` at the project root with the configuration from
Section 9.2.

### Step 3: Create Type Definition File

Create `dist/jstat.d.ts` with the complete type definitions from Section 8.1.

Since `dist/` is in `.gitignore` for some files but not others (the UMD bundles
are committed), we need to ensure `dist/jstat.d.ts` is committed to git. Check
`.gitignore` and add an exception if needed:

```
# In .gitignore, ensure jstat.d.ts is NOT ignored
!dist/jstat.d.ts
```

Alternatively, the `.d.ts` file can be placed in the `src/` directory and copied
to `dist/` during the build step. This keeps the source of truth outside `dist/`.

**Recommendation:** Place the `.d.ts` file at `dist/jstat.d.ts` and ensure it
is tracked by git. This is the conventional location for bundled type
definitions and matches the `"types"` field in `package.json`.

### Step 4: Update package.json

Add the `types` field and update the `exports` map:

```json
{
    "types": "./dist/jstat.d.ts",
    "exports": {
        ".": {
            "types": "./dist/jstat.d.ts",
            "import": "./dist/jstat.esm.mjs",
            "require": "./dist/jstat.cjs.js",
            "default": "./dist/jstat.js"
        }
    }
}
```

Add the `typecheck` script:

```json
{
    "scripts": {
        "typecheck": "tsc --project tsconfig.types.json"
    }
}
```

### Step 5: Create Type Tests

Create `test/types/jstat-test.ts` with the type tests from Section 9.3.

### Step 6: Update .prettierignore

Add `*.d.ts` to `.prettierignore` to prevent Prettier from reformatting the
type definitions:

```
dist/
node_modules/
build/
doc/
*.min.js
*.d.ts
```

### Step 7: Run Type Check

```bash
npm run typecheck
```

This should exit with code 0, indicating all type tests pass. If there are
errors, fix the `.d.ts` file and re-run.

### Step 8: Run Existing Tests

```bash
npm test
```

The existing test suite should be completely unaffected by the addition of type
definitions. Type definitions have no runtime effect.

### Step 9: Update CI Workflow

Add the type-check step to `.github/workflows/ci.yml` in the `lint-and-format`
job:

```yaml
- name: Type-check definitions
  run: npm run typecheck
```

### Step 10: Update ESLint Configuration

ESLint should ignore `.ts` files (the type test file) since they are not
JavaScript and cannot be linted by the current ESLint configuration:

```javascript
{
    ignores: [
        'dist/**',
        'node_modules/**',
        'build/**',
        'doc/**',
        'test/types/**'
    ]
}
```

---

## 11. Risks and Open Questions

### 11.1 Accuracy of Return Types for Instance Methods

**Risk:** Many instance methods return different types depending on whether the
jStat object is a vector or matrix. For example, `jStat([1,2,3]).mean()` returns
`number` but `jStat([[1,2],[3,4]]).mean()` returns `number[]`. The type
definition uses `number | number[]` which is correct but requires consumers to
narrow the type.

**Mitigation:** This is a fundamental limitation of typing a runtime-polymorphic
API. The union type is the correct representation. A more sophisticated approach
would use branded types or generics to distinguish `jStatVector` from
`jStatMatrix`, but this would be a significant increase in complexity for
marginal benefit. Start with union types and revisit if user feedback indicates
the narrowing is too burdensome.

### 11.2 Callback Return Type Overloads

**Risk:** The overloaded callback pattern (e.g., `mean()` returns
`number | Vector`, `mean(callback)` returns `jStat`) requires many overload
declarations. This makes the `.d.ts` file verbose. If overloads are missed or
mistyped, the types will be wrong.

**Mitigation:** The type test file (`test/types/jstat-test.ts`) should include
tests for both the callback and non-callback forms of representative methods.
The type definitions are derived directly from reading the source code, so they
are accurate by construction. The `npm run typecheck` CI step ensures they stay
correct.

### 11.3 Distribution Method Availability

**Risk:** The `DistributionInstance` interface declares all methods (pdf, cdf,
inv, mean, median, mode, variance, sample), but not all distributions implement
all methods. For example, calling `jStat.binomial(10, 0.5).mean()` will throw
`TypeError` at runtime (the instance method tries to call the missing static
`jStat.binomial.mean` as a function), but the type says it returns `number`.

**Mitigation:** Two options:

1. **Accept the inaccuracy** -- the shared interface is simpler and works for
   the majority case. Document that not all methods are available on all
   distributions.

2. **Separate instance interfaces per distribution** -- more accurate but
   significantly more complex. Each distribution constructor would return a
   different interface.

**Recommendation:** Start with the shared interface (Option 1). The static
methods already have accurate per-distribution interfaces. Consumers who need
compile-time safety should use the static API (`jStat.binomial.pdf(k, n, p)`)
rather than the constructor pattern. This is also the more common usage pattern
in practice.

### 11.4 `export =` vs `export default` Compatibility

**Risk:** `export = jStat` requires `esModuleInterop: true` for ESM
`import jStat from 'jstat'` to work. If a consumer has `esModuleInterop: false`,
they would need `import * as jStat from 'jstat'`.

**Mitigation:** `esModuleInterop: true` is the default in `tsc --init` since
TypeScript 4.x and is the recommended setting. The vast majority of TypeScript
projects have it enabled. The alternative (`export default` with a namespace
merge) is less compatible with CJS `require()` and has its own quirks.
`export =` is the standard pattern for UMD libraries and is used by major
libraries like jQuery, lodash, and moment.

### 11.5 Source of Truth Location for .d.ts

**Risk:** Placing `jstat.d.ts` in `dist/` means it lives alongside generated
files. If `dist/` is cleaned, the `.d.ts` file would be lost. Also, some
`.gitignore` rules may ignore files in `dist/`.

**Mitigation:** Two options:

1. **Place in `dist/` and track in git** -- add `!dist/jstat.d.ts` to
   `.gitignore` if needed. This is the conventional location.

2. **Place in `src/` and copy during build** -- store as `src/jstat.d.ts` and
   add a build step to copy it to `dist/`. This keeps the source of truth
   outside `dist/`.

**Recommendation:** Option 1. The type definition file is a hand-authored,
version-controlled artifact, not a generated output. Placing it in `dist/`
matches the `"types"` field convention and is how most libraries (lodash,
express, etc.) ship their types. Add `!dist/jstat.d.ts` to `.gitignore` to
ensure it is tracked.

### 11.6 Type Definition Maintenance

**Risk:** If the public API is modified in future versions, the `.d.ts` file
must be updated manually. Forgetting to update it will cause type errors for
consumers.

**Mitigation:** The type tests (`test/types/jstat-test.ts`) exercise the API
surface. If a method signature changes, the type tests will fail, prompting an
update to the `.d.ts` file. Add representative tests for every major API
category. The `npm run typecheck` step in CI enforces this automatically.

### 11.7 Open Question: Should We Submit to DefinitelyTyped?

Since jStat is shipping its own types, there is no need to submit to
DefinitelyTyped. The `"types"` field in `package.json` takes precedence over
`@types/jstat`. Shipping types with the package itself is the preferred approach
because:

- Types are always in sync with the library version
- No separate `@types/jstat` version to coordinate
- Changes are part of the library's release process

**Answer:** No. Ship types in the package directly.

### 11.8 Open Question: `toString()` Method

The jStat prototype does not explicitly define a `toString()` method. The
default `Object.prototype.toString()` is inherited. However, the architecture
document lists `.toString()` as an instance method. Checking the source:

```javascript
jProto.toArray = function toArray() { ... };
```

There is `toArray()` but no explicit `toString()`. Since all objects have
`toString()` via `Object.prototype`, it does not need to be declared in the
jStat interface -- it is inherited. The type definition should include
`toArray()` but can omit `toString()` (it is already present via the implicit
`Object` interface).

### 11.9 Open Question: TypeScript Version Requirement

The type definition uses standard TypeScript features (interfaces, function
overloads, `export =`, `export as namespace`, index signatures, tuple types).
No advanced features (conditional types, template literals, mapped types) are
used. The definitions should work with TypeScript 4.0+ and possibly earlier.

**Recommendation:** Do not declare a minimum TypeScript version. The features
used are old and well-supported. If a specific minimum is desired for
documentation, TypeScript 4.0 is a safe floor.

### 11.10 Open Question: `ibeta` Return Type

The `jStat.ibeta` function returns `false` when `x < 0 || x > 1`:

```javascript
if (x < 0 || x > 1) return false;
```

This means the return type is `number | boolean`. This is an unusual API design
(returning `false` instead of `NaN` or throwing). The type definition should
accurately reflect this:

```typescript
function ibeta(x: number, a: number, b: number): number | boolean;
```

This forces consumers to handle the `false` case, which is correct behavior.
