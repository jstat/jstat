# Phase 4 Research: Linting & Formatting

Research document for adding ESLint and Prettier to enforce consistent code style
across the jStat codebase, following the completion of Phases 1-3 (test migration,
build system modernization, and code modernization).

---

## Table of Contents

1. [Environment and Baseline](#1-environment-and-baseline)
2. [Scope Definition](#2-scope-definition)
3. [Current Code Style Inventory](#3-current-code-style-inventory)
4. [Tool Selection](#4-tool-selection)
5. [ESLint Configuration](#5-eslint-configuration)
6. [Prettier Configuration](#6-prettier-configuration)
7. [EditorConfig](#7-editorconfig)
8. [Integration Strategy](#8-integration-strategy)
9. [Migration Steps](#9-migration-steps)
10. [Risks and Open Questions](#10-risks-and-open-questions)

---

## 1. Environment and Baseline

### 1.1 Development Environment

- **Node.js version:** 22.14.0
- **npm version:** 10.x (ships with Node 22)
- **OS:** Linux (Ubuntu-based)
- **Current build:** Rollup 4.59.0 with `@rollup/plugin-terser`
- **Current test runner:** `node:test` (Node built-in)

### 1.2 Current Dev Dependencies

```json
{
    "@rollup/plugin-terser": "^0.4.4",
    "rollup": "^4.59.0"
}
```

Zero production dependencies. Two dev dependencies. This is a minimal footprint
that Phase 4 will necessarily increase, but we should keep the additions as few
as possible.

### 1.3 Current Source Sizes

| File | Lines | Bytes | Description |
|------|------:|------:|-------------|
| `src/core.js` | 661 | 15,932 | Constructor, matrix ops, utilities |
| `src/vector.js` | 551 | 14,323 | Vector/array statistics |
| `src/special.js` | 505 | 12,966 | Gamma, beta, error functions |
| `src/distribution.js` | 1,588 | 40,293 | 23 probability distributions |
| `src/linearalgebra.js` | 938 | 25,082 | Matrix algebra, decomposition, PCA |
| `src/test.js` | 327 | 9,464 | Hypothesis testing |
| `src/models.js` | 105 | 3,183 | OLS regression |
| `src/regression.js` | 206 | 5,536 | Regression utilities |
| `src/index.js` | 13 | 318 | Entry point |
| **Total** | **4,894** | **127,097** | |

### 1.4 Test Suite Sizes

| Directory | Files | Lines |
|-----------|------:|------:|
| `test/core/` | 26 | ~547 |
| `test/vector/` | 34 | ~1,187 |
| `test/distribution/` | 22 | ~1,340 |
| `test/linearalgebra/` | 22 | ~452 |
| `test/special/` | 3 | ~46 |
| `test/test/` | 4 | ~113 |
| `test/models/` | 3 | ~102 |
| `test/umd/` | 1 | ~20 |
| `test/helpers.js` | 1 | 30 |
| **Total** | **116** | **~3,837** |

### 1.5 Current Test Results

- **375 passing, 7 failing** (all 7 are the known `geomean` floating-point
  precision failures, not real bugs)

### 1.6 Existing Lint/Format Config

**None.** There is no `.eslintrc.*`, `eslint.config.*`, `.prettierrc.*`,
`.editorconfig`, `biome.json`, or any other lint/format configuration in the
repository. The codebase has never been linted or auto-formatted.

---

## 2. Scope Definition

### 2.1 What IS Phase 4

Phase 4 enforces consistent code style across all source and test files:

- Add ESLint for catching bugs and enforcing code quality rules
- Add Prettier for consistent formatting (indentation, spacing, line length,
  semicolons, quotes, etc.)
- Add `.editorconfig` for editor-level defaults
- Run a one-time format pass to bring all files into compliance
- Add `lint` and `format` npm scripts
- Ensure lint and format are part of the development workflow

### 2.2 What is NOT Phase 4

- **No CI/CD** -- that is Phase 5. Phase 4 adds the tooling; Phase 5 gates
  it in CI.
- **No TypeScript** -- that is Phase 6. No `@typescript-eslint` rules needed
  yet.
- **No API changes** -- the public API surface must remain 100% identical.
- **No algorithm changes** -- only formatting and style, not logic.
- **No new features** -- purely tooling and style enforcement.
- **No pre-commit hooks** -- that can be added in Phase 5 with CI. Keeping
  Phase 4 focused on the tools themselves reduces scope.

### 2.3 Files in Scope

| Path | Count | Notes |
|------|------:|-------|
| `src/*.js` | 9 | All source modules |
| `test/**/*-test.js` | 115 | All test files |
| `test/helpers.js` | 1 | Test helper utilities |
| `rollup.config.mjs` | 1 | Build configuration |
| **Total** | **126** | |

### 2.4 Files NOT in Scope

| Path | Reason |
|------|--------|
| `dist/*` | Generated output -- never lint or format |
| `node_modules/*` | Dependencies |
| `doc/**` | Documentation markdown |
| `build/**` | Legacy build tooling |
| `*.json` | Prettier can format but low priority |
| `Makefile` | Not JavaScript |

---

## 3. Current Code Style Inventory

This section catalogs every style inconsistency found in the codebase. These
findings inform the ESLint and Prettier configuration choices.

### 3.1 Variable Declarations

Phase 3 converted all `var` in source files to `const`/`let`. The source files
have **zero remaining `var` declarations** (only `var` in comments).

However, **all 116 test files still use `var`** exclusively. There are
approximately **682 `var` occurrences** across test files and `test/helpers.js`.
A typical test file's header looks like:

```javascript
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');
```

(Some files also destructure `assertEpsilon` from `helpers.js`.)

**Decision needed:** Should the one-time format pass also convert test files
from `var` to `const`/`let`? This is a style-only change with no behavioral
impact in test code. Recommendation: **Yes, include it.** ESLint's `no-var`
rule should apply uniformly. The conversion is mostly mechanical -- most `var`
declarations at the top of `it()` blocks or `describe()` blocks can become
`const` (never reassigned). Loop variables (`for (var i = ...)`) will become
`let`. This keeps the entire codebase consistent.

### 3.2 Semicolons

The codebase is **overwhelmingly semicolon-using** but has scattered missing
semicolons. Examples in source files:

```javascript
// src/vector.js, lines 113-115 -- missing semicolons
const logs = arr.map(Math.log)
const meanOfLogs = jStat.mean(logs)
return Math.exp(meanOfLogs)

// src/regression.js, line 41 -- missing semicolon
const pass = new Array(jMat.length)
```

Prettier will enforce semicolons everywhere. No manual action needed -- Prettier
handles this automatically.

### 3.3 Indentation

All files use **spaces** (no tabs in source, tabs only in one test file
`test/models/simple-regression-test.js`).

However, indentation width is **mixed between 2-space and 4-space**:

| File | 2-space lines | 4-space lines | Dominant |
|------|-------------:|-------------:|----------|
| `src/core.js` | 194 | 112 | 2-space |
| `src/vector.js` | 163 | 95 | 2-space |
| `src/special.js` | 183 | 126 | 2-space |
| `src/distribution.js` | 395 | 436 | Mixed |
| `src/linearalgebra.js` | 126 | 373 | 4-space |
| `src/test.js` | 85 | 100 | Mixed |
| `src/models.js` | 48 | 9 | 2-space |
| `src/regression.js` | 33 | 81 | 4-space |

The inconsistency comes from the original codebase having different authors
for different modules. Some files (like `linearalgebra.js` and `regression.js`)
were contributed with 4-space indent; others use 2-space.

**Decision needed:** Settle on one indent width for all files. The majority of
source lines use 2-space indent. The Node.js ecosystem convention is 2-space.
Recommendation: **2 spaces.**

### 3.4 Loose Equality (`==` instead of `===`)

There are **8 non-comment `==` operators** across **6 lines** in source
files that should be `===`:

| File | Line | Code | Safe to convert? |
|------|-----:|------|:---:|
| `src/distribution.js` | 65 | `if (alpha == 1 && beta == 1)` | Yes -- comparing numbers (2 operators) |
| `src/special.js` | 36 | `if ((x == 1.0) \|\| (x == 2.0))` | Yes -- comparing numbers (2 operators) |
| `src/special.js` | 481 | `if (shape == oalph)` | Yes -- comparing numbers |
| `src/test.js` | 88 | `return (args[2] == 1) ?` | Yes -- comparing numbers |
| `src/test.js` | 93 | `return (args[2] == 1) ?` | Yes -- comparing numbers |
| `src/regression.js` | 59 | `if (A.cols() == B.rows())` | Yes -- comparing numbers |

All 8 are numeric comparisons where `==` and `===` behave identically. These
are safe to convert and ESLint's `eqeqeq` rule should enforce it. There are
no cases where loose equality is intentionally exploiting type coercion.

### 3.5 Spacing Inconsistencies

#### 3.5.1 Control Flow Keywords

Mixed spacing after `if`/`for`/`while`:

```javascript
// With space (correct):
if (x > 1) return 0;
for (let i = 0; i < n; i++)

// Without space (wrong):
if(k !== k | 0) {          // src/distribution.js:822
for(let i=0;i<args.length;i++){  // src/regression.js:19
```

There are approximately 20+ instances of `if(`, `for(`, `else if(` missing
the space after the keyword, mostly concentrated in `distribution.js`,
`linearalgebra.js`, and `regression.js`.

#### 3.5.2 Opening Braces

Some lines have `){` with no space before the brace:

```javascript
for(j = 0; j < p; j++){    // src/linearalgebra.js:572
```

Prettier will fix all of these automatically.

#### 3.5.3 Operator Spacing

Inconsistent spacing around operators:

```javascript
// Missing spaces around operators:
for(let i=0;i<args.length;i++){    // src/regression.js:19
ans[i][j]=A[i][j]-B[i][j];        // src/regression.js:201

// Correct spacing elsewhere:
for (let i = 0; i < arr.length; i++)  // src/core.js:178
```

This is mainly a `regression.js` problem -- that file has the most compact
formatting. Prettier will normalize all operator spacing.

#### 3.5.4 Double Spaces

One instance of double space after `function`:

```javascript
jStat.create = function  create(rows, cols, func) {  // src/core.js:289
```

Prettier will collapse this to a single space.

### 3.6 Line Length

The codebase is very well-behaved for line length:

| Threshold | Files exceeding | Lines exceeding |
|----------:|:----------------|----------------:|
| 100 chars | `distribution.js`, `test.js` | 2 |
| 120 chars | `distribution.js` | 1 |
| 150 chars | none | 0 |

The single line exceeding 120 chars is in `src/distribution.js`:
```javascript
if ((Math.log(V) + Math.log(invalpha) - Math.log(a / (us * us) + b)) <= (-lam + k * loglam - jStat.loggam(k + 1))) {
```

A print width of 100 will only need to wrap 2 lines. A print width of 80 would
cause significantly more wrapping in mathematical expressions and is not
recommended for this codebase.

### 3.7 Trailing Whitespace

Source files have **zero trailing whitespace**. This is already clean (likely
from editor settings or Phase 3 cleanup).

### 3.8 Quote Style

The codebase uses **single quotes** almost exclusively. There are very few
double quotes (only in strings containing single quotes). Prettier should
enforce single quotes.

### 3.9 Trailing Commas

The codebase does **not** use trailing commas. Object literals and function
parameter lists do not have trailing commas. We should keep this style since
it matches the existing code.

However, there is a reasonable argument for switching to trailing commas in
multi-line structures. This is a purely cosmetic decision.

Recommendation: **No trailing commas** (`"trailingComma": "none"` in Prettier),
to minimize the diff and match the existing pattern.

### 3.10 Arrow Function Parentheses

Arrow functions with single parameters are currently used **without**
parentheses in most places:

```javascript
const ascNum = (a, b) => a - b;   // multi-param: parens required
const retZero = () => 0;           // no-param: parens required
row.map((t) => t);                 // single-param: currently has parens
```

However, some single-parameter arrow functions have parentheses and some don't.
The Prettier default (`"arrowParens": "always"`) adds parens to all. This is
fine and aligns with the majority of the existing code.

### 3.11 Debug Statements

Three commented-out `print()` calls exist in `src/regression.js`:

```javascript
//print("regressin!");
//print(jMatX.toArray());
//print(innerinv);
```

These are dead code. ESLint's `no-console` (or similar) won't flag them since
they're already commented out, but they could be removed for cleanliness during
the format pass.

### 3.12 `new Array()` Usage

There are **23 instances** of `new Array(...)` across source files. These fall
into two categories:

1. **`new Array(n)` for pre-allocation** (22 instances) -- e.g.,
   `const res = new Array(nrow)`. These are performance-intentional and should
   be kept. ESLint's `no-array-constructor` allows `new Array(n)` with a
   single numeric argument but flags `new Array()` (no arguments) and
   `new Array(a, b, ...)` (multiple arguments).

2. **`new Array()` with no arguments** (1 instance in `src/test.js:127`):
   ```javascript
   sample = new Array();  // should be: sample = []
   ```
   This should be changed to `[]`.

ESLint's `no-array-constructor` rule will flag category 2 but not category 1.

### 3.13 Tab Usage in Tests

One test file uses tabs: `test/models/simple-regression-test.js`. Prettier
will convert these to spaces automatically.

---

## 4. Tool Selection

### 4.1 ESLint

**Version:** ESLint 9.x (latest 9.x: 9.39.3) or ESLint 10.x (latest: 10.0.2)

ESLint 10.0.0 was released on Feb 6, 2026. Both 9.x and 10.x use the **flat
config** format (`eslint.config.js`). ESLint 10 removes the legacy
`.eslintrc.*` format entirely (9.x only deprecated it). Either version works
for this project. ESLint 10 requires Node.js >= 20.19.0 (our Node 22.14.0
qualifies). Since jStat has no existing ESLint config, we start directly with
flat config regardless of which major version we choose.

**Why flat config:**
- It is the current default and recommended format in both ESLint 9 and 10
- Simpler configuration model (just an array of config objects)
- No `extends` keyword -- composition via spread/concat
- ESLint 8.x is EOL
- Node 22 fully supports it

### 4.2 Prettier

**Version:** Prettier 3.x (latest: 3.8.1)

Prettier handles all formatting decisions. ESLint handles code quality rules.
There is no overlap when using `eslint-config-prettier` to disable ESLint's
formatting rules.

**Why Prettier over ESLint formatting rules:**
- Prettier is opinionated and deterministic -- no debates about individual
  formatting rules
- Prettier reformats the entire file consistently
- ESLint's formatting rules are deprecated in ESLint 9 (the `@stylistic`
  plugin exists but adds complexity)
- Prettier + ESLint is the standard industry practice

### 4.3 eslint-config-prettier

**Version:** 10.x (latest: 10.1.8)

Disables all ESLint rules that would conflict with Prettier. Required when
using ESLint and Prettier together.

### 4.4 Total New Dev Dependencies

| Package | Purpose | Approximate Size |
|---------|---------|-----------------|
| `eslint` | Linting | ~3.5 MB |
| `prettier` | Formatting | ~7.5 MB |
| `eslint-config-prettier` | Disables conflicting rules | ~15 KB |
| **Total** | | **~11 MB** |

Three new dev dependencies. This is acceptable for a project that previously
had no code quality tooling at all.

---

## 5. ESLint Configuration

### 5.1 Configuration File

Use `eslint.config.js` (flat config, CommonJS -- since the project does not
have `"type": "module"` in `package.json`).

**Note:** The entry point for the Rollup config is `rollup.config.mjs` (explicit
`.mjs` extension), so it runs as ESM regardless of the package.json `type`
field. The ESLint config should be `.js` (CommonJS) to match the project
default.

### 5.2 Proposed Configuration

```javascript
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    // Global ignores (equivalent to .eslintignore)
    ignores: [
      'dist/**',
      'node_modules/**',
      'build/**',
      'doc/**'
    ]
  },
  {
    // Source files
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      // --- Error prevention ---
      'eqeqeq': ['error', 'always'],
      'no-undef': 'error',
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-redeclare': 'error',
      'no-shadow': 'warn',
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],

      // --- Code quality ---
      'no-array-constructor': 'error',
      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'warn',

      // --- Disabled / intentionally off ---
      'no-prototype-builtins': 'off',     // not needed -- no prototype builtin calls in codebase
      'no-fallthrough': 'off',            // not needed -- no switch statements in the codebase
      'no-console': 'off'                 // no console usage in source anyway
    }
  },
  {
    // Test files
    files: ['test/**/*-test.js', 'test/helpers.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs'
    },
    rules: {
      'eqeqeq': ['error', 'always'],
      'no-undef': 'error',
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-redeclare': 'error',
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-array-constructor': 'error'
    }
  },
  {
    // Rollup config
    files: ['rollup.config.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  // Disable rules that conflict with Prettier
  prettier
];
```

### 5.3 Rule-by-Rule Rationale

#### Error Prevention Rules

| Rule | Setting | Rationale |
|------|---------|-----------|
| `eqeqeq` | `error` | 8 loose `==` across 6 lines in source, all safe to convert to `===` |
| `no-undef` | `error` | Catches typos and missing imports; critical since source uses ESM |
| `no-unused-vars` | `error` | Catches dead code; `_` prefix pattern allows intentional ignores |
| `no-redeclare` | `error` | Prevents accidental re-declaration of variables |
| `no-shadow` | `warn` | Some intentional shadowing exists (e.g., `sum` inside `jStat.sum`); warn only |
| `no-var` | `error` | Phase 3 converted all source `var`; prevents regression |
| `prefer-const` | `error` | Enforces `const` where `let` is not needed |

#### Code Quality Rules

| Rule | Setting | Rationale |
|------|---------|-----------|
| `no-array-constructor` | `error` | `new Array()` (no args) and `new Array(a, b)` (multiple args) should be `[]`/`[a, b]`. `new Array(n)` (single numeric) is allowed |
| `no-new-wrappers` | `error` | `new Number()`, `new String()`, etc. are always bugs |
| `no-throw-literal` | `error` | Should throw `Error` objects, not strings |
| `no-self-compare` | `error` | `x === x` is always `true` (old NaN check pattern) |
| `no-template-curly-in-string` | `warn` | Catches `'${x}'` instead of `` `${x}` `` |

#### Intentionally Disabled Rules

| Rule | Setting | Rationale |
|------|---------|-----------|
| `no-prototype-builtins` | `off` | Not needed -- no `.hasOwnProperty()` / `.isPrototypeOf()` calls in codebase |
| `no-fallthrough` | `off` | Not needed -- no switch statements in the codebase |
| `no-console` | `off` | No console usage exists; not worth enforcing |

### 5.4 Rules NOT Included (and why)

These commonly-seen rules are intentionally excluded:

| Rule | Why excluded |
|------|-------------|
| All `@stylistic/*` rules | Formatting is Prettier's job, not ESLint's |
| `semi` | Prettier handles semicolons |
| `indent` | Prettier handles indentation |
| `quotes` | Prettier handles quote style |
| `comma-dangle` | Prettier handles trailing commas |
| `max-len` | Prettier handles line length |
| `curly` | Debatable -- the codebase intentionally uses braceless `if` for single-line bodies; enforcing braces would cause a very large diff with no safety benefit |
| `no-plusplus` | `++`/`--` are used extensively and correctly throughout (e.g., `while (--i >= 0)`) |
| `no-continue` | Not an issue in this codebase |
| `no-param-reassign` | Too many legitimate parameter reassignment patterns (e.g., `args = tmpargs` in test.js) |
| `no-restricted-syntax` | No need for this |
| `no-use-before-define` | Would flag function hoisting which is used in some files |
| `consistent-return` | Many functions intentionally return `undefined` on some paths |

### 5.5 Expected Lint Violations to Fix

Before the codebase will pass `eslint`, these issues need to be resolved:

#### Source files (`src/*.js`)

| Issue | Count | Fix |
|-------|------:|-----|
| `==` to `===` | 8 (6 lines) | Manual replacement (see Step 5b) |
| `new Array()` (no args) | 1 | Change to `[]` |
| Possible `no-unused-vars` | TBD | Need to run ESLint to discover; likely ~3-5 |
| Possible `no-shadow` (warn) | TBD | Review and either rename or suppress |

#### Test files (`test/**/*-test.js`, `test/helpers.js`)

| Issue | Count | Fix |
|-------|------:|-----|
| `var` to `const`/`let` | ~682 | Mechanical conversion -- most become `const`, loop variables become `let` |
| Possible `no-unused-vars` | TBD | Likely from `(t, done)` test signatures where `t` is unused |

The `no-unused-vars` issue with `(t, done)` in test callbacks is a known
pattern in `node:test`. The destructured `t` (test context) is required by the
API to get `done` as the second parameter. Solution: prefix with `_`:
`(_t, done)`.

---

## 6. Prettier Configuration

### 6.1 Configuration File

Use `.prettierrc.json` (JSON format, simple and unambiguous).

### 6.2 Proposed Configuration

```json
{
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true
}
```

### 6.3 Option-by-Option Rationale

| Option | Value | Rationale |
|--------|-------|-----------|
| `singleQuote` | `true` | Existing code uses single quotes almost exclusively |
| `trailingComma` | `"none"` | Existing code does not use trailing commas; minimizes diff |
| `printWidth` | `100` | Only 2 source lines exceed 100 chars. 80 would cause too many wraps in mathematical expressions. 100 is a good balance |
| `tabWidth` | `2` | 2-space indent is the Node.js convention and matches the majority of the codebase |
| `semi` | `true` | Existing code uses semicolons; a few are missing and this fixes them |
| `arrowParens` | `"always"` | Prettier default; matches majority of existing code |
| `endOfLine` | `"lf"` | Unix line endings; the existing codebase uses LF |
| `bracketSpacing` | `true` | Prettier default; `{ x }` not `{x}` |

### 6.4 Prettier Ignore File

Create `.prettierignore`:

```
dist/
node_modules/
build/
doc/
*.min.js
```

### 6.5 Impact Assessment

Running Prettier across the codebase will produce changes in nearly every file.
The most significant changes will be:

1. **Indentation normalization** -- all files standardized to 2-space indent.
   This will be the largest category of changes, especially in
   `linearalgebra.js` (currently 4-space) and `regression.js` (currently
   4-space).

2. **Missing semicolon insertion** -- a handful of lines in `vector.js`
   and `regression.js`.

3. **Spacing normalization** -- spaces after `if`/`for`, before `{`, around
   operators. Mainly in `regression.js`, `distribution.js`, and
   `linearalgebra.js`.

4. **Tab-to-space conversion** -- only `test/models/simple-regression-test.js`.

5. **Quote normalization** -- very few changes (already single quotes).

6. **No functional changes** -- Prettier only reformats; it does not alter
   program behavior.

---

## 7. EditorConfig

### 7.1 Purpose

`.editorconfig` ensures that editors and IDEs use consistent settings when
editing files in the project. It is supported by VS Code, Vim, Emacs,
JetBrains IDEs, and many others (natively or via plugin).

### 7.2 Proposed Configuration

```ini
# EditorConfig: https://editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

### 7.3 Rationale

- **`indent_style = space`**: Matches Prettier's output and the project
  convention.
- **`indent_size = 2`**: Matches Prettier's `tabWidth: 2`.
- **`end_of_line = lf`**: Unix line endings, matching Prettier's `endOfLine`.
- **`charset = utf-8`**: Standard.
- **`trim_trailing_whitespace = true`**: Already clean, prevents regression.
- **`insert_final_newline = true`**: POSIX convention for text files.
- **`[*.md]` exception**: Markdown uses trailing whitespace for line breaks.
- **`[Makefile]` exception**: Make requires tabs for recipes.

---

## 8. Integration Strategy

### 8.1 ESLint + Prettier Integration

The standard pattern is:

1. **Prettier** handles all formatting (indentation, spacing, semicolons,
   quotes, line length, etc.)
2. **ESLint** handles code quality rules only (no formatting rules)
3. **`eslint-config-prettier`** disables any ESLint rules that would conflict
   with Prettier

This means:
- `npx prettier --write .` reformats code
- `npx eslint .` checks code quality
- There are **no conflicts** between the two tools

### 8.2 npm Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "build": "rollup -c",
    "test": "npm run build && node --test \"test/**/*-test.js\"",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

**Script descriptions:**
- `npm run lint` -- check for code quality issues (no changes)
- `npm run lint:fix` -- auto-fix ESLint issues where possible (e.g.,
  `var` to `let`, `let` to `const`)
- `npm run format` -- reformat all files with Prettier
- `npm run format:check` -- verify formatting without changing files (for CI
  in Phase 5)

### 8.3 Running Order

When fixing the codebase:

1. Run Prettier first (`npm run format`) -- this handles all formatting
2. Run ESLint fix (`npm run lint:fix`) -- this handles code quality auto-fixes
3. Manually fix any remaining ESLint errors
4. Verify tests pass (`npm test`)

After setup, the typical developer workflow is:
1. Write code
2. `npm run format` (or editor "format on save")
3. `npm run lint` (or editor integration)
4. `npm test`

---

## 9. Migration Steps

### Step 1: Install Dependencies

```bash
npm install --save-dev eslint prettier eslint-config-prettier
```

This adds 3 new dev dependencies to `package.json`.

### Step 2: Create Configuration Files

Create these files:

- `eslint.config.js` -- ESLint flat config (Section 5.2)
- `.prettierrc.json` -- Prettier config (Section 6.2)
- `.prettierignore` -- Prettier ignore patterns (Section 6.4)
- `.editorconfig` -- Editor defaults (Section 7.2)

### Step 3: Add npm Scripts

Add `lint`, `lint:fix`, `format`, and `format:check` scripts to
`package.json` (Section 8.2).

### Step 4: Run Prettier (One-Time Format Pass)

```bash
npx prettier --write .
```

This will reformat all files in scope. The changes should be committed as a
single commit with a clear message indicating it is a formatting-only change,
for example: `style: apply Prettier formatting to all source and test files`.

This commit will touch nearly every file. It should be a standalone commit with
no functional changes, so `git blame` can use `--ignore-rev` to skip it.

### Step 5: Fix ESLint Violations

#### 5a: Auto-fixable issues

```bash
npx eslint --fix .
```

This will automatically fix:
- `var` to `let` in test files (via `no-var` with `--fix`)
- Some `let` to `const` conversions (via `prefer-const` with `--fix`)

**Note:** `eqeqeq` does **not** auto-fix the `==` cases in this codebase.
ESLint only auto-fixes `==` when one operand is `typeof` or both are
same-type literals. The 8 `==` operators (variable-to-number and
variable-to-variable comparisons) must be fixed manually (see Step 5b).

#### 5b: Manual fixes

After auto-fix, run `npx eslint .` to see remaining issues. Expected manual
fixes:

1. **`==` to `===`** -- all 8 `==` operators across 6 lines (Section 3.4)
   must be changed manually. ESLint's `eqeqeq` rule does not auto-fix these
   cases.

2. **`new Array()` in `src/test.js:127`** -- change `sample = new Array()` to
   `sample = []`.

3. **Unused `t` in test callbacks** -- change `(t, done)` to `(_t, done)` in
   test files that use the done callback pattern. To find these:
   ```bash
   grep -rn '(t, done)' test/
   ```

4. **Review `no-shadow` warnings** -- these are warnings, not errors. Review
   each case and either rename the variable or add an ESLint disable comment
   if the shadowing is intentional. For example, `jStat.sum` has a local
   variable `sum` that shadows the outer function name -- this is fine and
   intentional.

5. **Review `no-unused-vars` errors** -- run ESLint and check for any unused
   variables. Some may exist in distribution.js where variables are declared
   but only used in specific code paths.

#### 5c: Commit fixes

The ESLint fixes should also be committed as a single commit:
`style: fix ESLint violations across source and test files`

### Step 6: Verify Tests Pass

```bash
npm test
```

The test suite baseline (382 total: 375 passing, 7 known geomean
floating-point failures) should remain unchanged. If any previously-passing
test now fails, the formatting or lint fix introduced a bug -- investigate
and fix before proceeding.

### Step 7: Verify Clean Lint and Format

```bash
npm run lint          # should exit 0 with no errors
npm run format:check  # should exit 0 with no changes needed
```

### Step 8: Update .gitignore

No changes needed -- `.gitignore` already excludes `dist/` outputs and
`node_modules/`.

### Step 9: Create .git-blame-ignore-revs

Create `.git-blame-ignore-revs` with the SHA of the Prettier formatting commit.
This allows `git blame` to skip the formatting commit:

```
# Phase 4: Prettier formatting pass
<SHA of the formatting commit>
```

Configure git to use it:
```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

---

## 10. Risks and Open Questions

### 10.1 Large Formatting Diff

**Risk:** The Prettier formatting commit will touch nearly every file and
produce a very large diff. This makes code review harder and `git blame`
less useful.

**Mitigation:**
- Use `.git-blame-ignore-revs` (Step 9) to skip the formatting commit in
  `git blame`.
- The formatting commit must contain **zero** functional changes -- only
  whitespace, semicolons, and quote style.
- Commit the Prettier pass and ESLint fixes as separate commits for clean
  history.

### 10.2 Behavioral Changes from `==` to `===`

**Risk:** Converting `==` to `===` could change behavior if the operands have
different types.

**Mitigation:** All 8 operators across 6 lines have been analyzed (Section 3.4).
Every one compares numeric values where `==` and `===` behave identically. The
test suite (375 passing tests) provides further assurance.

### 10.3 `var` to `const`/`let` in Test Files

**Risk:** Converting `var` to `const` or `let` in test files could
theoretically cause issues if a variable is used before its declaration (TDZ)
or if the same name is declared twice in the same scope.

**Mitigation:** Test files use a flat structure (declare at top of `it()` or
`describe()` blocks). There are no hoisting-dependent patterns in test code.
ESLint's `--fix` for `no-var` converts `var` to `let`, and then
`prefer-const` upgrades to `const` where the variable is never reassigned.
The test suite validates the result.

### 10.4 `no-shadow` False Positives

**Risk:** The `no-shadow` rule may produce many warnings for legitimate
patterns. For example, `jStat.sum = function sum(arr) { let sum = 0; ... }`
shadows the outer `sum` name, but this is intentional and harmless.

**Mitigation:** Set `no-shadow` to `warn` (not `error`) initially. After
seeing the actual warnings, decide whether to address them or disable the rule.
If the warning count is too high to be useful, downgrade to `off`.

### 10.5 ESLint `no-undef` for Source Files

**Risk:** Source files use ES module syntax (`import`/`export`). ESLint with
`sourceType: 'module'` should handle this correctly. However, the files
reference `Math`, `Array`, `Number`, etc. which are globals.

**Mitigation:** ESLint's default environment includes all standard JavaScript
globals (`Math`, `Array`, `Object`, `Number`, `parseInt`, `Infinity`, `NaN`,
etc.). These are available when `ecmaVersion` is set. The `sourceType: 'module'`
setting also implicitly enables strict mode. No special globals configuration
should be needed, but if `no-undef` flags legitimate globals, add them to
`languageOptions.globals`.

### 10.6 Test File `sourceType`

**Risk:** Test files use `require()` (CommonJS). ESLint needs
`sourceType: 'commonjs'` for test files, but `sourceType: 'module'` for source
files.

**Mitigation:** The proposed config (Section 5.2) already uses separate config
blocks for `src/**/*.js` (module) and `test/**/*-test.js` + `test/helpers.js`
(commonjs). The `sourceType: 'commonjs'` setting allows `require()` without
ESLint errors.

### 10.7 Build Output Validation

**Risk:** After formatting, the built output (`dist/*.js`) will be different
(because the source formatting changed). This is expected and safe -- Rollup
re-bundles from source.

**Mitigation:** Run `npm test` after the format pass. Tests load `dist/jstat.js`
(rebuilt by the `test` script), so passing tests confirm behavioral equivalence.

### 10.8 Open Question: `no-shadow` Scope

The `no-shadow` rule may produce a large number of warnings because the
codebase uses named function expressions assigned to object properties:

```javascript
jStat.sum = function sum(arr) {
  let sum = 0;  // shadows the function name "sum"
  // ...
};
```

This pattern exists throughout `vector.js`, `core.js`, `special.js`, and
`distribution.js`. Each named function expression creates a function-scoped
binding that can shadow an outer `let`/`const`.

**Options:**
1. Keep `no-shadow` at `warn` and accept the noise
2. Set `no-shadow` to `off` if the warning count is impractical
3. Use `no-shadow` with `{ "allow": [...] }` to whitelist specific names

Recommendation: Start with `warn`, assess the output, and adjust.

### 10.9 Open Question: Should We Lint `dist/` Files?

**No.** The `dist/` directory contains generated output. Linting it would
produce errors (UMD wrapper patterns don't pass modern lint rules) and serves
no purpose. The ESLint config explicitly ignores `dist/**`.

### 10.10 Open Question: `prefer-const` Aggressiveness

The `prefer-const` rule with `{ destructuring: 'all' }` means that `const` is
only enforced when **all** destructured variables are never reassigned. This
is the least aggressive setting. The alternative (`{ destructuring: 'any' }`)
would flag destructuring where any single variable could be `const`, which
leads to awkward patterns like splitting destructuring into separate `const`
and `let` declarations.

Recommendation: Keep `{ destructuring: 'all' }` for a clean, non-disruptive
experience.
