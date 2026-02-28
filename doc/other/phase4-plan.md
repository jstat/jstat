# Phase 4 Implementation Plan: Linting & Formatting

Concrete, step-by-step plan for adding ESLint, Prettier, and EditorConfig to
the jStat codebase, enforcing consistent code style across all source and test
files. Every change is either a tool-only addition, a whitespace/formatting
change, or a mechanical lint fix with zero public API impact.

**Prerequisite:** Phase 3 (code modernization) is complete. The test suite has
382 tests (375 passing, 7 known geomean float-precision failures). All source
files use ES module syntax with `const`/`let`, arrow functions, and rest
parameters.

**Authoritative reference:** `doc/other/phase4-research.md` contains the full
style inventory and rule-by-rule rationale. This plan distills it into
executable steps.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1: Install Dependencies](#2-step-1-install-dependencies)
3. [Step 2: Create Configuration Files](#3-step-2-create-configuration-files)
4. [Step 3: Add npm Scripts](#4-step-3-add-npm-scripts)
5. [Step 4: Run Prettier (One-Time Format Pass)](#5-step-4-run-prettier-one-time-format-pass)
6. [Step 5: Fix ESLint Violations](#6-step-5-fix-eslint-violations)
7. [Step 6: Convert Test File `var` to `const`/`let`](#7-step-6-convert-test-file-var-to-constlet)
8. [Step 7: Final Verification](#8-step-7-final-verification)
9. [Step 8: Create `.git-blame-ignore-revs`](#9-step-8-create-git-blame-ignore-revs)
10. [Completion Criteria](#10-completion-criteria)

---

## 1. Prerequisites

### 1.1 Verify Baseline

Before making any changes, confirm the build and tests pass:

```bash
npm run build
npm test
```

Expected: 382 tests, 375 passing, 7 failing (geomean float-precision).

Record the current state for comparison:

```bash
wc -c dist/jstat.js dist/jstat.min.js dist/jstat.esm.mjs dist/jstat.cjs.js
```

### 1.2 Verify No Existing Lint/Format Config

Confirm there is no pre-existing configuration to conflict with:

```bash
ls -la .eslintrc* eslint.config* .prettierrc* .editorconfig biome.json 2>/dev/null
```

Expected: no files found. If any exist, investigate before proceeding.

### 1.3 Current Dev Dependencies

The project should have exactly two dev dependencies:

```json
{
  "@rollup/plugin-terser": "^0.4.4",
  "rollup": "^4.59.0"
}
```

Phase 4 will add three more (ESLint, Prettier, eslint-config-prettier).

### 1.4 Files in Scope

| Path | Count | Notes |
|------|------:|-------|
| `src/*.js` | 9 | All source modules |
| `test/**/*-test.js` | 115 | All test files |
| `test/helpers.js` | 1 | Test helper utilities |
| `rollup.config.mjs` | 1 | Build configuration |
| **Total** | **126** | |

### 1.5 Files NOT in Scope

| Path | Reason |
|------|--------|
| `dist/*` | Generated output -- never lint or format |
| `node_modules/*` | Dependencies |
| `doc/**` | Documentation markdown |
| `build/**` | Legacy build tooling |
| `Makefile` | Not JavaScript |

---

## 2. Step 1: Install Dependencies

Install all three dev dependencies in a single command:

```bash
npm install --save-dev eslint prettier eslint-config-prettier
```

This adds:

| Package | Purpose |
|---------|---------|
| `eslint` | Code quality linting |
| `prettier` | Code formatting |
| `eslint-config-prettier` | Disables ESLint rules that conflict with Prettier |

### 2.1 Verify Installation

```bash
npx eslint --version
npx prettier --version
```

Expected: ESLint 9.x or 10.x, Prettier 3.x.

### 2.2 Verify `package.json` Updated

Check that `devDependencies` now has five entries:

```bash
node -e "const p = require('./package.json'); console.log(Object.keys(p.devDependencies).sort().join('\n'))"
```

Expected output (versions may vary):

```
@rollup/plugin-terser
eslint
eslint-config-prettier
prettier
rollup
```

**Do NOT commit yet** -- wait until all configuration files are created.

---

## 3. Step 2: Create Configuration Files

Create four new files. Each is specified exactly below.

### 3.1 `eslint.config.js` (ESLint Flat Config)

The project does not have `"type": "module"` in `package.json`, so the ESLint
config uses CommonJS format.

```javascript
const eslintConfigPrettier = require('eslint-config-prettier/flat');

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
      'no-prototype-builtins': 'off',
      'no-fallthrough': 'off',
      'no-console': 'off'
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
  eslintConfigPrettier
];
```

**Key design decisions:**

| Decision | Rationale |
|----------|-----------|
| Separate config blocks for `src/`, `test/`, `rollup.config.mjs` | Different `sourceType` -- source is ESM, tests are CJS |
| `eqeqeq: error` | All 8 `==` in source are numeric comparisons, safe to convert |
| `no-shadow: warn` (source only) | Some intentional shadowing exists; warn to assess noise level |
| `no-var: error` | Source already uses `const`/`let`; test files still use `var` (fixed in Step 6) |
| `prefer-const` with `destructuring: 'all'` | Least aggressive setting -- only flags when ALL destructured vars are never reassigned |
| `no-array-constructor: error` | Catches `new Array()` (no args) but allows `new Array(n)` for pre-allocation |
| `eslintConfigPrettier` as last entry | Disables all ESLint formatting rules that conflict with Prettier |

### 3.2 `.prettierrc.json`

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

**Option-by-option rationale:**

| Option | Value | Why |
|--------|-------|-----|
| `singleQuote` | `true` | Existing code uses single quotes almost exclusively |
| `trailingComma` | `"none"` | Existing code has no trailing commas; minimizes diff |
| `printWidth` | `100` | Only 2 source lines exceed 100 chars; 80 would over-wrap math expressions |
| `tabWidth` | `2` | Node.js convention; matches majority of the codebase |
| `semi` | `true` | Existing code uses semicolons; fixes the few missing ones |
| `arrowParens` | `"always"` | Prettier default; matches majority of existing code |
| `endOfLine` | `"lf"` | Unix line endings; the existing codebase uses LF |
| `bracketSpacing` | `true` | Prettier default; `{ x }` not `{x}` |

### 3.3 `.prettierignore`

```
dist/
node_modules/
build/
doc/
*.min.js
```

This prevents Prettier from touching generated files, dependencies, legacy
build tooling, and documentation.

### 3.4 `.editorconfig`

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

**Rationale:**

| Setting | Why |
|---------|-----|
| `indent_style = space` | Matches Prettier output and project convention |
| `indent_size = 2` | Matches Prettier `tabWidth: 2` |
| `end_of_line = lf` | Matches Prettier `endOfLine: "lf"` |
| `trim_trailing_whitespace = true` | Already clean; prevents regression |
| `insert_final_newline = true` | POSIX convention |
| `[*.md]` exception | Markdown uses trailing whitespace for line breaks |
| `[Makefile]` exception | Make requires tabs for recipes |

### 3.5 Verify Configuration Files

After creating all four files, verify they exist:

```bash
ls -la eslint.config.js .prettierrc.json .prettierignore .editorconfig
```

All four should be present and non-empty.

---

## 4. Step 3: Add npm Scripts

Add four new scripts to `package.json`. The existing `build` and `test` scripts
remain unchanged.

**Before (`package.json` scripts section):**

```json
{
  "scripts": {
    "build": "rollup -c",
    "test": "npm run build && node --test \"test/**/*-test.js\""
  }
}
```

**After:**

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

| Script | Purpose | Modifies files? |
|--------|---------|:---:|
| `npm run lint` | Check for code quality issues | No |
| `npm run lint:fix` | Auto-fix ESLint issues where possible | Yes |
| `npm run format` | Reformat all files with Prettier | Yes |
| `npm run format:check` | Verify formatting without changes (for CI in Phase 5) | No |

### 4.1 Verify Scripts

```bash
node -e "const p = require('./package.json'); console.log(Object.keys(p.scripts).sort().join('\n'))"
```

Expected:

```
build
format
format:check
lint
lint:fix
test
```

### 4.2 Commit Tooling Changes

Commit the dependency installation, configuration files, and npm scripts as a
standalone commit before running Prettier:

```
chore: add ESLint, Prettier, and EditorConfig configuration
```

This commit includes:
- `package.json` and `package-lock.json` (new devDependencies and scripts)
- `eslint.config.js`
- `.prettierrc.json`
- `.prettierignore`
- `.editorconfig`

No source or test files are modified in this commit.

---

## 5. Step 4: Run Prettier (One-Time Format Pass)

This is a big-bang formatting pass that will touch nearly every file. It must
contain **zero functional changes** -- only whitespace, semicolons, and quote
style.

### 5.1 Preview Changes (Dry Run)

Before writing anything, see what Prettier would change:

```bash
npx prettier --check .
```

This lists all files that would be reformatted. Review the list to confirm it
only includes in-scope files (source, tests, config). If any unexpected files
appear, update `.prettierignore`.

### 5.2 Run Prettier

```bash
npm run format
```

### 5.3 Expected Changes

The Prettier pass will produce these categories of changes:

| Category | Scope | Description |
|----------|-------|-------------|
| Indentation normalization | All files | Standardize to 2-space indent. Largest impact in `linearalgebra.js` (was 4-space) and `regression.js` (was 4-space) |
| Missing semicolons | `vector.js`, `regression.js` | ~5 lines where semicolons were missing |
| Keyword spacing | `distribution.js`, `linearalgebra.js`, `regression.js` | Add space after `if`/`for`/`while` keywords (~20 instances) |
| Brace spacing | `linearalgebra.js`, `regression.js` | Add space before `{` in `){` patterns |
| Operator spacing | `regression.js` | Add spaces around `=`, `<`, etc. |
| Double space collapse | `core.js` | `function  create` becomes `function create` (line 289) |
| Tab to space | `test/models/simple-regression-test.js` | Only test file using tabs |
| Quote normalization | Minimal | Already single quotes almost everywhere |

**No functional changes.** Prettier only reformats; it does not alter program
behavior.

### 5.4 Verify Tests Still Pass

```bash
npm test
```

Expected: same baseline (382 tests, 375 pass, 7 known geomean failures).

If any previously-passing test now fails, a formatting change introduced a
bug. This should not happen with Prettier but must be verified. Investigate
any new failure before proceeding.

### 5.5 Verify Prettier Is Satisfied

```bash
npm run format:check
```

Expected: exit code 0, all files formatted.

### 5.6 Commit the Prettier Pass

Commit this as a standalone commit with no other changes:

```
style: apply Prettier formatting to all source and test files
```

This commit will touch nearly every file. Keeping it as a standalone commit
with zero functional changes allows `git blame --ignore-rev` to skip it
(configured in Step 8).

---

## 6. Step 5: Fix ESLint Violations

After Prettier formatting, the codebase must pass ESLint. This step addresses
all lint violations.

### 6.1 Run ESLint to See Current Violations

```bash
npx eslint .
```

Review the full output. The violations will fall into the categories described
below.

### 6.2 Fix `==` to `===` (Manual -- 8 Operators on 6 Lines)

ESLint's `eqeqeq` rule does **not** auto-fix these cases (it only auto-fixes
when one operand is `typeof` or both are same-type literals). All 8 must be
changed manually.

**`src/distribution.js` (1 line, 2 operators):**

```javascript
// Before
if (alpha == 1 && beta == 1)

// After
if (alpha === 1 && beta === 1)
```

Both are numeric comparisons. Safe.

**`src/special.js` (2 lines, 3 operators):**

```javascript
// Before (line 36)
if ((x == 1.0) || (x == 2.0))

// After
if ((x === 1.0) || (x === 2.0))
```

```javascript
// Before (line 481)
if (shape == oalph)

// After
if (shape === oalph)
```

All numeric comparisons. Safe.

**`src/test.js` (2 lines, 2 operators):**

```javascript
// Before (line 88)
return (args[2] == 1) ?

// After
return (args[2] === 1) ?
```

```javascript
// Before (line 93)
return (args[2] == 1) ?

// After
return (args[2] === 1) ?
```

Both compare a number against the literal `1`. Safe.

**`src/regression.js` (1 line, 1 operator):**

```javascript
// Before (line 59)
if (A.cols() == B.rows())

// After
if (A.cols() === B.rows())
```

Both `.cols()` and `.rows()` return numbers. Safe.

### 6.3 Fix `new Array()` Without Arguments (1 Instance)

**`src/test.js` (anovafscore function):**

```javascript
// Before
sample = new Array();

// After
sample = [];
```

**Do NOT change** `new Array(n)` with a numeric argument -- those are
intentional pre-allocations. ESLint's `no-array-constructor` rule correctly
allows `new Array(n)`.

**Note:** Phase 3 may have already fixed this. If `sample = []` is already
present, skip this sub-step.

### 6.4 Run ESLint Auto-Fix

After the manual fixes above, run ESLint's auto-fixer on source files only:

```bash
npx eslint --fix "src/**/*.js" rollup.config.mjs
```

This will automatically fix:
- Some `let` to `const` conversions via `prefer-const` (variables declared
  with `let` that are never reassigned)

**Important:** Scope this command to source files -- do not run `eslint --fix .`
here. Running `--fix` on all files would also convert test file `var`
declarations, which is deferred to Step 6 as a separate commit. Also, do the
manual `==` fixes first to avoid any interaction between auto-fixes and manual
edits.

### 6.5 Fix Unused Variables (`no-unused-vars`)

Run ESLint again to see remaining violations:

```bash
npx eslint .
```

Expected remaining issues:

**Unused `t` in test callbacks:**

Some test files use the `done` callback pattern where `t` (test context) is
the first parameter but unused:

```javascript
// Before
it('some test', function(t, done) {
  // t is unused, but required to get done as second param
});

// After
it('some test', function(_t, done) {
  // prefix with _ to signal intentional non-use
});
```

Find all instances:

```bash
grep -rn '(t, done)' test/
```

Change each `(t, done)` to `(_t, done)`.

**Unused variables in source files:**

Run ESLint and check for any `no-unused-vars` errors in `src/` files. Common
patterns:

- Variables declared but only used in conditional code paths
- Variables that were unused after Phase 3 refactoring

Fix each by either removing the variable, prefixing with `_`, or adding an
inline ESLint disable comment if the variable is genuinely needed for clarity:

```javascript
// eslint-disable-next-line no-unused-vars
```

Use inline disables sparingly -- prefer actually removing dead code or
renaming.

### 6.6 Review `no-shadow` Warnings

The `no-shadow` rule is set to `warn`. Run ESLint and review the warnings:

```bash
npx eslint . 2>&1 | grep 'no-shadow'
```

Common patterns that produce `no-shadow` warnings in jStat:

```javascript
// Named function expression with local variable sharing the name:
jStat.sum = function sum(arr) {
  let sum = 0;  // shadows the function name "sum"
  // ...
};
```

**Decision tree for each warning:**

1. If the shadowing is intentional and the code is clear (e.g., `sum` inside
   `jStat.sum`), add an inline disable comment:
   ```javascript
   // eslint-disable-next-line no-shadow
   let sum = 0;
   ```

2. If the shadowing is accidental and renaming improves clarity, rename the
   variable.

3. If the warning count is very high (>20) and most are the named-function-
   expression pattern, consider downgrading `no-shadow` to `off` in the ESLint
   config. Update the config and document the decision.

**Important:** `no-shadow` is `warn`, not `error`. The codebase can pass
`eslint` with warnings present. The goal is to review and either fix or
accept each warning, not to achieve zero warnings at any cost.

### 6.7 Remove Dead Code (Optional Cleanup)

Three commented-out `print()` calls exist in `src/regression.js`:

```javascript
//print("regressin!");
//print(jMatX.toArray());
//print(innerinv);
```

These are dead debug statements from the original code. ESLint will not flag
them (they are comments), but removing them improves code cleanliness. This is
optional -- if done, include in the ESLint-fixes commit.

### 6.8 Verify Tests Still Pass

```bash
npm test
```

Expected: same baseline (375 passing, 7 known failures).

### 6.9 Verify ESLint Is Clean for Source Files

```bash
npx eslint "src/**/*.js" rollup.config.mjs
```

Expected: exit code 0 with no errors for source files. Warnings from
`no-shadow` are acceptable if they have been reviewed and accepted.

**Note:** Do not run `npm run lint` (which lints all files) at this stage --
test files still use `var` and will produce `no-var` errors until Step 6.

### 6.10 Re-Run Prettier After ESLint Fixes

ESLint's auto-fixer may produce code that is not Prettier-formatted (e.g.,
different indentation in newly rewritten lines). Re-run Prettier to normalize:

```bash
npm run format
```

Then verify both tools are satisfied:

```bash
npm run format:check
npx eslint "src/**/*.js" rollup.config.mjs
```

Both should exit 0. (Use the scoped lint command because test files still have
`var` at this stage.)

### 6.11 Commit the ESLint Fixes

Commit as a separate commit from the Prettier pass:

```
style: fix ESLint violations across source and test files
```

This commit contains:
- `==` to `===` conversions (8 operators, 6 lines)
- `new Array()` to `[]` (1 instance, if not already done)
- `let` to `const` upgrades (auto-fixed by ESLint)
- Unused variable fixes (`_t` prefix, dead code removal)
- `no-shadow` inline disables (if any)
- Commented-out `print()` removal (if done)

---

## 7. Step 6: Convert Test File `var` to `const`/`let`

Test files still use `var` exclusively (~682 occurrences across 116 files).
The `no-var` ESLint rule is enabled but was not auto-fixed in Step 5 because
the test file `var` to `const`/`let` conversion is large enough to warrant its
own step and commit.

### 7.1 Why a Separate Step

- The conversion touches all 116 test files
- It produces a large diff that should be isolated for review
- The conversion is mechanical but must be verified against the test suite
- Separating it from the ESLint source fixes keeps each commit focused

### 7.2 Run ESLint Auto-Fix on Test Files

ESLint's `--fix` for `no-var` converts `var` to `let`. Then `prefer-const`
upgrades `let` to `const` where the variable is never reassigned.

```bash
npx eslint --fix "test/**/*-test.js" "test/helpers.js"
```

### 7.3 Expected Conversions

The vast majority of `var` declarations in test files will become `const`:

```javascript
// Before (typical test file header)
var { describe, it } = require('node:test');
var assert = require('node:assert/strict');
var { jStat } = require('../helpers.js');

// After
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { jStat } = require('../helpers.js');
```

```javascript
// Before (typical test body)
var x = jStat.normal.pdf(0, 0, 1);

// After
const x = jStat.normal.pdf(0, 0, 1);
```

Variables that are reassigned (rare in test files) will become `let`:

```javascript
// Before
var result = 0;
result = jStat.sum([1, 2, 3]);

// After
let result = 0;
result = jStat.sum([1, 2, 3]);
```

### 7.4 Verify ESLint Auto-Fix Did Not Miss Anything

```bash
npx eslint "test/**/*-test.js" "test/helpers.js"
```

If any `no-var` errors remain, the auto-fixer could not handle them (e.g.,
duplicate declarations in the same scope). Fix these manually.

### 7.5 Re-Run Prettier

ESLint's `--fix` may produce lines that are not Prettier-formatted:

```bash
npm run format
```

### 7.6 Verify Tests Still Pass

```bash
npm test
```

Expected: same baseline (375 passing, 7 known failures).

**Why this is safe:** Test files use a flat structure -- `var` declarations
are at the top of `describe()` or `it()` blocks and are never used before
declaration. There are no hoisting-dependent patterns. ESLint's `--fix`
converts `var` to `let` (safe -- `let` has block scope like `var` has function
scope, and test declarations are always at the top of their block). Then
`prefer-const` upgrades never-reassigned `let` to `const` (always safe).

### 7.7 Verify Full Lint and Format Clean

```bash
npm run lint
npm run format:check
```

Both should exit 0.

### 7.8 Commit the Test Conversion

```
style: convert test file var declarations to const/let
```

---

## 8. Step 7: Final Verification

After the three source-modifying commits (Prettier pass, ESLint fixes, test
var conversion), perform a comprehensive verification.

### 8.1 Full Test Suite

```bash
npm test
```

Expected: 382 tests, 375 passing, 7 known geomean failures.

### 8.2 CJS/ESM/UMD Smoke Tests

```bash
# CJS
node -e "const j = require('./dist/jstat.cjs.js'); console.log(j.jStat.normal.pdf(0, 0, 1))"

# ESM
node --input-type=module -e "import jStat from './dist/jstat.esm.mjs'; console.log(jStat.normal.pdf(0, 0, 1))"

# UMD
node -e "const j = require('./dist/jstat.js'); console.log(j.jStat.normal.pdf(0, 0, 1))"
```

All three should output `0.3989422804014327`.

### 8.3 Lint Clean

```bash
npm run lint
```

Expected: exit 0, no errors. Warnings (from `no-shadow`) are acceptable if
reviewed.

### 8.4 Format Clean

```bash
npm run format:check
```

Expected: exit 0, all files already formatted.

### 8.5 No `var` in Source or Test Files

```bash
grep -rn '^[^/]*\bvar\b' src/*.js test/**/*-test.js test/helpers.js
```

Expected: zero output. All `var` declarations should be converted. (The
pattern `^[^/]*\bvar\b` excludes lines that start with `//` comments.)

### 8.6 No Loose Equality in Source Files

```bash
grep -rn '[^!=]==' src/*.js | grep -v '===' | grep -v '//' | grep -v '/\*'
```

Expected: zero output. All `==` should be converted to `===`. (The pattern
excludes both `//` and `/* */` comment lines.)

### 8.7 Bundle Size Comparison

```bash
wc -c dist/jstat.js dist/jstat.min.js dist/jstat.esm.mjs dist/jstat.cjs.js
```

Compare with the baseline from Step 1.1. The sizes should be roughly the same
-- formatting changes do not affect Rollup's output because the bundler
re-processes from source.

---

## 9. Step 8: Create `.git-blame-ignore-revs`

The Prettier formatting commit touches nearly every file and pollutes
`git blame`. Create a `.git-blame-ignore-revs` file to skip it.

### 9.1 Get the Prettier Commit SHA

```bash
git log --oneline --all | grep "apply Prettier formatting"
```

Note the SHA.

### 9.2 Create the File

Create `.git-blame-ignore-revs` at the project root:

```
# Phase 4: Prettier formatting pass
<SHA of the Prettier formatting commit>
```

Replace `<SHA of the Prettier formatting commit>` with the actual full SHA
(40 characters). For example:

```
# Phase 4: Prettier formatting pass
a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2
```

### 9.3 Configure Git to Use It

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

This is a local setting. Contributors will need to run this command or set it
globally. Phase 5 (CI) can automate this.

### 9.4 Commit

```
chore: add .git-blame-ignore-revs for Prettier formatting commit
```

---

## 10. Completion Criteria

All of the following must be true before Phase 4 is considered complete:

| Criterion | How to Verify |
|-----------|---------------|
| ESLint installed and configured | `npx eslint --version` succeeds; `eslint.config.js` exists |
| Prettier installed and configured | `npx prettier --version` succeeds; `.prettierrc.json` exists |
| `eslint-config-prettier` installed | Listed in `package.json` devDependencies |
| `.editorconfig` exists | `cat .editorconfig` shows indent/EOL settings |
| `.prettierignore` exists | `cat .prettierignore` shows `dist/`, `node_modules/`, etc. |
| npm scripts added | `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check` all work |
| All source files formatted | `npm run format:check` exits 0 |
| All source files pass lint | `npm run lint` exits 0 (no errors) |
| No `var` in source files | `grep -rn '^[^/]*\bvar\b' src/*.js` returns 0 lines |
| No `var` in test files | `grep -rn '^[^/]*\bvar\b' test/**/*-test.js test/helpers.js` returns 0 lines |
| No `==` in source files | All converted to `===` |
| `new Array()` (no args) removed | Changed to `[]` |
| Tests pass (375/382) | `npm test` |
| CJS/ESM/UMD all work | Smoke tests from Section 8.2 |
| `.git-blame-ignore-revs` exists | Contains SHA of Prettier commit |
| 5 commits in order | (1) tooling/config, (2) Prettier pass, (3) ESLint fixes, (4) test var conversion, (5) blame-ignore-revs |

### What is NOT Done in Phase 4

| Item | Phase |
|------|-------|
| CI/CD pipeline | Phase 5 |
| Pre-commit hooks | Phase 5 |
| TypeScript / `@typescript-eslint` | Phase 6 |
| API changes | Never in a style phase |
| Algorithm changes | Never in a style phase |
| New features | Never in a style phase |
