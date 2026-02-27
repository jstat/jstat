# Phase 2 Implementation Plan: Build System Modernization

Concrete, step-by-step plan for replacing the Makefile + cat concatenation
build with Rollup, producing dual UMD + ESM output from the same source.

**Prerequisite:** Phase 1 (test migration to node:test) is complete. The test
suite has 382 tests (375 passing, 7 known geomean float-precision failures).

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step-by-step Source File Conversion](#2-step-by-step-source-file-conversion)
3. [Create src/index.js Entry Point](#3-create-srcindexjs-entry-point)
4. [Rollup Configuration](#4-rollup-configuration)
5. [Update package.json](#5-update-packagejson)
6. [Update Makefile](#6-update-makefile)
7. [Verification Strategy](#7-verification-strategy)
8. [Cleanup](#8-cleanup)
9. [Completion Criteria](#9-completion-criteria)

---

## 1. Prerequisites

### 1.1 Verify Current Baseline

Before making any changes, confirm the current build works and record the
baseline test results.

```bash
make clean core
node --test "test/**/*-test.js"
```

Expected: 382 tests, 375 passing, 7 failing (geomean float-precision).

Save the current built output for later comparison:

```bash
cp dist/jstat.js dist/jstat.old.js
```

### 1.2 Install Rollup and Plugins

```bash
npm install --save-dev rollup @rollup/plugin-terser
```

This adds two new dev dependencies:
- `rollup` (4.x) -- the bundler
- `@rollup/plugin-terser` (0.4.x) -- minification plugin (replaces uglify-js)

Do NOT remove uglify-js yet. It stays in devDependencies until verification is
complete, even though the old cat/uglify build no longer functions after the
source files are converted to ES module syntax.

### 1.3 Files to Modify

| File | Action |
|------|--------|
| `src/core.js` | Remove IIFE wrapper, add `export default jStat` |
| `src/vector.js` | Remove IIFE wrapper, add `import jStat from './core.js'` |
| `src/special.js` | Remove IIFE wrapper, add `import jStat from './core.js'` |
| `src/distribution.js` | Remove IIFE wrapper, add `import jStat from './core.js'` |
| `src/linearalgebra.js` | Remove IIFE wrapper, add `import jStat from './core.js'` |
| `src/test.js` | Remove IIFE wrapper, add `import jStat from './core.js'` |
| `src/models.js` | Remove IIFE, add `import jStat from './core.js'`, restructure |
| `src/regression.js` | Add `import jStat from './core.js'` (no IIFE to remove) |
| `src/index.js` | **New file** -- entry point |
| `rollup.config.mjs` | **New file** -- Rollup configuration |
| `package.json` | Add module/exports fields, update scripts, add Rollup devDep |
| `Makefile` | Replace cat/uglify with Rollup delegation |
| `src/_header.js` | **Delete** (replaced by Rollup UMD wrapper) |
| `src/_footer.js` | **Delete** (replaced by src/index.js) |

---

## 2. Step-by-step Source File Conversion

Most source files currently use an IIFE pattern that receives `jStat` and
`Math` as parameters (exceptions: `core.js` uses `Math, undefined`,
`models.js` uses a parameter-less IIFE assigned to `jStat.models`, and
`regression.js` has no IIFE at all). The conversion is mechanical for the
common pattern:

1. Remove the IIFE opening line and closing line
2. Add `import jStat from './core.js';` at the top
3. The `Math` parameter is dropped -- `Math` is a global and does not need to
   be passed as a parameter. The IIFE parameter simply shadowed the global with
   the same value, so removing it changes nothing.
4. The `undefined` parameter (used only by core.js) is dropped -- ES modules
   run in strict mode where `undefined` cannot be reassigned.
5. Do NOT change any internal code (no `var` to `let`, no arrow functions, etc.)

### 2.1 `src/core.js` -- Full Before/After

This file is unique: it creates the `jStat` object via an IIFE that returns it.

**Current structure (lines 1 and 683-685):**

```javascript
var jStat = (function(Math, undefined) {

// For quick reference.
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

// ... ~680 lines of code creating jStat ...

// Exposing jStat.
return jStat;

}(Math));
```

**After conversion:**

```javascript
// For quick reference.
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

// ... ~680 lines of code creating jStat (unchanged) ...

// Exposing jStat.
export default jStat;
```

**Exact changes:**
1. **Remove line 1:** `var jStat = (function(Math, undefined) {`
2. **Remove line 683:** `return jStat;` -- top-level `return` is a syntax error
   in an ES module
3. **Remove line 685:** `}(Math));`
4. **Remove the blank line 684** (was between `return jStat;` and `}(Math);`)
5. **Add at the end:** `export default jStat;`
6. All private variables (`concat`, `slice`, `toString`, `calcRdx`, `isArray`,
   `isFunction`, `isNumber`, `toVector`, `retZero`, `retOne`, `retIdent`,
   `jProto`) become module-scoped instead of IIFE-scoped -- still private,
   invisible to other modules.

**What does NOT change:** Every line between the IIFE open and close remains
exactly as-is. The `jStat` constructor function declaration, `jStat._init`,
`jStat.fn`, `jStat.utils`, `jStat.extend`, all static methods, all prototype
methods -- all unchanged.

### 2.2 `src/vector.js`

**Current structure (lines 1 and 566):**

```javascript
(function(jStat, Math) {

var isFunction = jStat.utils.isFunction;
// ... 560 lines ...

}(jStat, Math));
```

**After conversion:**

```javascript
import jStat from './core.js';

var isFunction = jStat.utils.isFunction;
// ... 560 lines (unchanged) ...
```

**Exact changes:**
1. **Remove line 1:** `(function(jStat, Math) {`
2. **Remove last line:** `}(jStat, Math));`
3. **Add at line 1:** `import jStat from './core.js';`
4. All private variables (`isFunction`, `ascNum`, `clip`, `jProto`) become
   module-scoped.

**Dependencies:** core.js only.

### 2.3 `src/special.js`

**Current structure (lines 1-2 and 510):**

```javascript
// Special functions //
(function(jStat, Math) {

jStat.gammaln = function gammaln(x) {
// ... 506 lines ...

}(jStat, Math));
```

**After conversion:**

```javascript
// Special functions //
import jStat from './core.js';

jStat.gammaln = function gammaln(x) {
// ... 506 lines (unchanged) ...
```

**Exact changes:**
1. **Remove line 2:** `(function(jStat, Math) {`
2. **Remove last line:** `}(jStat, Math));`
3. **Add after the comment:** `import jStat from './core.js';`

**Dependencies:** core.js only.

### 2.4 `src/distribution.js`

**Current structure (lines 1 and 1598):**

```javascript
(function(jStat, Math) {

// generate all distribution instance methods
(function(list) {
// ... 1594 lines ...

}(jStat, Math));
```

**After conversion:**

```javascript
import jStat from './core.js';

// generate all distribution instance methods
(function(list) {
// ... 1594 lines (unchanged) ...
```

**Exact changes:**
1. **Remove line 1:** `(function(jStat, Math) {`
2. **Remove last line:** `}(jStat, Math));`
3. **Add at line 1:** `import jStat from './core.js';`
4. The inner IIFEs (distribution factory loop, per-distribution `jStat.extend`
   blocks) are all left intact -- only the outer IIFE is removed.

**Dependencies:** core.js, special.js (heavy -- gamma, beta, erf functions),
vector.js (light -- `jStat.mean`, `jStat.sum`). All accessed via the shared
`jStat` object, so the import of `jStat` from core.js is sufficient -- by the
time distribution.js runs, vector.js and special.js have already mutated the
`jStat` object (guaranteed by import order in index.js).

### 2.5 `src/linearalgebra.js`

**Current structure (lines 1-4 and 970):**

```javascript
/* Provides functions for the solution of linear system of equations, ... */

(function(jStat, Math) {

var push = Array.prototype.push;
var isArray = jStat.utils.isArray;
// ... 964 lines ...

}(jStat, Math));
```

**After conversion:**

```javascript
/* Provides functions for the solution of linear system of equations, ... */

import jStat from './core.js';

var push = Array.prototype.push;
var isArray = jStat.utils.isArray;
// ... 964 lines (unchanged) ...
```

**Exact changes:**
1. **Remove line 4:** `(function(jStat, Math) {`
2. **Remove last line:** `}(jStat, Math));`
3. **Add after the comment block:** `import jStat from './core.js';`
4. Private variables (`push`, `isArray`, `isUsable`) become module-scoped.

**Dependencies:** core.js, vector.js (for `jStat.sum` used in QR closure).

**Note on QR closure:** The QR function internally captures `var sum = jStat.sum`
at definition time. This works correctly because linearalgebra.js is imported
after vector.js in index.js, so `jStat.sum` is already defined when the closure
captures it.

### 2.6 `src/test.js`

**Current structure (lines 1-4 and 339):**

```javascript
(function(jStat, Math) {

var slice = [].slice;
var isNumber = jStat.utils.isNumber;
var isArray = jStat.utils.isArray;
// ... 333 lines ...

}(jStat, Math));
```

**After conversion:**

```javascript
import jStat from './core.js';

var slice = [].slice;
var isNumber = jStat.utils.isNumber;
var isArray = jStat.utils.isArray;
// ... 333 lines (unchanged) ...
```

**Exact changes:**
1. **Remove line 1:** `(function(jStat, Math) {`
2. **Remove last line:** `}(jStat, Math));`
3. **Add at line 1:** `import jStat from './core.js';`
4. Private variables (`slice`, `isNumber`, `isArray`, `differenceOfProportions`)
   become module-scoped.

**Dependencies:** core.js, vector.js (`jStat.mean`, `jStat.stdev`,
`jStat.pooledstdev`), distribution.js (`jStat.normal.cdf`, `jStat.normal.inv`,
`jStat.studentt.cdf`, `jStat.studentt.inv`, `jStat.centralF.cdf`,
`jStat.tukey.cdf`).

### 2.7 `src/models.js`

This file has a different pattern: the IIFE is assigned directly to
`jStat.models`.

**Current structure (lines 1 and 112-113):**

```javascript
jStat.models = (function(){
  function sub_regress(exog) { ... }
  function ols(endog, exog) { ... }
  function t_test(model) { ... }
  function F_test(model) { ... }
  function ols_wrap(endog, exog) { ... }
  return { ols: ols_wrap };
})();
```

**After conversion:**

```javascript
import jStat from './core.js';

function sub_regress(exog) {
  // ... unchanged ...
}

function ols(endog, exog) {
  // ... unchanged ...
}

function t_test(model) {
  // ... unchanged ...
}

function F_test(model) {
  // ... unchanged ...
}

function ols_wrap(endog, exog) {
  // ... unchanged ...
}

jStat.models = { ols: ols_wrap };
```

**Exact changes:**
1. **Remove line 1:** `jStat.models = (function(){`
2. **Remove lines 112-113:** `return { ols: ols_wrap };` and `})();`
3. **Add at line 1:** `import jStat from './core.js';`
4. **Add at the end:** `jStat.models = { ols: ols_wrap };`
5. Decrease indentation of all internal functions by 2 spaces (they were inside
   the IIFE). This is a whitespace-only change.
6. Internal functions (`sub_regress`, `ols`, `t_test`, `F_test`, `ols_wrap`)
   become module-scoped instead of IIFE-scoped -- still private.

**Dependencies:** core.js (`jStat` constructor, `jStat.col`, `jStat.arange`),
vector.js (`jStat.mean`, `jStat.sum`), linearalgebra.js (`jStat.lstsq`,
`jStat.multiply`, `jStat.subtract`), distribution.js (`jStat.studentt.cdf`,
`jStat.studentt.inv`, `jStat.beta.cdf`).

### 2.8 `src/regression.js`

This file has no IIFE wrapper -- it directly calls `jStat.extend({...})`.

**Current structure (lines 1-12 and 206):**

```javascript
//To regress, simply build X matrix
// ... comments ...

//Regressions

jStat.extend({
  buildxmatrix: function buildxmatrix(){
    // ...
  },
  // ...
});
```

**After conversion:**

```javascript
//To regress, simply build X matrix
// ... comments ...

import jStat from './core.js';

//Regressions

jStat.extend({
  buildxmatrix: function buildxmatrix(){
    // ...
  },
  // ...
});
```

**Exact changes:**
1. **Add after the comment block:** `import jStat from './core.js';`
2. No other changes. There is no IIFE to remove.

**Dependencies:** core.js (`jStat` constructor, `jStat.extend`), vector.js
(`jStat.fn.mean` instance method), linearalgebra.js (`jStat.inv`), test.js
(`jStat.anovaftest`, `jStat.ttest` used in `regresst` function).

---

## 3. Create `src/index.js` Entry Point

Create a new file `src/index.js` that serves as the single entry point for
Rollup. It imports all modules in dependency order and exports jStat:

```javascript
import jStat from './core.js';
import './vector.js';
import './special.js';
import './distribution.js';
import './linearalgebra.js';
import './test.js';
import './models.js';
import './regression.js';

// Backwards compatibility: require('jstat').jStat === require('jstat')
jStat.jStat = jStat;

export default jStat;
```

**How it works:**
- `import jStat from './core.js'` gets the jStat constructor object.
- The side-effect imports (`import './vector.js'`, etc.) each mutate the shared
  `jStat` object by adding methods to it. ES module default exports are value
  bindings -- since `jStat` is an object, every module receives the same
  reference and sees each other's mutations.
- The import order matches the current Makefile concatenation order, preserving
  the dependency chain.
- `jStat.jStat = jStat` replaces what `_footer.js` currently does.
- `export default jStat` provides the fully-assembled library to Rollup.

---

## 4. Rollup Configuration

Create `rollup.config.mjs` at the project root:

```javascript
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
      sourcemap: true
    }
  },
  // UMD minified (replaces current dist/jstat.min.js)
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
  // ESM (new)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/jstat.esm.mjs',
      format: 'es',
      sourcemap: true
    }
  },
  // CJS (new -- cleaner than UMD for Node.js consumers)
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

**Key configuration decisions:**

- **`exports: 'default'`** on UMD and CJS: ensures `require('jstat')` returns
  the jStat function directly (not an object with a `.default` property). This
  matches the current behavior exactly.

- **`name: 'jStat'`** on UMD: sets `window.jStat` in browsers.

- **`.mjs` extension for ESM:** The package.json has no `"type": "module"`, so
  Node.js treats `.js` files as CommonJS. The `.mjs` extension forces Node.js
  to parse the ESM file as an ES module without requiring a `"type": "module"`
  change that would affect all `.js` files in the package.

- **`sourcemap: true`**: generates source maps alongside each output file.

- **The `jStat.jStat` self-reference** is handled in `src/index.js`, not in the
  Rollup config. Rollup's `outro` option cannot reliably access the right scope
  for `exports: 'default'` mode. Setting it in source code ensures it is present
  in all output formats (UMD, CJS, ESM) automatically.

---

## 5. Update `package.json`

### 5.1 Add New Fields

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
  ]
}
```

**Field explanations:**

- **`main`** stays as `./dist/jstat.js` -- this is the backwards-compatible
  entry point. Changing it would break existing consumers who `require('jstat')`.
  The UMD file works fine for CJS.

- **`module`** points to the ESM build. Understood by bundlers like webpack and
  Rollup when consuming jStat as a dependency.

- **`exports`** is the modern Node.js conditional exports field:
  - `import` -> ESM build (for `import jStat from 'jstat'`)
  - `require` -> CJS build (for `const jStat = require('jstat')`)
  - `default` -> UMD fallback (for anything else)

- **`files`** limits what gets published to npm. Only `dist/` is needed for
  consumers.

### 5.2 Update Scripts

```json
{
  "scripts": {
    "build": "rollup -c",
    "test": "npm run build && node --test \"test/**/*-test.js\""
  }
}
```

### 5.3 Update devDependencies

Add:
```json
{
  "rollup": "^4.0.0",
  "@rollup/plugin-terser": "^0.4.0"
}
```

Remove (during cleanup step, not yet):
```json
{
  "uglify-js": "^3.6.7"
}
```

### 5.4 Complete package.json

The full updated `package.json`:

```json
{
  "name": "jstat",
  "version": "1.9.6",
  "description": "Statistical Library for JavaScript",
  "homepage": "http://github.com/jstat/jstat",
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
  "author": {
    "name": "Trevor Norris",
    "email": "trev.norris@gmail.com",
    "url": "http://trevorjnorris.com"
  },
  "licenses": [
    {
      "type": "MIT",
      "url": "http://www.opensource.org/licenses/mit-license.php"
    }
  ],
  "repository": {
    "type": "git",
    "url": "http://github.com/jstat/jstat.git"
  },
  "devDependencies": {
    "@rollup/plugin-terser": "^0.4.0",
    "rollup": "^4.0.0",
    "uglify-js": "^3.6.7",
    "vows": "^0.8.3"
  },
  "scripts": {
    "build": "rollup -c",
    "test": "npm run build && node --test \"test/**/*-test.js\""
  }
}
```

Note: `uglify-js` and `vows` are removed in the cleanup step, not here. Keep
them until verification is complete.

---

## 6. Update Makefile

Replace the current Makefile with a thin wrapper that delegates to npm scripts:

```makefile
DIST_DIR = ./dist

DOC_DIR = doc
BUILD_DIR = build
DOC_LIST = `ls $(DOC_DIR)/md/`
JS_ENGINE ?= $(shell which node nodejs 2>/dev/null | head -1)

all: clean core doc

clean:
	@echo 'Cleaning up build files'
	@rm -rf dist

core:
	@echo 'Building jStat'
	@npm run build

doc:
	@echo 'Generating documentation'
	@mkdir -p $(DIST_DIR)/docs/assets
	@cp $(DOC_DIR)/assets/*.css $(DIST_DIR)/docs/assets/
	@cp $(DOC_DIR)/assets/*.js $(DIST_DIR)/docs/assets/
	@for i in $(DOC_LIST); do \
		$(JS_ENGINE) $(BUILD_DIR)/doctool.js $(DOC_DIR)/assets/template.html $(DOC_DIR)/md/$${i} $(DIST_DIR)/docs/$${i%.*}.html; \
	done

install:
	@echo 'Downloading necessary libraries for build'
	@mkdir -p node_modules
	@npm install

jstat: core

test: clean core
	@echo 'Running jStat unit tests'
	@node --test "test/**/*-test.js"

.PHONY: clean core doc install test jstat
```

**What changed:**
- The `core` target now runs `npm run build` (Rollup) instead of `cat` +
  `uglifyjs`.
- Removed the `JS_COMPILER` and `JS_TESTER` variables.
- Removed the `NODE_PATH` variable.
- Removed the individual `jstat.js` and `jstat.min.js` targets.
- Preserved `doc`, `clean`, `install`, `test`, and `jstat` targets.
- `make jstat` is now an alias for `make core` (previously it built only the
  unminified file; now both are equivalent since Rollup produces all outputs
  in one pass).
- `make test` and `make core` still work as before.

---

## 7. Verification Strategy

Verification happens in multiple stages. Do NOT proceed to cleanup until all
checks pass.

### 7.1 Run the Full Test Suite Against UMD Output

The existing test suite loads `dist/jstat.js` (via `test/helpers.js`). Running
it against the Rollup-built UMD output verifies API compatibility:

```bash
npm test
```

Expected: same results as baseline (382 tests, 375 passing, 7 known failures).

### 7.2 Compare UMD Output to Old Build

```bash
# The old output was saved in step 1.1
diff dist/jstat.old.js dist/jstat.js | head -50
```

Expected differences (all acceptable):
- UMD wrapper preamble differs (Rollup's is slightly different but equivalent)
- `'use strict'` added by Rollup inside the factory function
- Minor whitespace/formatting differences
- Code ordering may differ slightly within the inlined modules

The diff is for manual review only. The test suite is the definitive check.

### 7.3 CJS Export Behavior

Run the existing CommonJS compatibility test:

```bash
node --test test/umd/commonjs-test.js
```

This verifies:
- `typeof jStat === 'function'`
- `jStat.jStat === jStat` (self-reference)
- Key methods exist on the jStat object

### 7.4 ESM Import Verification

Create a temporary test script:

```bash
cat > test/verify-esm.mjs << 'SCRIPT'
import jStat from '../dist/jstat.esm.mjs';
import assert from 'node:assert/strict';

assert.strictEqual(typeof jStat, 'function', 'jStat is a function');
assert.strictEqual(jStat.jStat, jStat, 'jStat.jStat self-reference');
assert.strictEqual(jStat.fn, jStat.prototype, 'jStat.fn alias');
assert.strictEqual(typeof jStat.normal, 'function', 'distributions exist');
assert.strictEqual(typeof jStat.mean, 'function', 'vector methods exist');
assert.strictEqual(typeof jStat.add, 'function', 'linalg methods exist');
assert.strictEqual(typeof jStat.zscore, 'function', 'test methods exist');
assert.strictEqual(typeof jStat.models.ols, 'function', 'models exist');
assert.strictEqual(typeof jStat.buildxmatrix, 'function', 'regression exists');

// Quick numerical smoke test
var pdf = jStat.normal.pdf(0, 0, 1);
assert.ok(pdf > 0.39 && pdf < 0.40, 'normal pdf(0,0,1) is ~0.3989');

console.log('ESM import test: all assertions passed');
SCRIPT
node test/verify-esm.mjs
```

### 7.5 CJS Require Verification (Against New CJS Build)

```bash
cat > test/verify-cjs.js << 'SCRIPT'
var jStat = require('../dist/jstat.cjs.js');
var assert = require('node:assert/strict');

assert.strictEqual(typeof jStat, 'function', 'jStat is a function');
assert.strictEqual(jStat.jStat, jStat, 'jStat.jStat self-reference');
assert.strictEqual(jStat.fn, jStat.prototype, 'jStat.fn alias');
assert.strictEqual(typeof jStat.normal, 'function', 'distributions exist');
assert.strictEqual(typeof jStat.mean, 'function', 'vector methods exist');

// Make sure require() returns the function directly, not {default: fn}
assert.strictEqual(jStat.default, undefined, 'no .default wrapper');

console.log('CJS require test: all assertions passed');
SCRIPT
node test/verify-cjs.js
```

### 7.6 Strict Mode Verification

Rollup's UMD output includes `'use strict'` in the factory function. The
research document confirmed no strict-mode violations exist in the source. The
test suite passing against the Rollup output (which runs in strict mode) is the
definitive verification. However, if any test fails that was not failing before,
investigate whether strict mode is the cause.

### 7.7 Build Time Check

```bash
time npm run build
```

The current build (`make clean core`) takes ~0.6 seconds. Rollup should complete
in under 2 seconds for a project of this size. The terser plugin will be the
bottleneck (similar to uglify-js today).

---

## 8. Cleanup

Only perform these steps after ALL verification checks in Section 7 pass.

### 8.1 Remove `src/_header.js` and `src/_footer.js`

```bash
git rm src/_header.js src/_footer.js
```

These files are no longer referenced by any build step. Their functionality is
replaced by:
- `_header.js` (UMD wrapper) -> Rollup's UMD output format
- `_footer.js` (`jStat.jStat = jStat; return jStat;`) -> `src/index.js`

### 8.2 Remove `uglify-js` Dependency

```bash
npm uninstall uglify-js
```

Minification is now handled by `@rollup/plugin-terser`.

### 8.3 Remove `vows` Dependency (if Not Already Done in Phase 1)

If Phase 1 already removed vows, skip this. Otherwise:

```bash
npm uninstall vows
```

### 8.4 Remove Saved Comparison File

```bash
rm dist/jstat.old.js
```

### 8.5 Remove Temporary Test Scripts

```bash
rm test/verify-esm.mjs test/verify-cjs.js
```

### 8.6 Update `.gitignore` if Needed

If source maps (`.map` files) should not be committed to the repository, add:

```
dist/*.map
```

If they should be committed (for npm publishing), no change is needed. The
recommendation from the research document is to include source maps in
published packages.

### 8.7 Final Test Run

```bash
npm test
```

Confirm same baseline results: 382 tests, 375 passing, 7 known failures.

---

## 9. Completion Criteria

Phase 2 is complete when all of the following are true:

- [ ] `npm run build` produces all four output files:
  - [ ] `dist/jstat.js` (UMD, unminified)
  - [ ] `dist/jstat.min.js` (UMD, minified)
  - [ ] `dist/jstat.esm.mjs` (ES module)
  - [ ] `dist/jstat.cjs.js` (CommonJS)
- [ ] `npm test` passes with the same results as the Phase 1 baseline
      (382 tests, 375 pass, 7 known geomean failures)
- [ ] `require('jstat')` returns the jStat function directly
- [ ] `require('jstat').jStat === require('jstat')` is true
- [ ] `import jStat from 'jstat'` works via the ESM build
- [ ] `jStat.jStat === jStat` is true in all output formats
- [ ] `jStat.fn === jStat.prototype` is true
- [ ] All 23 distributions are accessible (e.g., `jStat.normal.pdf`)
- [ ] The existing `test/umd/commonjs-test.js` passes
- [ ] `src/_header.js` and `src/_footer.js` are deleted
- [ ] `uglify-js` is removed from devDependencies
- [ ] `rollup` and `@rollup/plugin-terser` are in devDependencies
- [ ] `package.json` has `module` and `exports` fields
- [ ] `Makefile` delegates to `npm run build` (no more `cat` concatenation)
- [ ] No source code has been modernized (no `var` to `let`, no arrow functions)
      -- that is Phase 3
- [ ] Each source file follows its documented conversion pattern from Section 2
      (IIFE removed + import added for most files; `export default` added for
      core.js; restructured assignment for models.js; import-only for
      regression.js) -- internal code is untouched
