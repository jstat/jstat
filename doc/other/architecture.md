# jStat Modernization Architecture Document

This document serves as a comprehensive reference for modernizing jStat while
maintaining 100% backwards compatibility with the existing 1.x public API.

---

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [Public API Surface](#public-api-surface)
3. [Backwards Compatibility Contract](#backwards-compatibility-contract)
4. [Modernization Plan](#modernization-plan)
5. [Build System](#build-system)
6. [Testing Strategy](#testing-strategy)
7. [Migration Path](#migration-path)

---

## 1. Current Architecture

### 1.1 Source Structure

The library is a single concatenated file built from 10 source files in a fixed
order. The UMD wrapper (`_header.js` / `_footer.js`) wraps the entire library.

```
src/
  _header.js           (10 lines)   UMD wrapper opening
  core.js              (685 lines)  Constructor, matrix ops, utilities
  vector.js            (566 lines)  Vector/array statistics
  special.js           (510 lines)  Gamma, beta, error functions
  distribution.js      (1596 lines) 23 probability distributions
  linearalgebra.js     (970 lines)  Matrix algebra, decomposition, PCA
  test.js              (339 lines)  Hypothesis testing (z, t, F, Tukey)
  models.js            (113 lines)  OLS regression
  regression.js        (206 lines)  Regression utilities
  _footer.js           (5 lines)    UMD wrapper closing
```

Total: ~5,000 lines of source code.

### 1.2 Module System

UMD pattern supporting three environments:

```javascript
(function (window, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();          // CommonJS (Node.js)
    } else if (typeof define === 'function' && define.amd) {
        define(factory);                      // AMD (RequireJS)
    } else {
        window.jStat = factory();             // Browser global
    }
})(this, function () {
    // ... entire library ...
    jStat.jStat = jStat;  // backwards compat alias
    return jStat;
});
```

### 1.3 Constructor & Prototype Chain

```javascript
function jStat() {
    return new jStat._init(arguments);
}

jStat.fn = jStat.prototype;    // alias

jStat._init = function(args) {
    // Array → vector or matrix
    // Number args → sequence via jStat.seq()
    // jStat instance → clone
    // Otherwise → empty jStat
};

jStat._init.prototype = jStat.prototype;
jStat._init.constructor = jStat;
```

jStat objects are array-like: rows stored at numeric indices (`this[0]`,
`this[1]`, ...) with a `length` property.

**Constructor behaviors:**
- `jStat([1,2,3])` → vector (length=1, this[0]=[1,2,3])
- `jStat([[1,2],[3,4]])` → matrix (length=2)
- `jStat(1, 5, 11)` → sequence via `jStat.seq(1, 5, 11)`
- `jStat(existingJStat)` → clone
- `jStat()` → empty (this[0]=[], length=1)

### 1.4 Static / Instance Duality

Every statistical function exists in two forms:

```javascript
// Static: raw computation, returns primitive
jStat.mean([1, 2, 3])  // → 2

// Instance: wrapper for chaining
jStat([1, 2, 3]).mean()  // → 2
```

Instance methods are generated dynamically via loops that wrap static methods
and attach them to `jStat.prototype`. Callbacks enable chaining:

```javascript
jStat(data).mean(function(val) {
    // val is the mean; `this` is the jStat object
}).stdev(function(val) {
    // val is the stdev
});
```

The callback pattern uses `setTimeout` for deferred execution.

### 1.5 Distribution Factory

A single IIFE generates constructors, instance methods, and prototype methods
for all 23 distributions:

```javascript
(function(list) {
    for (var i = 0; i < list.length; i++) (function(func) {
        // Creates:
        //   jStat[func](a, b, c)           → distribution constructor
        //   jStat.fn[func](a, b, c)         → instance wrapper
        //   jStat[func].pdf(x, a, b, c)     → static method
        //   jStat[func].prototype.pdf(x)     → instance method
        //   ... and cdf, inv, mean, median, mode, variance, sample
    })(list[i]);
})('beta centralF cauchy chisquare ...'.split(' '));
```

### 1.6 Build System

GNU Make with file concatenation:

```makefile
JSTAT_FILES = src/_header.js src/core.js src/vector.js src/special.js \
              src/distribution.js src/linearalgebra.js src/test.js \
              src/models.js src/regression.js src/_footer.js

dist/jstat.js:
    cat $(JSTAT_FILES) > $@

dist/jstat.min.js:
    ./node_modules/.bin/uglifyjs dist/jstat.js -o $@
```

### 1.7 Test Framework

Vows.js 0.8.3 (last updated ~2014). BDD-style:

```javascript
vows.describe('jStat').addBatch({
    'sum': {
        'topic': function() { return jStat; },
        'returns correct sum': function(jStat) {
            assert.equal(jStat.sum([1, 2, 3]), 6);
        }
    }
}).export(module);
```

Tests load the built `dist/jstat.js` via `test/env.js`. Currently **372
passing, 7 broken** (all due to floating-point precision in `geomean` after
commit a869c76).

### 1.8 Dependencies

- **Production:** none
- **Dev:** uglify-js (^3.6.7), vows (^0.8.3)
- **No linting, no CI/CD, no type definitions**

---

## 2. Public API Surface

This is the complete backwards compatibility contract. Every method listed here
must continue to work identically after modernization.

### 2.1 Core (core.js)

#### Utilities

```
jStat.utils.calcRdx(a, b)
jStat.utils.isArray(arg)
jStat.utils.isFunction(arg)
jStat.utils.isNumber(arg)
jStat.utils.toVector(arr)
```

#### Random Number Control

```
jStat._random_fn              // property (default: Math.random)
jStat.setRandom(fn)
```

#### Matrix Construction

```
jStat.create(rows, cols, func)
jStat.zeros(rows, cols)
jStat.ones(rows, cols)
jStat.rand(rows, cols)
jStat.identity(rows, cols)
```

#### Matrix Access

```
jStat.rows(arr)
jStat.cols(arr)
jStat.dimensions(arr)
jStat.row(arr, index)
jStat.rowa(arr, index)
jStat.col(arr, index)
jStat.cola(arr, index)
jStat.diag(arr)
jStat.antidiag(arr)
```

#### Matrix Transformation

```
jStat.transpose(arr)
jStat.map(arr, func, toAlter)
jStat.cumreduce(arr, func, toAlter)
jStat.alter(arr, func)
jStat.copy(arr)
jStat.slice(list, rcSlice)
jStat.sliceAssign(A, rcSlice, B)
```

#### Matrix Utilities

```
jStat.symmetric(arr)
jStat.clear(arr)
jStat.diagonal(diagArray)
jStat.seq(min, max, length, func)
jStat.arange(start, end, step)
```

#### jStat.extend

```
jStat.extend(target, source)     // merge properties
jStat.fn.extend(source)          // extend prototype
```

#### Instance Methods (from core)

```
.transpose()  .clear()  .symmetric()  .rows()  .cols()
.dimensions() .diag()   .antidiag()   .row(i)  .col(i)
.create()     .zeros()  .ones()       .rand()  .identity()
.toArray()    .toString()
.push()       .sort()   .splice()     .slice()
.map()        .cumreduce() .alter()
```

### 2.2 Vector Statistics (vector.js)

#### Static Methods

```
jStat.sum(arr)
jStat.sumsqrd(arr)
jStat.sumsqerr(arr)
jStat.sumrow(arr)
jStat.product(arr)
jStat.min(arr)
jStat.max(arr)
jStat.unique(arr)
jStat.mean(arr)
jStat.meansqerr(arr)
jStat.geomean(arr)
jStat.median(arr)
jStat.cumsum(arr)
jStat.cumprod(arr)
jStat.diff(arr)
jStat.rank(arr)
jStat.mode(arr)
jStat.range(arr)
jStat.variance(arr, flag)
jStat.pooledvariance(arrays)
jStat.deviation(arr)
jStat.stdev(arr, flag)
jStat.pooledstdev(arrays)
jStat.meandev(arr)
jStat.meddev(arr)
jStat.coeffvar(arr)
jStat.quartiles(arr)
jStat.quantiles(arr, quantilesArray, alphap, betap)
jStat.percentile(arr, k, exclusive)
jStat.percentileOfScore(arr, score, kind)
jStat.histogram(arr, binCnt)
jStat.covariance(arr1, arr2)
jStat.corrcoeff(arr1, arr2)
jStat.spearmancoeff(arr1, arr2)
jStat.skewness(arr)
jStat.kurtosis(arr)
```

#### Instance Methods

All static methods above are available as instance methods:
```
jStat(arr).sum()
jStat(arr).mean()
// etc.
```

Two-argument correlation methods:
```
jStat(arr1).covariance(arr2)
jStat(arr1).corrcoeff(arr2)
```

### 2.3 Special Functions (special.js)

```
jStat.gammaln(x)
jStat.loggam(x)
jStat.gammafn(x)
jStat.gammap(a, x)
jStat.lowRegGamma(a, x)
jStat.gammapinv(p, a)
jStat.factorial(n)
jStat.factorialln(n)
jStat.combination(n, m)
jStat.combinationln(n, m)
jStat.permutation(n, m)
jStat.betafn(x, y)
jStat.betaln(x, y)
jStat.betacf(x, a, b)
jStat.ibeta(x, a, b)
jStat.ibetainv(p, a, b)
jStat.erf(x)
jStat.erfc(x)
jStat.erfcinv(p)
jStat.randn(n, m)
jStat.randg(shape, n, m)
```

### 2.4 Distributions (distribution.js)

23 distributions, each with a uniform API:

```
beta, centralF, cauchy, chisquare, exponential, gamma, invgamma,
kumaraswamy, laplace, lognormal, noncentralt, normal, pareto,
studentt, weibull, uniform, binomial, negbin, hypgeom, poisson,
triangular, tukey, arcsine
```

For each distribution `dist` with parameters `(a, b, c)`:

```
// Static methods
jStat.dist.pdf(x, a, b, c)
jStat.dist.cdf(x, a, b, c)
jStat.dist.inv(p, a, b, c)
jStat.dist.mean(a, b, c)
jStat.dist.median(a, b, c)
jStat.dist.mode(a, b, c)
jStat.dist.variance(a, b, c)
jStat.dist.sample(a, b, c)

// Constructor usage
var d = jStat.dist(a, b, c)
d.pdf(x)
d.cdf(x)
d.inv(p)
d.mean()
d.median()
d.mode()
d.variance()
d.sample(n)

// Instance usage (applied to data)
jStat(data).dist(a, b, c).pdf()
```

**Note:** Not all distributions implement every method. For example:
- `noncentralt` only has pdf, cdf
- `binomial`, `negbin`, `hypgeom` only have pdf, cdf
- `tukey` only has cdf, inv
- `cauchy` has no mean or variance (undefined)
- `poisson` has sample, sampleSmall, sampleLarge

### 2.5 Linear Algebra (linearalgebra.js)

#### Arithmetic

```
jStat.add(arr, arg)
jStat.subtract(arr, arg)
jStat.divide(arr, arg)
jStat.multiply(arr, arg)
jStat.dot(arr, arg)
jStat.outer(A, B)
jStat.pow(arr, arg)
jStat.exp(arr)
jStat.log(arr)
jStat.abs(arr)
jStat.norm(arr, p)
jStat.angle(arr, arg)
```

#### Matrix Decomposition & Solvers

```
jStat.aug(a, b)
jStat.inv(a)
jStat.det(a)
jStat.gauss_elimination(a, b)
jStat.gauss_jordan(a, b)
jStat.triaUpSolve(A, b)
jStat.triaLowSolve(A, b)
jStat.lu(A)
jStat.cholesky(A)
jStat.QR(A)                      // note: capital QR
jStat.lstsq(A, b)
```

#### Iterative Solvers

```
jStat.gauss_jacobi(a, b, x, r)
jStat.gauss_seidel(a, b, x, r)
jStat.SOR(a, b, x, r, w)
```

#### Eigenvalue

```
jStat.jacobi(a)
```

#### Numerical Methods

```
jStat.rungekutta(f, h, p, t_j, u_j, order)
jStat.romberg(f, a, b, order)
jStat.richardson(X, f, x, h)
jStat.simpson(f, a, b, n)
jStat.gauss_quadrature()         // not yet implemented
```

#### Interpolation

```
jStat.hermite(X, F, dF, value)
jStat.lagrange(X, F, value)
jStat.cubic_spline(X, F, value)
```

#### PCA

```
jStat.PCA(X)
```

#### Instance Methods

```
.add(arg)  .subtract(arg)  .divide(arg)  .multiply(arg)
.dot(arg)  .pow(arg)       .exp()        .log()
.abs()     .norm(p)        .angle(arg)
```

### 2.6 Statistical Tests (test.js)

```
jStat.zscore(value, mean, sd)
jStat.zscore(value, array, flag)
jStat.ztest(value, mean, sd, sides)
jStat.ztest(value, array, sides, flag)

jStat.tscore(value, mean, sd, n)
jStat.ttest(value, mean, sd, n, sides)

jStat.anovafscore(...arrays)
jStat.anovaftest(...arrays)
jStat.ftest(fscore, df1, df2)

jStat.qscore(mean1, mean2, n, k, sd)
jStat.qtest(score, n, k)
jStat.tukeyhsd(arrays)

jStat.normalci(value, alpha, sd, n)
jStat.tci(value, alpha, sd, n)
jStat.significant(pvalue, alpha)
```

Instance methods:
```
jStat(arr).zscore(value, flag)
jStat(arr).ztest(value, sides, flag)
jStat(arr).tscore(value)
jStat(arr).ttest(value, sides)
jStat(arr).anovafscore()
jStat(arr).anovaftes()            // note: typo preserved for compat
jStat(arr).normalci(value, alpha)
jStat(arr).tci(value, alpha)
jStat(arr).oneSidedDifferenceOfProportions(p1, n1, p2, n2)
jStat(arr).twoSidedDifferenceOfProportions(p1, n1, p2, n2)
```

### 2.7 Models (models.js)

```
jStat.models.ols(endog, exog)
```

Returns object with: `exog`, `endog`, `nobs`, `df_model`, `df_resid`, `coef`,
`predict`, `resid`, `ybar`, `SST`, `SSE`, `SSR`, `R2`, `adjust_R2`,
`t` (with `se`, `t`, `p`, `sigmaHat`, `interval95`),
`f` (with `F_statistic`, `pvalue`).

### 2.8 Regression Utilities (regression.js)

```
jStat.buildxmatrix(...arrays)
jStat.builddxmatrix(arrayOfArrays)
jStat.buildjxmatrix(jMatX)
jStat.buildymatrix(array)
jStat.buildjymatrix(jMat)
jStat.matrixmult(A, B)
jStat.xtranspx(jMatX)
jStat.xtranspxinv(jMatX)
jStat.regress(jMatX, jMatY)
jStat.regresst(jMatX, jMatY, sides)
jStat.jMatYBar(jMatX, beta)
jStat.residuals(jMatY, jMatYBar)
jStat.ssr(jMatYBar, yAverage)
jStat.sse(jMatY, jMatYBar)
jStat.sst(jMatY, yAverage)
jStat.matrixsubtract(A, B)
```

---

## 3. Backwards Compatibility Contract

### 3.1 What Must Not Change

1. **All public API signatures** listed in Section 2.
2. **`require('jstat')` must return an object with a `jStat` property.**
   (Currently: `module.exports = factory()` and `jStat.jStat = jStat`.)
3. **Browser global `window.jStat`** must still work.
4. **Constructor behaviors** — all four modes (array, matrix, sequence, clone).
5. **The `jStat.fn` alias** for `jStat.prototype`.
6. **Distribution constructor pattern** — `jStat.normal(0, 1)` returning an
   object with `pdf`, `cdf`, `inv`, `mean`, `median`, `mode`, `variance`,
   `sample` methods.
7. **Instance method chaining** with optional callbacks.
8. **Numerical results** — outputs must match to reasonable floating-point
   precision. Tests will enforce this.
9. **The `j$` alias** if it exists in current behavior.
10. **`jStat._init`** — used internally but technically public.

### 3.2 What Can Change

1. **Internal implementation** — algorithms can be improved as long as outputs
   match.
2. **Build tooling** — Makefile → modern bundler (as long as dist/ output is
   equivalent).
3. **Test framework** — Vows → modern framework.
4. **Dev dependencies** — can be replaced entirely.
5. **Source file organization** — files can be split/reorganized.
6. **New exports can be added** — ESM named exports alongside the existing
   default export.
7. **New methods can be added** — as long as existing ones aren't removed.
8. **`package.json` fields** — `module`, `exports`, `types`, `files`, etc.

### 3.3 What Can Be Added

1. **ESM entry point** — `import { normal, mean } from 'jstat'`
2. **TypeScript type definitions** — `dist/jstat.d.ts`
3. **Source maps** — for debugging
4. **New `exports` field** in package.json for dual CJS/ESM

---

## 4. Modernization Plan

### 4.1 Phase 1: Test Infrastructure

**Goal:** Replace Vows with a modern test framework while preserving all
existing test logic. This must happen first so that we have a safety net for
all subsequent changes.

**Framework choice: Node.js built-in test runner (`node:test`)**

Rationale:
- Zero dependencies — aligns with jStat's zero-dependency philosophy
- Built into Node.js 18+ (LTS)
- Native `describe`/`it`/`assert` API familiar to anyone
- Fast, no compilation step
- `node:test` is stable and ships with `node:assert`

**Steps:**
1. Create new test files mirroring the existing structure under `test/`.
2. Port each Vows batch to `describe`/`it` blocks using `node:assert`.
3. Fix the 7 broken `geomean` tests (floating-point precision).
4. Add comprehensive tests for every public API method listed in Section 2.
5. Add edge case tests: empty arrays, NaN, Infinity, negative values, single
   elements, large arrays.
6. Add numerical accuracy tests by comparing against known reference values
   (e.g. from R, SciPy, Wolfram Alpha).
7. Update `package.json` scripts: `"test": "node --test"`.
8. Remove `vows` dependency.

**Test file organization:**
```
test/
  core.test.js
  vector.test.js
  special.test.js
  distribution.test.js
  linearalgebra.test.js
  test.test.js            (statistical tests)
  models.test.js
  regression.test.js
  compat.test.js          (backwards compatibility smoke tests)
```

### 4.2 Phase 2: Build System

**Goal:** Replace Makefile + cat concatenation with Rollup, producing CJS, ESM,
and UMD bundles from the same source.

**Bundler choice: Rollup**

Rationale:
- Best-in-class for library bundling
- Clean ESM and CJS output
- Tree-shaking support
- Minimal configuration
- Small dependency footprint

**Steps:**
1. Install Rollup and required plugins as dev dependencies.
2. Create `rollup.config.js` producing:
   - `dist/jstat.js` — UMD bundle (backwards compatible, replaces current file)
   - `dist/jstat.min.js` — minified UMD
   - `dist/jstat.cjs.js` — CommonJS bundle
   - `dist/jstat.esm.js` — ES module bundle
3. Update `package.json`:
   ```json
   {
     "main": "./dist/jstat.cjs.js",
     "module": "./dist/jstat.esm.js",
     "browser": "./dist/jstat.js",
     "exports": {
       ".": {
         "import": "./dist/jstat.esm.js",
         "require": "./dist/jstat.cjs.js",
         "default": "./dist/jstat.js"
       }
     }
   }
   ```
4. Ensure `dist/jstat.js` UMD output is byte-for-byte equivalent in behavior
   to the current concatenated output.
5. Remove Makefile (or keep as convenience wrapper calling npm scripts).
6. Add npm scripts: `"build"`, `"build:min"`, `"clean"`.

**Source refactoring for Rollup:**
- Remove `_header.js` and `_footer.js` (Rollup generates the wrapper).
- Each source file becomes a proper module with explicit imports/exports.
- Internal shared state (the `jStat` object) is created in `core.js` and
  imported by other modules.
- The entry point (`src/index.js`) imports all modules, assembles jStat, and
  exports it.

### 4.3 Phase 3: Code Modernization

**Goal:** Update JavaScript syntax and patterns while maintaining identical
runtime behavior.

**Steps:**
1. `var` → `let`/`const` where appropriate.
2. Regular functions → arrow functions for callbacks and short lambdas (but
   keep `function` for methods that use `this`).
3. Replace manual `isArray` polyfill with `Array.isArray`.
4. Replace manual `isNumber`/`isFunction` with modern equivalents where safe.
5. Use `for...of` loops where clearer than index loops.
6. Use template literals where clearer than string concatenation.
7. Add `'use strict'` (Rollup ESM output is strict by default).

**What NOT to change:**
- The prototype-based architecture (no class conversion — too risky for compat).
- The distribution factory pattern (works well, just modernize syntax).
- Callback chaining behavior (must remain for backwards compat).
- Any algorithm logic — only syntax changes in this phase.

### 4.4 Phase 4: Linting & Formatting

**Goal:** Enforce consistent code style.

**Steps:**
1. Add ESLint with a minimal config (no opinionated style rules that would
   cause massive diffs).
2. Add Prettier for formatting.
3. Add `.editorconfig`.
4. One-time format pass (single commit, clearly labeled).
5. Add lint to CI.

### 4.5 Phase 5: CI/CD

**Goal:** Automated testing and quality gates.

**Steps:**
1. Add GitHub Actions workflow:
   - Run tests on push/PR against Node.js 18, 20, 22.
   - Run linting.
   - Build and verify dist/ output.
2. Add branch protection rules (optional, repo admin decision).

### 4.6 Phase 6: TypeScript Definitions

**Goal:** Provide type definitions for TypeScript users.

**Steps:**
1. Create `dist/jstat.d.ts` with complete type definitions.
2. Add `"types": "./dist/jstat.d.ts"` to package.json.
3. Types must cover all public API from Section 2.
4. Add type tests to verify definitions compile correctly.

### 4.7 Phase 7: Documentation

**Goal:** Update docs to reflect modern usage patterns.

**Steps:**
1. Update README with ESM import examples.
2. Update build/install instructions.
3. Add TypeScript usage examples.
4. Keep existing markdown docs functional.

---

## 5. Build System Details

### 5.1 Current Build (for reference)

```makefile
# Concatenation order determines dependency resolution
JSTAT_FILES = src/_header.js src/core.js src/vector.js src/special.js \
              src/distribution.js src/linearalgebra.js src/test.js \
              src/models.js src/regression.js src/_footer.js

dist/jstat.js:
	cat $(JSTAT_FILES) > $@

dist/jstat.min.js: dist/jstat.js
	./node_modules/.bin/uglifyjs $< -o $@
```

### 5.2 Source Module Dependency Graph

Understanding internal dependencies is critical for the Rollup migration. All
modules depend on the `jStat` object created in `core.js`:

```
core.js          (standalone — creates jStat)
  ├── vector.js         (depends on: core)
  ├── special.js        (depends on: core)
  ├── distribution.js   (depends on: core, special)
  ├── linearalgebra.js  (depends on: core)
  ├── test.js           (depends on: core, distribution, vector)
  ├── models.js         (depends on: core, linearalgebra)
  └── regression.js     (depends on: core, linearalgebra, distribution)
```

### 5.3 Target Rollup Configuration

```javascript
// rollup.config.js
import { terser } from 'rollup-plugin-terser';

export default [
    // UMD (backwards compatible)
    {
        input: 'src/index.js',
        output: {
            file: 'dist/jstat.js',
            format: 'umd',
            name: 'jStat',
            exports: 'default',
            outro: 'exports.jStat = exports;'  // compat alias
        }
    },
    // UMD minified
    {
        input: 'src/index.js',
        output: {
            file: 'dist/jstat.min.js',
            format: 'umd',
            name: 'jStat',
            exports: 'default',
            outro: 'exports.jStat = exports;',
            plugins: [terser()]
        }
    },
    // ESM
    {
        input: 'src/index.js',
        output: {
            file: 'dist/jstat.esm.js',
            format: 'es'
        }
    },
    // CJS
    {
        input: 'src/index.js',
        output: {
            file: 'dist/jstat.cjs.js',
            format: 'cjs',
            exports: 'default',
            outro: 'module.exports.jStat = module.exports;'
        }
    }
];
```

---

## 6. Testing Strategy

### 6.1 Test Categories

**Unit tests** — one test file per source module, testing every public static
method with:
- Normal inputs (happy path)
- Edge cases (empty array, single element, very large arrays)
- Boundary values (0, -0, Infinity, -Infinity, NaN)
- Type coercion cases (string numbers, null, undefined)

**Instance method tests** — verify that instance wrappers produce the same
results as static methods.

**Distribution tests** — for each of the 23 distributions:
- PDF values match reference (R/SciPy)
- CDF values match reference
- CDF(inv(p)) ≈ p (round-trip)
- mean/median/mode/variance match known formulas
- sample() produces values in valid range
- Edge cases for each distribution's parameter constraints

**Backwards compatibility tests** — smoke tests that verify:
- `require('jstat').jStat` works
- `jStat.fn` === `jStat.prototype`
- Constructor modes all work
- Chaining with callbacks works
- Distribution constructor pattern works

**Numerical accuracy tests** — compare against reference implementations:
- Special functions vs. known values (Abramowitz & Stegun tables)
- Distribution quantiles vs. R's `qnorm`, `qt`, etc.
- Matrix operations vs. known results
- Tolerance: typically 1e-7 relative error for most functions

### 6.2 Test Helpers

```javascript
// Approximate equality for floating-point comparisons
function assertApproxEqual(actual, expected, tol = 1e-10) {
    assert.ok(
        Math.abs(actual - expected) < tol,
        `Expected ${expected}, got ${actual} (diff: ${Math.abs(actual - expected)})`
    );
}

// Relative error check for values far from zero
function assertRelativeEqual(actual, expected, relTol = 1e-7) {
    const relErr = Math.abs((actual - expected) / expected);
    assert.ok(
        relErr < relTol,
        `Expected ${expected}, got ${actual} (relative error: ${relErr})`
    );
}
```

### 6.3 Known Issues to Fix

1. **geomean floating-point precision** (7 broken tests) — The implementation
   `Math.exp(mean(arr.map(Math.log)))` accumulates float errors. Fix: use
   compensated summation or adjust test tolerances to use approximate equality.

2. **`jStat.fn.anovaftes`** — typo in method name (missing trailing 't').
   Must keep the typo for backwards compat but can add `anovaftest` as alias.

---

## 7. Migration Path

### 7.1 Execution Order

```
Phase 1: Tests           ← FIRST (safety net for everything else)
Phase 2: Build System    ← enables modern module output
Phase 3: Code Modern.    ← syntax updates with tests as guard
Phase 4: Lint/Format     ← enforces consistency
Phase 5: CI/CD           ← automated quality gates
Phase 6: TypeScript      ← type definitions
Phase 7: Documentation   ← update for new usage patterns
```

### 7.2 Versioning Strategy

All changes ship under the **1.x line** since there are no breaking changes.

- Phase 1 (tests): 1.9.7 — internal only, no user-facing changes
- Phase 2 (build): 1.10.0 — adds ESM/CJS entry points (minor bump)
- Phase 3 (code): no version bump (internal refactor)
- Phase 4 (lint): no version bump (internal)
- Phase 5 (CI): no version bump (internal)
- Phase 6 (types): 1.11.0 — adds TypeScript definitions (minor bump)
- Phase 7 (docs): no version bump

### 7.3 Risk Mitigation

- **Every phase starts with `npm test` passing.**
- **Every phase ends with `npm test` passing.**
- **No phase modifies public API signatures.**
- **The UMD `dist/jstat.js` output is tested for behavioral equivalence
  throughout.**
- **Phase 2 (build) must verify that the Rollup UMD output produces identical
  results by running the full test suite against it.**
- **Git tags mark each phase completion for easy rollback.**

### 7.4 What We Are NOT Doing

To keep scope manageable and risk low:

- **No class-based rewrite** — the prototype pattern works and changing it
  risks breaking the world.
- **No Promise-based API** — the callback/setTimeout pattern is the public API.
- **No tree-shakeable named exports of individual functions** — would require a
  fundamentally different architecture. The ESM export is still the full jStat
  object.
- **No new statistical functions** — modernization only.
- **No algorithm changes** — unless fixing a known bug (geomean precision).
- **No dropping support for any distribution or method.**
