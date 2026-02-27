# Phase 1 Implementation Plan: Test Migration (Vows.js to node:test)

Step-by-step plan for migrating jStat's 115 test files from Vows.js 0.8.3 to
Node.js built-in test runner (`node:test`). Every step is mechanical -- no new
test coverage, no API changes, no source code refactoring.

**Environment:** Node.js 22.14.0, jStat 1.9.6 on the 1.x branch.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Migration Order](#2-migration-order)
3. [Mechanical Transformation Reference](#3-mechanical-transformation-reference)
4. [Assertion Mapping Table](#4-assertion-mapping-table)
5. [Callback Pattern Migration](#5-callback-pattern-migration)
6. [Batch-by-Batch Migration Steps](#6-batch-by-batch-migration-steps)
7. [Validation Strategy](#7-validation-strategy)
8. [Known Issues](#8-known-issues)
9. [Completion Criteria](#9-completion-criteria)

---

## 1. Prerequisites

Complete all of these before migrating any test file.

### 1.1 Create `test/helpers.js`

This file replaces `test/env.js`. It provides the jStat instance and the custom
`assertEpsilon` helper that `node:assert` lacks.

```javascript
var assert = require('node:assert/strict');
var jStat = require('../dist/jstat.js');

function assertEpsilon(eps, actual, expected, message) {
    if (Number.isNaN(actual)) {
        assert.fail(
            message || 'expected ' + expected + ' \u00b1 ' + eps + ', but got NaN'
        );
    }
    var diff = Math.abs(actual - expected);
    if (diff > eps) {
        assert.fail(
            message || 'expected ' + expected + ' \u00b1 ' + eps +
            ', got ' + actual + ' (diff: ' + diff + ')'
        );
    }
}

function assertArrayEpsilon(eps, actual, expected, message) {
    assert.strictEqual(actual.length, expected.length,
        'array length mismatch: got ' + actual.length +
        ', expected ' + expected.length);
    for (var i = 0; i < expected.length; i++) {
        assertEpsilon(eps, actual[i], expected[i],
            (message || '') + '[' + i + ']: expected ' + expected[i] +
            ' \u00b1 ' + eps + ', got ' + actual[i]);
    }
}

module.exports = { jStat: jStat, assertEpsilon: assertEpsilon, assertArrayEpsilon: assertArrayEpsilon };
```

Notes:
- Uses `var` and concatenation (no ES6) to match the project's current style.
- Preserves the exact `(eps, actual, expected)` argument order from Vows'
  `assert.epsilon` so migration is a simple rename.
- `assertArrayEpsilon` is available for the geomean fix (Section 8.1) and any
  future use, but is not needed for most migrations.
- jStat is exported as a named property so tests use
  `var jStat = require('../helpers.js').jStat;` or destructure as needed.

### 1.2 Rename `test/test/anovafscore.js`

```bash
git mv test/test/anovafscore.js test/test/anovafscore-test.js
```

This file is the only one of 115 that does not match the `*-test.js` glob
pattern. Without renaming, `node --test "test/**/*-test.js"` will not discover
it.

### 1.3 Update `package.json` scripts

Replace the Vows test command with node:test using an explicit glob:

```json
{
    "scripts": {
        "test": "make clean core && node --test \"test/**/*-test.js\""
    }
}
```

Why an explicit glob:
- Bare `node --test` discovers `test/env.js` and `test/template.js` (via
  `**/test/**/*.js` pattern) and `src/test.js` (via `**/test.js` pattern).
- All three would error or produce incorrect results.
- The glob `test/**/*-test.js` matches exactly the 115 test files and nothing
  else.

The build step (`make clean core`) is kept because tests load `dist/jstat.js`.

### 1.4 Update Makefile test target

Update the `test` target in the Makefile to use node:test as well, so `make
test` stays consistent:

```makefile
test: clean core
	@echo 'Running jStat unit tests'
	@node --test "test/**/*-test.js"
```

### 1.5 Verify prerequisites work

Before starting migration, confirm the infrastructure works by migrating one
trivial file (the simplest: `test/core/alter-test.js`). Run it in isolation:

```bash
make clean core
node --test test/core/alter-test.js
```

If this passes, the helpers file, glob, and build chain are all working. Then
proceed with the ordered migration.

---

## 2. Migration Order

Migrate in this order, from simplest patterns to most complex. Each batch
builds confidence before tackling harder files.

| Batch | Directory | Files | Rationale |
|------:|-----------|------:|-----------|
| 1 | `test/core/` (no-callback files) | 18 | Simplest pattern: topic returns jStat, assertions are deepEqual/equal/isTrue/isFalse. No async. |
| 2 | `test/core/` (callback files) | 8 | Same directory but adds the this.callback pattern. |
| 3 | `test/vector/` (no-callback files) | 11 | Introduces epsilon assertions. Still synchronous. |
| 4 | `test/vector/` (callback files) | 23 | Combines epsilon + callback patterns. |
| 5 | `test/distribution/` | 22 | All epsilon-heavy, no callbacks. Uniform pattern. |
| 6 | `test/linearalgebra/` | 22 | Mix of deepEqual and epsilon. No callbacks. |
| 7 | `test/special/` | 3 | Small batch, epsilon + equal. |
| 8 | `test/models/` | 3 | Small batch, epsilon only. |
| 9 | `test/test/` | 4 | Includes the renamed anovafscore-test.js. Mix of assertions. |
| 10 | `test/umd/` | 1 | Special case: loads jStat directly (not via helpers). |

### Batch 1 -- Core (no callbacks, 18 files)

```
test/core/alter-test.js         deepEqual
test/core/arange-test.js        epsilon
test/core/clear-test.js         deepEqual, isTrue
test/core/copy-test.js          equal
test/core/create-test.js        deepEqual, isTrue
test/core/diagonal-test.js      epsilon
test/core/extend-test.js        deepEqual
test/core/identity-test.js      deepEqual, isTrue
test/core/jstat-test.js         isFunction, deepEqual, isTrue, equal
test/core/map-test.js           deepEqual
test/core/ones-test.js          deepEqual, isTrue
test/core/rand-test.js          isTrue
test/core/seq-test.js           deepEqual
test/core/sliceAssign-test.js   deepEqual
test/core/slice-test.js         epsilon
test/core/symmetric-test.js     isTrue, isFalse
test/core/utils-test.js         isTrue, isFalse, equal
test/core/zeros-test.js         deepEqual, isTrue
```

### Batch 2 -- Core (with callbacks, 8 files)

```
test/core/antidiag-test.js      deepEqual + callback
test/core/col-test.js           deepEqual + callback + this-context check
test/core/cols-test.js          equal + callback
test/core/diag-test.js          deepEqual + callback
test/core/dimensions-test.js    deepEqual + callback
test/core/row-test.js           deepEqual + callback + this-context check
test/core/rows-test.js          equal + callback + isTrue
test/core/transpose-test.js     deepEqual + callback
```

Note: `col-test.js` and `row-test.js` have `assert.isTrue(this instanceof
jStat)` inside callback tests. These require the special this-context handling
described in Section 5.2.

### Batch 3 -- Vector (no callbacks, 11 files)

```
test/vector/corrcoeff-test.js       epsilon
test/vector/covariance-test.js      epsilon
test/vector/deviation-test.js       deepEqual
test/vector/histogram-test.js       deepEqual
test/vector/kurtosis-test.js        epsilon
test/vector/percentile-test.js      epsilon
test/vector/percentile-of-score-test.js  epsilon
test/vector/rank-test.js            deepEqual
test/vector/skewness-test.js        epsilon
test/vector/spearman-test.js        epsilon
test/vector/unique-test.js          deepEqual
```

### Batch 4 -- Vector (with callbacks, 23 files)

```
test/vector/coeffvar-test.js    epsilon + callback
test/vector/cumsum-test.js      deepEqual + callback
test/vector/cumprod-test.js     deepEqual + callback
test/vector/diff-test.js        deepEqual + callback
test/vector/geomean-test.js     equal + callback (BROKEN -- see Section 8.1)
test/vector/max-test.js         equal + callback
test/vector/mean-test.js        equal + callback
test/vector/meandev-test.js     epsilon + callback
test/vector/meansqerr-test.js   epsilon + callback
test/vector/meddev-test.js      epsilon + callback
test/vector/median-test.js      equal, epsilon + callback
test/vector/min-test.js         equal + callback
test/vector/mode-test.js        deepEqual, equal + callback
test/vector/product-test.js     equal + callback
test/vector/quantiles-test.js   epsilon + callback
test/vector/quartiles-test.js   deepEqual + callback
test/vector/range-test.js       equal + callback
test/vector/stdev-test.js       epsilon + callback
test/vector/sum-test.js         equal, deepEqual + callback
test/vector/sumrow-test.js      deepEqual + callback
test/vector/sumsqerr-test.js    epsilon + callback
test/vector/sumsqrd-test.js     equal + callback
test/vector/variance-test.js    epsilon + callback
```

### Batch 5 -- Distribution (22 files)

All follow the same pattern: topic returns jStat, assertions are epsilon with
pre-computed reference values from R or Wolfram Alpha. A few files also use
`equal`, `ok`, or `isNaN` for boundary cases.

```
test/distribution/arcsine-test.js
test/distribution/beta-test.js
test/distribution/binomial-test.js
test/distribution/cauchy-test.js
test/distribution/central-f-test.js
test/distribution/chisquare-test.js
test/distribution/gamma-test.js
test/distribution/hypergeometric-test.js
test/distribution/inverse-gamma-test.js
test/distribution/kumaraswamy-test.js
test/distribution/laplace-test.js
test/distribution/lognormal-test.js
test/distribution/neg-bin-test.js
test/distribution/noncentralt-test.js
test/distribution/normal-test.js
test/distribution/pareto-test.js
test/distribution/poisson-test.js
test/distribution/student-t-test.js
test/distribution/triangular-test.js
test/distribution/tukey-test.js
test/distribution/uniform-test.js
test/distribution/weibull-test.js
```

### Batch 6 -- Linear Algebra (22 files)

```
test/linearalgebra/abs-test.js          deepEqual
test/linearalgebra/add-test.js          deepEqual
test/linearalgebra/angle-test.js        epsilon
test/linearalgebra/aug-test.js          deepEqual
test/linearalgebra/cholesky-test.js     epsilon
test/linearalgebra/det-test.js          equal
test/linearalgebra/divide-test.js       deepEqual
test/linearalgebra/dot-test.js          equal
test/linearalgebra/exp-test.js          deepEqual
test/linearalgebra/gauss-test.js        epsilon
test/linearalgebra/inv-test.js          deepEqual
test/linearalgebra/log-test.js          deepEqual
test/linearalgebra/lstsq-test.js        epsilon
test/linearalgebra/lu-test.js           epsilon
test/linearalgebra/multiply-test.js     deepEqual
test/linearalgebra/norm-test.js         equal
test/linearalgebra/outer-test.js        epsilon
test/linearalgebra/pow-test.js          deepEqual
test/linearalgebra/qr-test.js           epsilon
test/linearalgebra/subtract-test.js     deepEqual
test/linearalgebra/triaLowSolve-test.js epsilon
test/linearalgebra/triaUpSolve-test.js  epsilon
```

### Batch 7 -- Special (3 files)

```
test/special/gammafn-test.js        epsilon, equal
test/special/gammap-test.js         epsilon
test/special/lowRegGamma-test.js    epsilon
```

### Batch 8 -- Models (3 files)

```
test/models/R2-test.js                  epsilon
test/models/simple-regression-test.js   epsilon
test/models/thousand-size-test.js       epsilon
```

### Batch 9 -- Statistical Tests (4 files)

```
test/test/anovafscore-test.js                   equal (renamed from anovafscore.js)
test/test/differenceOfProportions-test.js       isTrue
test/test/qtest-test.js                         epsilon, deepEqual
test/test/ztest-test.js                         equal
```

### Batch 10 -- UMD (1 file)

```
test/umd/commonjs-test.js      equal (does NOT use helpers -- loads jStat directly)
```

---

## 3. Mechanical Transformation Reference

Every test file follows this transformation pattern. The steps are always the
same; only the assertion types and callback handling vary.

### 3.1 Header Replacement

**Before (every Vows file):**
```javascript
var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.whatever');

require('../env.js');
```

**After (every node:test file):**
```javascript
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');
```

For files that also use epsilon:
```javascript
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');
```

### 3.2 Footer Removal

**Before:**
```javascript
suite.export(module);
```

**After:** Delete the line entirely. `node:test` discovers and runs the file
automatically.

### 3.3 Basic Batch Transformation (Pattern 1: Topic returns jStat)

This is the most common pattern. The topic function returns `jStat` and passes
it to each test function. Since jStat is now imported directly, the topic
wrapper is eliminated entirely.

**Before (Vows):**
```javascript
suite.addBatch({
  'symmetric': {
    'topic': function() {
      return jStat;
    },
    'return symmetric': function(jStat) {
      assert.isTrue(jStat.symmetric([[1, 2], [2, 1]]));
      assert.isFalse(jStat.symmetric([[1, 2], [1, 2]]));
    },
    'symmetric from jStat object': function(jStat) {
      assert.isTrue(jStat([[1, 2], [2, 1]]).symmetric());
      assert.isFalse(jStat([[1, 2], [1, 2]]).symmetric());
    }
  }
});
```

**After (node:test):**
```javascript
describe('symmetric', function() {
    it('return symmetric', function() {
        assert.strictEqual(jStat.symmetric([[1, 2], [2, 1]]), true);
        assert.strictEqual(jStat.symmetric([[1, 2], [1, 2]]), false);
    });
    it('symmetric from jStat object', function() {
        assert.strictEqual(jStat([[1, 2], [2, 1]]).symmetric(), true);
        assert.strictEqual(jStat([[1, 2], [1, 2]]).symmetric(), false);
    });
});
```

Rules:
- `suite.addBatch({ 'name': { ... }})` becomes `describe('name', function() { ... })`.
- `'topic': function() { return jStat; },` is deleted.
- Each `'test name': function(jStat) { ... }` becomes `it('test name', function() { ... })`.
- The `jStat` parameter is removed (it is now a module-level variable).

### 3.4 Multiple Batches

Files with multiple `suite.addBatch(...)` calls become multiple `describe()`
blocks at the top level.

**Before:**
```javascript
suite.addBatch({
  'sum': {
    'topic': function() { return jStat; },
    'return basic sum': function(jStat) { ... }
  }
});
suite.addBatch({
  '#sum vector': {
    'topic': function() { jStat([1, 2, 3]).sum(this.callback); },
    'sum callback': function(val, stat) { ... }
  }
});
```

**After:**
```javascript
describe('sum', function() {
    it('return basic sum', function() { ... });
});
describe('#sum vector', function() {
    it('sum callback', function() { ... });   // see Section 5 for callback handling
});
```

### 3.5 Epsilon Assertions

**Before:**
```javascript
var tol = 0.000001;
assert.epsilon(tol, jStat.normal.pdf(0, 0, 1.0), 0.3989423);
```

**After:**
```javascript
var tol = 0.000001;
assertEpsilon(tol, jStat.normal.pdf(0, 0, 1.0), 0.3989423);
```

This is a straight rename: `assert.epsilon` becomes `assertEpsilon`. The
argument order `(tolerance, actual, expected)` is identical.

### 3.6 Use `function` Keywords, Not Arrow Functions

All migrated tests should use `function` keywords, not arrow functions. The
current codebase uses pre-ES6 patterns and arrow functions are a Phase 3 change.

```javascript
// Correct for Phase 1:
describe('foo', function() {
    it('bar', function() { ... });
});

// NOT this (Phase 3):
describe('foo', () => {
    it('bar', () => { ... });
});
```

---

## 4. Assertion Mapping Table

Complete mapping of every Vows assertion used in jStat's test suite to its
`node:assert/strict` equivalent.

| # | Vows Assertion | node:assert/strict Equivalent | Occurrences | Notes |
|--:|----------------|------------------------------|------------:|-------|
| 1 | `assert.epsilon(tol, actual, expected)` | `assertEpsilon(tol, actual, expected)` | 539 | Custom helper from `helpers.js` |
| 2 | `assert.deepEqual(actual, expected)` | `assert.deepStrictEqual(actual, expected)` | 166 | |
| 3 | `assert.equal(actual, expected)` | `assert.strictEqual(actual, expected)` | 133 | Vows `equal` uses `==`, but jStat tests always compare same types |
| 4 | `assert.isTrue(value)` | `assert.strictEqual(value, true)` | 49 | |
| 5 | `assert.isFalse(value)` | `assert.strictEqual(value, false)` | 35 | |
| 6 | `assert.isFunction(value)` | `assert.strictEqual(typeof value, 'function')` | 4 | Only in `jstat-test.js` (4 occurrences) |
| 7 | `assert.ok(value)` | `assert.ok(value)` | 2 | Same API, no change needed |
| 8 | `assert.isNaN(value)` | `assert.ok(Number.isNaN(value))` | 21 | All 21 occurrences in `test/distribution/triangular-test.js` |

### Notes on `assert.equal` vs `assert.strictEqual`

Vows' `assert.equal` uses JavaScript's `==` (loose equality). Node's
`assert.strictEqual` uses `===`. In jStat's test suite, all `assert.equal`
comparisons are between values of the same type (number-to-number,
string-to-string), so switching to `strictEqual` is safe and correct.

### Notes on `assert.deepEqual` vs `assert.deepStrictEqual`

Vows' `assert.deepEqual` uses the standard Node `assert.deepEqual` which
performs structural comparison. Under `node:assert/strict`, `deepEqual` is
already `deepStrictEqual`. Using `assert.deepStrictEqual` explicitly makes the
intent clear and avoids any ambiguity.

---

## 5. Callback Pattern Migration

### 5.1 Background

~31 test files use Vows' `this.callback` mechanism to test jStat's callback
chaining API. In Vows, when a topic calls `this.callback(val)`, the framework
captures the arguments and passes them to the assertion functions as parameters.

jStat's callback mechanism uses `setTimeout(..., 0)` internally, making these
effectively asynchronous (though they resolve in the same event loop tick).

### 5.2 Standard Callback Transformation

The recommended approach wraps the callback in a Promise. This avoids the
`done` callback pattern and is more readable.

**Before (Vows):**
```javascript
suite.addBatch({
  '#sum vector': {
    'topic': function() {
      jStat([1, 2, 3]).sum(this.callback);
    },
    'sum callback': function(val, stat) {
      assert.equal(val, 6);
    }
  },
  '#sum matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).sum(this.callback);
    },
    'sum matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [4, 6]);
    }
  },
  '#sum full matrix': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).sum(true, this.callback);
    },
    'sum full matrix callback': function(val, stat) {
      assert.equal(val, 10);
    }
  }
});
```

**After (node:test):**
```javascript
describe('#sum vector', function() {
    it('sum callback', function(t, done) {
        jStat([1, 2, 3]).sum(function(val) {
            assert.strictEqual(val, 6);
            done();
        });
    });
});
describe('#sum matrix cols', function() {
    it('sum matrix cols callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).sum(function(val) {
            assert.deepStrictEqual(val, [4, 6]);
            done();
        });
    });
});
describe('#sum full matrix', function() {
    it('sum full matrix callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).sum(true, function(val) {
            assert.strictEqual(val, 10);
            done();
        });
    });
});
```

Rules:
- The Vows topic + separate assertion function collapse into a single `it()`
  block.
- The `this.callback` is replaced with an inline callback function.
- All assertions from the Vows assertion function(s) move inside the callback.
- `done()` is called after assertions to signal completion.
- The `it()` callback signature is `function(t, done)` where `t` is the test
  context and `done` signals async completion.

### 5.3 Handling Multiple Assertions per Callback Topic

In Vows, a single topic with `this.callback` can have multiple assertion
functions that all receive the same callback values. In node:test, each
assertion becomes its own `it()` block with its own callback invocation.

**Before (Vows):**
```javascript
suite.addBatch({
  '#col': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).col(0, this.callback);
    },
    'col callback': function(val, stat) {
      assert.deepEqual(val.toArray(), [[1], [3]]);
      assert.isTrue(this instanceof jStat);
    }
  }
});
```

**After (node:test):**
```javascript
describe('#col', function() {
    it('col callback', function(t, done) {
        jStat([[1, 2], [3, 4]]).col(0, function(val) {
            assert.deepStrictEqual(val.toArray(), [[1], [3]]);
            assert.strictEqual(this instanceof jStat, true);
            done();
        });
    });
});
```

Each Vows assertion function maps 1:1 to an `it()` block. When the original
has a single assertion function containing multiple assertions, they stay
together in one `it()` block.

### 5.4 The `this` Context Issue

Two files (`test/core/col-test.js` line 28, `test/core/row-test.js` line 28)
assert that `this` inside a callback is a jStat instance:

```javascript
assert.isTrue(this instanceof jStat);
```

In Vows, the callback context is set by jStat's internal
`setTimeout(function() { ... }.bind(this), 0)` mechanism. To preserve this in
the migrated test, the callback **must** use a `function` keyword (not an arrow
function), because arrow functions do not have their own `this`:

```javascript
it('callback this context', function(t, done) {
    jStat([[1, 2], [3, 4]]).col(0, function() {
        assert.strictEqual(this instanceof jStat, true);
        done();
    });
});
```

This is the correct approach for these two specific tests. All other callback
tests can also safely use `function` keywords (and should, per the no-arrow-
functions rule in Section 3.6).

### 5.5 Files Using Callbacks

Complete list of files with `this.callback` usage (31 files):

**Core (8 files):**
```
test/core/antidiag-test.js
test/core/col-test.js           (has this-context assertion)
test/core/cols-test.js
test/core/diag-test.js
test/core/dimensions-test.js
test/core/row-test.js           (has this-context assertion)
test/core/rows-test.js
test/core/transpose-test.js
```

**Vector (23 files):**
```
test/vector/coeffvar-test.js
test/vector/cumsum-test.js
test/vector/cumprod-test.js
test/vector/diff-test.js
test/vector/geomean-test.js
test/vector/max-test.js
test/vector/mean-test.js
test/vector/meandev-test.js
test/vector/meansqerr-test.js
test/vector/meddev-test.js
test/vector/median-test.js
test/vector/min-test.js
test/vector/mode-test.js
test/vector/product-test.js
test/vector/quantiles-test.js
test/vector/quartiles-test.js
test/vector/range-test.js
test/vector/stdev-test.js
test/vector/sum-test.js
test/vector/sumrow-test.js
test/vector/sumsqerr-test.js
test/vector/sumsqrd-test.js
test/vector/variance-test.js
```

Note: The counts from the research doc say ~31 files but the actual lists above
total 31 files (8 core + 23 vector). During migration, each file should be
checked for `this.callback` usage.

---

## 6. Batch-by-Batch Migration Steps

For each batch, follow this procedure:

### General Procedure (repeat for every file)

1. **Read the existing Vows file.** Identify:
   - Which assertions are used (check against Section 4)
   - Whether `this.callback` appears
   - Whether `this instanceof jStat` appears
   - Number of batches (= number of `describe` blocks needed)

2. **Apply the header replacement** (Section 3.1).

3. **Transform each batch** into a `describe()` block:
   - Delete `'topic': function() { return jStat; },` for basic topics.
   - Convert each assertion function to an `it()` call.
   - Apply the assertion mapping (Section 4).
   - For callback topics, apply Section 5.2 or 5.3.

4. **Remove the footer** (`suite.export(module);`).

5. **Run the single file** to verify:
   ```bash
   node --test test/<dir>/<file>-test.js
   ```

6. **Compare test count** -- the number of `it()` blocks should match the
   number of assertion functions in the original Vows file.

### Batch 1: Core (no callbacks)

These are the simplest files. Each has one `suite.addBatch` with a topic that
returns `jStat` and 1-3 assertion functions.

**Full worked example: `test/core/alter-test.js`**

Before:
```javascript
var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.alter');

require('../env.js');

suite.addBatch({
  'alter': {
    'topic': function() {
      return jStat;
    },
    'return alter': function(jStat) {
      assert.deepEqual(jStat.alter([[1, 2], [3, 4]], function(x) {
        return x * 2;
      }), [[2, 4], [6, 8]]);
      assert.deepEqual(jStat([[1, 2], [3, 4]]).alter(function(x) {
        return x * 2;
      }).toArray(), [[2, 4], [6, 8]]);
    }
  }
});

suite.export(module);
```

After:
```javascript
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('alter', function() {
    it('return alter', function() {
        assert.deepStrictEqual(jStat.alter([[1, 2], [3, 4]], function(x) {
            return x * 2;
        }), [[2, 4], [6, 8]]);
        assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).alter(function(x) {
            return x * 2;
        }).toArray(), [[2, 4], [6, 8]]);
    });
});
```

**Full worked example: `test/core/jstat-test.js`** (multiple assertion types)

Before:
```javascript
var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'jStat': {
    'topic': function() {
      return jStat;
    },
    'basic checks': function(jStat) {
      assert.isFunction(jStat.prototype.toArray);
      assert.isFunction(jStat.prototype.push);
      // ... (2 more isFunction, 4 deepEqual, 6 isTrue, 3 equal assertions)
      assert.deepEqual(jStat().toArray(), []);
      assert.isTrue(jStat._init.constructor === jStat);
      assert.equal(jStat.prototype.length, 0);
    },
    'matrix/vector generation': function(jStat) {
      assert.deepEqual(jStat([1, 2, 3]).toArray(), [1, 2, 3]);
    },
    'sequence generation': function(jStat) {
      assert.deepEqual(jStat(0, 0.5, 6).toArray(),
                       [0, 0.1, 0.2, 0.3, 0.4, 0.5]);
    }
  }
});

suite.export(module);
```

After:
```javascript
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('jStat', function() {
    it('basic checks', function() {
        assert.strictEqual(typeof jStat.prototype.toArray, 'function');
        assert.strictEqual(typeof jStat.prototype.push, 'function');
        // ... (2 more isFunction, 4 deepStrictEqual, 6 strictEqual(true), 3 strictEqual assertions)
        assert.deepStrictEqual(jStat().toArray(), []);
        assert.strictEqual(jStat._init.constructor === jStat, true);
        assert.strictEqual(jStat.prototype.length, 0);
    });
    it('matrix/vector generation', function() {
        assert.deepStrictEqual(jStat([1, 2, 3]).toArray(), [1, 2, 3]);
    });
    it('sequence generation', function() {
        assert.deepStrictEqual(jStat(0, 0.5, 6).toArray(),
                               [0, 0.1, 0.2, 0.3, 0.4, 0.5]);
    });
});
```

### Batch 2: Core (with callbacks)

**Full worked example: `test/core/rows-test.js`**

Before:
```javascript
var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.rows');

require('../env.js');

suite.addBatch({
  'rows': {
    'topic': function() {
      return jStat;
    },
    'number of rows': function(jStat) {
      assert.equal(jStat.rows([[1], [4], [5]]), 3);
      assert.equal(jStat([[1], [4], [5]]).rows(), 3);
      assert.isTrue(jStat([[1], [3]]).rows(function() {}) instanceof jStat);
    }
  },
  '#rows': {
    'topic': function() {
      jStat([[1, 2, 3], [4, 5, 6]]).rows(this.callback);
    },
    'rows sends value': function(val, stat) {
      assert.equal(val, 2);
    }
  }
});

suite.export(module);
```

After:
```javascript
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('rows', function() {
    it('number of rows', function() {
        assert.strictEqual(jStat.rows([[1], [4], [5]]), 3);
        assert.strictEqual(jStat([[1], [4], [5]]).rows(), 3);
        assert.strictEqual(jStat([[1], [3]]).rows(function() {}) instanceof jStat, true);
    });
});
describe('#rows', function() {
    it('rows sends value', function(t, done) {
        jStat([[1, 2, 3], [4, 5, 6]]).rows(function(val) {
            assert.strictEqual(val, 2);
            done();
        });
    });
});
```

### Batch 3: Vector (no callbacks)

Same as Batch 1 but many files use `assert.epsilon`. The only difference is
importing `assertEpsilon` and doing the rename.

### Batch 4: Vector (with callbacks)

Same as Batch 2 plus epsilon. See the sum-test.js worked example in Section 5.2.

### Batch 5: Distribution

All distribution tests follow an identical pattern. Here is the template:

**Full worked example: `test/distribution/normal-test.js`**

Before:
```javascript
var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'normal pdf': {
    'topic': function() {
      return jStat;
    },
    'check pdf calculation': function(jStat) {
      var tol = 0.000001;
      assert.epsilon(tol, jStat.normal.pdf(0, 0, 1.0), 0.3989423);
      assert.epsilon(tol, jStat.normal.pdf(5, 10, 3.0), 0.03315905);
      assert.epsilon(tol, jStat.normal.pdf(-1, 1, 0.5), 0.00026766);
    },
    'check inv calculation': function(jStat) {
      var tol = 0.000001;
      assert.epsilon(tol, jStat.normal.inv(0.3989423, 0, 1.0), -0.2560858);
      assert.epsilon(tol, jStat.normal.inv(0.05, 10, 3.0), 5.065439);
      assert.epsilon(tol, jStat.normal.inv(0.65, -2, .5), -1.80734);
    }
  }
});

suite.export(module);
```

After:
```javascript
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('normal pdf', function() {
    it('check pdf calculation', function() {
        var tol = 0.000001;
        assertEpsilon(tol, jStat.normal.pdf(0, 0, 1.0), 0.3989423);
        assertEpsilon(tol, jStat.normal.pdf(5, 10, 3.0), 0.03315905);
        assertEpsilon(tol, jStat.normal.pdf(-1, 1, 0.5), 0.00026766);
    });
    it('check inv calculation', function() {
        var tol = 0.000001;
        assertEpsilon(tol, jStat.normal.inv(0.3989423, 0, 1.0), -0.2560858);
        assertEpsilon(tol, jStat.normal.inv(0.05, 10, 3.0), 5.065439);
        assertEpsilon(tol, jStat.normal.inv(0.65, -2, .5), -1.80734);
    });
});
```

### Batch 6-8: Linear Algebra, Special, Models

All follow the same patterns as Batches 1 and 3. No callbacks. Apply the
standard transformation.

**Full worked example: `test/linearalgebra/cholesky-test.js`**

Before:
```javascript
var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'cholesky decomposition': {
    'topic': function() {
      return jStat;
    },
    'example1': function(jStat) {
      var A = [[4, 6, 10], [6, 58, 29], [10, 29, 38]];
      var T = jStat.cholesky(A);
      var tol=0.0001;
      assert.epsilon(tol, T[0][0], 2.0);
      assert.epsilon(tol, T[0][1], 0.0);
      assert.epsilon(tol, T[0][2], 0.0);
      assert.epsilon(tol, T[1][0], 3.0);
      assert.epsilon(tol, T[1][1], 7.0);
      assert.epsilon(tol, T[1][2], 0.0);
      assert.epsilon(tol, T[2][0], 5.0);
      assert.epsilon(tol, T[2][1], 2.0);
      assert.epsilon(tol, T[2][2], 3.0);
    }
  }
});

suite.export(module);
```

After:
```javascript
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

describe('cholesky decomposition', function() {
    it('example1', function() {
        var A = [[4, 6, 10], [6, 58, 29], [10, 29, 38]];
        var T = jStat.cholesky(A);
        var tol = 0.0001;
        assertEpsilon(tol, T[0][0], 2.0);
        assertEpsilon(tol, T[0][1], 0.0);
        assertEpsilon(tol, T[0][2], 0.0);
        assertEpsilon(tol, T[1][0], 3.0);
        assertEpsilon(tol, T[1][1], 7.0);
        assertEpsilon(tol, T[1][2], 0.0);
        assertEpsilon(tol, T[2][0], 5.0);
        assertEpsilon(tol, T[2][1], 2.0);
        assertEpsilon(tol, T[2][2], 3.0);
    });
});
```

### Batch 9: Statistical Tests

**Full worked example: `test/test/anovafscore-test.js`** (after rename)

Before:
```javascript
var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'anovafscore ': {
    'topic': function() {
      return jStat;
    },
    'anovafscore control test': function(jStat) {
      var control = [433.579, 471.484, 487.407, 518.166, 444.534,
                     434.615, 447.401, 525.873, 421.322, 425.949];
      var test = [356.139, 315.869, 327.203, 335.308, 332.547, 336.871,
                  353.809, 333.462, 349.203, 340.051];
      assert.equal(jStat.anovafscore(control, test), 94.76896135161758);
      assert.equal(jStat.anovafscore(test, control), 94.76896135161758);
    }
  }
});

suite.export(module);
```

After:
```javascript
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

describe('anovafscore', function() {
    it('anovafscore control test', function() {
        var control = [433.579, 471.484, 487.407, 518.166, 444.534,
                       434.615, 447.401, 525.873, 421.322, 425.949];
        var test = [356.139, 315.869, 327.203, 335.308, 332.547, 336.871,
                    353.809, 333.462, 349.203, 340.051];
        assert.strictEqual(jStat.anovafscore(control, test), 94.76896135161758);
        assert.strictEqual(jStat.anovafscore(test, control), 94.76896135161758);
    });
});
```

### Batch 10: UMD

**Full worked example: `test/umd/commonjs-test.js`**

This file is special: it does NOT use `test/env.js` or `test/helpers.js`.
It loads jStat directly via `require('./../../dist/jstat.js')` to test the
CommonJS export behavior.

Before:
```javascript
var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.commonjs');

suite.addBatch({
  'jStat': {
    'topic': function() {
      return require('./../../dist/jstat.js');
    },
    'should be defined': function(jStat) {
      assert.equal(typeof jStat, 'function');
      assert.equal(typeof jStat.rows, 'function');
      assert.equal(typeof jStat.min, 'function');
      assert.equal(typeof jStat.betafn, 'function');
      assert.equal(typeof jStat.beta.pdf, 'function');
      assert.equal(typeof jStat.add, 'function');
      assert.equal(typeof jStat.zscore, 'function');
    },
    'should export jStat under "jStat" property': function(jStat) {
      assert.equal(jStat.jStat, jStat);
    },
  }
});

suite.export(module);
```

After:
```javascript
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');

// Intentionally NOT using helpers.js -- testing raw CJS require behavior
var jStat = require('./../../dist/jstat.js');

describe('jStat commonjs', function() {
    it('should be defined', function() {
        assert.strictEqual(typeof jStat, 'function');
        assert.strictEqual(typeof jStat.rows, 'function');
        assert.strictEqual(typeof jStat.min, 'function');
        assert.strictEqual(typeof jStat.betafn, 'function');
        assert.strictEqual(typeof jStat.beta.pdf, 'function');
        assert.strictEqual(typeof jStat.add, 'function');
        assert.strictEqual(typeof jStat.zscore, 'function');
    });
    it('should export jStat under "jStat" property', function() {
        assert.strictEqual(jStat.jStat, jStat);
    });
});
```

---

## 7. Validation Strategy

### 7.1 Per-File Validation

After migrating each file, run it in isolation:

```bash
node --test test/<dir>/<file>-test.js
```

Verify:
- All tests pass (exit code 0).
- The number of passing tests matches the number of assertion functions in the
  original Vows file. Count `it()` blocks in the new file -- they should
  equal the number of `'test name': function(...)` entries in the old file.

### 7.2 Per-Batch Validation

After completing each batch, run all tests in the directory:

```bash
node --test "test/<dir>/*-test.js"
```

Then run the full suite:

```bash
npm test
```

Both must pass before proceeding to the next batch.

### 7.3 Total Test Count Verification

The current Vows suite reports 371 passing tests and 7 broken (geomean). After
migration, the node:test suite should report:

- **371 passing** (same as before) plus **7 fixed** (geomean, see Section 8.1)
  = **378 total passing, 0 failing**.

The exact number of `it()` blocks across all files must be counted and tracked.
Before starting migration, count the total assertion functions across all 115
Vows files to establish the baseline.

To count assertion functions in the current Vows suite:

```bash
grep -r "': function(" test/*/  --include="*-test.js" | grep -v "topic" | wc -l
```

This gives the total number of test cases (excluding topic functions). The
migrated suite's `it()` count must match.

Note: Callback tests in Vows may have multiple assertion functions per topic
that share callback data. In the migration, each becomes its own `it()` block,
so the count stays 1:1.

### 7.4 Side-by-Side Comparison (optional)

For extra confidence, especially during Batch 1, you can run the old and new
versions side by side:

```bash
# Old (Vows) -- will need vows still installed
./node_modules/vows/bin/vows --spec test/core/alter-test.js

# New (node:test)
node --test test/core/alter-test.js
```

This is only possible while Vows is still installed. After the migration is
complete and Vows is removed, this is no longer available.

---

## 8. Known Issues

### 8.1 Broken geomean Tests (7 failures)

**File:** `test/vector/geomean-test.js`

**Problem:** The tests use `assert.equal` (strict equality) to compare
floating-point results from `jStat.geomean()`. After commit a869c76 changed
the geomean algorithm to `Math.exp(mean(arr.map(Math.log)))`, the results
differ at the ULP level from the hardcoded expected values.

Example failure:
```
expected 1.8171205928321397, got 1.8171205928321394
```

**Fix during migration:** Replace `assert.equal` / `assert.deepEqual` with
`assertEpsilon` / `assertArrayEpsilon` using a tolerance of `1e-14` (near
machine epsilon). This is not masking a bug -- the algorithm is mathematically
correct, and the old expected values were simply captured at a time when a
different algorithm was in use.

**Before:**
```javascript
'return basic geomean': function(jStat) {
    assert.equal(jStat.geomean([1, 2, 3]), 1.8171205928321397);
},
'geomean matrix cols': function(jStat) {
    assert.deepEqual(jStat([[1, 2], [3, 4]]).geomean(),
                     [1.7320508075688772, 2.8284271247461903]);
},
```

**After:**
```javascript
it('return basic geomean', function() {
    assertEpsilon(1e-14, jStat.geomean([1, 2, 3]), 1.8171205928321397);
});
it('geomean matrix cols', function() {
    assertArrayEpsilon(1e-14, jStat([[1, 2], [3, 4]]).geomean(),
                       [1.7320508075688772, 2.8284271247461903]);
});
```

The same fix applies to all 7 test cases in this file (4 synchronous + 3
callback variants).

### 8.2 `anovaftes` Typo

The instance method `jStat.fn.anovaftes()` (in `src/test.js` line 185) is
missing the trailing 't'. The static method `jStat.anovaftest()` is spelled
correctly. This is a published API and must not be "fixed" -- it would break
backwards compatibility.

**Action:** Migrate the existing test as-is. The test file (`anovafscore.js`
-> `anovafscore-test.js`) only tests the static `jStat.anovafscore()` method,
not the instance method, so the typo does not affect migration.

### 8.3 `test/test/qtest-test.js` Module-Level Code

This file has module-level code that runs before any test batch:

```javascript
var sd = jStat.pooledstdev(data);
var n = data[0].length + data[1].length + data[2].length;
var k = data.length;
```

This code depends on the global `jStat` from `env.js`. After migration, these
lines must use the `jStat` imported from `helpers.js`. Since the variables are
used inside test functions, they can remain at module scope -- `node:test`
evaluates the full module before running tests.

**After:**
```javascript
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat, assertEpsilon } = require('../helpers.js');

var data = [ ... ];   // same as before
var sd = jStat.pooledstdev(data);   // uses imported jStat, not global
var n = data[0].length + data[1].length + data[2].length;
var k = data.length;
```

### 8.4 `test/distribution/binomial-test.js` Mixed Assertion Types

This file uses `assert.epsilon`, `assert.ok`, and `assert.equal` in the same
test function. Each assertion maps independently per Section 4:

```javascript
// assert.ok(Number.isNaN(...)) stays the same
assert.ok(Number.isNaN(jStat.binomial.cdf(10, 12, -1)));
// assert.equal -> assert.strictEqual
assert.strictEqual(jStat.binomial.cdf(12, 10, 0.5), 1);
// assert.epsilon -> assertEpsilon
assertEpsilon(tol, jStat.binomial.cdf(101073, 101184, 0.9988219676207195), 0.7857313651);
```

Note: `binomial-test.js` already uses `assert.ok(Number.isNaN(...))` in the
original Vows code -- it does not need migration from `assert.isNaN`. The
example above shows the existing pattern, not a migration.

Several distribution files mix assertion types this way. Apply each mapping
independently within the same `it()` block.

### 8.5 `test/vector/coeffvar-test.js` and Similar: `assert.deepEqual` on Floats

Several vector tests use `assert.deepEqual` to compare floating-point results
that happen to be exactly representable (e.g., `0.6`, `0.5`). These migrate
directly to `assert.deepStrictEqual`. Do NOT preemptively change them to
`assertEpsilon` -- if the Vows tests passed with strict equality, the migrated
tests should too.

The only exception is the geomean tests (Section 8.1) which are known broken.

### 8.6 Files With `var` Declarations Shadowing `jStat`

In the Vows pattern, many test functions receive `jStat` as a parameter:

```javascript
'test name': function(jStat) {
    jStat.sum([1, 2, 3]);
}
```

After migration, `jStat` is a module-level variable and the parameter is
removed. Since the function no longer receives `jStat` as an argument, the
module-level binding is used. This is correct and no shadowing occurs.

However, be careful: if any file has a local `var jStat = ...` declaration
(not as a function parameter), that would shadow the import. Scan for this
pattern in each file. In practice, no jStat test files do this.

---

## 9. Completion Criteria

Phase 1 is complete when ALL of the following are true:

### 9.1 All Tests Migrated

- [ ] All 115 test files have been converted from Vows to node:test.
- [ ] `test/test/anovafscore.js` has been renamed to `anovafscore-test.js`.
- [ ] Every `it()` block corresponds to exactly one assertion function from
      the original Vows file (1:1 mapping).

### 9.2 All Tests Passing

- [ ] `npm test` exits with code 0.
- [ ] `node --test "test/**/*-test.js"` reports 0 failures.
- [ ] The 7 previously broken geomean tests now pass (using assertEpsilon).
- [ ] Total passing test count matches or exceeds the original 371 + 7 = 378.

### 9.3 Infrastructure Cleaned Up

- [ ] `test/helpers.js` exists and provides `jStat`, `assertEpsilon`, and
      `assertArrayEpsilon`.
- [ ] `test/env.js` is deleted.
- [ ] `test/template.js` is deleted.
- [ ] `vows` is removed from `devDependencies` (`npm uninstall vows`).
- [ ] `package.json` `"test"` script uses `node --test`.
- [ ] Makefile `test` target uses `node --test`.

### 9.4 No Regressions

- [ ] No test file uses `require('vows')`.
- [ ] No test file uses `require('../env.js')`.
- [ ] No test file uses `suite.addBatch` or `suite.export`.
- [ ] No test file uses `assert.epsilon` (all use `assertEpsilon`).
- [ ] `dist/jstat.js` output is unchanged (no source modifications).
- [ ] The public API surface is unchanged.

### 9.5 Verification Commands

Final verification after all work is complete:

```bash
# Build and run all tests
npm test

# Verify no Vows remnants
grep -r "require('vows')" test/ && echo "FAIL: vows still referenced" || echo "OK"
grep -r "require('../env.js')" test/ && echo "FAIL: env.js still referenced" || echo "OK"
grep -r "suite.addBatch" test/ && echo "FAIL: Vows patterns remain" || echo "OK"
grep -r "suite.export" test/ && echo "FAIL: Vows patterns remain" || echo "OK"

# Verify vows is not in dependencies
node -e "var p = require('./package.json'); if (p.devDependencies.vows) { console.log('FAIL'); process.exit(1); } else { console.log('OK'); }"

# Verify test count
node --test "test/**/*-test.js" 2>&1 | tail -5
```

---

## Appendix A: Quick-Reference Transformation Checklist

Print this out or keep it open while migrating. For each file:

```
[ ] Replace header:
    - var vows = require('vows');          -> DELETE
    - var assert = require('assert');      -> var assert = require('node:assert/strict');
    - var suite = vows.describe('...');    -> DELETE
    - require('../env.js');                -> var { jStat } = require('../helpers.js');
    - (if epsilon used)                    -> add assertEpsilon to destructure

[ ] For each suite.addBatch({ 'name': { ... } }):
    - 'name': { ... }                     -> describe('name', function() { ... });
    - 'topic': function() { return X; },  -> DELETE
    - 'test': function(X) { ... }         -> it('test', function() { ... });
    - (remove X parameter from function)

[ ] For callback topics:
    - Collapse topic + assertions into it() with done callback
    - Replace this.callback with inline function(val) { ...; done(); }

[ ] Replace assertions:
    - assert.equal(a, b)                  -> assert.strictEqual(a, b)
    - assert.deepEqual(a, b)              -> assert.deepStrictEqual(a, b)
    - assert.epsilon(t, a, e)             -> assertEpsilon(t, a, e)
    - assert.isTrue(x)                    -> assert.strictEqual(x, true)
    - assert.isFalse(x)                   -> assert.strictEqual(x, false)
    - assert.isFunction(x)               -> assert.strictEqual(typeof x, 'function')
    - assert.isNaN(x)                     -> assert.ok(Number.isNaN(x))

[ ] Remove footer:
    - suite.export(module);               -> DELETE

[ ] Run: node --test test/<dir>/<file>-test.js
[ ] Verify pass count matches original
```
