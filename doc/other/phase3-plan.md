# Phase 3 Implementation Plan: Code Modernization

Concrete, step-by-step plan for modernizing jStat source code from pre-ES6
JavaScript patterns to ES2015+ syntax. Every change is a mechanical syntax
transformation with zero public API impact.

**Prerequisite:** Phase 2 (build system modernization to Rollup) is complete.
The test suite has 382 tests (375 passing, 7 known geomean float-precision
failures). All source files are ES modules with `import`/`export`.

**Authoritative reference:** `doc/other/phase3-research.md` contains the full
safety analysis. This plan distills it into executable steps.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1: `var` to `const`/`let`](#2-step-1-var-to-constlet)
3. [Step 2: Eliminate IIFEs](#3-step-2-eliminate-iifes)
4. [Step 3: `arguments` to Rest Parameters](#4-step-3-arguments-to-rest-parameters)
5. [Step 4: Arrow Functions for Callbacks](#5-step-4-arrow-functions-for-callbacks)
6. [Step 5: Minor Cleanups](#6-step-5-minor-cleanups)
7. [Verification Strategy](#7-verification-strategy)
8. [Completion Criteria](#8-completion-criteria)

---

## 1. Prerequisites

### 1.1 Verify Baseline

Before making any changes, confirm the build and tests pass:

```bash
npm run build
npm test
```

Expected: 382 tests, 375 passing, 7 failing (geomean float-precision).

Record the current bundle sizes for comparison after modernization:

```bash
wc -c dist/jstat.js dist/jstat.min.js dist/jstat.esm.mjs dist/jstat.cjs.js
```

### 1.2 Transformation Rules Summary

These rules apply uniformly across all steps:

| Rule | Details |
|------|---------|
| `var` never reassigned | `const` |
| `var` reassigned (counters, accumulators, conditionally assigned) | `let` |
| Multi-variable `var a = 1, b = 2` | Split into separate `const`/`let` per variable |
| `var` declared without assignment (`var x;`) | `let x;` |
| Loop counter `var i = 0` in `for` | `let i = 0` |
| IIFE wrapping a `for` loop for closure capture | Replace with `for...of` using `const` |
| IIFE wrapping helper functions | Extract helpers to module scope |
| `slice.call(arguments)` | `...args` rest parameter |
| `apply(null, arguments)` | `...args` rest parameter + spread `...args` |
| `.map(function(x) { return expr; })` | `.map((x) => expr)` |
| `.forEach(function(x) { ... })` | `.forEach((x) => { ... })` |
| `setTimeout(function() { ... })` where enclosing scope captures `this` via `self` | `setTimeout(() => { ... })` |
| Functions using `this` or attached to prototype | Keep as `function` -- NEVER convert to arrow |
| Module-level function declarations | Keep as `function` declarations (hoisting safety) |
| Named function expressions in `jStat.extend({...})` | Keep as `function` (better stack traces) |

### 1.3 Test After Every File

After modifying each source file, run:

```bash
npm run build && npm test
```

Do NOT batch changes across files without testing between them.

---

## 2. Step 1: `var` to `const`/`let`

This is the safest change and should be done first across ALL files. It does
not affect `this` or `arguments` semantics -- only scoping.

**Process for each file:**
1. Change every `var` to either `const` or `let`
2. Split multi-variable declarations into separate statements
3. Run `npm run build && npm test`

### 2.1 `src/core.js` (48 `var` declarations)

**Split and convert the top-level references (lines 1-4):**

```javascript
// Before
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

// After
const concat = Array.prototype.concat;
const slice = Array.prototype.slice;
const toString = Object.prototype.toString;
```

All three are assigned once and never reassigned.

**`calcRdx` (line 9):**

```javascript
// Before
var val = n > m ? n : m;

// After
const val = n > m ? n : m;
```

**`isArray` (line 15):**

```javascript
// Before
var isArray = Array.isArray || function isArray(arg) { ... };

// After (keep polyfill for now -- Step 5 removes it)
const isArray = Array.isArray || function isArray(arg) { ... };
```

**`jStat._init` (lines 48-86):**

```javascript
// Before
for (var i = 0; i < args[0].length; i++)

// After
for (let i = 0; i < args[0].length; i++)
```

**`jStat.extend` (lines 112-127):**

```javascript
// Before
var i, j;

// After
let i, j;
```

**`jStat.col` (lines 171-187):**

```javascript
// Before
var submat = jStat.arange(arr.length).map(function() { ... });
// ...
var column = new Array(arr.length);
for (var i = 0; i < arr.length; i++)

// After
const submat = jStat.arange(arr.length).map(function() { ... });
// ...
const column = new Array(arr.length);
for (let i = 0; i < arr.length; i++)
```

**`jStat.diag` (lines 198-204):**

```javascript
// Before
var nrow = jStat.rows(arr);
var res = new Array(nrow);
for (var row = 0; row < nrow; row++)

// After
const nrow = jStat.rows(arr);
const res = new Array(nrow);
for (let row = 0; row < nrow; row++)
```

**`jStat.antidiag` (lines 208-213):**

```javascript
// Before
var nrow = jStat.rows(arr) - 1;
var res = new Array(nrow);
for (var i = 0; nrow >= 0; nrow--, i++)

// After
let nrow = jStat.rows(arr) - 1;   // reassigned in loop: nrow--
const res = new Array(nrow);
for (let i = 0; nrow >= 0; nrow--, i++)
```

**`jStat.transpose` (lines 217-237):**

```javascript
// Before
var obj = [];
var objArr, rows, cols, j, i;

// After
const obj = [];
let objArr, rows, cols, j, i;
```

Note: `rows` and `cols` are assigned after declaration. `obj` is only pushed
to, never reassigned.

**`jStat.map` (lines 242-261):**

```javascript
// Before
var row, nrow, ncol, res, col;

// After
let row, nrow, ncol, res, col;
```

All are assigned after declaration or in the loop.

**`jStat.cumreduce` (lines 265-285):**

Same pattern as `jStat.map` -- all `let`.

**`jStat.create` (lines 295-311):**

```javascript
// Before
var res = new Array(rows);
var i, j;

// After
const res = new Array(rows);
let i, j;
```

**`jProto` reference (line 593):**

```javascript
// Before
var jProto = jStat.prototype;

// After
const jProto = jStat.prototype;
```

**`jStat.symmetric` (lines 356-370):**

```javascript
// Before
var size = arr.length;
var row, col;

// After
const size = arr.length;
let row, col;
```

**`jStat.seq` (lines 380-399):**

```javascript
// Before
var arr = [];
var hival = calcRdx(min, max);
var step = (max * hival - min * hival) / ((length - 1) * hival);
var current = min;
var cnt;

// After
const arr = [];
const hival = calcRdx(min, max);
const step = (max * hival - min * hival) / ((length - 1) * hival);
let current = min;   // reassigned in for loop
let cnt;
```

**`jStat.arange` (lines 405-432):**

```javascript
// Before
var rl = [];
var i;

// After
const rl = [];
let i;
```

**`jStat.slice` IIFE internals (lines 439-501):**

All `var` inside `_slice` and `slice` become `let` or `const` as appropriate:
- `var i` -> `let i`
- `var rl = []` -> `const rl = []`
- `var length = list.length` -> `const length = list.length`
- `var colSlice, rowSlice` -> `let colSlice, rowSlice`
- `var row = jStat.rowa(...)` -> `const row = ...`
- `var col = jStat.cola(...)` -> `const col = ...`
- `var rows = _slice(...)` -> `const rows = ...`

**`jStat.sliceAssign` (lines 507-562):**

```javascript
// Before
var nl, ml;
// ...
var m = rcSlice.row;
var n = rcSlice.col;

// After
let nl, ml;
// ...
const m = rcSlice.row;
const n = rcSlice.col;
```

**IIFE prototype generators (lines 633-677):**

Inside each IIFE:
- `var i = 0` in `for` -> `let i = 0`
- `var self = this` -> `const self = this`
- `var results` -> `let results`

**General const/let determination for core.js:**

| Variable | Keyword | Reason |
|----------|---------|--------|
| `concat`, `slice`, `toString` | `const` | Never reassigned |
| `isArray`, `jProto` | `const` | Assigned once |
| Loop counters (`i`, `j`, `row`, `col`, `cnt`) | `let` | Reassigned per iteration |
| Accumulators, conditionally assigned | `let` | Reassigned |
| Computed-once values (`size`, `nrow`, `res`, `hival`, `step`) | `const` | Depends -- `const` if never reassigned |

### 2.2 `src/vector.js` (103 `var` declarations)

**Import and top-level (lines 1-10):**

```javascript
// Before
var isFunction = jStat.utils.isFunction;

// After
const isFunction = jStat.utils.isFunction;
```

**Statistical functions pattern -- most follow this template:**

```javascript
// Before (e.g., jStat.sum)
var sum = 0;
var i = arr.length;

// After
let sum = 0;       // sum += in loop
let i = arr.length; // --i in loop
```

```javascript
// Before (e.g., jStat.sumsqerr)
var mean = jStat.mean(arr);
var sum = 0;
var i = arr.length;
var tmp;

// After
const mean = jStat.mean(arr);
let sum = 0;
let i = arr.length;
let tmp;
```

**`jStat.unique` (lines 88-97):**

```javascript
// Before
var hash = {}, _arr = [];
for(var i = 0; ...) {

// After (split multi-var)
const hash = {};
const _arr = [];
for (let i = 0; ...) {
```

**`jStat.geomean` (lines 113-117):**

```javascript
// Before
var logs = arr.map(Math.log)
var meanOfLogs = jStat.mean(logs)

// After
const logs = arr.map(Math.log);
const meanOfLogs = jStat.mean(logs);
```

**`jStat.median` (lines 121-128):**

```javascript
// Before
var arrlen = arr.length;
var _arr = arr.slice().sort(ascNum);

// After
const arrlen = arr.length;
const _arr = arr.slice().sort(ascNum);
```

**`jStat.rank` (lines 155-185) -- note the `var number` redeclaration:**

```javascript
// Before
var i;
var distinctNumbers = [];
var numberCounts = {};
for (i = 0; i < arr.length; i++) {
    var number = arr[i];        // declared inside for-block
    // ...
}
var sortedDistinctNumbers = distinctNumbers.sort(ascNum);
var numberRanks = {};
var currentRank = 1;
for (i = 0; ...) {
    var number = sortedDistinctNumbers[i];  // redeclared -- safe with let
    var count = numberCounts[number];
    var first = currentRank;
    var last = currentRank + count - 1;
    var rank = (first + last) / 2;
    // ...
    currentRank += count;
}

// After
let i;
const distinctNumbers = [];
const numberCounts = {};
for (i = 0; i < arr.length; i++) {
    const number = arr[i];
    // ...
}
const sortedDistinctNumbers = distinctNumbers.sort(ascNum);
const numberRanks = {};
let currentRank = 1;   // currentRank += count
for (i = 0; ...) {
    const number = sortedDistinctNumbers[i];   // separate block scope, no conflict
    const count = numberCounts[number];
    const first = currentRank;
    const last = currentRank + count - 1;
    const rank = (first + last) / 2;
    // ...
    currentRank += count;
}
```

The `var number` redeclaration in two separate `for` blocks is safe with `let`/
`const` because each block gets its own scope.

**`jStat.mode` (lines 191-220):**

```javascript
// Before
var arrLen = arr.length;
var _arr = arr.slice().sort(ascNum);
var count = 1;
var maxCount = 0;
var numMaxCount = 0;
var mode_arr = [];
var i;

// After
const arrLen = arr.length;
const _arr = arr.slice().sort(ascNum);
let count = 1;        // count++ and count = 1
let maxCount = 0;     // maxCount = count
let numMaxCount = 0;  // numMaxCount++
let mode_arr = [];    // mode_arr = [_arr[i]]
let i;
```

**`jStat.quantiles` (lines 305-326):**

```javascript
// Before
var sortedArray = arr.slice().sort(ascNum);
var quantileVals = [quantilesArray.length];
var n = arr.length;
var i, p, m, aleph, k, gamma;

// After
const sortedArray = arr.slice().sort(ascNum);
const quantileVals = [quantilesArray.length];
const n = arr.length;
let i, p, m, aleph, k, gamma;
```

**`jStat.percentile` (lines 330-340):**

```javascript
// Before
var _arr = arr.slice().sort(ascNum);
var realIndex = ...;
var index = parseInt(realIndex);
var frac = realIndex - index;

// After
const _arr = arr.slice().sort(ascNum);
const realIndex = ...;
const index = parseInt(realIndex);
const frac = realIndex - index;
```

**`jStat.percentileOfScore` (lines 345-363):**

```javascript
// Before
var counter = 0;
var len = arr.length;
var strict = false;
var value, i;

// After
let counter = 0;     // counter++
const len = arr.length;
let strict = false;  // strict = true
let value, i;
```

**`jProto` reference and IIFE internals (lines 439-564):**

```javascript
// Before
var jProto = jStat.prototype;

// After
const jProto = jStat.prototype;
```

Inside each IIFE prototype generator:
- `var i = 0` -> `let i = 0`
- `var arr = []` -> `const arr = []`
- `var tmpthis = this` -> `const tmpthis = this`
- `var args = Array.prototype.slice.call(arguments)` -> `const args = ...`
  (keep as `const` since the array reference is not reassigned)
- `var callbackFunction` -> `let callbackFunction`
- `var argsToPass = args.slice(...)` -> `const argsToPass = ...`
- `var curriedFunction = function ...` -> hoist to `let curriedFunction;` before
  the `if/else` block, then assign inside `else`. The `var` is declared inside
  `else` but used after the block (lines 556, 561); `const`/`let` inside `else`
  would be block-scoped and cause a `ReferenceError`.

**General const/let determination for vector.js:**

| Pattern | Keyword |
|---------|---------|
| `var mean = jStat.mean(arr)` | `const` |
| `var sum = 0` (with `sum +=`) | `let` |
| `var i = arr.length` (with `--i`) | `let` |
| `var _arr = arr.slice().sort(...)` | `const` |
| `var arrLen = arr.length` | `const` |
| `var jProto = jStat.prototype` | `const` |
| `var isFunction = jStat.utils.isFunction` | `const` |

### 2.3 `src/special.js` (58 `var` declarations)

**Pattern:** Nearly all functions are pure numerical computations. The typical
pattern is coefficient arrays (`const`), intermediate values assigned once
(`const`), and loop counters/accumulators (`let`).

**`jStat.gammaln` (lines 5-18):**

```javascript
// Before
var j = 0;
var cof = [...];
var ser = 1.000000000190015;
var xx, y, tmp;
tmp = (y = xx = x) + 5.5;

// After
let j = 0;              // j++ in loop
const cof = [...];
let ser = 1.000000000190015;  // ser += in loop
let xx, y, tmp;
tmp = (y = xx = x) + 5.5;
```

**`jStat.loggam` (lines 25-58):**

```javascript
// Before
var x0, x2, xp, gl, gl0;
var k, n;
var a = [...];

// After
let x0, x2, xp, gl, gl0;
let k, n;
const a = [...];
```

**`jStat.gammafn` (lines 61-110):**

```javascript
// Before
var p = [...];
var q = [...];
var fact = false;
var n = 0;
var xden = 0;
var xnum = 0;
var y = x;
var i, z, yi, res;

// After
const p = [...];
const q = [...];
let fact = false;    // reassigned: fact = (...)
let n = 0;           // reassigned: n = (y | 0) - 1
let xden = 0;        // reassigned in loop
let xnum = 0;        // reassigned in loop
let y = x;           // y++, y -= n
let i, z, yi, res;
```

**`jStat.lowRegGamma` (lines 121-154):**

```javascript
// Before
var aln = jStat.gammaln(a);
var ap = a;
var sum = 1 / a;
var del = sum;
var b = x + 1 - a;
var c = 1 / 1.0e-30;
var d = 1 / b;
var h = d;
var i = 1;
var ITMAX = -~(Math.log((a >= 1) ? a : 1 / a) * 8.5 + a * 0.4 + 17);
var an;

// After
const aln = jStat.gammaln(a);
let ap = a;           // ap is incremented: ++ap
let sum = 1 / a;      // sum +=
let del = sum;         // del *= in loop
let b = x + 1 - a;    // b += 2 in loop
let c = 1 / 1.0e-30;  // reassigned in loop
let d = 1 / b;         // reassigned in loop
let h = d;             // h *= in loop
let i = 1;
const ITMAX = -~(Math.log((a >= 1) ? a : 1 / a) * 8.5 + a * 0.4 + 17);
let an;
```

**`jStat.erf` (lines 304-337):**

```javascript
// Before
var cof = [...];
var j = cof.length - 1;
var isneg = false;
var d = 0;
var dd = 0;
var t, ty, tmp, res;

// After
const cof = [...];
let j = cof.length - 1;  // j-- in loop
let isneg = false;         // isneg = true
let d = 0;                 // reassigned in loop
let dd = 0;                // reassigned in loop
let t, ty, tmp, res;
```

**General rule for special.js:** Coefficient arrays are always `const`. Anything
used as a loop counter, accumulator, or iteration variable is `let`. Single-
assignment intermediate values are `const`.

### 2.4 `src/distribution.js` (149 `var` declarations)

**The distribution factory IIFE (lines 4-64):**

Inside the factory:
- `var i = 0` -> `let i = 0`
- `var a = this._a` -> `const a = ...`
- `var b = this._b` -> `const b = ...`
- `var c = this._c` -> `const c = ...`
- `var newthis = jStat[func](a, b, c)` -> `const newthis = ...`

**Distribution static methods (the bulk of the file):**

Nearly all 175+ static methods follow this pattern:

```javascript
pdf: function pdf(x, alpha, beta) {
    // ... pure computation, no reassignment of locals
    var p = ...;
    var q = ...;
    return expression;
}
```

These `var` declarations are almost all `const` because the computed values are
used once and never reassigned. Exceptions are accumulator variables in the
Tukey distribution functions and loop counters.

**Tukey distribution internals -- `tukeyWprob` (lines 1241-1366):**

This function has the most complex variable usage in distribution.js:

```javascript
// Before
var nleg = 12;
var ihalf = 6;
// ... many more vars

// After
const nleg = 12;
const ihalf = 6;
// All the constant table values: const
// Loop counters (i, j, jj): let
// Accumulators (ac, pr_w): let
```

**`betinc` helper (lines 730-760):**

```javascript
// Before
var a0 = 0;
var b0 = 1;
var a1 = 1;
var b1 = 1;
var m9 = 0;
var a2 = 0;
var c9;

// After
let a0 = 0;   // all reassigned in while loop
let b0 = 1;
let a1 = 1;
let b1 = 1;
let m9 = 0;
let a2 = 0;
let c9;
```

**General rule for distribution.js:** The vast majority (~120) are `const`.
Only loop counters and accumulators are `let` (~29).

### 2.5 `src/linearalgebra.js` (156 `var` declarations)

This file has the most `var` declarations due to heavily iterative matrix
algorithms. Many functions have large multi-variable `var` statements that
must be split.

**Top-level references (lines 6-7):**

```javascript
// Before
var push = Array.prototype.push;
var isArray = jStat.utils.isArray;

// After
const push = Array.prototype.push;
const isArray = jStat.utils.isArray;
```

**`jStat.multiply` (lines 49-71) -- multi-var split example:**

```javascript
// Before
var row, col, nrescols, sum, nrow, ncol, res, rescols;
// ...
nrow = arr.length,
ncol = arr[0].length,
res = jStat.zeros(nrow, nrescols = (isUsable(arg)) ? arg[0].length : ncol),
rescols = 0;

// After
let row, col, sum;
let nrescols;
let rescols = 0;
const nrow = arr.length;
const ncol = arr[0].length;
nrescols = (isUsable(arg)) ? arg[0].length : ncol;
const res = jStat.zeros(nrow, nrescols);
```

Note: the comma-separated assignments on lines 55-58 use the comma operator
and need to be rewritten as separate statements. The `nrescols` assignment
embedded in the `jStat.zeros` call must be extracted.

**`jStat.gauss_elimination` (lines 211-253) -- complex multi-var:**

```javascript
// Before
var i = 0,
j = 0,
n = a.length,
m = a[0].length,
factor = 1,
sum = 0,
x = [],
maug, pivot, temp, k;

// After
let i = 0;
let j = 0;
const n = a.length;
const m = a[0].length;
let factor = 1;     // factor = a[j][i] / a[i][i]
let sum = 0;         // sum = sum + ...
const x = [];
let maug, pivot, temp, k;
```

**`jStat.gauss_jordan` (lines 255-292):**

```javascript
// Before
var m = jStat.aug(a, b);
var h = m.length;
var w = m[0].length;
var c = 0;
var x, y, y2;

// After
const m = jStat.aug(a, b);
const h = m.length;
const w = m[0].length;
let c = 0;
let x, y, y2;
```

**`jStat.dot` (lines 84-103) -- multi-var split:**

```javascript
// Before
var left = ...,
right = ...,
res = [],
row = 0,
nrow = left.length,
ncol = left[0].length,
sum, col;

// After
const left = ...;
const right = ...;
const res = [];
let row = 0;
const nrow = left.length;
const ncol = left[0].length;
let sum, col;
```

**`QR` IIFE internals (lines 547-588):**

```javascript
// Before
var sum   = jStat.sum;
var range = jStat.arange;
// Inside qr2:
var n = x.length;
var p = x[0].length;
var r = jStat.zeros(p, p);
var i,j,k;

// After
const sum   = jStat.sum;
const range = jStat.arange;
// Inside qr2:
const n = x.length;
const p = x[0].length;
const r = jStat.zeros(p, p);
let i, j, k;
```

**`lstsq` IIFE internals (lines 590-649):**

Similarly: matrix dimension variables are `const`, loop/iteration variables
are `let`.

**`jStat.jacobi` (lines 651-698):**

```javascript
// Before
var condition = 1;
var n = a.length;
var e = jStat.identity(n, n);
var ev = [];
var b, i, j, p, q, maxim, theta, s;

// After
let condition = 1;    // condition = 0 then condition = 1
const n = a.length;
let e = jStat.identity(n, n);  // e = jStat.multiply(e, s)
const ev = [];
let b, i, j, p, q, maxim, theta, s;
```

**Gauss-Jacobi/Seidel/SOR (lines 405-518) -- repeated pattern:**

All three solvers have identical structure. In each:
- `var i = 0` -> `let i = 0`
- `var j = 0` -> `let j = 0`
- `var n = a.length` -> `const n = a.length`
- `var l = [], u = [], d = []` -> split into three `const` declarations
- `var xv, c, h, xk` -> `let xv, c, h, xk`

**General rule for linearalgebra.js:** ~90 are `const`, ~65 are `let`.

### 2.6 `src/test.js` (34 `var` declarations)

**Top-level (lines 3-5):**

```javascript
// Before
var slice = [].slice;
var isNumber = jStat.utils.isNumber;
var isArray = jStat.utils.isArray;

// After
const slice = [].slice;
const isNumber = jStat.utils.isNumber;
const isArray = jStat.utils.isArray;
```

**Static methods using `slice.call(arguments)` (10 methods):**

```javascript
// Before (in each of zscore, ztest, tscore, ttest, etc.)
var args = slice.call(arguments),
expVar, sample, sampMean, ...;

// After
const args = slice.call(arguments);
let expVar, sample, sampMean, ...;
```

Note: `args` is never reassigned (it is an array reference used for indexing).
The other variables in multi-var declarations must be split and assessed
individually.

**`anovafscore` (lines 122-153) -- detailed split:**

```javascript
// Before
var args = slice.call(arguments),
expVar, sample, sampMean, sampSampMean, tmpargs, unexpVar, i, j;

// After
const args = slice.call(arguments);
let expVar;
let sample;
let sampMean;
let sampSampMean;
let tmpargs;
let unexpVar;
let i, j;
```

Then later in the function:
- `tmpargs = new Array(args[0].length)` -- `tmpargs` is `let` (assigned conditionally)
- `sample = new Array()` -- `sample` is `let` (reassigned)
- `sampMean = jStat.mean(sample)` -- `sampMean` is `let`
- `expVar = 0` -- `let` (accumulated)
- `unexpVar = 0` -- `let` (accumulated)

**`differenceOfProportions` (lines 317-324):**

```javascript
// Before
var pooled = ...;
var se = ...;

// After
const pooled = ...;
const se = ...;
```

**`tukeyhsd` (lines 244-258):**

```javascript
// Before
var sd = jStat.pooledstdev(arrays);
var means = arrays.map(...);
var n = arrays.reduce(...);
var results = [];
for (var i = 0; ...)
    for (var j = i + 1; ...)
        var p = jStat.qtest(...);

// After
const sd = jStat.pooledstdev(arrays);
const means = arrays.map(...);
const n = arrays.reduce(...);
const results = [];
for (let i = 0; ...)
    for (let j = i + 1; ...)
        const p = jStat.qtest(...);
```

### 2.7 `src/models.js` (34 `var` declarations)

All 34 have assignments; 0 are uninitialized. Most are single-assignment
computations.

**`sub_regress` (lines 3-12):**

```javascript
// Before
var var_count = exog[0].length;
var modelList = jStat.arange(var_count).map(...);

// After
const var_count = exog[0].length;
const modelList = jStat.arange(var_count).map(...);
```

**`ols` (lines 18-55):**

```javascript
// Before
var nobs = endog.length;
var df_model = exog[0].length - 1;
var df_resid = nobs-df_model - 1;
var coef = jStat.lstsq(exog, endog);
var predict = ...;
var resid = ...;
var ybar = jStat.mean(endog);
var SSE = ...;
var SSR = ...;
var SST = SSE + SSR;
var R2 = (SSE / SST);

// After -- ALL const (none reassigned)
const nobs = endog.length;
const df_model = exog[0].length - 1;
const df_resid = nobs - df_model - 1;
const coef = jStat.lstsq(exog, endog);
const predict = ...;
const resid = ...;
const ybar = jStat.mean(endog);
const SSE = ...;
const SSR = ...;
const SST = SSE + SSR;
const R2 = (SSE / SST);
```

**`t_test` (lines 59-87):**

```javascript
// Before
var subModelList = sub_regress(model.exog);
var sigmaHat = ...;
var seBetaHat = ...;
var tStatistic = ...;
var pValue = ...;
var c = ...;
var interval95 = ...;

// After -- ALL const
const subModelList = sub_regress(model.exog);
const sigmaHat = ...;
const seBetaHat = ...;
const tStatistic = ...;
const pValue = ...;
const c = ...;
const interval95 = ...;
```

**`F_test` (lines 89-97):**

```javascript
// Before
var F_statistic = ...;
var fcdf = function(x, n1, n2) { ... }
var pvalue = ...;

// After
const F_statistic = ...;
const fcdf = function(x, n1, n2) { ... };
const pvalue = ...;
```

**`ols_wrap` (lines 99-111):**

```javascript
// Before
var model = ols(endog,exog);
var ttest = t_test(model);
var ftest = F_test(model);
var adjust_R2 = ...;

// After
const model = ols(endog, exog);
const ttest = t_test(model);
const ftest = F_test(model);
const adjust_R2 = ...;
```

### 2.8 `src/regression.js` (31 `var` declarations)

**`buildxmatrix` (lines 13-25):**

```javascript
// Before
var matrixRows = new Array(arguments.length);
for(var i=0;i<arguments.length;i++){
    var array = [1];

// After
const matrixRows = new Array(arguments.length);
for (let i = 0; i < arguments.length; i++) {
    const array = [1];
```

**`builddxmatrix` (lines 27-37):**

Same pattern: `const matrixRows`, `let i`, `const array`.

**`buildjxmatrix` (lines 39-47):**

```javascript
// Before
var pass = new Array(jMat.length)
for(var i=0;i<jMat.length;i++){

// After
const pass = new Array(jMat.length);
for (let i = 0; i < jMat.length; i++) {
```

**`matrixmult` (lines 57-87):**

```javascript
// Before
var i, j, k, result, sum;

// After
let i, j, k, result, sum;
```

**`regresst` (lines 102-150):**

```javascript
// Before
var beta = jStat.regress(jMatX,jMatY);
var compile = {};
// ...
var covar = jStat.xtranspxinv(jMatX);
var sds, ts, ps;
for(var i=0; ...)

// After
const beta = jStat.regress(jMatX, jMatY);
const compile = {};
// ...
const covar = jStat.xtranspxinv(jMatX);
let sds, ts, ps;
for (let i = 0; ...)
```

**`ssr`, `sse`, `sst` (lines 172-194):**

```javascript
// Before
var ssr = 0;
for(var i = 0; ...)

// After
let ssr = 0;
for (let i = 0; ...)
```

**`matrixsubtract` (lines 196-205):**

```javascript
// Before
var ans = new Array(A.length);
for(var i=0;...){
    ans[i] = new Array(A[i].length);
    for(var j=0;...)

// After
const ans = new Array(A.length);
for (let i = 0; ...) {
    ans[i] = new Array(A[i].length);
    for (let j = 0; ...)
```

### 2.9 `src/index.js`

No `var` declarations. No changes needed.

---

## 3. Step 2: Eliminate IIFEs

With `const`/`let` in place from Step 1, the loop-variable-capture IIFEs are
no longer needed because `const` in `for...of` (and `let` in `for`) provides
block scope per iteration.

There are 13 IIFEs to handle. They fall into two categories:

1. **Loop-closure IIFEs** (10): Exist solely to capture a loop variable.
   Replace with `for...of` using `const`.
2. **Helper-encapsulating IIFEs** (3): Wrap internal helper functions in a
   closure. Extract helpers to module scope.

### 3.1 `src/core.js` -- IIFE 1: `jStat.slice` (lines 439-501)

**Category:** Helper-encapsulating IIFE.

The IIFE wraps `_slice` and `slice` in a closure, returning `slice` as the
value assigned to `jStat.slice`. In module scope, `_slice` can simply be a
module-level function.

```javascript
// Before
jStat.slice = (function(){
  function _slice(list, start, end, step) {
    // ...
  }

  function slice(list, rcSlice) {
    // ... uses _slice internally
  }

  return slice;
}());

// After
function _slice(list, start, end, step) {
  // ... (same body)
}

jStat.slice = function slice(list, rcSlice) {
  // ... (same body, uses _slice which is now module-scope)
};
```

### 3.2 `src/core.js` -- IIFE 2: No-arg prototype methods (lines 633-648)

**Category:** Loop-closure IIFE.

```javascript
// Before
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function(func) {
      const self = this;
      let results;
      if (func) {
        setTimeout(function() {
          func.call(self, jProto[passfunc].call(self));
        });
        return this;
      }
      results = jStat[passfunc](this);
      return isArray(results) ? jStat(results) : results;
    };
  })(funcs[i]);
})('transpose clear symmetric rows cols dimensions diag antidiag'.split(' '));

// After
for (const passfunc of 'transpose clear symmetric rows cols dimensions diag antidiag'.split(' ')) {
  jProto[passfunc] = function(func) {
    const self = this;
    let results;
    if (func) {
      setTimeout(function() {
        func.call(self, jProto[passfunc].call(self));
      });
      return this;
    }
    results = jStat[passfunc](this);
    return isArray(results) ? jStat(results) : results;
  };
}
```

The inner `function(func) { ... }` MUST stay as `function` -- it uses `this`.

### 3.3 `src/core.js` -- IIFE 3: One-arg prototype methods (lines 653-667)

**Category:** Loop-closure IIFE.

```javascript
// Before
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function(index, func) {
      const self = this;
      if (func) {
        setTimeout(function() {
          func.call(self, jProto[passfunc].call(self, index));
        });
        return this;
      }
      return jStat(jStat[passfunc](this, index));
    };
  })(funcs[i]);
})('row col'.split(' '));

// After
for (const passfunc of 'row col'.split(' ')) {
  jProto[passfunc] = function(index, func) {
    const self = this;
    if (func) {
      setTimeout(function() {
        func.call(self, jProto[passfunc].call(self, index));
      });
      return this;
    }
    return jStat(jStat[passfunc](this, index));
  };
}
```

### 3.4 `src/core.js` -- IIFE 4: Shortcut prototype methods (lines 671-677)

**Category:** Loop-closure IIFE.

```javascript
// Before
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function() {
      return jStat(jStat[passfunc].apply(null, arguments));
    };
  })(funcs[i]);
})('create zeros ones rand identity'.split(' '));

// After
for (const passfunc of 'create zeros ones rand identity'.split(' ')) {
  jProto[passfunc] = function() {
    return jStat(jStat[passfunc].apply(null, arguments));
  };
}
```

Note: the inner function uses `arguments` -- that is addressed in Step 3. For
now, keep it as-is; only the IIFE wrapper is removed.

### 3.5 `src/vector.js` -- IIFE 5: cumsum/cumprod (lines 447-478)

**Category:** Loop-closure IIFE.

```javascript
// Before
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function(fullbool, func) {
      // ... uses this
    };
  })(funcs[i]);
})(('cumsum cumprod').split(' '));

// After
for (const passfunc of 'cumsum cumprod'.split(' ')) {
  jProto[passfunc] = function(fullbool, func) {
    // ... uses this (keep as function)
  };
}
```

### 3.6 `src/vector.js` -- IIFE 6: Vector stat methods (lines 482-518)

**Category:** Loop-closure IIFE.

```javascript
// Before
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function(fullbool, func) {
      // ... uses this
    };
  })(funcs[i]);
})(('sum sumsqrd sumsqerr sumrow product min max unique mean meansqerr ' +
    'geomean median diff rank mode range variance deviation stdev meandev ' +
    'meddev coeffvar quartiles histogram skewness kurtosis').split(' '));

// After
for (const passfunc of ('sum sumsqrd sumsqerr sumrow product min max unique mean meansqerr ' +
    'geomean median diff rank mode range variance deviation stdev meandev ' +
    'meddev coeffvar quartiles histogram skewness kurtosis').split(' ')) {
  jProto[passfunc] = function(fullbool, func) {
    // ... uses this (keep as function)
  };
}
```

### 3.7 `src/vector.js` -- IIFE 7: Argument-taking methods (lines 523-564)

**Category:** Loop-closure IIFE.

```javascript
// Before
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function() {
      // ... uses this and arguments
    };
  })(funcs[i]);
})('quantiles percentileOfScore'.split(' '));

// After
for (const passfunc of 'quantiles percentileOfScore'.split(' ')) {
  jProto[passfunc] = function() {
    // ... uses this and arguments (keep as function)
  };
}
```

### 3.8 `src/special.js` -- IIFE 8: Special function instance methods (lines 492-499)

**Category:** Loop-closure IIFE.

```javascript
// Before
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jStat.fn[passfunc] = function() {
      return jStat(
          jStat.map(this, function(value) { return jStat[passfunc](value); }));
    }
  })(funcs[i]);
})('gammaln gammafn factorial factorialln'.split(' '));

// After
for (const passfunc of 'gammaln gammafn factorial factorialln'.split(' ')) {
  jStat.fn[passfunc] = function() {
    return jStat(
        jStat.map(this, function(value) { return jStat[passfunc](value); }));
  };
}
```

The inner function uses `this` via `jStat.map(this, ...)` -- keep as `function`.

### 3.9 `src/special.js` -- IIFE 9: randn instance method (lines 502-508)

**Category:** Loop-closure IIFE.

```javascript
// Before
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jStat.fn[passfunc] = function() {
      return jStat(jStat[passfunc].apply(null, arguments));
    };
  })(funcs[i]);
})('randn'.split(' '));

// After
for (const passfunc of 'randn'.split(' ')) {
  jStat.fn[passfunc] = function() {
    return jStat(jStat[passfunc].apply(null, arguments));
  };
}
```

### 3.10 `src/distribution.js` -- IIFE 10: Distribution factory (lines 3-64)

**Category:** Loop-closure IIFE (nested).

This is the most complex IIFE. It has three levels of nesting:
1. Outer IIFE iterating over distribution names
2. Inner IIFE for `pdf`/`cdf`/`inv` prototype methods
3. Inner IIFE for `mean`/`median`/`mode`/`variance` prototype methods

```javascript
// Before
(function(list) {
  for (var i = 0; i < list.length; i++) (function(func) {
    // ... distribution constructor and jStat.fn[func] ...

    // nested IIFE for pdf/cdf/inv
    (function(vals) {
      for (var i = 0; i < vals.length; i++) (function(fnfunc) {
        jStat[func].prototype[fnfunc] = function(x) { ... };
      })(vals[i]);
    })('pdf cdf inv'.split(' '));

    // nested IIFE for mean/median/mode/variance
    (function(vals) {
      for (var i = 0; i < vals.length; i++) (function(fnfunc) {
        jStat[func].prototype[fnfunc] = function() { ... };
      })(vals[i]);
    })('mean median mode variance'.split(' '));

  })(list[i]);
})('beta centralF cauchy ...'.split(' '));

// After
for (const func of (
  'beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy ' +
  'laplace lognormal noncentralt normal pareto studentt weibull uniform ' +
  'binomial negbin hypgeom poisson triangular tukey arcsine'
).split(' ')) {
  // distribution constructor -- uses this, keep as function
  jStat[func] = function f(a, b, c) {
    if (!(this instanceof f))
      return new f(a, b, c);
    this._a = a;
    this._b = b;
    this._c = c;
    return this;
  };

  // jStat.fn method -- uses this, keep as function
  jStat.fn[func] = function(a, b, c) {
    const newthis = jStat[func](a, b, c);
    newthis.data = this;
    return newthis;
  };

  // sample prototype method -- uses this, keep as function
  jStat[func].prototype.sample = function(arr) {
    const a = this._a;
    const b = this._b;
    const c = this._c;
    if (arr)
      return jStat.alter(arr, function() {
        return jStat[func].sample(a, b, c);
      });
    else
      return jStat[func].sample(a, b, c);
  };

  // pdf/cdf/inv prototype methods
  for (const fnfunc of 'pdf cdf inv'.split(' ')) {
    jStat[func].prototype[fnfunc] = function(x) {
      const a = this._a;
      const b = this._b;
      const c = this._c;
      if (!x && x !== 0)
        x = this.data;
      if (typeof x !== 'number') {
        return jStat.fn.map.call(x, function(x) {
          return jStat[func][fnfunc](x, a, b, c);
        });
      }
      return jStat[func][fnfunc](x, a, b, c);
    };
  }

  // mean/median/mode/variance prototype methods
  for (const fnfunc of 'mean median mode variance'.split(' ')) {
    jStat[func].prototype[fnfunc] = function() {
      return jStat[func][fnfunc](this._a, this._b, this._c);
    };
  }
}
```

### 3.11 `src/linearalgebra.js` -- IIFE 11: QR decomposition (lines 547-588)

**Category:** Helper-encapsulating IIFE.

```javascript
// Before
QR: (function() {
  const sum   = jStat.sum;
  const range = jStat.arange;

  function qr2(x) {
    // ... implementation
  }

  return qr2;
}()),

// After -- extract to module scope
const _qr_sum = jStat.sum;
const _qr_range = jStat.arange;

function qr2(x) {
  // ... implementation, using _qr_sum and _qr_range
}

// Then in jStat.extend:
QR: qr2,
```

Note: The IIFE captures `jStat.sum` and `jStat.arange` as local `sum` and
`range` at evaluation time. The module-scope `_qr_sum`/`_qr_range` approach
preserves this captured-reference semantics. Do NOT replace these with direct
`jStat.sum`/`jStat.arange` lookups inside `qr2` -- that would change from
captured-at-load to looked-up-at-call, a subtle semantics difference.

### 3.12 `src/linearalgebra.js` -- IIFE 12: lstsq (lines 590-649)

**Category:** Helper-encapsulating IIFE.

```javascript
// Before
lstsq: (function() {
  function R_I(A) { ... }
  function qr_solve(A, b) { ... }
  return qr_solve;
}()),

// After -- extract to module scope
function R_I(A) {
  // ... same body
}

function qr_solve(A, b) {
  // ... same body
}

// Then in jStat.extend:
lstsq: qr_solve,
```

### 3.13 `src/linearalgebra.js` -- IIFE 13: Instance methods (lines 951-968)

**Category:** Loop-closure IIFE.

```javascript
// Before
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jStat.fn[passfunc] = function(arg, func) {
      const tmpthis = this;
      if (func) {
        setTimeout(function() {
          func.call(tmpthis, jStat.fn[passfunc].call(tmpthis, arg));
        }, 15);
        return this;
      }
      if (typeof jStat[passfunc](this, arg) === 'number')
        return jStat[passfunc](this, arg);
      else
        return jStat(jStat[passfunc](this, arg));
    };
  }(funcs[i]));
}('add divide multiply subtract dot pow exp log abs norm angle'.split(' ')));

// After
for (const passfunc of 'add divide multiply subtract dot pow exp log abs norm angle'.split(' ')) {
  jStat.fn[passfunc] = function(arg, func) {
    const tmpthis = this;
    if (func) {
      setTimeout(function() {
        func.call(tmpthis, jStat.fn[passfunc].call(tmpthis, arg));
      }, 15);
      return this;
    }
    if (typeof jStat[passfunc](this, arg) === 'number')
      return jStat[passfunc](this, arg);
    else
      return jStat(jStat[passfunc](this, arg));
  };
}
```

### 3.14 Run tests after all IIFE eliminations

```bash
npm run build && npm test
```

---

## 4. Step 3: `arguments` to Rest Parameters

Convert all 17 `arguments` usage sites to rest parameters. This must be done
BEFORE converting any of these functions to arrow functions (arrow functions
do not have `arguments`).

### 4.1 `src/core.js` -- `jStat()` constructor (line 37-39)

```javascript
// Before
function jStat() {
  return new jStat._init(arguments);
}

// After
function jStat(...args) {
  return new jStat._init(args);
}
```

**Safety:** `_init` only uses bracket indexing (`args[0]`, `args[1]`) and
`.length` -- both work identically on arrays and arguments objects.

### 4.2 `src/core.js` -- `jStat.extend()` (lines 112-127)

```javascript
// Before
jStat.extend = function extend(obj) {
  let i, j;
  if (arguments.length === 1) {
    for (j in obj)
      jStat[j] = obj[j];
    return this;
  }
  for (i = 1; i < arguments.length; i++) {
    for (j in arguments[i])
      obj[j] = arguments[i][j];
  }
  return obj;
};

// After
jStat.extend = function extend(obj, ...sources) {
  let j;
  if (sources.length === 0) {
    if (obj === undefined) return obj;  // preserve zero-arg behavior
    for (j in obj)
      jStat[j] = obj[j];
    return this;
  }
  for (let i = 0; i < sources.length; i++) {
    for (j in sources[i])
      obj[j] = sources[i][j];
  }
  return obj;
};
```

**Note:** The zero-arg guard preserves backwards compatibility. The original
`arguments.length === 1` check is false when called with zero args, so the
original returns `obj` (i.e., `undefined`). Without the guard, the rest-param
rewrite would enter the `sources.length === 0` branch and return `this`
instead -- an API behavior change.

### 4.3 `src/core.js` -- Shortcut prototype methods (was IIFE 4, now a `for...of` loop)

```javascript
// Before (after IIFE elimination)
for (const passfunc of 'create zeros ones rand identity'.split(' ')) {
  jProto[passfunc] = function() {
    return jStat(jStat[passfunc].apply(null, arguments));
  };
}

// After
for (const passfunc of 'create zeros ones rand identity'.split(' ')) {
  jProto[passfunc] = function(...args) {
    return jStat(jStat[passfunc](...args));
  };
}
```

### 4.4 `src/vector.js` -- Argument-taking prototype methods (was IIFE 7)

```javascript
// Before (after IIFE elimination)
for (const passfunc of 'quantiles percentileOfScore'.split(' ')) {
  jProto[passfunc] = function() {
    const arr = [];
    let i = 0;
    const tmpthis = this;
    const args = Array.prototype.slice.call(arguments);
    let callbackFunction;
    // ...
  };
}

// After
for (const passfunc of 'quantiles percentileOfScore'.split(' ')) {
  jProto[passfunc] = function(...args) {
    const arr = [];
    let i = 0;
    const tmpthis = this;
    let callbackFunction;
    // ... (remove the slice.call line, args is already an array)
  };
}
```

### 4.5 `src/special.js` -- randn instance method (was IIFE 9)

```javascript
// Before (after IIFE elimination)
for (const passfunc of 'randn'.split(' ')) {
  jStat.fn[passfunc] = function() {
    return jStat(jStat[passfunc].apply(null, arguments));
  };
}

// After
for (const passfunc of 'randn'.split(' ')) {
  jStat.fn[passfunc] = function(...args) {
    return jStat(jStat[passfunc](...args));
  };
}
```

### 4.6 `src/test.js` -- All 10 static methods

All 10 follow the identical pattern. Replace `slice.call(arguments)` with
`...args` rest parameter:

**`zscore` (line 13):**

```javascript
// Before
zscore: function zscore() {
  const args = slice.call(arguments);
  if (isNumber(args[1])) {
    return (args[0] - args[1]) / args[2];
  }
  return (args[0] - jStat.mean(args[1])) / jStat.stdev(args[1], args[2]);
},

// After
zscore: function zscore(...args) {
  if (isNumber(args[1])) {
    return (args[0] - args[1]) / args[2];
  }
  return (args[0] - jStat.mean(args[1])) / jStat.stdev(args[1], args[2]);
},
```

**Apply the same transformation to all 10:**

| Method | Change |
|--------|--------|
| `zscore` | `function zscore()` -> `function zscore(...args)`, delete `const args = slice.call(arguments);` |
| `ztest` | same pattern |
| `tscore` | same pattern |
| `ttest` | same pattern |
| `anovafscore` | same pattern; note multi-var declaration must already be split from Step 1 |
| `anovaftest` | same pattern |
| `qscore` | same pattern |
| `qtest` | same pattern |
| `normalci` | same pattern |
| `tci` | same pattern |

After all 10 are converted, the `const slice = [].slice;` at the top of
`test.js` is no longer used. **Remove it.**

### 4.7 `src/regression.js` -- `buildxmatrix` (lines 13-25)

```javascript
// Before
buildxmatrix: function buildxmatrix(){
  const matrixRows = new Array(arguments.length);
  for (let i = 0; i < arguments.length; i++) {
    const array = [1];
    matrixRows[i] = array.concat(arguments[i]);
  }
  return jStat(matrixRows);
},

// After
buildxmatrix: function buildxmatrix(...args) {
  const matrixRows = new Array(args.length);
  for (let i = 0; i < args.length; i++) {
    matrixRows[i] = [1].concat(args[i]);
  }
  return jStat(matrixRows);
},
```

### 4.8 `src/regression.js` -- `builddxmatrix` (lines 27-37)

This function only uses `arguments[0]`. Give it a proper parameter name:

```javascript
// Before
builddxmatrix: function builddxmatrix() {
  const matrixRows = new Array(arguments[0].length);
  for (let i = 0; i < arguments[0].length; i++) {
    const array = [1];
    matrixRows[i] = array.concat(arguments[0][i]);
  }
  return jStat(matrixRows);
},

// After
builddxmatrix: function builddxmatrix(arrays) {
  const matrixRows = new Array(arrays.length);
  for (let i = 0; i < arrays.length; i++) {
    matrixRows[i] = [1].concat(arrays[i]);
  }
  return jStat(matrixRows);
},
```

### 4.9 Run tests

```bash
npm run build && npm test
```

---

## 5. Step 4: Arrow Functions for Callbacks

Convert anonymous function expressions passed to `.map()`, `.forEach()`,
`.reduce()`, `.filter()`, and `setTimeout` to arrow functions WHERE SAFE.

### 5.1 Safety Rules

**CONVERT to arrow:**
- Callbacks to `.map()`, `.forEach()`, `.reduce()`, `.filter()` that do NOT
  use `this` or `arguments`
- `setTimeout` callbacks that capture `this` via a `self`/`tmpthis` variable
  in the enclosing scope (these already do not use their own `this`)
- The `.alter()` callback in special.js `randg`
  (`function() { return jStat.randg(shape); }` -> `() => jStat.randg(shape)`)

**DO NOT CONVERT to arrow:**
- Any function using `this` (prototype methods, distribution prototype methods)
- Any function using `arguments` (should be none after Step 3)
- Named function expressions in `jStat.extend({...})` calls
- Module-level function declarations
- Distribution static methods (keep as `function` for consistency and stack
  traces)
- The callback inside `jStat.fn.map.call(x, function(x) { ... })` in
  distribution.js -- technically safe but better left as `function` for
  clarity since the parameter shadows the outer `x`

**Exception -- `poisson.sample`:** This static method uses `this` and MUST
stay as `function`.

### 5.2 `src/core.js` Callbacks

**`jStat.row` (line 154):**

```javascript
// Before
return index.map(function(i) {
  return jStat.row(arr, i);
})

// After
return index.map((i) => jStat.row(arr, i))
```

**`jStat.col` (lines 172-181):**

```javascript
// Before
const submat = jStat.arange(arr.length).map(function() {
  return new Array(index.length);
});
index.forEach(function(ind, i){
  jStat.arange(arr.length).forEach(function(j) {
    submat[j][i] = arr[j][ind];
  });
});

// After
const submat = jStat.arange(arr.length).map(() => new Array(index.length));
index.forEach((ind, i) => {
  jStat.arange(arr.length).forEach((j) => {
    submat[j][i] = arr[j][ind];
  });
});
```

**`jStat.cola` (line 193):**

```javascript
// Before
return jStat.col(arr, i).map(function(a){ return a[0] });

// After
return jStat.col(arr, i).map((a) => a[0]);
```

**`jStat.diagonal` (line 569):**

```javascript
// Before
diagArray.forEach(function(t, i) {
  mat[i][i] = t;
});

// After
diagArray.forEach((t, i) => {
  mat[i][i] = t;
});
```

**`jStat.copy` (lines 578-584):**

```javascript
// Before
return A.map(function(row) {
  if (isNumber(row))
    return row;
  return row.map(function(t) {
    return t;
  });
});

// After
return A.map((row) => {
  if (isNumber(row))
    return row;
  return row.map((t) => t);
});
```

**`jStat.slice` internals (line 495):**

```javascript
// Before
return rows.map(function(row) {
  return _slice(row, colSlice.start, colSlice.end, colSlice.step);
});

// After
return rows.map((row) => _slice(row, colSlice.start, colSlice.end, colSlice.step));
```

**`jStat.sliceAssign` callbacks (lines 520, 535, 556-559):**

```javascript
// Before
nl.forEach(function(n, i) { A[m][n] = B[i]; });
ml.forEach(function(m, j) { A[m][n] = B[j]; });
ml.forEach(function(m, i) {
  nl.forEach(function(n, j) { A[m][n] = B[i][j]; });
});

// After
nl.forEach((n, i) => { A[m][n] = B[i]; });
ml.forEach((m, j) => { A[m][n] = B[j]; });
ml.forEach((m, i) => {
  nl.forEach((n, j) => { A[m][n] = B[i][j]; });
});
```

**`setTimeout` callbacks in prototype generators (after IIFE elimination):**

```javascript
// Before (in the no-arg prototype loop)
setTimeout(function() {
  func.call(self, jProto[passfunc].call(self));
});

// After
setTimeout(() => {
  func.call(self, jProto[passfunc].call(self));
});
```

Apply this to all 3 prototype generator loops in core.js and the instance
method loop in linearalgebra.js.

### 5.3 `src/vector.js` Callbacks

**`jStat.cumsum` (line 133):**

```javascript
// Before
return jStat.cumreduce(arr, function (a, b) { return a + b; });

// After
return jStat.cumreduce(arr, (a, b) => a + b);
```

**`jStat.cumprod` (line 139):**

```javascript
// Before
return jStat.cumreduce(arr, function (a, b) { return a * b; });

// After
return jStat.cumreduce(arr, (a, b) => a * b);
```

**`jStat.rank` (line 182):**

```javascript
// Before
return arr.map(function (number) {
  return numberRanks[number];
});

// After
return arr.map((number) => numberRanks[number]);
```

**`jStat.pooledvariance` (line 236):**

```javascript
// Before
var sumsqerr = arr.reduce(function (a, samples) {return a + jStat.sumsqerr(samples);}, 0);
var count = arr.reduce(function (a, samples) {return a + samples.length;}, 0);

// After
const sumsqerr = arr.reduce((a, samples) => a + jStat.sumsqerr(samples), 0);
const count = arr.reduce((a, samples) => a + samples.length, 0);
```

**`setTimeout` callbacks in vector.js prototype generators:**

Same pattern as core.js -- convert `setTimeout(function() { ... })` to
`setTimeout(() => { ... })` in all three prototype generator loops.

### 5.4 `src/special.js` Callbacks

**`jStat.randg` (line 464):**

```javascript
// Before
mat.alter(function() { return jStat.randg(shape); });

// After
mat.alter(() => jStat.randg(shape));
```

**Special function instance method callback (line 496):**

```javascript
// Before (after IIFE elimination)
jStat.fn[passfunc] = function() {
  return jStat(
      jStat.map(this, function(value) { return jStat[passfunc](value); }));
};

// After
jStat.fn[passfunc] = function() {
  return jStat(
      jStat.map(this, (value) => jStat[passfunc](value)));
};
```

### 5.5 `src/distribution.js` Callbacks

**Distribution factory `.alter()` callback (line 27-29):**

```javascript
// Before
return jStat.alter(arr, function() {
  return jStat[func].sample(a, b, c);
});

// After
return jStat.alter(arr, () => jStat[func].sample(a, b, c));
```

**Note:** Do NOT convert the `jStat.fn.map.call(x, function(x) { ... })` on
line 43. This callback has a parameter `x` that shadows the outer `x`
variable. While technically safe as an arrow, the parameter shadowing makes
it confusing. Leave as `function`.

### 5.6 `src/linearalgebra.js` Callbacks

**`jStat.outer` (line 79):**

```javascript
// Before
return jStat.multiply(A.map(function(t){ return [t] }), [B]);

// After
return jStat.multiply(A.map((t) => [t]), [B]);
```

**`triaUpSolve` / `triaLowSolve` callbacks (lines 311-348):**

```javascript
// Before
b = b.map(function(i){ return i[0] });
// ...
parts = jStat.arange(i + 1, size).map(function(j) {
  return x[j] * A[i][j];
});
// ...
return x.map(function(i){ return [i] });

// After
b = b.map((i) => i[0]);
// ...
parts = jStat.arange(i + 1, size).map((j) => x[j] * A[i][j]);
// ...
return x.map((i) => [i]);
```

**Apply the same pattern to all `.map()` and `.forEach()` callbacks in:**
- `lu` (lines 356-380)
- `cholesky` (lines 385-401)
- `QR`/`qr2` (after extraction)
- `lstsq`/`R_I`/`qr_solve` (after extraction)

**`lstsq` / `qr_solve` callbacks:**

```javascript
// Before
b = b.map(function(x){ return [x] });
// ...
return x.map(function(i){ return i[0] });

// After
b = b.map((x) => [x]);
// ...
return x.map((i) => i[0]);
```

**`setTimeout` in instance method loop (after IIFE elimination):**

```javascript
// Before
setTimeout(function() {
  func.call(tmpthis, jStat.fn[passfunc].call(tmpthis, arg));
}, 15);

// After
setTimeout(() => {
  func.call(tmpthis, jStat.fn[passfunc].call(tmpthis, arg));
}, 15);
```

### 5.7 `src/test.js` Callbacks

**`tukeyhsd` callbacks (lines 246-247):**

```javascript
// Before
const means = arrays.map(function (arr) {return jStat.mean(arr);});
const n = arrays.reduce(function (n, arr) {return n + arr.length;}, 0);

// After
const means = arrays.map((arr) => jStat.mean(arr));
const n = arrays.reduce((n, arr) => n + arr.length, 0);
```

### 5.8 `src/models.js` Callbacks

**All `.map()` and `.filter()` callbacks (12 total):**

```javascript
// Before (sub_regress)
const modelList = jStat.arange(var_count).map(function(endog_index) {
  const exog_index =
      jStat.arange(var_count).filter(function(i){return i!==endog_index});
  return ols(jStat.col(exog, endog_index).map(function(x){ return x[0] }),
             jStat.col(exog, exog_index))
});

// After
const modelList = jStat.arange(var_count).map((endog_index) => {
  const exog_index =
      jStat.arange(var_count).filter((i) => i !== endog_index);
  return ols(jStat.col(exog, endog_index).map((x) => x[0]),
             jStat.col(exog, exog_index));
});
```

```javascript
// Before (ols)
const predict =
    jStat.multiply(exog, coef.map(function(x) { return [x] }))
        .map(function(p) { return p[0] });
// ...
const SSE = jStat.sum(predict.map(function(f) {
  return Math.pow(f - ybar, 2);
}));
const SSR = jStat.sum(endog.map(function(y, i) {
  return Math.pow(y - predict[i], 2);
}));

// After
const predict =
    jStat.multiply(exog, coef.map((x) => [x]))
        .map((p) => p[0]);
// ...
const SSE = jStat.sum(predict.map((f) => Math.pow(f - ybar, 2)));
const SSR = jStat.sum(endog.map((y, i) => Math.pow(y - predict[i], 2)));
```

```javascript
// Before (t_test)
const seBetaHat = subModelList.map(function(mod) { ... });
const tStatistic = model.coef.map(function(coef, i) { ... });
const pValue = tStatistic.map(function(t) { ... });
const interval95 = model.coef.map(function(coef, i) { ... });

// After
const seBetaHat = subModelList.map((mod) => { ... });
const tStatistic = model.coef.map((coef, i) => (coef - 0) / seBetaHat[i]);
const pValue = tStatistic.map((t) => { ... });
const interval95 = model.coef.map((coef, i) => { ... });
```

```javascript
// Before (F_test)
const fcdf = function(x, n1, n2) {
  return jStat.beta.cdf(x / (n2 / n1 + x), n1 / 2, n2 / 2)
}

// After
const fcdf = (x, n1, n2) => jStat.beta.cdf(x / (n2 / n1 + x), n1 / 2, n2 / 2);
```

### 5.9 Run tests

```bash
npm run build && npm test
```

---

## 6. Step 5: Minor Cleanups

### 6.1 Remove `Array.isArray` Polyfill (core.js line 15)

```javascript
// Before
const isArray = Array.isArray || function isArray(arg) {
  return toString.call(arg) === '[object Array]';
};

// After
const isArray = Array.isArray;
```

The `toString` reference (line 4) may no longer be needed after this change.
Check if `toString` is used anywhere else in core.js:
- `isFunction` (line 21) uses `toString.call(arg)` -- still needed.

So `toString` stays.

### 6.2 Convert Trivial Helper Functions to Const-Assigned Arrows (core.js)

```javascript
// Before
function retZero() { return 0; }
function retOne() { return 1; }
function retIdent(i, j) { return i === j ? 1 : 0; }

// After
const retZero = () => 0;
const retOne = () => 1;
const retIdent = (i, j) => i === j ? 1 : 0;
```

**Safety:** All three are used after their declaration point (lines 321, 332,
351 respectively). None use `this` or `arguments`. No hoisting dependency.

### 6.3 Convert `laplaceSign` to Const-Assigned Arrow (distribution.js line 1201)

```javascript
// Before
function laplaceSign(x) { return x / Math.abs(x); }

// After
const laplaceSign = (x) => x / Math.abs(x);
```

**Safety:** Used only on line 1237, after declaration. No `this`/`arguments`.

### 6.4 Default Parameters for `typeof` Checks (vector.js)

```javascript
// Before (jStat.quantiles, lines 305-314)
jStat.quantiles = function quantiles(arr, quantilesArray, alphap, betap) {
  // ...
  if (typeof alphap === 'undefined')
    alphap = 3 / 8;
  if (typeof betap === 'undefined')
    betap = 3 / 8;

// After
jStat.quantiles = function quantiles(arr, quantilesArray, alphap = 3 / 8, betap = 3 / 8) {
  // ... (remove the typeof checks)
```

**Safety:** Default parameters trigger on `undefined`, matching the `typeof`
check behavior exactly. No caller passes `null` for these parameters.

Note: `alphap` and `betap` are function parameters, not `var` declarations,
so Step 1 does not apply to them. Before this change, they were reassigned by
the `typeof` checks; after this change, the default values handle that, so
the parameters are effectively never reassigned within the function body.

### 6.5 Replace `new Array()` Without Arguments (test.js)

```javascript
// Before (anovafscore, line 133)
sample = new Array();

// After
sample = [];
```

**Do NOT change** `new Array(n)` with a numeric argument -- these are
intentional pre-allocations throughout the codebase.

### 6.6 Remove Unused `slice` Import (test.js)

After Step 3 converted all `slice.call(arguments)` to `...args`, the line:

```javascript
const slice = [].slice;
```

is no longer needed. **Delete it.**

### 6.7 Run tests

```bash
npm run build && npm test
```

---

## 7. Verification Strategy

### 7.1 Test Suite

The test suite (382 tests, 375 passing, 7 known geomean failures) is the
primary safety net. Run after every file change:

```bash
npm run build && npm test
```

### 7.2 CJS/ESM Compatibility Smoke Test

After all changes are complete, verify module compatibility:

```bash
# CJS
node -e "const j = require('./dist/jstat.cjs.js'); console.log(j.jStat.normal.pdf(0, 0, 1))"

# ESM
node --input-type=module -e "import jStat from './dist/jstat.esm.mjs'; console.log(jStat.normal.pdf(0, 0, 1))"

# UMD
node -e "const j = require('./dist/jstat.js'); console.log(j.jStat.normal.pdf(0, 0, 1))"
```

All three should output `0.3989422804014327`.

### 7.3 Constructor Mode Verification

```bash
node -e "
const jStat = require('./dist/jstat.cjs.js').jStat;
// Vector
console.log(jStat([1,2,3]).mean());  // 2
// Matrix
console.log(jStat([[1,2],[3,4]]).rows());  // 2
// Sequence
console.log(jStat(1, 5, 5).toArray());  // [1, 2, 3, 4, 5]
// Clone
const a = jStat([1,2,3]);
const b = jStat(a);
console.log(b.mean());  // 2
// Distribution constructor
const d = jStat.normal(0, 1);
console.log(d.pdf(0));  // 0.3989422804014327
console.log(d.cdf(0));  // 0.5
"
```

### 7.4 Callback Chaining Verification

```bash
node -e "
const jStat = require('./dist/jstat.cjs.js').jStat;
jStat([1,2,3,4,5]).mean(function(val) {
  console.log('mean:', val);  // mean: 3
}).stdev(function(val) {
  console.log('stdev:', val);  // stdev: 1.4142135623730951
});
setTimeout(() => console.log('done'), 100);
"
```

### 7.5 Bundle Size Comparison

Compare before and after:

```bash
wc -c dist/jstat.js dist/jstat.min.js dist/jstat.esm.mjs dist/jstat.cjs.js
```

Expected: roughly the same or slightly smaller. `const`/`let` are the same
character count as `var`. Arrow functions are shorter. IIFE elimination
removes wrapper code.

---

## 8. Completion Criteria

All of the following must be true before Phase 3 is considered complete:

| Criterion | How to Verify |
|-----------|---------------|
| All `var` declarations converted to `const`/`let` | `grep -r 'var ' src/*.js` returns 0 lines (excluding comments) |
| All multi-variable declarations split | Visual inspection |
| All 13 IIFEs eliminated | No `(function(` patterns remain except the `jStat` constructor self-invocation check `this instanceof f` |
| All `arguments` usage converted to rest params | `grep -rn 'arguments' src/*.js` returns only comment lines (word appears in comments in vector.js, special.js, core.js) |
| Safe callbacks converted to arrow functions | Visual inspection |
| `Array.isArray` polyfill removed | Line 15 of core.js is `const isArray = Array.isArray;` |
| Trivial helpers converted to const arrows | `retZero`, `retOne`, `retIdent`, `laplaceSign` |
| Default parameters applied | `quantiles` function in vector.js |
| `new Array()` (no args) replaced | `[]` in test.js anovafscore |
| Tests pass (375/382) | `npm test` |
| CJS/ESM/UMD all work | Smoke tests from Section 7.2 |
| Constructor modes work | Section 7.3 |
| Callback chaining works | Section 7.4 |
| No public API changes | All tests pass, smoke tests pass |
| Bundle sizes comparable | Section 7.5 |

### What is NOT done in Phase 3

- No index-based `for` loop to `for...of` conversions (these loops are
  intentional; the only `for...of` usage is in Step 2 IIFE elimination where
  it replaces `for (var i = 0; ...) (function(x) { ... })(arr[i])` patterns)
- No template literal conversions (no string concatenation candidates exist)
- No `concat.apply([], arr)` to spread/flat (stack safety concern)
- No class-based rewrite
- No algorithm changes
- No new features
