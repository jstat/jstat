# Phase 2 Research: Build System Modernization

Research document for replacing the Makefile + cat concatenation build with a
modern bundler, producing UMD, CommonJS, and ESM output from the same source.

---

## Table of Contents

1. [Environment and Baseline](#1-environment-and-baseline)
2. [Current Build Architecture](#2-current-build-architecture)
3. [Source File Analysis](#3-source-file-analysis)
4. [Module Dependency Graph](#4-module-dependency-graph)
5. [Build Tool Evaluation](#5-build-tool-evaluation)
6. [ESM Conversion Strategy](#6-esm-conversion-strategy)
7. [Dual Output Strategy](#7-dual-output-strategy)
8. [Migration Steps](#8-migration-steps)
9. [Backwards Compatibility Verification](#9-backwards-compatibility-verification)
10. [Risks and Open Questions](#10-risks-and-open-questions)

---

## 1. Environment and Baseline

### 1.1 Development Environment

- **Node.js version:** 22.14.0
- **npm version:** 10.x (ships with Node 22)
- **OS:** Linux (Ubuntu-based)
- **Make version:** GNU Make 4.x

### 1.2 Current Build Commands

```bash
make core         # Build dist/jstat.js and dist/jstat.min.js
make clean        # rm -rf dist
make test         # clean + core + node --test "test/**/*-test.js"
npm test          # make clean core && node --test "test/**/*-test.js"
```

### 1.3 Current Output Files

| File | Lines | Bytes | Description |
|------|------:|------:|-------------|
| `dist/jstat.js` | 5,001 | 129,999 | Unminified UMD bundle |
| `dist/jstat.min.js` | 1 | 73,428 | Minified UMD (uglify-js) |

### 1.4 Current Build Time

```
real  0m0.611s    (clean + core, including minification)
user  0m1.032s
sys   0m0.111s
```

The build is essentially instant. The concatenation step (`cat`) is negligible;
the minification step (uglify-js) accounts for nearly all the time.

### 1.5 Source File Sizes

| File | Lines | Bytes | % of Total |
|------|------:|------:|------------|
| `src/_header.js` | 9 | 267 | 0.2% |
| `src/core.js` | 685 | 16,619 | 12.8% |
| `src/vector.js` | 566 | 14,870 | 11.4% |
| `src/special.js` | 510 | 13,118 | 10.1% |
| `src/distribution.js` | 1,598 | 40,511 | 31.2% |
| `src/linearalgebra.js` | 970 | 25,761 | 19.8% |
| `src/test.js` | 339 | 9,781 | 7.5% |
| `src/models.js` | 113 | 3,493 | 2.7% |
| `src/regression.js` | 206 | 5,488 | 4.2% |
| `src/_footer.js` | 5 | 91 | 0.1% |
| **Total** | **5,001** | **129,999** | **100%** |

### 1.6 Current Dev Dependencies

```json
{
    "uglify-js": "^3.6.7",
    "vows": "^0.8.3"
}
```

After Phase 1 (test migration), vows will be removed. The only build-related
dependency is uglify-js for minification.

---

## 2. Current Build Architecture

### 2.1 Makefile Analysis

The Makefile (`/var/projects/jstat/Makefile`) defines the following build
targets:

```makefile
NODE_PATH ?= ./node_modules
DIST_DIR = ./dist
JS_COMPILER = node_modules/.bin/uglifyjs
JS_TESTER = node_modules/.bin/vows

core: jstat.js jstat.min.js

jstat.js: \
    src/_header.js \
    src/core.js \
    src/vector.js \
    src/special.js \
    src/distribution.js \
    src/linearalgebra.js \
    src/test.js \
    src/models.js \
    src/regression.js \
    src/_footer.js
    @mkdir -p $(DIST_DIR)
    @cat $^ > $(DIST_DIR)/$@

jstat.min.js: jstat.js
    @$(JS_COMPILER) < $(DIST_DIR)/$< > $(DIST_DIR)/$@
```

The build is two steps:

1. **Concatenation:** `cat` all 10 source files (in dependency order) into
   `dist/jstat.js`
2. **Minification:** pipe through `uglifyjs` to produce `dist/jstat.min.js`

There is no transpilation, no module resolution, no tree-shaking, and no source
maps. The concatenation order is critical because the source files are not
self-contained modules -- they rely on variables defined in earlier files being
available in scope.

### 2.2 File Concatenation Order

The order in the Makefile is not arbitrary. It follows a strict dependency
chain:

```
1. _header.js          Opens the UMD wrapper and factory function
2. core.js             Creates the jStat object (IIFE returning jStat)
3. vector.js           Adds vector stat methods to jStat (IIFE, receives jStat)
4. special.js          Adds special math functions to jStat (IIFE, receives jStat)
5. distribution.js     Adds 23 distributions to jStat (IIFE, receives jStat)
6. linearalgebra.js    Adds matrix ops to jStat (IIFE, receives jStat)
7. test.js             Adds hypothesis tests to jStat (IIFE, receives jStat)
8. models.js           Adds OLS regression (IIFE, assigns to jStat.models)
9. regression.js       Adds regression utilities via jStat.extend
10. _footer.js         Sets jStat.jStat = jStat, returns jStat, closes UMD
```

### 2.3 UMD Wrapper Structure

**Opening (`_header.js`, 9 lines):**

```javascript
(function (window, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();          // CommonJS
    } else if (typeof define === 'function' && define.amd) {
        define(factory);                      // AMD
    } else {
        window.jStat = factory();             // Browser global
    }
})(this, function () {
```

**Closing (`_footer.js`, 5 lines):**

```javascript
  // Make it compatible with previous version.
  jStat.jStat = jStat;

  return jStat;
});
```

The entire library runs inside a single factory function. The factory:
1. Creates the `jStat` object via core.js
2. Mutates it by adding methods from each subsequent file
3. Sets `jStat.jStat = jStat` for backwards compatibility
4. Returns `jStat` to the UMD wrapper which exports it

The `jStat.jStat = jStat` self-reference is critical for backwards compat:
`require('jstat').jStat` must equal the jStat function itself.

### 2.4 What the UMD Wrapper Provides

Three environment targets from one output file:

| Environment | Access Pattern | Mechanism |
|-------------|---------------|-----------|
| **CommonJS (Node.js)** | `require('jstat')` | `module.exports = factory()` |
| **AMD (RequireJS)** | `define(['jstat'], ...)` | `define(factory)` |
| **Browser global** | `window.jStat` | `window.jStat = factory()` |

For CommonJS, the returned value has:
- `require('jstat')` returns the `jStat` function
- `require('jstat').jStat` returns the same `jStat` function (self-reference)
- All methods are properties of this function (e.g., `require('jstat').mean`)

---

## 3. Source File Analysis

### 3.1 `src/core.js` (685 lines, 16,619 bytes)

**Structure:** IIFE that creates and returns the jStat object.

```javascript
var jStat = (function(Math, undefined) {
    // ... private helpers, constructor, prototype, static methods ...
    return jStat;
}(Math));
```

**What it creates:**
- The `jStat` constructor function
- `jStat._init` (initializer, separated from constructor)
- `jStat.fn` alias for `jStat.prototype`
- `jStat.utils` (calcRdx, isArray, isFunction, isNumber, toVector)
- `jStat._random_fn` and `jStat.setRandom`
- `jStat.extend` (jQuery-style object merge)
- Matrix construction: `create`, `zeros`, `ones`, `rand`, `identity`
- Matrix access: `rows`, `cols`, `dimensions`, `row`, `rowa`, `col`, `cola`,
  `diag`, `antidiag`
- Matrix transformation: `transpose`, `map`, `cumreduce`, `alter`, `copy`,
  `slice`, `sliceAssign`
- Matrix utilities: `symmetric`, `clear`, `seq`, `arange`, `diagonal`
- Prototype methods: `toArray`, `toString`, `push`, `sort`, `splice`, `slice`,
  `map`, `cumreduce`, `alter`
- IIFE-generated instance methods for zero-arg and one-arg static methods

**Private variables (module-scoped):**
- `concat`, `slice`, `toString` (Array/Object prototype refs)
- `calcRdx`, `isArray`, `isFunction`, `isNumber`, `toVector` (utility fns)
- `retZero`, `retOne`, `retIdent` (factory fns for zeros/ones/identity)
- `jProto` (alias for jStat.prototype)

**Dependencies:** None. This is the root. It takes only `Math` as a parameter
from the outer scope.

**Key pattern:** The IIFE receives `Math` as a parameter and `undefined` as a
second parameter (a pre-ES5 trick to ensure `undefined` is truly undefined).
The entire module creates `jStat` in a local scope and returns it. The returned
value is assigned to `var jStat` in the factory function's scope, making it
available to all subsequent files.

### 3.2 `src/vector.js` (566 lines, 14,870 bytes)

**Structure:** IIFE that receives `jStat` and `Math`, adds methods directly
to `jStat` and `jStat.prototype`.

```javascript
(function(jStat, Math) {
    // ... adds static methods, extends prototype ...
}(jStat, Math));
```

**What it adds:**
- Statistical functions as static methods on `jStat`: `sum`, `sumsqrd`,
  `sumsqerr`, `sumrow`, `product`, `min`, `max`, `unique`, `mean`, `meansqerr`,
  `geomean`, `median`, `cumsum`, `cumprod`, `diff`, `rank`, `mode`, `range`,
  `variance`, `pooledvariance`, `deviation`, `stdev`, `pooledstdev`, `meandev`,
  `meddev`, `coeffvar`, `quartiles`, `quantiles`, `percentile`,
  `percentileOfScore`, `histogram`, `covariance`, `corrcoeff`, `spearmancoeff`,
  `stanMoment`, `skewness`, `kurtosis`
- IIFE-generated prototype wrappers for cumsum/cumprod (special handling)
- IIFE-generated prototype wrappers for all zero-arg stat methods (large loop)
- IIFE-generated prototype wrappers for quantiles/percentileOfScore (with args)

**Private variables:**
- `isFunction` (from `jStat.utils.isFunction`)
- `ascNum` (sort comparator)
- `clip` (clamping helper)
- `jProto` (alias for `jStat.prototype`)

**Dependencies:**
- **core.js:** `jStat`, `jStat.utils.isFunction`,
  `jStat.cumreduce`, `jStat.map`, `jStat.utils.toVector`, `jStat.prototype`
- Note: `jStat.mean` and `jStat.sum` are defined in vector.js itself, not
  core.js. Internal references to these within vector.js are self-references.

### 3.3 `src/special.js` (510 lines, 13,118 bytes)

**Structure:** IIFE that receives `jStat` and `Math`, adds special math
functions to `jStat`.

```javascript
(function(jStat, Math) {
    // ... adds gammaln, gammafn, betafn, erf, etc. ...
}(jStat, Math));
```

**What it adds:**
- Special functions as static methods: `gammaln`, `loggam`, `gammafn`,
  `gammap`, `lowRegGamma`, `factorialln`, `factorial`, `combination`,
  `combinationln`, `permutation`, `betafn`, `betaln`, `betacf`, `gammapinv`,
  `erf`, `erfc`, `erfcinv`, `ibetainv`, `ibeta`, `randn`, `randg`
- IIFE-generated prototype wrappers for `gammaln`, `gammafn`, `factorial`,
  `factorialln` (mapped over matrix elements)
- IIFE-generated prototype wrapper for `randn`

**Private variables:** None that persist outside the IIFE.

**Dependencies:**
- **core.js:** `jStat`, `jStat.fn`, `jStat.map`, `jStat.create`, `jStat.zeros`,
  `jStat._random_fn`

### 3.4 `src/distribution.js` (1,598 lines, 40,511 bytes)

**Structure:** IIFE that receives `jStat` and `Math`, defines all 23
probability distributions.

```javascript
(function(jStat, Math) {
    // Distribution factory (generates constructors + instance methods)
    (function(list) {
        // ... for each distribution name ...
    })('beta centralF cauchy ... arcsine'.split(' '));

    // Then each distribution gets its static methods via jStat.extend:
    jStat.extend(jStat.beta, { pdf: ..., cdf: ..., inv: ..., ... });
    jStat.extend(jStat.centralF, { ... });
    // ... 23 distributions ...
}(jStat, Math));
```

**What it adds:**
- 23 distribution constructors: `jStat.beta`, `jStat.centralF`, `jStat.cauchy`,
  `jStat.chisquare`, `jStat.exponential`, `jStat.gamma`, `jStat.invgamma`,
  `jStat.kumaraswamy`, `jStat.laplace`, `jStat.lognormal`, `jStat.noncentralt`,
  `jStat.normal`, `jStat.pareto`, `jStat.studentt`, `jStat.weibull`,
  `jStat.uniform`, `jStat.binomial`, `jStat.negbin`, `jStat.hypgeom`,
  `jStat.poisson`, `jStat.triangular`, `jStat.tukey`, `jStat.arcsine`
- For each: constructor, `jStat.fn[dist]` instance wrapper, and prototype
  methods (`pdf`, `cdf`, `inv`, `mean`, `median`, `mode`, `variance`, `sample`)
- Static methods for each distribution (`jStat.normal.pdf(x, mu, sigma)`, etc.)

**Private variables:** None that persist outside the IIFE, though the factory
closure is complex.

**Dependencies:**
- **core.js:** `jStat`, `jStat.fn`, `jStat.extend`, `jStat.alter`,
  `jStat._random_fn`
- **special.js (heavy):** `jStat.gammaln`, `jStat.gammafn`, `jStat.gammap`,
  `jStat.lowRegGamma`, `jStat.gammapinv`, `jStat.factorial`, `jStat.betafn`,
  `jStat.betaln`, `jStat.betacf`, `jStat.ibeta`, `jStat.ibetainv`,
  `jStat.erf`, `jStat.erfc`, `jStat.erfcinv`, `jStat.randn`, `jStat.randg`,
  `jStat.loggam`, `jStat.combination`
- **vector.js (light):** `jStat.mean` (used in uniform distribution median
  calculation), `jStat.sum` (used in Poisson CDF)

### 3.5 `src/linearalgebra.js` (970 lines, 25,761 bytes)

**Structure:** IIFE that receives `jStat` and `Math`, adds linear algebra
operations via `jStat.extend`.

```javascript
(function(jStat, Math) {
    var push = Array.prototype.push;
    var isArray = jStat.utils.isArray;

    function isUsable(arg) { ... }

    jStat.extend({
        add: ..., subtract: ..., multiply: ..., // etc.
    });

    // IIFE-generated prototype wrappers
    (function(funcs) { ... })('add divide multiply ...'.split(' '));
}(jStat, Math));
```

**What it adds:**
- Arithmetic: `add`, `subtract`, `divide`, `multiply`, `outer`, `dot`, `pow`,
  `exp`, `log`, `abs`, `norm`, `angle`
- Matrix decomposition: `aug`, `inv`, `det`, `gauss_elimination`,
  `gauss_jordan`, `triaUpSolve`, `triaLowSolve`, `lu`, `cholesky`, `QR`,
  `lstsq`
- Iterative solvers: `gauss_jacobi`, `gauss_seidel`, `SOR`
- Eigenvalue: `jacobi`, `householder`
- Numerical methods: `rungekutta`, `romberg`, `richardson`, `simpson`
- Interpolation: `hermite`, `lagrange`, `cubic_spline`
- PCA: `PCA`
- `gauss_quadrature` (stub, throws)
- Prototype wrappers for arithmetic operations

**Private variables:**
- `push` (Array.prototype.push)
- `isArray` (from jStat.utils)
- `isUsable` (helper function)
- `sum`, `range` closures inside `QR` (references to `jStat.sum` and
  `jStat.arange`)

**Dependencies:**
- **core.js:** `jStat`, `jStat.extend`, `jStat.utils.isArray`, `jStat.map`,
  `jStat.zeros`, `jStat.identity`, `jStat.transpose`, `jStat.copy`,
  `jStat.arange`, `jStat.slice`, `jStat.sliceAssign`, `jStat.fn`
- **self-references (defined in this file's own extend block):**
  `jStat.multiply`, `jStat.inv`, `jStat.add`, `jStat.subtract`, `jStat.dot`
- **vector.js:** `jStat.sum` (used in the QR decomposition closure)

Note: linearalgebra.js references `jStat.sum` and `jStat.arange`.
`jStat.arange` is defined in core.js. `jStat.sum` is defined in vector.js
(not core.js). The QR decomposition closure (`var sum = jStat.sum`) captures
the reference at define time. Since vector.js is loaded before
linearalgebra.js, the QR closure gets the vector.js version. This is a
subtle load-order dependency that must be preserved in the ES module
import order.

### 3.6 `src/test.js` (339 lines, 9,781 bytes)

**Structure:** IIFE that receives `jStat` and `Math`, adds statistical
hypothesis testing functions.

```javascript
(function(jStat, Math) {
    var slice = [].slice;
    var isNumber = jStat.utils.isNumber;
    var isArray = jStat.utils.isArray;

    // Z, T, F, Tukey statistics via jStat.extend
    // Instance methods via jStat.extend(jStat.fn, { ... })
}(jStat, Math));
```

**What it adds:**
- Z-statistics: `zscore`, `ztest` (static + instance)
- T-statistics: `tscore`, `ttest` (static + instance)
- F-statistics: `anovafscore`, `anovaftest`, `ftest` (static)
- Instance: `anovafscore`, `anovaftes` (the typo)
- Tukey's range: `qscore`, `qtest`, `tukeyhsd`
- Error bounds: `normalci`, `tci` (static + instance), `significant` (static only)
- Difference of proportions: `oneSidedDifferenceOfProportions`,
  `twoSidedDifferenceOfProportions` (instance only)

**Private variables:**
- `slice` ([].slice)
- `isNumber`, `isArray` (from jStat.utils)
- `differenceOfProportions` (internal helper function)

**Dependencies:**
- **core.js:** `jStat`, `jStat.extend`, `jStat.utils.isNumber`,
  `jStat.utils.isArray`
- **vector.js:** `jStat.mean`, `jStat.stdev`, `jStat.pooledstdev`
- **distribution.js:** `jStat.normal.cdf`, `jStat.normal.inv`,
  `jStat.studentt.cdf`, `jStat.studentt.inv`, `jStat.centralF.cdf`,
  `jStat.tukey.cdf`

### 3.7 `src/models.js` (113 lines, 3,493 bytes)

**Structure:** IIFE assigned directly to `jStat.models`.

```javascript
jStat.models = (function() {
    function sub_regress(exog) { ... }
    function ols(endog, exog) { ... }
    function t_test(model) { ... }
    function F_test(model) { ... }
    function ols_wrap(endog, exog) { ... }
    return { ols: ols_wrap };
})();
```

**What it adds:**
- `jStat.models` object with a single public method: `ols`
- Internal helpers: `sub_regress`, `ols`, `t_test`, `F_test`

**Private variables (closure-scoped):**
- `sub_regress`, `ols`, `t_test`, `F_test` (internal functions)

**Dependencies:**
- **core.js:** `jStat` (constructor), `jStat.col`, `jStat.arange`
- **vector.js:** `jStat.mean`, `jStat.sum`
- **linearalgebra.js:** `jStat.lstsq`, `jStat.multiply`, `jStat.subtract`
- **distribution.js:** `jStat.studentt.cdf`, `jStat.studentt.inv`,
  `jStat.beta.cdf`

### 3.8 `src/regression.js` (206 lines, 5,488 bytes)

**Structure:** Direct calls to `jStat.extend`, no wrapping IIFE.

```javascript
jStat.extend({
    buildxmatrix: function() { ... },
    builddxmatrix: function() { ... },
    // ... more regression functions ...
});
```

**What it adds:**
- Matrix builders: `buildxmatrix`, `builddxmatrix`, `buildjxmatrix`,
  `buildymatrix`, `buildjymatrix`
- Matrix operations: `matrixmult`, `xtranspx`, `xtranspxinv`
- Regression: `regress`, `regresst`
- Prediction: `jMatYBar`, `residuals`
- Sum of squares: `ssr`, `sse`, `sst`
- `matrixsubtract`

**Private variables:** None.

**Dependencies:**
- **core.js:** `jStat` (constructor), `jStat.extend`
- **vector.js:** `jStat.fn.mean` (instance method, called as `jMatY.mean()` at
  line 109)
- **linearalgebra.js:** `jStat.inv` (via `xtranspxinv`)
- Note: `jStat.matrixmult` is defined in regression.js itself (line 57), not
  in linearalgebra.js. Internal references are self-references.
- **test.js:** `jStat.anovaftest`, `jStat.ttest` (used in `regresst`)
- **distribution.js:** (indirect, via test.js's use of distributions)

---

## 4. Module Dependency Graph

### 4.1 Direct Dependencies

```
core.js                     (standalone -- creates jStat)
  |
  +-- vector.js             (depends on: core)
  |
  +-- special.js            (depends on: core)
  |
  +-- distribution.js       (depends on: core, special, vector*)
  |
  +-- linearalgebra.js      (depends on: core, vector**)
  |
  +-- test.js               (depends on: core, vector, distribution)
  |
  +-- models.js             (depends on: core, vector, linearalgebra, distribution)
  |
  +-- regression.js         (depends on: core, vector****, linearalgebra, test, distribution***)
```

`*` distribution.js uses `jStat.mean` and `jStat.sum` from vector.js in two
places (uniform distribution median calculation and Poisson CDF).

`**` linearalgebra.js captures `jStat.sum` and `jStat.arange` in the QR
closure. `jStat.arange` is from core.js. `jStat.sum` is defined in vector.js
(overrides nothing in core.js). The QR closure captures it at module load time.

`***` regression.js uses `jStat.anovaftest` and `jStat.ttest` from test.js,
which in turn uses distributions.

`****` regression.js calls `jMatY.mean()` (line 109), which is an instance
method added by vector.js.

### 4.2 Load Order (must be preserved)

```
1. core.js
2. vector.js           (after core)
3. special.js          (after core, parallel with vector if desired)
4. distribution.js     (after core, special, vector)
5. linearalgebra.js    (after core, vector)
6. test.js             (after core, vector, distribution)
7. models.js           (after core, vector, linearalgebra, distribution)
8. regression.js       (after core, vector, linearalgebra, test)
```

### 4.3 Dependency Matrix

| File | core | vector | special | distrib | linalg | test |
|------|:----:|:------:|:-------:|:-------:|:------:|:----:|
| **vector.js** | X | | | | | |
| **special.js** | X | | | | | |
| **distribution.js** | X | X | X | | | |
| **linearalgebra.js** | X | X | | | | |
| **test.js** | X | X | | X | | |
| **models.js** | X | X | | X | X | |
| **regression.js** | X | X | | | X | X |

### 4.4 Circular Dependency Analysis

There are **no circular dependencies**. The graph is a DAG (directed acyclic
graph). This is good news for module conversion -- a bundler can resolve the
dependency order automatically.

### 4.5 Shared Mutable State

All files mutate a single shared object: `jStat`. This is the fundamental
pattern -- each file adds properties to `jStat`, and later files reference
properties added by earlier files. When converting to ES modules, this shared
state must be carefully managed:

- **Option A (monolithic):** One central module creates jStat, all others
  import and mutate it, then a barrel module re-exports it.
- **Option B (import/export):** Each module exports its additions, and an entry
  point assembles them onto jStat.

Option A is simpler and lower-risk for Phase 2. Option B is cleaner but
requires more refactoring (better suited for Phase 3).

---

## 5. Build Tool Evaluation

### 5.1 Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| UMD output (matching current) | **Must** | `dist/jstat.js` must be API-identical |
| Minified UMD output | **Must** | `dist/jstat.min.js` |
| ESM output | **Must** | New `dist/jstat.esm.mjs` |
| CJS output | **Should** | New `dist/jstat.cjs.js` (cleaner than UMD for Node) |
| Source maps | **Should** | For debugging |
| Minimal dependencies | **Should** | Align with zero-dependency philosophy |
| Fast builds | **Nice** | Current build is 0.6s, should not regress significantly |
| Simple config | **Nice** | Maintainable by a small project |
| Tree-shaking support | **Future** | Not needed now, but nice if the tool supports it later |

### 5.2 Rollup

**What it is:** A module bundler designed for libraries. Excels at producing
clean, readable output in multiple formats.

**Pros:**
- Designed for library bundling (exactly our use case)
- First-class UMD, ESM, CJS output formats
- Clean output -- does not wrap every module in extra function scopes
- Excellent tree-shaking (useful if we later expose individual functions)
- Output closely resembles hand-written code
- Mature plugin ecosystem: `@rollup/plugin-terser` for minification
- Small dependency footprint (~20 packages total)
- Source map support built-in
- `output.banner` / `output.footer` options for custom wrapper customization
- `output.outro` / `output.intro` options for injecting code inside the wrapper

**Cons:**
- Slightly more complex config than esbuild
- Plugin-based architecture means terser is a separate install
- Slower than esbuild for large projects (not relevant at our scale)

**UMD output control:** Rollup's UMD format generates a standard UMD wrapper
with configurable `name` (global variable name). We can control:
- `name: 'jStat'` -- sets `window.jStat`
- `exports: 'default'` -- the default export becomes the module value
- Note: `outro` cannot be used to set the `jStat.jStat` self-reference via
  `exports.jStat = exports` because `exports` is not in scope inside the UMD
  factory when using `exports: 'default'`. Section 7.4 describes the correct
  solution: setting `jStat.jStat = jStat` in `src/index.js`.

**Version:** Rollup 4.x (latest stable as of early 2026)

### 5.3 esbuild

**What it is:** An extremely fast bundler written in Go. Designed for
application bundling with speed as the primary goal.

**Pros:**
- Extremely fast (10-100x faster than Rollup)
- Built-in minification (no separate plugin)
- Zero JavaScript dependencies (single binary)
- Simple API

**Cons:**
- **No native UMD output format.** This is a significant gap. esbuild supports
  `iife`, `cjs`, and `esm`, but not UMD. To produce UMD output, we would need
  a custom wrapper script or a plugin.
- Less control over output format details
- Output is less readable (more wrapper code per module)
- No `outro`/`intro` injection for custom code inside the wrapper
- Tree-shaking is less sophisticated than Rollup's
- The `iife` format does not produce a standard UMD wrapper that supports
  CJS + AMD + browser global in one file

**UMD workaround:** We could use `iife` format with `globalName: 'jStat'` for
the browser bundle, and separately produce CJS and ESM. But this means the
browser bundle would NOT work with `require()` -- breaking the current behavior
where `dist/jstat.js` works in both Node and browser.

**Verdict:** esbuild's lack of UMD support is a dealbreaker for our primary
requirement.

### 5.4 webpack

**What it is:** A full-featured module bundler primarily designed for web
applications.

**Pros:**
- UMD support via `output.libraryTarget: 'umd'`
- Extremely mature, well-documented
- Plugin for everything

**Cons:**
- Massive dependency tree (300+ packages)
- Configuration complexity is extreme for a simple library
- Output includes webpack runtime boilerplate (~2KB)
- Designed for applications, not libraries
- Overkill for our use case
- Output is less readable than Rollup

**Verdict:** Too heavyweight and application-oriented. The webpack runtime
boilerplate would be unnecessary overhead in our clean library output.

### 5.5 Comparison Summary

| Feature | Rollup | esbuild | webpack |
|---------|--------|---------|---------|
| UMD output | Yes (native) | **No** | Yes (native) |
| ESM output | Yes | Yes | Yes |
| CJS output | Yes | Yes | Yes |
| Clean output | **Best** | Good | Worst (runtime) |
| Config complexity | Low | **Lowest** | High |
| Build speed | Fast | **Fastest** | Slow |
| Dependency count | ~20 | **1** | ~300 |
| Source maps | Yes | Yes | Yes |
| Library focus | **Yes** | No | No |
| Tree-shaking | **Best** | Good | Good |
| Minification | Plugin | Built-in | Plugin |

### 5.6 Recommendation: Rollup

Rollup is the clear choice for this project:

1. **Native UMD support** -- critical for maintaining `dist/jstat.js`
   compatibility
2. **Clean output** -- the generated UMD wrapper is standard and predictable,
   close to what we currently hand-write
3. **Library-focused design** -- Rollup was built for exactly this use case
4. **Dual output** -- producing UMD, ESM, and CJS from one build is
   straightforward
5. **Source maps** -- built-in, zero-config
6. **Low dependency count** -- aligns with jStat's zero-dependency philosophy
7. **Future tree-shaking** -- if we later expose individual functions as named
   exports, Rollup will handle it best

The build speed difference between Rollup and esbuild is irrelevant at our
scale (130KB of source). Both will complete in under a second.

---

## 6. ESM Conversion Strategy

### 6.1 The Key Question: Convert Source Now or Later?

Phase 2 is about the build system. Phase 3 is about code modernization. The
question is: **should Phase 2 convert the source files to ES modules, or should
it just replace the build tool while keeping the concatenation approach?**

**Option A: Convert to ES modules in Phase 2**
- Each src/ file becomes a proper ES module with `import`/`export`
- Rollup resolves the dependency graph automatically
- Removes `_header.js` and `_footer.js` (Rollup generates wrappers)
- Pros: Clean separation, enables tree-shaking infrastructure
- Cons: Larger diff, more risk, mixes build + source changes in one phase

**Option B: Keep concatenation, just replace the tool**
- Rollup uses a single entry point that `cat`-like concatenates the files
- Or use `rollup-plugin-multi-entry` to treat files as one big input
- Pros: Minimal source changes, lower risk
- Cons: Does not really leverage Rollup's strengths, still no proper modules

**Option C: Minimal ES module wrappers in Phase 2, full modernization in Phase 3**
- Add `import`/`export` statements to each file without changing internal code
- Keep pre-ES6 patterns (`var`, no arrow functions) -- those change in Phase 3
- Each file imports `jStat` from core.js and mutates it (same pattern as now)
- Pros: Enables Rollup properly, minimal internal code changes, clean phase
  boundary
- Cons: The imports/exports look odd alongside `var` and old-style functions

### 6.2 Recommendation: Option C

Option C gives us the best balance. The changes per file are small and
mechanical:

1. Remove the IIFE wrapper from each file
2. Add `import jStat from './core.js'` (or similar)
3. Add `export default jStat` (or just export nothing, since we mutate)
4. Create `src/index.js` as the entry point that imports everything in order

This keeps the actual code untouched (no `var` -> `let`, no arrow functions)
while giving Rollup proper module boundaries to work with. Phase 3 then
modernizes the code within these module boundaries.

### 6.3 Conversion Pattern for Each File Type

**Pattern 1: core.js (creates jStat)**

Before:
```javascript
var jStat = (function(Math, undefined) {
    // ... 680 lines ...
    return jStat;
}(Math));
```

After:
```javascript
// Private helpers (were inside IIFE scope)
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;
// ...

function jStat() {
    return new jStat._init(arguments);
}
// ... all the code that was inside the IIFE ...

export default jStat;
```

The IIFE served to create a private scope. ES modules already provide file-level
scope, so the IIFE can be removed. `Math` is a global and does not need to be
passed as a parameter. The `undefined` parameter trick is unnecessary in ES
modules (strict mode guarantees `undefined` is not reassignable).

**Pattern 2: vector.js, special.js, etc. (mutates jStat)**

Before:
```javascript
(function(jStat, Math) {
    var isFunction = jStat.utils.isFunction;
    // ... adds methods to jStat ...
}(jStat, Math));
```

After:
```javascript
import jStat from './core.js';

var isFunction = jStat.utils.isFunction;
// ... same code, adds methods to jStat ...
```

The IIFE is removed. The `jStat` and `Math` parameters are replaced: `jStat`
comes from an import, `Math` is a global. The module's top-level scope
replaces the IIFE scope for variable privacy.

**Pattern 3: models.js (IIFE assigned to property)**

Before:
```javascript
jStat.models = (function() {
    // ... internal functions ...
    return { ols: ols_wrap };
})();
```

After:
```javascript
import jStat from './core.js';

// The inner IIFE can stay (it provides private scope for internal helpers)
// OR we can remove it since ES module scope is already private:
function sub_regress(exog) { ... }
function ols(endog, exog) { ... }
// ...
jStat.models = { ols: ols_wrap };
```

**Pattern 4: regression.js (no IIFE, direct extend)**

Before:
```javascript
jStat.extend({
    buildxmatrix: function() { ... },
    // ...
});
```

After:
```javascript
import jStat from './core.js';

jStat.extend({
    buildxmatrix: function() { ... },
    // ...
});
```

Simplest case -- just add the import. No IIFE to remove.

### 6.4 The Entry Point: `src/index.js`

This new file is the single entry point for Rollup. It imports all modules in
dependency order and exports jStat:

```javascript
import jStat from './core.js';
import './vector.js';
import './special.js';
import './distribution.js';
import './linearalgebra.js';
import './test.js';
import './models.js';
import './regression.js';

// Backwards compatibility self-reference
jStat.jStat = jStat;

export default jStat;
```

The side-effect imports (`import './vector.js'`) work because each module
mutates the shared `jStat` object. The order of imports matters because of the
dependency chain documented in Section 4.

### 6.5 What Happens to `_header.js` and `_footer.js`

Both are **removed**. Their functionality is replaced by:
- `_header.js` (UMD wrapper opening) -> Rollup's UMD output format
- `_footer.js` (self-reference + return) -> `src/index.js` sets
  `jStat.jStat = jStat`, and `export default jStat` is what Rollup wraps

### 6.6 Math Parameter Removal

Every IIFE currently receives `Math` as a parameter:

```javascript
(function(jStat, Math) { ... }(jStat, Math));
```

This was a micro-optimization pattern from the early 2010s: passing `Math` as
a local parameter was thought to be faster than looking it up in the global
scope. In modern engines this makes no measurable difference. When removing the
IIFE, the `Math` parameter is dropped and the code just references the global
`Math` directly (which it already effectively does -- the parameter simply
shadows the global with the same value).

### 6.7 The `undefined` Parameter

`core.js` uses the pattern:

```javascript
var jStat = (function(Math, undefined) { ... }(Math));
```

The second parameter is not passed a value, ensuring `undefined` is truly
`undefined` (a defensive pattern from pre-ES5 when `undefined` was assignable).
ES modules run in strict mode where `undefined` cannot be reassigned, so this
parameter is safely removed.

---

## 7. Dual Output Strategy

### 7.1 Output Files

| File | Format | Purpose |
|------|--------|---------|
| `dist/jstat.js` | UMD | Browser + legacy Node.js, backwards compatible |
| `dist/jstat.min.js` | UMD (minified) | Production browser use |
| `dist/jstat.esm.mjs` | ES module | Modern bundlers, tree-shaking potential |
| `dist/jstat.cjs.js` | CommonJS | Node.js `require()` |

**Why `.mjs` for the ESM build:** The package.json has no `"type": "module"`
field, so Node.js treats `.js` files as CommonJS by default. A `.js` file
containing `export default` syntax would fail to parse. The `.mjs` extension
forces Node.js to parse the file as an ES module regardless of the package
type, ensuring it works without requiring a `"type": "module"` change that
would affect all other `.js` files in the package.

### 7.2 Rollup Configuration

```javascript
// rollup.config.mjs
import terser from '@rollup/plugin-terser';

export default [
    // UMD (backwards compatible, replaces current dist/jstat.js)
    {
        input: 'src/index.js',
        output: {
            file: 'dist/jstat.js',
            format: 'umd',
            name: 'jStat',
            exports: 'default',
            // Inject the self-reference inside the UMD factory,
            // after all code but before the return statement.
            // NOTE: This may not be needed if index.js sets jStat.jStat.
            // Test to confirm.
            sourcemap: true
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
            sourcemap: true,
            plugins: [terser()]
        }
    },
    // ESM
    {
        input: 'src/index.js',
        output: {
            file: 'dist/jstat.esm.mjs',
            format: 'es',
            sourcemap: true
        }
    },
    // CJS
    {
        input: 'src/index.js',
        output: {
            file: 'dist/jstat.cjs.js',
            format: 'cjs',
            exports: 'default',
            sourcemap: true
        }
    }
];
```

### 7.3 package.json Updates

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
    "files": [
        "dist/"
    ],
    "scripts": {
        "build": "rollup -c",
        "build:watch": "rollup -c --watch",
        "test": "npm run build && node --test \"test/**/*-test.js\""
    }
}
```

**Key decisions:**

1. **`main` stays as `./dist/jstat.js`** -- This is the backwards-compatible
   entry point. Changing it would break existing consumers who `require('jstat')`.
   The UMD file works fine for CJS.

2. **`module` field** -- Points to the ESM build. Understood by bundlers like
   webpack and Rollup when consuming jStat as a dependency.

3. **`exports` field** -- The modern Node.js way to specify conditional exports.
   - `import` -> ESM build (for `import jStat from 'jstat'`)
   - `require` -> CJS build (for `require('jstat')`)
   - `default` -> UMD (fallback)

4. **`files` field** -- Limits what gets published to npm. Only `dist/` is
   needed.

### 7.4 The `jStat.jStat` Self-Reference

The current code sets `jStat.jStat = jStat` in `_footer.js`. This must be
preserved in all output formats:

- **UMD:** The UMD wrapper receives the return value of the factory and exports
  it. The self-reference must be set inside the factory before it returns.
  Rollup's `exports: 'default'` with our `index.js` setting
  `jStat.jStat = jStat` handles this.

- **CJS:** The CJS output needs `module.exports.jStat = module.exports`. This
  can be achieved with Rollup's `outro` option:
  ```javascript
  outro: 'module.exports.jStat = module.exports;'
  ```
  OR by having the source code set it (via `jStat.jStat = jStat` in
  `index.js`), which Rollup will include in all formats.

- **ESM:** The ESM output exports jStat as the default export. Since
  `jStat.jStat = jStat` is set in the source, it will be present on the
  exported object. `import jStat from 'jstat'; jStat.jStat === jStat` will
  be true.

### 7.5 UMD Output Comparison

The current UMD wrapper (hand-written in `_header.js`):

```javascript
(function (window, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.jStat = factory();
    }
})(this, function () {
    // ... library code ...
    return jStat;
});
```

Rollup's UMD output (with `name: 'jStat'`, `exports: 'default'`):

```javascript
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.jStat = factory());
})(this, (function () { 'use strict';
    // ... library code ...
    return jStat;
}));
```

**Differences:**
1. Rollup's UMD adds a `module !== 'undefined'` check (more robust)
2. Rollup uses `globalThis` with fallback (modern best practice)
3. Rollup adds `'use strict'` to the factory. Note: the minified output
   currently passes all tests, but this does not prove strict-mode safety
   since uglify-js does not insert `'use strict'` and the code does not
   actually run in strict mode. Strict-mode compatibility will need explicit
   verification when switching to Rollup (which outputs strict-mode ESM).
4. The detection order is the same: CJS first, then AMD, then global

These differences should be **behaviorally identical** for all supported
environments. The `globalThis` addition is strictly an improvement.

### 7.6 Strict Mode Implications

Rollup's ESM output is strict mode by default. The UMD output with the factory
function will also include `'use strict'`. We need to verify that all existing
source code is strict-mode compatible.

**Potential issues:**
- Use of `arguments.callee` -- not present in jStat source
- Duplicate parameter names -- not present
- Assigning to read-only globals -- not present
- `with` statements -- not present
- Octal literals -- not present
- Deleting non-configurable properties -- not present

**Confirmed:** A review of all source files shows no strict-mode violations.
The code appears strict-mode compatible based on manual review. Note that the
current uglify-js minified output does not actually run in strict mode (uglify-js
does not insert `'use strict'`), so the passing minified tests do not constitute
a strict-mode verification. Explicit strict-mode testing should be performed
during the Rollup migration.

---

## 8. Migration Steps

### 8.1 Overview

```
Step 1: Install Rollup and plugins
Step 2: Create rollup.config.mjs
Step 3: Convert source files to ES modules and create src/index.js entry point
Step 4: Build with Rollup and verify all tests pass
Step 5: Update package.json
Step 6: Update Makefile to delegate to npm scripts
Step 7: Clean up
```

### 8.2 Step 1: Install Rollup and Plugins

```bash
npm install --save-dev rollup @rollup/plugin-terser
```

Expected additions to devDependencies:
- `rollup` (~4.x)
- `@rollup/plugin-terser` (~0.4.x)

This replaces `uglify-js`. After migration, `uglify-js` can be removed.

### 8.3 Step 2: Create Rollup Config

Create `rollup.config.mjs` as described in Section 7.2.

### 8.4 Step 3: Convert Source Files to ES Modules and Create Entry Point

This is the core of the migration. For each file:

**`src/core.js`:**
1. Remove the opening `var jStat = (function(Math, undefined) {`
2. Remove the closing `}(Math));`
3. Remove `return jStat;` (line 683) -- top-level `return` is a syntax error
   in ES modules. The export is handled by step 5 instead.
4. The private variables (`concat`, `slice`, `toString`, etc.) become
   module-scoped (still private)
5. Add `export default jStat;` at the end

**`src/vector.js`:**
1. Remove the opening `(function(jStat, Math) {`
2. Remove the closing `}(jStat, Math));`
3. Add `import jStat from './core.js';` at the top
4. Private variables (`isFunction`, `ascNum`, `clip`, `jProto`) become
   module-scoped

**`src/special.js`:**
1. Remove the opening `(function(jStat, Math) {`
2. Remove the closing `}(jStat, Math));`
3. Add `import jStat from './core.js';` at the top

**`src/distribution.js`:**
1. Remove the opening `(function(jStat, Math) {`
2. Remove the closing `}(jStat, Math));`
3. Add `import jStat from './core.js';` at the top
4. Note: distribution.js uses `jStat.mean`, `jStat.sum` (from vector.js) and
   many special functions. These are all accessed via the `jStat` object, which
   is mutated by earlier imports. The import of `jStat` from core.js gives us
   the same object that vector.js and special.js have already mutated.

   **The critical subtlety:** In the current concatenation approach, all files
   share the same `jStat` variable in the factory function's scope. In the ES
   module approach, each file imports `jStat` from core.js. ES module default
   exports are value bindings (not live bindings -- live bindings apply to named
   exports only). However, since `jStat` is an object, the "value" is a
   reference to that object. Each importing file gets the same reference.
   Because the mutations are to properties of this shared object (not
   reassignment of the binding), all files see each other's mutations.
   **This works correctly.**

**`src/linearalgebra.js`:**
1. Remove the IIFE wrapper
2. Add `import jStat from './core.js';`
3. The QR closure currently captures `jStat.sum` and `jStat.arange` at
   definition time. In the ES module version, these closures will capture the
   same references because the QR IIFE runs at import time, after vector.js
   has been imported (import order in index.js guarantees this).

**`src/test.js`:**
1. Remove the IIFE wrapper
2. Add `import jStat from './core.js';`

**`src/models.js`:**
1. Remove the outer IIFE (the one that assigns to `jStat.models`)
2. Add `import jStat from './core.js';`
3. Convert internal functions to module-scoped
4. Add `jStat.models = { ols: ols_wrap };` at the end

**`src/regression.js`:**
1. Add `import jStat from './core.js';` at the top
2. No other changes needed (no IIFE to remove)

**`src/index.js` (new):**
```javascript
import jStat from './core.js';
import './vector.js';
import './special.js';
import './distribution.js';
import './linearalgebra.js';
import './test.js';
import './models.js';
import './regression.js';

jStat.jStat = jStat;

export default jStat;
```

**`src/_header.js` and `src/_footer.js`:**
Deleted. Their functionality is replaced by Rollup (UMD wrapper) and
`src/index.js` (self-reference).

### 8.5 Step 4: Build with Rollup and Verify Tests Pass

1. Build the old output for comparison: `make clean core`; `cp dist/jstat.js dist/jstat.old.js`
2. Build with Rollup: `npx rollup -c`
3. Run the full test suite against the Rollup UMD output: `node --test "test/**/*-test.js"`
4. Compare the Rollup UMD output to the old concatenated output: `diff dist/jstat.old.js dist/jstat.js`

```bash
npm run build     # Rollup produces dist/jstat.js, dist/jstat.min.js, etc.
npm test          # Run full test suite against new output
```

All 382 tests must pass (minus the 7 known geomean float-precision failures).
Any new failures indicate a regression in the build output.

### 8.6 Step 5: Update package.json

Add/update the following fields:

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
    "files": [
        "dist/"
    ],
    "scripts": {
        "build": "rollup -c",
        "test": "npm run build && node --test \"test/**/*-test.js\""
    },
    "devDependencies": {
        "rollup": "^4.x",
        "@rollup/plugin-terser": "^0.4.x"
    }
}
```

Remove `uglify-js` from devDependencies.

### 8.7 Step 6: Update Makefile

The Makefile can either be removed or updated to delegate to npm scripts:

```makefile
all: build

build:
	npm run build

test:
	npm test

clean:
	rm -rf dist

.PHONY: all build test clean
```

Keeping the Makefile as a thin wrapper preserves the `make test` workflow for
anyone who uses it. The actual build logic moves to `rollup.config.mjs`.

### 8.8 Step 7: Clean Up

1. Remove `src/_header.js` and `src/_footer.js`
2. Remove `uglify-js` from devDependencies
3. Verify `npm pack` only includes `dist/` files
4. Update `.gitignore` if needed (source maps in dist/)
5. Tag the release

---

## 9. Backwards Compatibility Verification

### 9.1 API Compatibility Tests

The existing test suite is the primary verification mechanism. All tests load
`dist/jstat.js` and exercise the full public API. If all tests pass against
the Rollup-built `dist/jstat.js`, API compatibility is confirmed.

### 9.2 CJS Export Behavior

The critical CJS behavior that must be preserved:

```javascript
const jStat = require('jstat');

// These must all be true:
typeof jStat === 'function'           // jStat is a constructor function
typeof jStat.jStat === 'function'     // Self-reference exists
jStat === jStat.jStat                 // Self-reference is identity
typeof jStat.normal === 'function'    // Distributions are properties
typeof jStat.mean === 'function'      // Static methods are properties
jStat.fn === jStat.prototype          // fn alias exists
```

After Phase 1 completes, the `test/umd/commonjs-test.js` tests should cover
these. If not, we should add a dedicated backwards-compatibility test file.

### 9.3 UMD Output Diff

After building with Rollup, perform a structural comparison:

```bash
# Build with old method
make clean core
cp dist/jstat.js dist/jstat.old.js

# Build with Rollup
npx rollup -c
diff dist/jstat.old.js dist/jstat.js
```

Expected differences:
- UMD wrapper preamble (Rollup's is slightly different but equivalent)
- `'use strict'` addition
- Possible whitespace/formatting differences
- Code ordering may differ slightly (Rollup resolves its own order)

These differences are **cosmetic** and should not affect behavior. The test
suite is the ultimate arbiter, not byte-for-byte output comparison.

### 9.4 Browser Global Verification

Create a minimal HTML test:

```html
<script src="dist/jstat.js"></script>
<script>
    console.assert(typeof jStat === 'function');
    console.assert(jStat === jStat.jStat);
    console.assert(jStat.normal.pdf(0, 0, 1) > 0.39);
    console.log('Browser global test passed');
</script>
```

### 9.5 ESM Import Verification

```javascript
// test-esm.mjs
import jStat from './dist/jstat.esm.mjs';

console.assert(typeof jStat === 'function');
console.assert(jStat === jStat.jStat);
console.assert(typeof jStat.normal === 'function');
console.log('ESM import test passed');
```

```bash
node test-esm.mjs
```

### 9.6 AMD Compatibility

Rollup's UMD output includes AMD support. This can be verified with a simple
RequireJS test if needed, but AMD usage is rare in 2026 and unlikely to be a
real concern. The UMD wrapper's AMD branch is structurally correct by
construction.

---

## 10. Risks and Open Questions

### 10.1 Risk: Rollup Output Differs from Concatenation

**Risk level:** Low
**Mitigation:** The test suite catches behavioral differences. Any remaining
cosmetic differences (whitespace, wrapper structure) are acceptable.

**Detail:** Rollup may order code differently than the concatenation approach.
In particular, Rollup performs its own dependency resolution and may inline
modules differently. Since all modules mutate the same `jStat` object, the
order of side effects matters. The import order in `src/index.js` guarantees
the correct order.

### 10.2 Risk: `this` Context in UMD Wrapper

**Risk level:** Low
**Detail:** The current `_header.js` passes `this` as the `window` parameter.
In Node.js CommonJS, `this` at the top level is `module.exports`. In browser
global scope, `this` is `window`. In strict mode (which Rollup adds), `this`
at the top level is `undefined`.

Rollup's UMD wrapper handles this correctly by using:
```javascript
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, ...)
```

This is actually more robust than the current wrapper, which passes raw `this`.

### 10.3 Risk: Strict Mode Breaks Something

**Risk level:** Very low
**Mitigation:** A manual review of all source files found no strict-mode
violations. Note that the current minified output does not actually run in
strict mode (uglify-js does not insert `'use strict'`), so passing minified
tests alone do not verify strict-mode safety. Explicit strict-mode testing
should be performed during the Rollup migration.

### 10.4 Risk: ES Module Default Export Semantics

**Risk level:** Low
**Detail:** When Rollup produces CJS output from an ES module with
`export default jStat`, it generates:

```javascript
module.exports = jStat;
```

This is exactly what the current code does. Some bundlers add
`module.exports.default = jStat` alongside `module.exports = jStat`, but
Rollup with `exports: 'default'` produces the clean form.

**Verification:** Test that `require('jstat')` returns the jStat function
directly (not an object with a `.default` property).

### 10.5 Risk: Consumers Using Deep Imports

**Risk level:** Very low
**Detail:** If any consumer does `require('jstat/src/core.js')` or similar,
the source file restructuring would break them. This is an unsupported import
path and unlikely in practice. The `"files"` field in package.json already
limits published files.

### 10.6 Open Question: Should `dist/jstat.cjs.js` Exist?

The current `dist/jstat.js` (UMD) already works for CommonJS. A separate CJS
build adds a file that provides no functional benefit over UMD. Arguments for:
- Cleaner, no AMD/browser detection overhead (~200 bytes smaller)
- Follows modern dual-package conventions
- The `exports` field can point CJS consumers to it specifically

Arguments against:
- One more file to maintain and test
- Negligible size difference
- UMD already works perfectly for CJS

**Recommendation:** Include it. The `exports` field makes it easy to direct
CJS consumers to the cleaner CJS build, and it is zero additional effort since
Rollup builds it from the same source.

### 10.7 Open Question: Source Maps in dist/

Should source maps be committed to the repository and published to npm?

Arguments for:
- Helps debugging in production
- Standard practice for npm packages
- Small size overhead (~130KB for .map files)

Arguments against:
- Doubles the files in dist/
- Source maps reference src/ paths which are not published

**Recommendation:** Generate source maps and publish them. They are a
significant debugging aid. Include source content in the maps
(`output.sourcemapExcludeSources: false`, which is Rollup's default) so the
map files are self-contained and don't need the original src/ files to be
published.

Note: Rollup's default source map behavior references the source files
relative to the map file. Since we are publishing only `dist/`, the source
files would not be available to consumers unless source content is embedded.
Options:
- Use `output.sourcemapPathTransform` to adjust paths
- Do not include source content in maps (smaller, but less useful)
- Include source content in maps via `output.sourcemapExcludeSources: false`
  (Rollup's default -- source content is included unless explicitly excluded)

**Decision:** Defer this to implementation. Source maps are a nice-to-have
and the exact configuration can be tuned during Step 2.

### 10.8 Open Question: Phase Ordering with Phase 1

Phase 2 depends on Phase 1 being complete. The test suite must be fully
migrated to `node:test` before we change the build system, because:
1. We need the test suite as a safety net for build changes
2. The Makefile `test` target will change, and we want test infrastructure
   settled first
3. Phase 1 may reveal test gaps that should be filled before Phase 2

### 10.9 Open Question: The Tukey Distribution Size

The Tukey distribution at the end of `distribution.js` (lines 1396-1596) has a
large `cdf` function spanning about 134 lines (1397-1530) and an `inv` function
spanning about 64 lines (1532-1595). The `cdf` is the largest single function
in the codebase. It uses only `jStat.gammaln` from
special.js and basic `Math` operations. When converting to ES modules, this
file will be a single large module. If tree-shaking is desired in the future,
splitting `distribution.js` into per-distribution files would be beneficial
but is out of scope for Phase 2.

### 10.10 Open Question: Preserving Build Speed

The current build takes 0.6 seconds. Rollup's build time for a project of
this size should be well under 2 seconds. The terser plugin (minification)
will likely be the bottleneck, similar to how uglify-js is today. This is
acceptable.

If build speed becomes a concern, `@rollup/plugin-terser` runs terser in a
worker thread, which is faster than the current synchronous uglify-js piping.

### 10.11 Summary of Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Bundler | Rollup | Best library bundler, native UMD support |
| Source conversion | ES modules in Phase 2 | Enables proper bundling, minimal code changes |
| Code modernization | Deferred to Phase 3 | Clean phase boundary, smaller diffs |
| `main` field | Keep `./dist/jstat.js` | Backwards compat |
| `exports` field | Add with import/require/default | Modern Node.js resolution |
| CJS output | Yes, `dist/jstat.cjs.js` | Clean CJS for Node.js consumers |
| ESM output | Yes, `dist/jstat.esm.mjs` | Modern bundler support |
| Source maps | Yes (deferred config details) | Debugging aid |
| Makefile | Keep as thin wrapper | Preserves existing workflow |
| `_header.js` / `_footer.js` | Remove | Replaced by Rollup and index.js |
