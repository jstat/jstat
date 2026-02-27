# Phase 1 Research: Test Infrastructure Migration

Research document for migrating from Vows.js to Node.js built-in test runner.

---

## Table of Contents

1. [Environment](#1-environment)
2. [Current Test Suite Inventory](#2-current-test-suite-inventory)
3. [Vows Patterns Used](#3-vows-patterns-used)
4. [Assertion Migration Map](#4-assertion-migration-map)
5. [node:test API Reference](#5-nodetest-api-reference)
6. [node:assert Gaps](#6-nodeassert-gaps)
7. [Migration Patterns](#7-migration-patterns)
8. [Known Bugs to Fix](#8-known-bugs-to-fix)
9. [File-by-File Inventory](#9-file-by-file-inventory)
10. [Implementation Considerations](#10-implementation-considerations)

---

## 1. Environment

- **Node.js version:** 22.14.0
- **`node:test` status at Node 22:** Stable (core, reporters, watch mode)
- **Glob support:** Built-in at Node 22 (`node --test "test/**/*-test.js"`)
- **Current test framework:** Vows 0.8.3 (last updated ~2014, unmaintained)
- **Current test command:** `./node_modules/vows/bin/vows --spec --isolate`
- **Current results:** 372 passing, 7 broken (all `geomean` float precision)
- **Note:** Vows `--isolate` mode is broken on Node 22 (all tests error).
  Without `--isolate`, tests run correctly. This is another reason to migrate.

---

## 2. Current Test Suite Inventory

### File Counts by Directory

| Directory | Files | Primary Assertion Style |
|-----------|------:|------------------------|
| `test/core/` | 26 | `deepEqual`, `isTrue`, callbacks |
| `test/vector/` | 34 | `deepEqual`, `epsilon`, callbacks |
| `test/distribution/` | 22 | `epsilon` (heavy) |
| `test/linearalgebra/` | 22 | `deepEqual`, `epsilon` |
| `test/special/` | 3 | `epsilon`, `equal` |
| `test/test/` | 4 | `epsilon`, `equal`, `isTrue` |
| `test/models/` | 3 | `epsilon` |
| `test/umd/` | 1 | `isFunction`, `equal` |
| **Total** | **115** | |

Of these, 114 follow the `*-test.js` naming convention. One file
(`test/test/anovafscore.js`) does not — it will need renaming or an explicit
glob to be discovered by `node --test`.

### Setup Files

- `test/env.js` — Sets `jStat` as a global: `jStat = require('../dist/jstat.js');`
- `test/template.js` — Boilerplate template (not imported by tests, just a
  copy-paste reference)
- `test/index.html` — Browser test runner (not relevant to Node migration)

---

## 3. Vows Patterns Used

### Pattern 1: Basic Topic → Assertions (most common)

```javascript
var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');
require('../env.js');

suite.addBatch({
    'description': {
        'topic': function() {
            return jStat;
        },
        'test name': function(jStat) {
            assert.equal(jStat.sum([1, 2, 3]), 6);
        },
        'another test': function(jStat) {
            assert.deepEqual(jStat.zeros(2, 2), [[0, 0], [0, 0]]);
        }
    }
});

suite.export(module);
```

The topic returns a value (usually `jStat` itself), which is passed as the
argument to every assertion function in that group. Multiple assertion functions
share one topic.

### Pattern 2: Callback/Async Topic

```javascript
suite.addBatch({
    '#cols': {
        'topic': function() {
            jStat([[1, 2], [3, 4]]).cols(this.callback);
        },
        'callback value': function(val, stat) {
            assert.equal(val, 2);
        },
        'stat is jStat instance': function(val, stat) {
            assert.isTrue(stat instanceof jStat);
        }
    }
});
```

Vows' `this.callback` is a special mechanism: when a topic calls
`this.callback(val)`, the assertion functions receive `(val, ...)` as their
arguments. Used for testing jStat's callback chaining API.

**Files using this pattern:** ~31 files across core and vector directories,
specifically for instance method callback tests.

### Pattern 3: Multiple Batches per File

```javascript
suite.addBatch({
    'static method': { ... }
});
suite.addBatch({
    'instance method': { ... }
});
suite.addBatch({
    'callback method': { ... }
});
```

Many files add 2-4 batches testing static, instance, and callback variants.

### Pattern 4: Nested Contexts (rare)

Some files nest one level deeper inside a batch for sub-grouping. This is
uncommon in jStat tests — most are flat.

---

## 4. Assertion Migration Map

### Usage Frequency

Counted across all 115 test files:

| Vows Assertion | Occurrences | Files |
|----------------|------------:|------:|
| `assert.epsilon(tol, actual, expected)` | 539 | 44 |
| `assert.deepEqual(actual, expected)` | 166 | 58 |
| `assert.equal(actual, expected)` | 133 | 40 |
| `assert.isTrue(value)` | 49 | 17 |
| `assert.isFalse(value)` | 35 | 2 |
| `assert.isFunction(value)` | 4 | 1 |
| `assert.ok(value)` | 2 | 1 |
| `assert.isNaN(value)` | 21 | 1 |

### Migration Mapping

| Vows | node:assert/strict | Notes |
|------|-------------------|-------|
| `assert.equal(a, b)` | `assert.strictEqual(a, b)` | |
| `assert.deepEqual(a, b)` | `assert.deepStrictEqual(a, b)` | |
| `assert.isTrue(x)` | `assert.strictEqual(x, true)` | |
| `assert.isFalse(x)` | `assert.strictEqual(x, false)` | |
| `assert.isFunction(x)` | `assert.strictEqual(typeof x, 'function')` | |
| `assert.ok(x)` | `assert.ok(x)` | Same |
| `assert.isNaN(x)` | `assert.ok(Number.isNaN(x))` | Vows checks `actual !== actual` |
| `assert.epsilon(t, a, e)` | **Custom helper needed** | See below |

### The `assert.epsilon` Problem

`node:assert` has **no** approximate equality assertion. There is no
`closeTo`, `approximately`, or `epsilon` method. A feature request
(nodejs/node#14686) was never implemented.

Vows' implementation:
```javascript
assert.epsilon = function(eps, actual, expected) {
    if (isNaN(actual) || Math.abs(actual - expected) > eps) {
        assert.fail(actual, expected, ...);
    }
};
```

We need a custom helper that preserves the same `(eps, actual, expected)`
signature so migration is mechanical.

---

## 5. node:test API Reference

### Core API

```javascript
const { describe, it, before, after, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

describe('group', () => {
    before(() => { /* once before all */ });
    after(() => { /* once after all */ });

    it('test name', () => {
        assert.strictEqual(1 + 1, 2);
    });

    it('async test', (t, done) => {
        someCallback((result) => {
            assert.strictEqual(result, 42);
            done();
        });
    });
});
```

### Running Tests

```bash
# Auto-discover (matches *-test.js, *.test.js, test-*, etc.)
node --test

# Explicit glob
node --test "test/**/*-test.js"

# Spec reporter (default in Node 22)
node --test --test-reporter=spec

# Filter by name
node --test --test-name-pattern="normal pdf"
```

### Key Characteristics

- Each test file runs in a **separate child process** by default (isolation).
- `describe`/`it` nesting works like Mocha/Jest.
- Hooks: `before`, `after`, `beforeEach`, `afterEach` scoped to `describe`.
- `it.skip()`, `it.todo()`, `describe.skip()` available.
- No globals needed — everything imported from `node:test`.

### Default File Discovery

When running bare `node --test`, it discovers files matching:
- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

The current `*-test.js` naming convention **already matches** the default
pattern. No file renaming needed.

**However:** bare `node --test` will also pick up files that should NOT run:
- `test/env.js` — matches `**/test/**/*.js`
- `test/template.js` — matches `**/test/**/*.js`
- `src/test.js` — matches `**/test.js`

All three will error or produce unexpected results if discovered. An explicit
glob is mandatory: `node --test "test/**/*-test.js"`.

---

## 6. node:assert Gaps

What `node:assert` does NOT provide that we need:

| Need | Solution |
|------|----------|
| Approximate float equality | Custom `assertEpsilon(eps, actual, expected)` |
| Approximate array equality | Custom `assertArrayEpsilon(eps, actual, expected)` |
| `isTrue`/`isFalse` | `assert.strictEqual(x, true/false)` |
| `isFunction` | `assert.strictEqual(typeof x, 'function')` |

All gaps are small. The only one requiring real work is `assertEpsilon`.

---

## 7. Migration Patterns

### Pattern 1: Basic Topic → describe/it

**Before (Vows):**
```javascript
suite.addBatch({
    'sum': {
        'topic': function() { return jStat; },
        'basic sum': function(jStat) {
            assert.equal(jStat.sum([1, 2, 3]), 6);
        },
        'sum of single': function(jStat) {
            assert.equal(jStat.sum([5]), 5);
        }
    }
});
```

**After (node:test):**
```javascript
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');

describe('sum', () => {
    it('basic sum', () => {
        assert.strictEqual(jStat.sum([1, 2, 3]), 6);
    });
    it('sum of single', () => {
        assert.strictEqual(jStat.sum([5]), 5);
    });
});
```

### Pattern 2: Callback Topic → it with done callback

**Before (Vows):**
```javascript
suite.addBatch({
    '#cols': {
        'topic': function() {
            jStat([[1, 2], [3, 4]]).cols(this.callback);
        },
        'returns column count': function(val) {
            assert.equal(val, 2);
        }
    }
});
```

**After (node:test):**
```javascript
describe('#cols callback', () => {
    it('returns column count', (t, done) => {
        jStat([[1, 2], [3, 4]]).cols(function(val) {
            assert.strictEqual(val, 2);
            done();
        });
    });
});
```

**Note:** jStat's callback mechanism uses `setTimeout` internally, so
`done`-style async tests are needed. However, since `setTimeout` is called
with delay 0, these are effectively synchronous. An alternative is wrapping in
a Promise:

```javascript
it('returns column count', async () => {
    const val = await new Promise(resolve => {
        jStat([[1, 2], [3, 4]]).cols(resolve);
    });
    assert.strictEqual(val, 2);
});
```

### Pattern 3: epsilon Assertions

**Before (Vows):**
```javascript
assert.epsilon(tol, jStat.normal.pdf(0, 0, 1), 0.3989423);
```

**After (node:test):**
```javascript
assertEpsilon(tol, jStat.normal.pdf(0, 0, 1), 0.3989423);
```

Same function signature — migration is a find-and-replace of `assert.epsilon`
→ `assertEpsilon` after importing the helper.

### Pattern 4: isTrue/isFalse

**Before:**
```javascript
assert.isTrue(jStat.symmetric(matrix));
assert.isFalse(jStat.utils.isNumber('abc'));
```

**After:**
```javascript
assert.strictEqual(jStat.symmetric(matrix), true);
assert.strictEqual(jStat.utils.isNumber('abc'), false);
```

---

## 8. Known Bugs to Fix

### 8.1 Broken `geomean` Tests (7 failures)

**Root cause:** Floating-point accumulation in `Math.exp(mean(arr.map(Math.log)))`.

**Failing tests in `test/vector/geomean-test.js`:**
1. `return basic geomean` — expected 1.8171205928321397, got 1.8171205928321394
2. `geomean from instance` — same diff
3. `geomean matrix cols` — last digit diff in second element
4. `geomean full matrix` — last digit diff
5-7. Callback variants of 1-4

**Fix approach:** The tests use `assert.equal` and `assert.deepEqual` (strict
equality) for floating-point results. These should use `assertEpsilon` /
`assertArrayEpsilon` with a tolerance. The algorithm itself is mathematically
correct — it's just float accumulation at the ULP level. The old tests were
written before the algorithm was changed in commit a869c76.

**Action:** Migrate these tests to use `assertEpsilon` with a tolerance of
~1e-14 (near machine epsilon). This is not masking a bug — it's fixing
incorrect assertions that demand bit-exact equality of floating-point results.

### 8.2 `anovaftes` Typo

The instance/prototype method `jStat.fn.anovaftes()` (line 185 of
`src/test.js`) is missing the trailing 't'. The static method
`jStat.anovaftest()` (line 159) is spelled correctly. This is a published API
so we must keep the typo for backwards compat. When writing new tests, test
both the typo name and optionally add `anovaftest` as an alias on the prototype
if we want to fix it going forward.

---

## 9. File-by-File Inventory

**Note:** The assertion types and callback flags in these tables are
approximate indicators of the primary patterns used. Some files use additional
assertion types not listed. During migration, each file should be read to
confirm its exact assertions.

### 9.1 Core Tests (26 files)

| File | Methods Tested | Assertions Used | Has Callbacks |
|------|---------------|-----------------|:---:|
| `jstat-test.js` | constructor, factory | isFunction, deepEqual, isTrue, equal | no |
| `alter-test.js` | alter (static+instance) | deepEqual | no |
| `antidiag-test.js` | antidiag (static+instance) | deepEqual | yes |
| `arange-test.js` | arange | epsilon | no |
| `clear-test.js` | clear (static+instance) | deepEqual, isTrue | no |
| `col-test.js` | col (static+instance) | deepEqual | yes |
| `cols-test.js` | cols (static+instance) | equal | yes |
| `copy-test.js` | copy | equal | no |
| `create-test.js` | create | deepEqual, isTrue | no |
| `diagonal-test.js` | diagonal | epsilon | no |
| `diag-test.js` | diag (static+instance) | deepEqual | yes |
| `dimensions-test.js` | dimensions (static+instance) | deepEqual | yes |
| `extend-test.js` | extend | deepEqual | no |
| `identity-test.js` | identity | deepEqual, isTrue | no |
| `map-test.js` | map (static+instance) | deepEqual | no |
| `ones-test.js` | ones | deepEqual, isTrue | no |
| `rand-test.js` | rand | isTrue | no |
| `row-test.js` | row (static+instance) | deepEqual | yes |
| `rows-test.js` | rows (static+instance) | equal | yes |
| `seq-test.js` | seq | deepEqual | no |
| `slice-test.js` | slice | epsilon | no |
| `sliceAssign-test.js` | sliceAssign | deepEqual | no |
| `symmetric-test.js` | symmetric | isTrue, isFalse | no |
| `transpose-test.js` | transpose (static+instance) | deepEqual | yes |
| `utils-test.js` | calcRdx, isArray, isFunction, isNumber | isTrue, isFalse, equal | no |
| `zeros-test.js` | zeros | deepEqual, isTrue | no |

### 9.2 Vector Tests (34 files)

| File | Methods Tested | Assertions Used | Has Callbacks |
|------|---------------|-----------------|:---:|
| `coeffvar-test.js` | coeffvar | epsilon | yes |
| `corrcoeff-test.js` | corrcoeff | epsilon | no |
| `covariance-test.js` | covariance | epsilon | no |
| `cumsum-test.js` | cumsum | deepEqual | yes |
| `cumprod-test.js` | cumprod | deepEqual | yes |
| `deviation-test.js` | deviation | deepEqual | no |
| `diff-test.js` | diff | deepEqual | no |
| `geomean-test.js` | geomean | equal (**BROKEN**) | yes |
| `histogram-test.js` | histogram | deepEqual | no |
| `kurtosis-test.js` | kurtosis | epsilon | no |
| `max-test.js` | max | equal | yes |
| `mean-test.js` | mean | equal | yes |
| `meandev-test.js` | meandev | epsilon | no |
| `meansqerr-test.js` | meansqerr | epsilon | no |
| `meddev-test.js` | meddev | epsilon | no |
| `median-test.js` | median | equal, epsilon | yes |
| `min-test.js` | min | equal | yes |
| `mode-test.js` | mode | deepEqual, equal | no |
| `percentile-test.js` | percentile | epsilon | no |
| `percentile-of-score-test.js` | percentileOfScore | epsilon | no |
| `product-test.js` | product | equal | yes |
| `quantiles-test.js` | quantiles | epsilon | no |
| `quartiles-test.js` | quartiles | deepEqual | no |
| `range-test.js` | range | equal | yes |
| `rank-test.js` | rank | deepEqual | no |
| `skewness-test.js` | skewness | epsilon | no |
| `spearman-test.js` | spearmancoeff | epsilon | no |
| `stdev-test.js` | stdev | epsilon | yes |
| `sum-test.js` | sum | equal | yes |
| `sumrow-test.js` | sumrow | deepEqual | no |
| `sumsqerr-test.js` | sumsqerr | epsilon | yes |
| `sumsqrd-test.js` | sumsqrd | equal | yes |
| `unique-test.js` | unique | deepEqual | no |
| `variance-test.js` | variance | epsilon | yes |

### 9.3 Distribution Tests (22 files)

All follow the same pattern: topic returns `jStat`, assertions primarily use
`epsilon` with pre-computed reference values (typically from R or Wolfram
Alpha). Several files also use `equal`, `ok`, `isTrue`, and `isNaN` for
boundary cases (e.g. `binomial-test.js`, `triangular-test.js`,
`kumaraswamy-test.js`).

| File | Distribution | Methods Tested |
|------|-------------|---------------|
| `arcsine-test.js` | arcsine | pdf, cdf, inv, mean, median, mode, variance |
| `beta-test.js` | beta | pdf, cdf, inv, mean, median, mode, variance |
| `binomial-test.js` | binomial | pdf, cdf |
| `cauchy-test.js` | cauchy | pdf, cdf, inv, median, mode |
| `central-f-test.js` | centralF | pdf, cdf, inv, mean, mode, variance |
| `chisquare-test.js` | chisquare | pdf, cdf, inv, mean, median, mode, variance |
| `gamma-test.js` | gamma | pdf, cdf, inv, mean, mode, variance |
| `hypergeometric-test.js` | hypgeom | pdf, cdf |
| `inverse-gamma-test.js` | invgamma | pdf, cdf, inv, mean, mode, variance |
| `kumaraswamy-test.js` | kumaraswamy | pdf, cdf, inv, mean, median, mode, variance |
| `laplace-test.js` | laplace | pdf, cdf, mean, median, mode, variance |
| `lognormal-test.js` | lognormal | pdf, cdf, inv, mean, median, mode, variance |
| `neg-bin-test.js` | negbin | pdf, cdf |
| `noncentralt-test.js` | noncentralt | pdf, cdf |
| `normal-test.js` | normal | pdf, cdf, inv, mean, median, mode, variance |
| `pareto-test.js` | pareto | pdf, cdf, inv, mean, median, mode, variance |
| `poisson-test.js` | poisson | pdf, cdf, mean, variance |
| `student-t-test.js` | studentt | pdf, cdf, inv, mean, median, mode, variance |
| `triangular-test.js` | triangular | pdf, cdf, inv, mean, median, mode, variance |
| `tukey-test.js` | tukey | cdf, inv |
| `uniform-test.js` | uniform | pdf, cdf, inv, mean, median, mode, variance |
| `weibull-test.js` | weibull | pdf, cdf, inv, mean, median, mode, variance |

### 9.4 Linear Algebra Tests (22 files)

| File | Methods Tested | Assertions Used |
|------|---------------|-----------------|
| `abs-test.js` | abs | deepEqual |
| `add-test.js` | add | deepEqual |
| `angle-test.js` | angle | epsilon |
| `aug-test.js` | aug | deepEqual |
| `cholesky-test.js` | cholesky | epsilon |
| `det-test.js` | det | equal |
| `divide-test.js` | divide | deepEqual |
| `dot-test.js` | dot | equal |
| `exp-test.js` | exp | deepEqual |
| `gauss-test.js` | gauss_elimination | epsilon |
| `inv-test.js` | inv | deepEqual |
| `log-test.js` | log | deepEqual |
| `lstsq-test.js` | lstsq | epsilon |
| `lu-test.js` | lu | epsilon |
| `multiply-test.js` | multiply | deepEqual |
| `norm-test.js` | norm | equal |
| `outer-test.js` | outer | epsilon |
| `pow-test.js` | pow | deepEqual |
| `qr-test.js` | QR | epsilon |
| `subtract-test.js` | subtract | deepEqual |
| `triaLowSolve-test.js` | triaLowSolve | epsilon |
| `triaUpSolve-test.js` | triaUpSolve | epsilon |

### 9.5 Special Function Tests (3 files)

| File | Methods Tested | Assertions Used |
|------|---------------|-----------------|
| `gammafn-test.js` | gammafn | epsilon, equal |
| `gammap-test.js` | gammap | epsilon |
| `lowRegGamma-test.js` | lowRegGamma | epsilon |

### 9.6 Statistical Test Tests (4 files)

| File | Methods Tested | Assertions Used |
|------|---------------|-----------------|
| `anovafscore.js` | anovafscore | equal |
| `differenceOfProportions-test.js` | oneSidedDifferenceOfProportions, twoSidedDifferenceOfProportions | isTrue |
| `qtest-test.js` | qtest, qscore, tukeyhsd, pooledstdev | epsilon |
| `ztest-test.js` | ztest, zscore | equal |

### 9.7 Models Tests (3 files)

| File | Methods Tested | Assertions Used |
|------|---------------|-----------------|
| `R2-test.js` | models.ols (R2, adjust_R2, t, f) | epsilon |
| `simple-regression-test.js` | models.ols | epsilon |
| `thousand-size-test.js` | models.ols (large data) | epsilon |

### 9.8 UMD Test (1 file)

| File | What It Tests | Assertions Used |
|------|--------------|-----------------|
| `commonjs-test.js` | CJS export, jStat.jStat alias, key methods exist | isFunction, equal |

---

## 10. Implementation Considerations

### 10.1 File Discovery Collision

`node --test` with default discovery will pick up files that are NOT tests:
- `test/env.js` and `test/template.js` — match `**/test/**/*.js`
- `src/test.js` — matches `**/test.js` (this is the statistical tests source
  file, not a test runner file)

**Option A (renaming)** does NOT solve this — `_env.js` still matches
`**/test/**/*.js`, and `src/test.js` would still be picked up.

**Solution:** Use an explicit glob: `node --test "test/**/*-test.js"`. This is
the only reliable approach. It also means `test/test/anovafscore.js` must be
renamed to `anovafscore-test.js` to be discovered.

### 10.2 Module System for Test Files

Tests should stay CommonJS (`require`) since:
- `dist/jstat.js` uses `module.exports` (CommonJS)
- No `"type": "module"` in package.json
- Simpler migration — change test structure, not module system
- ESM migration happens in Phase 2 with the build system

### 10.3 Test Helper File

Create `test/helpers.js` providing:

```javascript
const assert = require('node:assert/strict');
const jStat = require('../dist/jstat.js');

function assertEpsilon(eps, actual, expected, message) {
    if (Number.isNaN(actual)) {
        assert.fail(
            message || `expected ${expected} ± ${eps}, but got NaN`
        );
    }
    const diff = Math.abs(actual - expected);
    if (diff > eps) {
        assert.fail(
            message || `expected ${expected} ± ${eps}, got ${actual} (diff: ${diff})`
        );
    }
}

function assertArrayEpsilon(eps, actual, expected, message) {
    assert.strictEqual(actual.length, expected.length,
        `array length mismatch: got ${actual.length}, expected ${expected.length}`);
    for (let i = 0; i < expected.length; i++) {
        assertEpsilon(eps, actual[i], expected[i],
            message || `[${i}]: expected ${expected[i]} ± ${eps}, got ${actual[i]}`);
    }
}

module.exports = { jStat, assertEpsilon, assertArrayEpsilon };
```

### 10.4 Callback Test Strategy

~31 test files test jStat's callback chaining. jStat callbacks use
`setTimeout(..., 0)` internally. Two approaches:

**Approach A: Promise wrapper (clean, no `done` callback)**
```javascript
it('mean callback', async () => {
    const val = await new Promise(resolve => {
        jStat([1, 2, 3]).mean(resolve);
    });
    assert.strictEqual(val, 2);
});
```

**Approach B: done callback**
```javascript
it('mean callback', (t, done) => {
    jStat([1, 2, 3]).mean((val) => {
        assert.strictEqual(val, 2);
        done();
    });
});
```

**Recommended:** Approach A. The Promise wrapper is more readable and avoids
the `done` callback pattern that's easy to misuse (forgetting to call `done`
on error paths).

**Caveat:** Some existing callback tests assert that `this` inside the
callback is a jStat instance (e.g. `col-test.js:28`, `row-test.js:28`). The
simple Promise wrapper with arrow function loses `this` context. For those
tests, use a regular function and capture `this`:

```javascript
it('callback this context', async () => {
    const ctx = await new Promise(function(resolve) {
        jStat([[1, 2], [3, 4]]).col(0, function() {
            resolve(this);
        });
    });
    assert.strictEqual(ctx instanceof jStat, true);
});
```

A helper could be added:

```javascript
function callbackToPromise(fn) {
    return new Promise((resolve) => { fn(resolve); });
}
```

### 10.5 Migration is Mechanical

The migration is almost entirely mechanical:

1. Replace boilerplate (require vows → require node:test + helpers)
2. Replace `suite.addBatch({ 'name': { 'topic': ..., 'test': ... }})` →
   `describe('name', () => { it('test', () => { ... }) })`
3. Replace `assert.equal` → `assert.strictEqual`
4. Replace `assert.deepEqual` → `assert.deepStrictEqual`
5. Replace `assert.epsilon` → `assertEpsilon`
6. Replace `assert.isTrue(x)` → `assert.strictEqual(x, true)`
7. Replace `assert.isFalse(x)` → `assert.strictEqual(x, false)`
8. Replace `assert.isFunction(x)` → `assert.strictEqual(typeof x, 'function')`
9. Replace `suite.export(module)` → remove
10. Wrap callback topics in Promise pattern

### 10.6 Test Execution

**package.json script:**
```json
{
    "scripts": {
        "test": "node --test \"test/**/*-test.js\""
    }
}
```

An explicit glob is required because bare `node --test` picks up files that
are NOT tests: `test/env.js`, `test/template.js`, and `src/test.js` (the
source file for statistical tests). The glob `test/**/*-test.js` catches all
114 `*-test.js` files across subdirectories.

**Note:** `test/test/anovafscore.js` does not match `*-test.js`. It must be
renamed to `test/test/anovafscore-test.js` during migration.

### 10.7 What Tests to Add

Beyond migrating existing tests, these gaps should be filled:

**Missing coverage (methods with no dedicated test file):**
- `jStat.pooledvariance` / `jStat.pooledstdev` (only tested incidentally in qtest)
- `jStat.PCA`
- `jStat.jacobi` (eigenvalues)
- `jStat.rungekutta`, `jStat.romberg`, `jStat.richardson`, `jStat.simpson`
- `jStat.hermite`, `jStat.lagrange`, `jStat.cubic_spline`
- `jStat.gauss_jacobi`, `jStat.gauss_seidel`, `jStat.SOR`
- `jStat.setRandom`
- Distribution `sample()` methods (basic sanity checks)
- Several instance methods for linearalgebra operations

**Edge case coverage to add everywhere:**
- Empty array `[]`
- Single element `[5]`
- `NaN` values in input
- `Infinity` / `-Infinity` in input
- Very large arrays (performance sanity)

### 10.8 Build Dependency

Tests currently require `dist/jstat.js` to exist (loaded via `env.js`). The
Makefile's `test` target runs `clean core` before tests. We need either:

- **Keep the build-before-test dependency:** `"test": "make core && node --test"`
- **Or test against source directly** (not possible until Phase 2 modularizes
  the source)

For Phase 1, keep building first. Use:
```json
{
    "scripts": {
        "build": "make core",
        "test": "npm run build && node --test"
    }
}
```

Or even simpler, since `make test` already does `clean core` first:
```json
{
    "scripts": {
        "build": "make core",
        "pretest": "npm run build",
        "test": "node --test"
    }
}
```

### 10.9 Removing Vows

After all tests are migrated and passing:
1. `npm uninstall vows`
2. Delete `test/env.js` and `test/template.js`
3. Update Makefile's `test` target if needed
