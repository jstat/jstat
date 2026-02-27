# Phase 3 Research: Code Modernization

Research document for modernizing jStat source code from pre-ES6 patterns to
modern JavaScript, without any changes to the public API.

---

## Table of Contents

1. [Environment and Baseline](#1-environment-and-baseline)
2. [Scope Definition](#2-scope-definition)
3. [Pattern Inventory](#3-pattern-inventory)
4. [Critical Safety Analysis](#4-critical-safety-analysis)
5. [File-by-File Analysis](#5-file-by-file-analysis)
6. [The `this` Problem in Detail](#6-the-this-problem-in-detail)
7. [The `arguments` Problem in Detail](#7-the-arguments-problem-in-detail)
8. [Recommended Approach](#8-recommended-approach)
9. [Risks and Open Questions](#9-risks-and-open-questions)

---

## 1. Environment and Baseline

### 1.1 Node.js Version

- **Node.js version:** 22.14.0
- **ES module support:** Fully stable. Source files already use `import`/`export`.
- **Target ES level for modernization:** ES2015 (ES6) patterns only. No ES2017+
  features (async/await, optional chaining, nullish coalescing) since those go
  beyond basic syntax modernization.

### 1.2 Current Source Sizes

| File | Lines | Bytes | Description |
|------|------:|------:|-------------|
| `src/core.js` | 681 | 16,574 | Constructor, matrix ops, utilities |
| `src/vector.js` | 565 | 14,859 | Vector/array statistics |
| `src/special.js` | 509 | 13,107 | Gamma, beta, error functions |
| `src/distribution.js` | 1,597 | 40,500 | 23 probability distributions |
| `src/linearalgebra.js` | 969 | 25,750 | Matrix algebra, decomposition, PCA |
| `src/test.js` | 338 | 9,770 | Hypothesis testing |
| `src/models.js` | 113 | 3,287 | OLS regression |
| `src/regression.js` | 206 | 5,518 | Regression utilities |
| `src/index.js` | 13 | 318 | Entry point |
| **Total** | **4,991** | **129,683** | |

### 1.3 Current Bundle Sizes

| File | Size |
|------|-----:|
| `dist/jstat.js` (UMD) | 138,122 bytes (4,978 lines) |
| `dist/jstat.min.js` (UMD minified) | 51,847 bytes |
| `dist/jstat.esm.mjs` (ESM) | 129,340 bytes |
| `dist/jstat.cjs.js` (CJS) | 129,349 bytes |

### 1.4 Build System Status

Phase 2 is complete. The build system uses Rollup with the following configuration:

- **Bundler:** Rollup 4.59.0 with `@rollup/plugin-terser`
- **Entry point:** `src/index.js`
- **Output formats:** UMD, UMD minified, ESM (`.mjs`), CJS
- **Source maps:** Enabled for all outputs
- **Makefile** still present (wraps `npm run build` and `node --test`)
- **No `_header.js`/`_footer.js`** (removed in Phase 2)
- **All source files are ES modules** with `import`/`export` statements

### 1.5 Current Code Patterns

The source code uniformly uses pre-ES6 JavaScript patterns:

- All variable declarations use `var` (610 executable across all source files)
- All function definitions use the `function` keyword
- No arrow functions anywhere
- No template literals
- No destructuring
- No `let`/`const`
- No `for...of` loops
- No rest/spread parameters (relies on `arguments` and `slice.call`)
- No default parameters
- Heavy use of IIFEs for closure-based variable capture in loops
- `Array.isArray` polyfill still present (unnecessary since ES5)

---

## 2. Scope Definition

### 2.1 What IS Phase 3

Phase 3 is strictly about modernizing JavaScript syntax patterns. Every change
must be a mechanical syntax transformation that preserves identical runtime
behavior:

- `var` to `let`/`const` where safe
- `function` expressions to arrow functions where safe (no `this`/`arguments`)
- IIFE-based loop closures to `let`-based closures or array methods
- `slice.call(arguments)` to rest parameters where safe
- `new Array(n)` to array literals where equivalent
- `typeof x === 'undefined'` to simpler comparisons where applicable
- Removal of unnecessary polyfills (`Array.isArray` fallback)

### 2.2 What is NOT Phase 3

- **No API changes** -- the public API surface must remain 100% identical
- **No new features** -- no new methods, properties, or behaviors
- **No architectural changes** -- no restructuring, no class conversion, no
  Promise-based API changes
- **No TypeScript** -- that is Phase 6
- **No algorithm changes** -- only syntax, not logic
- **No changes to prototype-based architecture** -- `jStat.fn = jStat.prototype`
  stays as-is
- **No changes to the distribution factory pattern** -- just modernize syntax
  within it
- **No changes to the callback/setTimeout chaining pattern** -- it is the
  public API

### 2.3 The Public API Compatibility Contract

Every method listed in `doc/other/architecture.md` Section 2 must continue to
work identically. This includes:

- All static methods on `jStat`
- All instance methods on `jStat.prototype`
- The `jStat.fn` alias for `jStat.prototype`
- Constructor behaviors (array, matrix, sequence, clone, empty)
- Distribution constructor pattern (`jStat.normal(0, 1).pdf(x)`)
- Instance method chaining with callbacks
- The `jStat.jStat` self-reference
- `jStat._init` and its prototype chain
- `jStat.utils` object
- `jStat.extend` behavior (both 1-arg and 2-arg forms)

---

## 3. Pattern Inventory

### 3.1 `var` Declarations (610 total)

| File | Total `var` | With Assignment | Without Assignment |
|------|------------:|----------------:|-------------------:|
| `core.js` | 48 | 37 | 11 |
| `vector.js` | 103 | 94 | 9 |
| `special.js` | 58 | 46 | 12 |
| `distribution.js` | 149 | 137 | 12 |
| `linearalgebra.js` | 155 | 133 | 22 |
| `test.js` | 34 | 29 | 5 |
| `models.js` | 32 | 32 | 0 |
| `regression.js` | 31 | 29 | 2 |
| `index.js` | 0 | 0 | 0 |
| **Total** | **610** | **537** | **73** |

**const vs let analysis:**

Most `var` declarations with immediate assignment that are never reassigned
can become `const`. The "without assignment" declarations (73) are variables
declared and then assigned later, or declared as part of multi-variable `var`
statements -- these are typically `let` candidates.

Rough breakdown:

- **~400 can be `const`** -- assigned once and never reassigned (e.g.,
  `var sum = 0` in a loop accumulator is `let` since `sum +=`, but
  `var mean = jStat.mean(arr)` is `const` since it is never reassigned)
- **~140 should be `let`** -- loop counters, accumulators, reassigned variables
- **~73 are "uninitialized then assigned"** -- these are `let`

Each file will need manual review to determine the correct classification.
Loop counters (`var i = 0`) are always `let`. Function parameters that shadow
outer `var` declarations need care.

**Known `var` redeclaration issue:**
In `vector.js`, the `rank()` function declares `var number` twice in nested
`for` loops (lines 160 and 173). With `var` this is harmless (same function
scope). With `let` inside the `for` block, each declaration is its own scope,
so this is actually safe to convert to `let` -- but it should be noted as a
pattern to watch for.

### 3.2 `function` Keywords (~460 executable, 512 including comments)

The per-file totals below include `function` occurrences in comment lines
(documentation comments that mention the word "function" in English). The
executable counts for conversion purposes are approximately 52 lower than
the raw totals.

| File | Declarations | Named Expressions | Anon Expressions | Callbacks | Method Defs | Total (incl. comments) |
|------|-------------:|------------------:|-----------------:|----------:|------------:|------:|
| `core.js` | 10 | 32 | 3 | 22 | 10 | 77 |
| `vector.js` | 2 | 35 | 6 | 14 | 5 | 62 |
| `special.js` | 0 | 21 | 2 | 7 | 14 | 44 |
| `distribution.js` | 4 | 1 | 4 | 8 | 169 | 186 |
| `linearalgebra.js` | 5 | 0 | 1 | 40 | 37 | 83 |
| `test.js` | 1 | 0 | 0 | 2 | 23 | 26 |
| `models.js` | 5 | 0 | 1 | 12 | 0 | 18 |
| `regression.js` | 0 | 0 | 0 | 0 | 16 | 16 |

"Method Defs" are named function expressions assigned as object properties --
either inside `jStat.extend({...})` object literals (e.g.,
`pdf: function pdf(x, rate) {...}`) or via direct property assignment (e.g.,
`jStat.rows = function rows(arr) {...}`). These are the largest category
in distribution.js (169 of 186).

**Arrow function conversion candidates:**

Callbacks passed to `.map()`, `.forEach()`, `.reduce()`, `.filter()` are the
primary candidates. These are short, do not use `this` or `arguments`, and
are the most natural arrow function conversions.

Estimated conversion:
- **~105 callbacks** can safely become arrow functions
- **~90 named function expressions** in `jStat.extend()` calls CANNOT become
  arrows (they are object method definitions and some use `this`)
- **~22 function declarations** need individual analysis (some are module-level
  helpers that could become arrow-assigned-to-const, but see Section 4.4 on
  hoisting risks)
- **~10 IIFE patterns** would be better rewritten using `let` in the loop

### 3.3 `arguments` Object Usage (24 executable occurrences)

| File | Count | Context |
|------|------:|---------|
| `core.js` | 6 | `jStat()` constructor (1), `jStat.extend()` (4), prototype shortcut IIFE (1) |
| `vector.js` | 1 | Prototype extension for `quantiles`/`percentileOfScore` |
| `special.js` | 1 | Prototype shortcut IIFE (`apply(null, arguments)`) |
| `test.js` | 10 | 10 of 15 `jStat.extend({...})` static methods use `slice.call(arguments)` |
| `regression.js` | 6 | `buildxmatrix()`, `builddxmatrix()` use `arguments` directly |

Full details in [Section 7](#7-the-arguments-problem-in-detail).

### 3.4 `new Array()` Constructor (23 occurrences)

| File | Count | Context |
|------|------:|---------|
| `core.js` | 11 | `new Array(nrow)`, `new Array(cols)`, `new Array(rows)` |
| `vector.js` | 2 | `new Array(arrlen)`, `new Array(arr1Len)` |
| `test.js` | 4 | `new Array(2)`, `new Array()` |
| `regression.js` | 6 | `new Array(arguments.length)`, `new Array(A.length)`, etc. |

Most of these use `new Array(n)` to pre-allocate arrays of a specific length,
which is a legitimate performance pattern. These should NOT be blindly
converted to `[]` -- the pre-allocation is intentional. The one exception is
`new Array()` without arguments (test.js line 133: `sample = new Array()`)
which should become `[]`.

### 3.5 `typeof x !== 'undefined'` Checks (2 occurrences)

Both in `vector.js` (quantiles function, lines 311-314):
```javascript
if (typeof alphap === 'undefined')
    alphap = 3 / 8;
if (typeof betap === 'undefined')
    betap = 3 / 8;
```

These could become default parameters if the function signature allows, or
`alphap ??= 3/8` with nullish coalescing assignment. However, since the
quantiles function is a named function expression assigned to `jStat.quantiles`,
default parameters are the cleanest approach:
`function quantiles(arr, quantilesArray, alphap = 3/8, betap = 3/8)`.

**Safety note:** Default parameters only trigger on `undefined`, which matches
the `typeof` check behavior. However, if any caller explicitly passes
`undefined`, the behavior would be the same. Safe to convert.

### 3.6 `for` Loops (170 total) and `while` Loops (27 total)

| File | `for` | `while` |
|------|------:|--------:|
| `core.js` | 25 | 0 |
| `vector.js` | 20 | 7 |
| `special.js` | 14 | 4 |
| `distribution.js` | 14 | 6 |
| `linearalgebra.js` | 73 | 10 |
| `test.js` | 9 | 0 |
| `models.js` | 0 | 0 |
| `regression.js` | 15 | 0 |

**`for...of` conversion candidates:**

Very few. Most `for` loops use index access (`arr[i]`) or have complex
iteration patterns (`for (i = 0; i < n; i++)` with the index used inside).
The `for...of` pattern would only apply to loops that iterate values without
needing the index. In jStat, nearly every loop needs the index for array
element access. Additionally, numeric `for` loops are faster than `for...of`
for array iteration, which matters for a math library.

**Recommendation:** Do NOT convert `for` loops to `for...of`. The index-based
patterns are both correct and performant. The only candidate conversions would
be `for...in` loops used for object property iteration in `jStat.extend()`,
but even those are correct as-is.

### 3.7 IIFE Patterns (13 IIFEs)

These are IIFEs used throughout the codebase, primarily to capture loop
variables in closures:

| File | Line(s) | Purpose |
|------|---------|---------|
| `core.js` | 439-501 | `jStat.slice` closure (wraps internal `_slice` helper) |
| `core.js` | 633-648 | Prototype no-arg methods (transpose, clear, etc.) |
| `core.js` | 653-667 | Prototype one-arg methods (row, col) |
| `core.js` | 671-677 | Prototype shortcut methods (create, zeros, etc.) |
| `vector.js` | 447-478 | cumsum/cumprod instance methods |
| `vector.js` | 482-518 | Vector stat instance methods (sum, mean, etc.) |
| `vector.js` | 523-564 | Argument-taking instance methods (quantiles, etc.) |
| `special.js` | 492-499 | Special function instance methods |
| `special.js` | 502-508 | randn instance method |
| `distribution.js` | 4-64 | Distribution factory (the big one) |
| `linearalgebra.js` | 547-588 | QR decomposition (function-scoped IIFE) |
| `linearalgebra.js` | 590-649 | lstsq (function-scoped IIFE) |
| `linearalgebra.js` | 951-968 | Linear algebra instance methods |

Most of these IIFEs exist because `var` in a `for` loop shares a single
binding across iterations. With `let`, each iteration gets its own binding,
eliminating the need for the inner IIFE. The `jStat.slice` IIFE (core.js
439-501) is different -- it creates a closure for the internal `_slice`
helper, which is unnecessary in ES module scope and can simply be extracted
to a module-level function. IIFE elimination is one of the most impactful
modernizations.

**Conversion pattern:**
```javascript
// Before (IIFE to capture loop variable)
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function() { /* uses passfunc */ };
  })(funcs[i]);
})('transpose clear ...'.split(' '));

// After (let eliminates need for IIFE)
for (const passfunc of 'transpose clear ...'.split(' ')) {
  jProto[passfunc] = function() { /* uses passfunc */ };
}
```

Or, using `forEach`:
```javascript
'transpose clear ...'.split(' ').forEach((passfunc) => {
  jProto[passfunc] = function() { /* uses passfunc */ };
});
```

**Safety:** This is safe because the only purpose of the IIFE is to create a
new scope for the loop variable. `let`/`const` in `for...of` (or `.forEach`
with an arrow) creates block scope per iteration, providing the same guarantee.

**Important:** The inner functions assigned to `jProto[passfunc]` must remain
as `function` expressions (not arrows) because they use `this`. Only the
IIFE wrapper and iteration variable capture can be modernized.

### 3.8 String Concatenation (0 template literal candidates)

There are no string concatenation patterns in the source code that would
benefit from template literals. The only string concatenation is in the
`.split(' ')` patterns for building method name lists, and those are idiomatic.

### 3.9 `Array.isArray` Polyfill (1 occurrence)

In `core.js` line 15:
```javascript
var isArray = Array.isArray || function isArray(arg) {
  return toString.call(arg) === '[object Array]';
};
```

`Array.isArray` has been available since ES5 (2009) and is supported in all
environments jStat targets. The polyfill fallback can be removed:
```javascript
const isArray = Array.isArray;
```

Or, internal code could simply use `Array.isArray` directly and remove the
`isArray` variable. However, `isArray` is exported via `jStat.utils.isArray`,
so the assignment must remain for backwards compatibility.

### 3.10 Other Patterns

**`concat.apply([], arr)` in `toVector`:** Could become `arr.flat()` (ES2019)
or `[].concat(...arr)` (ES2015 spread). Since we are targeting ES2015 patterns,
spread is appropriate but may have stack size limits for very large arrays.
Leave as-is for safety.

**`.call()` and `.apply()` patterns (34 occurrences):** Most of these are
either necessary for setting `this` context in callbacks or for spreading
arguments. They are NOT candidates for modernization -- they serve a purpose.

---

## 4. Critical Safety Analysis

### 4.1 `this` Binding -- Arrow Functions

**The Rule:** Arrow functions do not have their own `this`. They inherit `this`
from the enclosing lexical scope. Any function that relies on `this` being the
object on which the method was called CANNOT become an arrow function.

**Functions that use `this` (CANNOT become arrows):**

| File | Location | Context |
|------|----------|---------|
| `core.js` | `jStat._init` (lines 48-86) | Constructor -- `this[i]`, `this.length`, `this[0]` |
| `core.js` | `jStat.extend` (line 118) | Returns `this` |
| `core.js` | `jProto.toArray` (line 609) | `this.length`, `slice.call(this)` |
| `core.js` | `jProto.map` (line 615) | `jStat.map(this, ...)` |
| `core.js` | `jProto.cumreduce` (line 621) | `jStat.cumreduce(this, ...)` |
| `core.js` | `jProto.alter` (lines 627-628) | `jStat.alter(this, ...)`, `return this` |
| `core.js` | IIFE no-arg methods (lines 635-648) | `var self = this`, `return this` |
| `core.js` | IIFE one-arg methods (lines 655-665) | `var self = this`, `return this` |
| `core.js` | IIFE shortcut methods (lines 673-675) | `arguments` (no `this` but uses `arguments`) |
| `vector.js` | IIFE cumsum/cumprod (lines 451-476) | `this.length`, `this.transpose()`, `this[0]` |
| `vector.js` | IIFE vector stats (lines 486-514) | `this.length`, `this.transpose()`, `this[0]` |
| `vector.js` | IIFE arg methods (lines 525-561) | `this.length`, `this[0]` |
| `special.js` | IIFE special fn methods (line 494-497) | `jStat.map(this, ...)` |
| `distribution.js` | Distribution constructor (lines 7-13) | `this instanceof f`, `this._a`, etc. |
| `distribution.js` | `jStat.fn[func]` (lines 16-19) | `newthis.data = this` |
| `distribution.js` | `.sample()` prototype (lines 22-31) | `this._a`, `this._b`, `this._c` |
| `distribution.js` | `.pdf/.cdf/.inv` prototype (lines 36-48) | `this._a`, `this._b`, `this._c`, `this.data` |
| `distribution.js` | `.mean/.median/...` prototype (lines 54-56) | `this._a`, `this._b`, `this._c` |
| `distribution.js` | `poisson.sample` (lines 1072-1076) | `this.sampleSmall`, `this.sampleLarge` |
| `linearalgebra.js` | IIFE instance methods (lines 953-966) | `this`, `return this` |
| `test.js` | `jStat.fn.zscore` (line 54) | `this.mean()`, `this.stdev()` |
| `test.js` | `jStat.fn.ztest` (line 58) | `this.zscore()` |
| `test.js` | `jStat.fn.tscore` (line 106) | `this.mean()`, `this.stdev()`, `this.cols()` |
| `test.js` | `jStat.fn.ttest` (lines 110-112) | `this.tscore()`, `this.cols()` |
| `test.js` | `jStat.fn.anovafscore` (line 182) | `this.toArray()` |
| `test.js` | `jStat.fn.anovaftes` (lines 186-191) | `this.length`, `this[i]`, `this.anovafscore()` |
| `test.js` | `jStat.fn.normalci` (line 308) | `this.toArray()` |
| `test.js` | `jStat.fn.tci` (line 312) | `this.toArray()` |

**Summary:** Nearly all methods attached to `jStat.prototype` (via `jProto`,
`jStat.fn`, or `jStat.extend(jStat.fn, {...})`) and all distribution prototype
methods use `this` and MUST remain as `function` expressions. Exceptions:
the core shortcut methods (line 673, use `arguments` but not `this`) and
`oneSidedDifferenceOfProportions`/`twoSidedDifferenceOfProportions` in test.js
(use neither `this` nor `arguments`). Even so, these should remain as `function`
expressions for consistency with other prototype methods.

**Functions that do NOT use `this` (CAN become arrows):**

- All static methods on `jStat.*` (e.g., `jStat.sum`, `jStat.mean`, etc.)
- Almost all distribution static methods (e.g., `jStat.normal.pdf`, etc.) --
  **exception:** `poisson.sample` uses `this` and CANNOT become an arrow
- Helper functions (e.g., `calcRdx`, `ascNum`, `clip`, `betinc`,
  `laplaceSign`, `tukeyWprob`, `tukeyQinv`, `differenceOfProportions`)
- All `.map()`, `.forEach()`, `.reduce()`, `.filter()` callbacks that do not
  reference `this`
- Internal helpers in `models.js` (`sub_regress`, `ols`, `t_test`, `F_test`,
  `ols_wrap`)

**However**, see Section 4.4 for why converting function declarations to
arrow-assigned-to-const has hoisting implications.

### 4.2 `var` Hoisting -- Temporal Dead Zone

**The Rule:** `var` declarations are hoisted to the top of the function scope
and initialized to `undefined`. `let`/`const` declarations are hoisted but
NOT initialized -- accessing them before their declaration throws a
`ReferenceError` (the "temporal dead zone").

**Analysis of hoisting reliance in jStat:**

After careful review, **no code in jStat relies on `var` hoisting**. All
variables are used after their `var` declaration. The patterns are:

1. Variables declared at the top of functions (common C-style pattern)
2. Loop counters declared in `for` initializers
3. Multi-variable `var` statements declaring several variables at once

All of these are safe to convert to `let`/`const` because the variables are
always used after their declaration point.

**One subtle case:** In `vector.js` line 155, `jStat.rank` uses `var number`
inside two separate `for` loops. With `var`, both refer to the same function-
scoped variable. With `let`, each `for` block gets its own `number` variable.
This is actually safe (and arguably more correct) because the two loops are
sequential and do not interact through the shared `number` variable.

**Multi-variable `var` statements:** Several functions use patterns like:
```javascript
var a = 1, b = 2, c;
```
When converting, each variable in the statement must be individually assessed.
If `a` and `b` are never reassigned but `c` is, this becomes:
```javascript
const a = 1;
const b = 2;
let c;
```
This requires splitting multi-variable declarations, which is a mechanical but
tedious change.

### 4.3 `arguments` Object -- Arrow Functions

**The Rule:** Arrow functions do not have their own `arguments` object. They
inherit `arguments` from the enclosing scope (if it is a regular function) or
get a `ReferenceError` if there is no enclosing regular function.

**Every function using `arguments`:**

See [Section 7](#7-the-arguments-problem-in-detail) for the full list. These
functions CANNOT become arrow functions unless `arguments` is replaced with
rest parameters first. And rest parameter conversion requires verifying that
all call sites pass arguments in a compatible way.

### 4.4 Function Declaration Hoisting

**The Rule:** `function` declarations are hoisted (both the declaration and
the definition). `const fn = () => {}` or `const fn = function() {}` is NOT
hoisted (the variable is hoisted but stays in the TDZ until the assignment).

**Function declarations in jStat and their usage order:**

| File | Function | Declared Line | First Used Line | Hoisting Relied Upon? |
|------|----------|:------------:|:--------------:|:--------------------:|
| `core.js` | `calcRdx` | 8 | 94 (ref), 385 (call) | No |
| `core.js` | `isArray` | 15 (`var =`) | 50 | No (it's a `var`, not declaration) |
| `core.js` | `isFunction` | 20 | 54 | No |
| `core.js` | `isNumber` | 25 | 68 | No |
| `core.js` | `toVector` | 31 | 98 (ref) | No |
| `core.js` | `jStat` | 37 | 43 (jStat.fn) | **No** -- `jStat.fn` is set on line 43, after `jStat` is declared on line 37. Hoisting is not relied upon. Cannot become arrow regardless (used with `new`). |
| `core.js` | `retZero` | 314 | 321, 375 | No |
| `core.js` | `retOne` | 325 | 332 | No |
| `core.js` | `retIdent` | 344 | 351 | No |
| `vector.js` | `ascNum` | 6 | 123, 193, etc. | No |
| `vector.js` | `clip` | 8 | 320 | No |
| `distribution.js` | `betinc` | 730 | 786, 788 | No |
| `distribution.js` | `laplaceSign` | 1201 | 1237 | No |
| `distribution.js` | `tukeyWprob` | 1241 | 1339, 1448, 1504 | No |
| `distribution.js` | `tukeyQinv` | 1368 | 1549 | No |
| `linearalgebra.js` | `isUsable` | 9 | 18, 19, 59, etc. | No |
| `test.js` | `differenceOfProportions` | 317 | 329, 334 | No |
| `models.js` | `sub_regress` | 3 | 60 | No |
| `models.js` | `ols` | 18 | 8 (in `sub_regress`) | **Textual** -- `sub_regress` (line 3) references `ols` (line 18), but `sub_regress` is only called at runtime after both are defined. Safe to convert. |
| `models.js` | `t_test` | 59 | 101 | No |
| `models.js` | `F_test` | 89 | 102 | No |
| `models.js` | `ols_wrap` | 99 | 113 | No |

**Critical hoisting dependencies:**

1. **`jStat` function declaration (core.js line 37):** The `jStat` constructor
   is a function declaration, and `jStat.fn` is set immediately after on
   line 43. As a function declaration, this is hoisted. However, since `jStat`
   is the very first function declared and there are no references to it before
   line 37, hoisting is not actually relied upon. It CANNOT become an arrow
   function regardless (it is a constructor that must be callable with `new`
   via `jStat._init`). **Leave as `function` declaration.**

2. **`ols` in models.js:** `sub_regress` (line 3) calls `ols` (line 18).
   Since `sub_regress` is defined before `ols`, this relies on function
   declaration hoisting. If `ols` were converted to `const ols = () => {}`,
   it would be in the TDZ when `sub_regress` is defined. However, `sub_regress`
   does not call `ols` at definition time -- it only calls `ols` when
   `sub_regress` itself is called, which happens at runtime after both functions
   are defined. So this is actually **safe** to convert, because by the time
   `sub_regress` is invoked, `ols` will have been assigned. But to avoid
   confusion, it is cleaner to simply reorder the declarations or keep them
   as `function` declarations.

**Recommendation:** Keep module-level function declarations as `function`
declarations in general. The main benefit of arrow functions is brevity in
callbacks, not in top-level function definitions. Converting declarations to
const-assigned arrows adds risk (TDZ) with minimal readability benefit. The
one exception is trivial one-expression helpers (`retZero`, `retOne`,
`retIdent`, `laplaceSign`) which can become `const` arrow assignments since
they are always used after their declaration (see Q5 in Section 9).

### 4.5 Strict Mode

**The Rule:** ES modules run in strict mode automatically. Rollup's ESM output
is already strict mode. The UMD output wraps in a function scope.

**Phase 2 already verified that the full test suite passes against the Rollup
output.** This means the code is already running in strict mode (in the ESM
bundle at minimum) without issues. Key strict mode behaviors that could differ:

- **No implicit globals:** All variables must be declared. Since jStat uses
  `var` for everything, no undeclared variables exist.
- **No `with` statements:** jStat does not use `with`.
- **No `arguments.callee`:** jStat does not use `arguments.callee`.
- **No octal literals:** jStat does not use octal literals.
- **Duplicate parameter names:** jStat does not have duplicate parameter names.
- **`this` in non-method functions is `undefined`:** The `jStat()` constructor
  is always called via `new jStat._init(arguments)`, so `this` is always the
  new instance. Static methods do not use `this`.

**Conclusion:** Strict mode is already in effect and all tests pass. No strict
mode concerns for Phase 3.

---

## 5. File-by-File Analysis

### 5.1 `src/core.js` (681 lines, 48 `var`)

**`var` declarations:**
- 37 with assignment, 11 without
- ~30 can be `const` (e.g., `var concat = Array.prototype.concat`, loop-internal
  values that are not reassigned, `var self = this`)
- ~18 should be `let` (loop counters like `var i = 0`, accumulators, variables
  reassigned in if/else branches like `var results`)

**Functions that CAN become arrows:**
- `retZero` (line 314) -- trivial, but it is a declaration (keep as-is or use
  const assignment)
- `retOne` (line 325) -- same
- `retIdent` (line 344) -- same
- All `.map()` and `.forEach()` callbacks: ~15 callbacks in `jStat.row`,
  `jStat.col`, `jStat.cola`, `jStat.copy`, `jStat.slice`, `jStat.sliceAssign`,
  `jStat.diagonal`
- The `function(value, row, col)` callbacks in `jStat.map`-like patterns

**Functions that CANNOT become arrows:**
- `jStat()` constructor (line 37) -- function declaration, used with `new`
- `jStat._init` (line 48) -- uses `this` extensively
- `jStat.extend` (line 112) -- uses `arguments`, returns `this`
- All `jProto` methods (`toArray`, `map`, `cumreduce`, `alter`) -- use `this`
- All IIFE-generated prototype methods (lines 633-677) -- the inner functions
  use `this`; the IIFE wrappers themselves can be eliminated

**`arguments` usage:**
- `jStat()` constructor (line 38): `new jStat._init(arguments)` -- cannot use
  rest params without changing the constructor API
- `jStat.extend` (lines 115-123): Uses `arguments.length` and `arguments[i]`
  for the multi-argument form -- CAN convert to rest params
- IIFE shortcut methods (line 674): `jStat[passfunc].apply(null, arguments)` --
  the wrapping function uses `arguments`; would need rest params

**IIFE cleanup opportunities:**
- Lines 633-648: No-arg prototype methods IIFE
- Lines 653-667: One-arg prototype methods IIFE
- Lines 671-677: Shortcut methods IIFE
All three can have their outer IIFE removed and the `for` loop replaced with
`for...of` using `const`.

**Other modernization:**
- Line 15: Remove `Array.isArray` polyfill fallback
- `jStat.slice` IIFE (lines 439-501): The outer IIFE creates a closure for
  the internal `_slice` function. This is unnecessary in ES module scope --
  `_slice` can be a module-level function.

**Gotchas:**
- The `jStat.fn = jStat.prototype` pattern must remain.
- `jStat._init.prototype = jStat.prototype` must remain.

### 5.2 `src/vector.js` (565 lines, 103 `var`)

**`var` declarations:**
- 94 with assignment, 9 without
- ~70 can be `const` (most local variables in stat functions are assigned once)
- ~33 should be `let` (loop counters, accumulators like `var sum = 0` that get
  `+= ` applied, `var i` in while loops)

**Functions that CAN become arrows:**
- All `.map()`, `.reduce()`, `.filter()` callbacks (~10 callbacks)
- `ascNum` (line 6) and `clip` (line 8) are simple helpers -- could be arrows
  but they are function declarations used later; keep as declarations.

**Functions that CANNOT become arrows:**
- All three IIFE-generated prototype method patterns (lines 447-564) -- the
  inner methods use `this` extensively (`this.length`, `this.transpose()`,
  `this[0]`)

**`arguments` usage:**
- Line 529: `Array.prototype.slice.call(arguments)` in the IIFE for
  `quantiles`/`percentileOfScore` instance methods -- this function can use
  rest parameters

**IIFE cleanup opportunities:**
- Lines 447-478: cumsum/cumprod IIFE -- can use `for...of`
- Lines 482-518: Vector stat methods IIFE -- can use `for...of`
- Lines 523-564: Arg-taking methods IIFE -- can use `for...of`

**Other modernization:**
- Line 3: `var isFunction = jStat.utils.isFunction` can be `const`
- Lines 311-314: `typeof alphap === 'undefined'` can become default parameters

### 5.3 `src/special.js` (509 lines, 58 `var`)

**`var` declarations:**
- 46 with assignment, 12 without
- ~35 can be `const` (coefficient arrays, intermediate calculations)
- ~23 should be `let` (loop counters, accumulators, variables modified in loops)

**Functions that CAN become arrows:**
- `.alter()` callback (line 464): `function() { return jStat.randg(shape); }`
- `.map()` callback (line 496): `function(value) { return jStat[passfunc](value); }`

**Functions that CANNOT become arrows:**
- The IIFE-generated prototype methods (lines 494, 504) -- they reference
  `jStat.fn[passfunc]` and use `jStat.map(this, ...)` where `this` refers to
  the jStat instance

**Actually**, looking closer: the function at line 494 (`jStat.fn[passfunc] =
function() { ... }`) uses `this` indirectly via `jStat.map(this, ...)`. This
CANNOT become an arrow.

**`arguments` usage:**
- Line 505: `jStat[passfunc].apply(null, arguments)` -- the wrapping function
  uses `arguments` and would need rest params

**IIFE cleanup opportunities:**
- Lines 492-499 and 502-508 can have IIFEs removed with `for...of` loop

**Other:**
- No string concatenation to template-ify
- Most functions are pure numerical computations -- straightforward `var` to
  `const`/`let` conversion

### 5.4 `src/distribution.js` (1,597 lines, 149 `var`)

**`var` declarations:**
- 137 with assignment, 12 without
- ~120 can be `const` (most distribution static methods declare variables that
  are assigned once: `var u = jStat.randg(alpha)`)
- ~29 should be `let` (loop counters, accumulators, Tukey/hypgeom iteration
  variables)

**Functions that CAN become arrows:**
- Distribution static methods (e.g., `pdf`, `cdf`, `inv`, `mean`, `median`,
  `mode`, `sample`, `variance`) -- these do NOT use `this`. There are roughly
  **175 named function expressions** inside `jStat.extend(jStat.distname, {...})`
  calls that could technically become arrows. However, since they are object
  method shorthand candidates, the recommendation is to keep them as `function`
  for consistency (see Section 8).
- Callbacks in `.map()` patterns (~8 callbacks)

**Functions that CANNOT become arrows:**
- Distribution constructor (lines 7-13): `this instanceof f`, `this._a`, etc.
- `jStat.fn[func]` (lines 16-19): `this` refers to jStat instance
- All `.prototype` methods (lines 22-56): `this._a`, `this._b`, `this._c`,
  `this.data`
- `poisson.sample` (lines 1072-1076): `this.sampleSmall`, `this.sampleLarge`

**`arguments` usage:** None. Distribution static methods all have explicit
parameter lists.

**IIFE cleanup opportunities:**
- The main distribution factory IIFE (lines 4-64) is the most complex IIFE
  in the codebase. It contains nested IIFEs for generating `pdf`/`cdf`/`inv`
  and `mean`/`median`/`mode`/`variance` prototype methods. The outer IIFE
  iterates over the distribution name list. This can be modernized by
  replacing the IIFE with a `for...of` loop and using `const func` to capture
  the distribution name per iteration.

**Other modernization:**
- The four helper functions (`betinc`, `laplaceSign`, `tukeyWprob`,
  `tukeyQinv`) are module-internal. They are function declarations and do not
  use `this` or `arguments`. They could become const-assigned arrows but the
  readability benefit is marginal. Recommend keeping as function declarations.

### 5.5 `src/linearalgebra.js` (969 lines, 155 `var`)

**`var` declarations:**
- 133 with assignment, 22 without
- ~90 can be `const` (matrix dimensions, temporary computation results)
- ~65 should be `let` (loop counters, matrix element accumulators, iteration
  variables in Gauss elimination, Jacobi iteration, etc.)

This file has the most `var` declarations due to the heavily iterative nature
of matrix algorithms. Many functions have large multi-variable `var` statements
at the top:
```javascript
var i = 0, j = 0, n = a.length, l = [], u = [], d = [];
var xv, c, h, xk;
```
These will need to be split into individual `const`/`let` declarations.

**Functions that CAN become arrows:**
- ~40 `.map()` and `.forEach()` callbacks throughout the file (particularly in
  `triaUpSolve`, `triaLowSolve`, `lu`, `cholesky`, `QR`, `lstsq`)
- `isUsable` (line 9) -- simple helper, but a function declaration

**Functions that CANNOT become arrows:**
- IIFE-generated instance methods (lines 953-966): use `this`, `return this`

**IIFE cleanup opportunities:**
- `QR` (lines 547-588): Wraps `qr2` function and helper references. In module
  scope, the IIFE is unnecessary -- `qr2` can be a module-level function.
- `lstsq` (lines 590-649): Same pattern -- `R_I` and `qr_solve` can be
  module-level functions.
- Instance method IIFE (lines 951-968): Standard IIFE-for-loop pattern.

**Other:**
- `push = Array.prototype.push` (line 6) can become `const`
- The `det` function (line 183) calls itself recursively -- must stay as a
  named function or use a const-assigned reference.

### 5.6 `src/test.js` (338 lines, 34 `var`)

**`var` declarations:**
- 29 with assignment, 5 without
- ~20 can be `const`
- ~14 should be `let`

**Functions that CAN become arrows:**
- `differenceOfProportions` (line 317) -- does not use `this` or `arguments`.
  But it is a function declaration, so keep as-is.
- `.map()` callback on line 246: `function(arr) { return jStat.mean(arr); }`

**Functions that CANNOT become arrows:**
- All `jStat.extend(jStat.fn, {...})` methods (5 extend calls adding instance
  methods) -- ALL use `this`
- Most `jStat.extend({...})` static methods (5 extend calls) -- these do NOT
  use `this`, but 10 of 15 DO use `arguments` (see below; `ftest`,
  `tukeyhsd`, and `significant` use named parameters instead)

**`arguments` usage (10 occurrences):** This is the heaviest user of
`arguments` in the entire codebase. 10 of 15 static methods use the pattern
(`ftest`, `tukeyhsd`, and `significant` use named parameters instead):
```javascript
zscore: function zscore() {
    var args = slice.call(arguments);
    // ... use args[0], args[1], etc.
}
```

These are variadic functions that accept different parameter lists depending
on argument count/types. See [Section 7](#7-the-arguments-problem-in-detail)
for detailed analysis.

### 5.7 `src/models.js` (113 lines, 32 `var`)

**`var` declarations:**
- 32 with assignment, 0 without
- ~26 can be `const` (most are single-assignment calculations)
- ~6 should be `let` (loop counters)

**Functions that CAN become arrows:**
- All 12 `.map()` and `.filter()` callbacks
- `fcdf` (line 92) -- local function expression, no `this`/`arguments`

**Functions that CANNOT become arrows:**
- None use `this` or `arguments`
- However, `sub_regress`, `ols`, `t_test`, `F_test`, `ols_wrap` are all
  function declarations. Converting them to arrows is safe but offers
  minimal benefit. Keep as declarations.

**Hoisting concern:** `sub_regress` (line 3) references `ols` (line 18).
Both are function declarations, so hoisting makes this work. If `ols` were
changed to a `const` assignment, the code would still work at runtime (since
`sub_regress` is only called later, after `ols` is assigned). But to be safe,
either reorder the functions or keep as declarations.

**`arguments` usage:** None.

### 5.8 `src/regression.js` (206 lines, 31 `var`)

**`var` declarations:**
- 29 with assignment, 2 without
- ~22 can be `const`
- ~9 should be `let` (loop counters)

**Functions that CAN become arrows:** None of the functions are callbacks.
The methods are all inside a `jStat.extend({...})` call, making them object
properties. They do not use `this`.

**Functions that CANNOT become arrows (due to `arguments`):** None use `this`,
and arrow functions ARE syntactically valid as object property values. However,
these functions use `arguments` (see below), so they cannot be arrows unless
converted to rest params first. After rest param conversion, they could become:
```javascript
jStat.extend({
  buildxmatrix: (...args) => { ... },
});
```

**`arguments` usage (6 occurrences):**
- `buildxmatrix` (lines 18-21): `arguments.length`, `arguments[i]`
- `builddxmatrix` (lines 30-33): `arguments[0].length`, `arguments[0][i]`

Both use `arguments` to accept variadic input. See Section 7.

### 5.9 `src/index.js` (13 lines, 0 `var`)

No modernization needed. This file is already modern (only `import`/`export`
statements and one property assignment).

---

## 6. The `this` Problem in Detail

### 6.1 Overview

jStat uses `this` in two distinct patterns:

1. **Instance methods on `jStat.prototype`:** Methods that operate on the
   jStat array-like object. `this` refers to the jStat instance.

2. **Distribution prototype methods:** Methods on `jStat.normal.prototype`,
   etc. `this` refers to the distribution instance (with `_a`, `_b`, `_c`
   parameters).

### 6.2 `jStat.extend()` Calls -- Which Use `this`?

**Static extends (`jStat.extend({...})`) -- add to `jStat` namespace:**

| File | Line | Methods | Uses `this`? |
|------|------|---------|:------------:|
| `test.js` | 9 | `zscore`, `ztest` | No (uses `arguments`) |
| `test.js` | 66 | `tscore`, `ttest` | No (uses `arguments`) |
| `test.js` | 117 | `anovafscore`, `anovaftest`, `ftest` | No (`anovafscore`/`anovaftest` use `arguments`; `ftest` uses named params) |
| `test.js` | 196 | `qscore`, `qtest`, `tukeyhsd` | No (`qscore`/`qtest` use `arguments`; `tukeyhsd` uses named params) |
| `test.js` | 262 | `normalci`, `tci`, `significant` | No (`normalci`/`tci` use `arguments`; `significant` uses named params) |
| `regression.js` | 12 | `buildxmatrix`, ..., `matrixsubtract` | No (uses `arguments` in 2) |
| `linearalgebra.js` | 13 | `add`, ..., `PCA` (all linear algebra methods) | No |

None of the static `jStat.extend({...})` methods use `this`. They are pure
functions that take arguments and return results. However, many use
`arguments`, which prevents arrow conversion (see Section 7).

**Prototype extends (`jStat.extend(jStat.fn, {...})`):**

| File | Line | Methods | Uses `this`? |
|------|------|---------|:------------:|
| `test.js` | 52 | `zscore`, `ztest` | **Yes** |
| `test.js` | 104 | `tscore`, `ttest` | **Yes** |
| `test.js` | 180 | `anovafscore`, `anovaftes` | **Yes** |
| `test.js` | 306 | `normalci`, `tci` | **Yes** |
| `test.js` | 327 | `oneSidedDifferenceOfProportions`, `twoSidedDifferenceOfProportions` | No (`this` not used) |

All `jStat.fn` methods except the two proportion methods use `this`. The
proportion methods (lines 328-336) are interesting -- they do not use `this`
at all. They could technically be arrow functions, but since they are part of
an object literal, the benefit is minimal.

**Distribution extends (`jStat.extend(jStat.distname, {...})`):**

All 23 distribution `jStat.extend(jStat.distname, {...})` calls add static
methods that do NOT use `this`. The one exception is `poisson.sample`
(line 1072-1076) which uses `this.sampleSmall(l)` and `this.sampleLarge(l)`.
However, this `this` refers to the `jStat.poisson` object itself (since
`sample` is called as `jStat.poisson.sample(l)`), not a prototype instance.
Converting this to an arrow would break it because `this` would not refer to
`jStat.poisson`. **This MUST remain a function expression.**

### 6.3 The Callback Pattern

The prototype methods use `setTimeout` with `.call()` to bind `this`:
```javascript
jProto[passfunc] = function(func) {
    var self = this;
    if (func) {
        setTimeout(function() {
            func.call(self, jProto[passfunc].call(self));
        });
        return this;
    }
    // ...
};
```

The `self = this` capture and `func.call(self, ...)` pattern is how jStat
implements callback chaining. These outer functions MUST remain as `function`
expressions (they need `this`). The inner `setTimeout` callback captures
`self` from the closure and does NOT use its own `this` -- so the inner
callback CAN become an arrow function:
```javascript
jProto[passfunc] = function(func) {
    const self = this;
    if (func) {
        setTimeout(() => {
            func.call(self, jProto[passfunc].call(self));
        });
        return this;
    }
    // ...
};
```

### 6.4 Summary

| Pattern | Count | Can Use Arrow? |
|---------|------:|:--------------:|
| `jProto` / `jStat.fn` methods | ~35 | No |
| Distribution prototype methods | ~30 | No |
| Distribution static methods | ~175 | Technically yes, but not recommended |
| `jStat.extend({...})` static methods | ~45 | Only if `arguments` is first replaced |
| `.map`/`.forEach`/`.reduce` callbacks | ~105 | Yes |
| `setTimeout` inner callbacks | ~6 | Yes |
| Module-level helper functions | ~22 | Keep as declarations |

---

## 7. The `arguments` Problem in Detail

### 7.1 Complete Inventory

#### `src/core.js`

**1. `jStat()` constructor (line 38):**
```javascript
function jStat() {
    return new jStat._init(arguments);
}
```
The `arguments` object is passed directly to `jStat._init`. This is the
constructor function that MUST remain a `function` declaration. Converting to
rest params (`function jStat(...args)`) and passing `args` to `_init` is
possible but would change `_init` to receive an array instead of an
arguments object. Since `_init` accesses `args[0]`, `args[1]`, etc., and
arrays support the same indexing, this IS safe to convert:
```javascript
function jStat(...args) {
    return new jStat._init(args);
}
```
**Verdict: CAN convert** -- `_init` only uses bracket indexing and `.length`.

**2. `jStat.extend()` (lines 112-127):**
```javascript
jStat.extend = function extend(obj) {
    var i, j;
    if (arguments.length === 1) {
        for (j in obj) jStat[j] = obj[j];
        return this;
    }
    for (i = 1; i < arguments.length; i++) {
        for (j in arguments[i])
            obj[j] = arguments[i][j];
    }
    return obj;
};
```
Uses `arguments.length` and iterates `arguments[i]`. Can be converted to rest
params:
```javascript
jStat.extend = function extend(obj, ...sources) {
    if (sources.length === 0) {
        for (const j in obj) jStat[j] = obj[j];
        return this;
    }
    for (let i = 0; i < sources.length; i++) {
        for (const j in sources[i])
            obj[j] = sources[i][j];
    }
    return obj;
};
```
**Verdict: CAN convert** -- straightforward rest param replacement.

**3. IIFE shortcut methods (lines 671-677):**
```javascript
(function(funcs) {
    for (var i = 0; i < funcs.length; i++) (function(passfunc) {
        jProto[passfunc] = function() {
            return jStat(jStat[passfunc].apply(null, arguments));
        };
    })(funcs[i]);
})('create zeros ones rand identity'.split(' '));
```
The inner function uses `arguments` to forward all args to the static method.
Can convert to rest params:
```javascript
for (const passfunc of 'create zeros ones rand identity'.split(' ')) {
    jProto[passfunc] = function(...args) {
        return jStat(jStat[passfunc](...args));
    };
}
```
**Verdict: CAN convert** -- simple forwarding pattern.

#### `src/vector.js`

**4. Arg-taking prototype methods (line 529):**
```javascript
var args = Array.prototype.slice.call(arguments);
```
Inside the IIFE for `quantiles`/`percentileOfScore` instance methods. The
function uses `arguments` to detect callbacks and extract argument lists.
Can convert to rest params.
**Verdict: CAN convert.**

#### `src/special.js`

**5. randn prototype method (line 505):**
```javascript
jStat.fn[passfunc] = function() {
    return jStat(jStat[passfunc].apply(null, arguments));
};
```
Same forwarding pattern as core.js shortcut methods.
**Verdict: CAN convert** -- same rest param pattern.

#### `src/test.js` (10 occurrences)

**6-15. All static test methods:**

| Method | Line | Pattern |
|--------|------|---------|
| `zscore` | 14 | `var args = slice.call(arguments)` |
| `ztest` | 26 | `var args = slice.call(arguments)` |
| `tscore` | 71 | `var args = slice.call(arguments)` |
| `ttest` | 83 | `var args = slice.call(arguments)` |
| `anovafscore` | 123 | `var args = slice.call(arguments)` |
| `anovaftest` | 160 | `var args = slice.call(arguments)` |
| `qscore` | 201 | `var args = slice.call(arguments)` |
| `qtest` | 224 | `var args = slice.call(arguments)` |
| `normalci` | 267 | `var args = slice.call(arguments)` |
| `tci` | 286 | `var args = slice.call(arguments)` |

All use the same pattern: `var args = slice.call(arguments)` to get an array
of all arguments, then branch on `args.length` or `isNumber(args[1])` to
determine which parameter list was passed.

These can ALL be converted to rest parameters:
```javascript
zscore: function zscore(...args) {
    if (isNumber(args[1])) {
        return (args[0] - args[1]) / args[2];
    }
    return (args[0] - jStat.mean(args[1])) / jStat.stdev(args[1], args[2]);
},
```

The `slice.call(arguments)` conversion is trivial since `...args` produces
a real Array (unlike `arguments` which is array-like). The existing code
immediately converts to a real array anyway, so behavior is identical.

**Verdict: ALL CAN convert** -- drop `slice.call(arguments)`, use `...args`.

#### `src/regression.js` (6 occurrences)

**16. `buildxmatrix` (lines 18-21):**
```javascript
buildxmatrix: function buildxmatrix(){
    var matrixRows = new Array(arguments.length);
    for(var i=0;i<arguments.length;i++){
        var array = [1];
        matrixRows[i]= array.concat(arguments[i]);
    }
    return jStat(matrixRows);
},
```
Uses `arguments.length` and `arguments[i]`. Can convert to rest params:
```javascript
buildxmatrix: function buildxmatrix(...args) {
    const matrixRows = new Array(args.length);
    for (let i = 0; i < args.length; i++) {
        matrixRows[i] = [1].concat(args[i]);
    }
    return jStat(matrixRows);
},
```
**Verdict: CAN convert.**

**17. `builddxmatrix` (lines 27-37):**
```javascript
builddxmatrix: function builddxmatrix() {
    var matrixRows = new Array(arguments[0].length);
    for(var i=0;i<arguments[0].length;i++){
        var array = [1]
        matrixRows[i]= array.concat(arguments[0][i]);
    }
    return jStat(matrixRows);
},
```
Only uses `arguments[0]`. Can convert to a regular parameter:
```javascript
builddxmatrix: function builddxmatrix(arrays) {
    const matrixRows = new Array(arrays.length);
    // ...
},
```
**Verdict: CAN convert** -- uses only `arguments[0]`, just give it a name.

### 7.2 Summary

| Location | Occurrences | Can Convert? | Notes |
|----------|:-----------:|:------------:|-------|
| `jStat()` constructor | 1 | Yes | Pass array instead of arguments |
| `jStat.extend()` | 1 | Yes | Rest params |
| Core shortcut methods IIFE | 1 | Yes | Rest params + spread |
| Vector arg methods IIFE | 1 | Yes | Rest params |
| Special randn IIFE | 1 | Yes | Rest params + spread |
| test.js static methods | 10 | Yes | Drop `slice.call`, use `...args` |
| regression.js build methods | 2 | Yes | Rest params or named params |
| **Total** | **17** | **All** | |

These 17 conversion sites correspond to the 24 executable occurrences in
Section 3.3 (some sites, like `jStat.extend()`, use `arguments` on multiple
lines).

Every `arguments` usage in jStat can be safely converted to rest parameters.
None of them use `arguments` in exotic ways (like `arguments.callee` or
passing `arguments` to a function that expects a non-array-like object).

---

## 8. Recommended Approach

### 8.1 Order of Operations

Modernize **pattern-by-pattern across all files** rather than file-by-file.
This ensures consistency and makes it easier to review each type of change.

**Step 1: `var` to `const`/`let` (all files)**

This is the safest and most impactful change. It does not affect `this` or
`arguments` semantics. Do all files in one pass:

1. Convert all `var` declarations that are never reassigned to `const`
2. Convert remaining `var` declarations to `let`
3. Split multi-variable declarations where `const`/`let` mixing is needed
4. Run full test suite after each file

**Step 2: IIFE elimination (all files)**

Replace the 13 IIFE patterns with `for...of` using `const` (for loop-closure
IIFEs) or extract to module scope (for the `jStat.slice`, QR, and lstsq closure
IIFEs that encapsulate helper functions). For loop-closure IIFEs, this is safe
because their purpose is variable capture, which `const` in `for...of` provides.
For helper-encapsulating IIFEs, module scope provides equivalent encapsulation.

1. Convert each IIFE pattern
2. Keep the inner `function` expressions as-is (they use `this`)
3. Run test suite after each conversion

**Step 3: `arguments` to rest parameters (test.js, regression.js, core.js)**

Convert all `arguments` usage to rest parameters. Focus on:

1. test.js static methods (10 conversions)
2. regression.js build methods (2 conversions)
3. core.js `jStat.extend`, `jStat()` constructor, shortcut IIFE (3 conversions)
4. vector.js and special.js prototype IIFEs (2 conversions)
5. Run test suite after each file

**Step 4: Callback arrow functions (all files)**

Convert `.map()`, `.forEach()`, `.reduce()`, `.filter()` callbacks and
`setTimeout` inner callbacks to arrow functions. These are the safest arrow
conversions because:

- They are short (usually single expressions)
- They do not use `this` (they capture variables from the enclosing scope)
- They do not use `arguments`

**Step 5: Remove `Array.isArray` polyfill (core.js)**

Change `var isArray = Array.isArray || function isArray(arg) { ... }` to
`const isArray = Array.isArray`.

**Step 6: Minor cleanups**

- Convert `typeof x === 'undefined'` to default parameters (vector.js)
- Convert `new Array()` (no arguments) to `[]` (test.js line 133)
- Clean up the `jStat.slice` IIFE (core.js) -- extract `_slice` to module scope

### 8.2 What NOT to Convert

- **Function declarations at module scope** -- keep as `function` declarations
  for hoisting safety and readability. Exception: trivial one-expression helpers
  (`retZero`, `retOne`, `retIdent`, `laplaceSign`) can become const-assigned
  arrows (see Q5 in Section 9).
- **Named function expressions in `jStat.extend({...})` calls** -- these are
  object method definitions. While arrow functions are syntactically valid as
  object property values, named function expressions provide better stack
  traces and make the intent clearer. Converting them to arrows provides
  minimal benefit.
- **`for` loops to `for...of`** -- numeric `for` loops with index access are
  idiomatic for array processing in a math library. `for...of` would be less
  efficient and less clear.
- **`new Array(n)` pre-allocations** -- intentional performance optimization.
- **`concat.apply([], arr)` in `toVector`** -- safer than spread for large
  arrays.

### 8.3 Verification Strategy

The test suite is the primary safety net:

1. **Before starting:** Run `npm test` and confirm all tests pass
2. **After each logical change:** Run `npm test`
3. **After each file is complete:** Run `npm test`
4. **After all changes:** Run `npm test` plus manual verification that:
   - `require('jstat').jStat` works (CJS compatibility)
   - Distribution constructor pattern works
   - Callback chaining works
   - All four constructor modes work
5. **Compare bundle sizes** before and after to detect unexpected changes.
   `const`/`let` should produce roughly the same minified size as `var`.

---

## 9. Risks and Open Questions

### 9.1 Risks

**Risk 1: Subtle `this` binding changes (HIGH)**

The single greatest risk is accidentally converting a function that uses `this`
to an arrow function. jStat's prototype chain is deeply intertwined, and a
missed `this` reference would cause silent failures (returning `undefined`
instead of the expected value) or `TypeError` crashes. Mitigation: the
comprehensive `this` audit in Section 6 catalogs every instance. Every
function-to-arrow conversion must be cross-referenced against this list.

**Risk 2: `var` to `let`/`const` in complex scoping (MEDIUM)**

Some functions have deeply nested closures (especially the IIFE patterns).
Converting `var` to `let`/`const` changes scoping from function-level to
block-level. While no code was found to rely on `var` hoisting, there may be
edge cases in the interaction between closures and `setTimeout`. Mitigation:
the test suite covers all public API methods, so behavioral regressions would
be caught.

**Risk 3: `arguments` to rest parameter mismatch (LOW)**

If any internal caller passes `arguments` objects rather than individual
arguments, the conversion could break. However, all call sites were verified
to pass normal arguments. The test suite would catch any discrepancy.

**Risk 4: Bundle size increase (LOW)**

`const` and `let` are the same length as `var` (3 characters vs 3). Arrow
functions are shorter than `function` expressions. Rest parameters (`...args`)
are shorter than `slice.call(arguments)`. Overall, the bundle size should
stay the same or decrease slightly. The minified bundle should be essentially
unchanged since `var`, `let`, and `const` all minify to single-character
variable names.

### 9.2 Open Questions

**Q1: Should we use a codemod tool (e.g., jscodeshift, lebab)?**

**Recommendation: No.** The codebase is only ~5,000 lines. A manual approach
ensures each change is intentional and reviewed for safety. Codemod tools
cannot understand jStat's unique `this`-binding patterns in the prototype
chain and would likely produce incorrect arrow function conversions.

**Q2: Should distribution static methods become arrow functions?**

**Recommendation: No.** There are ~175 of them. Converting them to arrows
saves a few characters per function but changes the style of the largest file
in the codebase. The named function expressions provide better stack traces
when debugging distribution calculations. Additionally, `poisson.sample`
uses `this`, creating an inconsistency if other distribution methods are
arrows but `poisson.sample` is not. Keep them all as `function` for
consistency.

**Q3: Should we convert `jStat.extend({...})` static methods in test.js to
use named parameters instead of `...args` with branching?**

**Recommendation: No, not in Phase 3.** The overloaded parameter list pattern
(e.g., `zscore(value, mean, sd)` vs `zscore(value, array, flag)`) is part of
the public API. Converting from `...args` to named parameters would require
choosing one calling convention or adding runtime detection logic, which
changes behavior. Phase 3 is syntax-only modernization. The `...args` rest
parameter is a direct 1:1 replacement for `slice.call(arguments)`.

**Q4: Should the multi-line `var` declarations be split into one per line?**

**Recommendation: Yes.** When a multi-variable `var` statement mixes `const`
and `let` candidates, it must be split anyway. For consistency, split all
multi-variable declarations. This is also a readability improvement and makes
future diffs cleaner (one variable per line means adding/removing a variable
is a single-line diff).

**Q5: Should `function retZero() { return 0; }` become `const retZero = () => 0;`?**

**Recommendation: Yes for these trivial helpers**, but only the ones that are
truly trivial (one expression, no `this`, no `arguments`). Specifically:
`retZero`, `retOne`, `retIdent` in core.js, and `laplaceSign` in
distribution.js. Other function declarations should remain as declarations.

**Q6: What is the expected impact on readability?**

The primary readability improvements are:
- `const` communicates "this value never changes" -- reduces cognitive load
- Arrow callbacks in `.map()` are more concise: `(x) => x[0]` vs
  `function(x) { return x[0]; }`
- IIFE elimination removes one of the most confusing patterns in the codebase
- Rest parameters are clearer than `slice.call(arguments)`

The risk to readability is minimal because:
- The prototype-based architecture is unchanged
- The distribution factory pattern is unchanged (just cleaner syntax)
- No functions are renamed, moved, or restructured
