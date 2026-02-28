# Phase 5 Implementation Plan: CI/CD

Concrete, step-by-step plan for adding GitHub Actions CI/CD pipelines to the
jStat project. Every change is either a new configuration file or a minor
`package.json` metadata addition. Zero new dependencies, zero public API
changes, zero source code changes (except fixing the 7 known test failures so
CI is green from the start).

**Prerequisite:** Phase 4 (linting & formatting) is complete. The test suite has
382 tests (375 passing, 7 known geomean float-precision failures). ESLint and
Prettier are configured and passing. All source and test files use modern
`const`/`let` syntax.

**Authoritative reference:** `doc/other/phase5-research.md` contains the full
architecture analysis, action version selection, and risk assessment. This plan
distills it into executable steps.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1: Fix the 7 Known Test Failures](#2-step-1-fix-the-7-known-test-failures)
3. [Step 2: Add `engines` Field to `package.json`](#3-step-2-add-engines-field-to-packagejson)
4. [Step 3: Create CI Workflow](#4-step-3-create-ci-workflow)
5. [Step 4: Create Release Workflow](#5-step-4-create-release-workflow)
6. [Step 5: Push and Verify](#6-step-5-push-and-verify)
7. [Step 6: Configure Branch Protection](#7-step-6-configure-branch-protection)
8. [Step 7: Configure npm Trusted Publishing](#8-step-7-configure-npm-trusted-publishing)
9. [Completion Criteria](#9-completion-criteria)

---

## 1. Prerequisites

### 1.1 Verify Baseline

Before making any changes, confirm the build, tests, lint, and format all work:

```bash
npm run build
npm test
npm run lint
npm run format:check
```

Expected:
- Build succeeds, producing four dist files.
- 382 tests total, 375 passing, 7 failing (geomean float-precision).
- ESLint exits 0 (no errors, 11 `no-shadow` warnings).
- Prettier exits 0 (all files formatted).

### 1.2 Verify No Existing CI Configuration

Confirm there is no pre-existing CI configuration:

```bash
ls -la .github/ .travis.yml .circleci/ 2>/dev/null
```

Expected: nothing found (or only `.github/` directory without a `workflows/`
subdirectory).

### 1.3 Current Dev Dependencies

The project should have exactly five dev dependencies:

```json
{
    "@rollup/plugin-terser": "^0.4.4",
    "eslint": "^10.0.2",
    "eslint-config-prettier": "^10.1.8",
    "prettier": "^3.8.1",
    "rollup": "^4.59.0"
}
```

Phase 5 adds **zero** new dependencies. CI/CD is purely YAML configuration
files.

### 1.4 Current npm Scripts

All scripts needed for CI already exist:

```json
{
    "build": "rollup -c",
    "test": "npm run build && node --test \"test/**/*-test.js\"",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
}
```

No new scripts are added in Phase 5.

### 1.5 Files to Create

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | CI workflow (lint, format, test matrix, build verification) |
| `.github/workflows/release.yml` | Release/publish workflow (tag-triggered npm publish) |

### 1.6 Files to Modify

| File | Change |
|------|--------|
| `package.json` | Add `engines` field |
| `test/vector/geomean-test.js` | Fix 7 assertions to use epsilon comparison |

---

## 2. Step 1: Fix the 7 Known Test Failures

Before CI can enforce zero failures, the 7 `geomean` tests must be fixed. These
tests use `assert.strictEqual` and `assert.deepStrictEqual` (bit-exact
comparison) on floating-point results that have inherent precision variance
across different computation paths. They should use `assertEpsilon` and
`assertArrayEpsilon` from the test helpers.

### 2.1 Why This Must Come First

CI must be green from the first push. A CI pipeline that fails on every run is
worse than no CI at all -- it trains everyone to ignore failures. Fixing these
7 tests is a prerequisite, not optional cleanup.

### 2.2 Current File

The file is `test/vector/geomean-test.js`. It currently has 7 assertions across
7 test cases that use strict equality:

```javascript
// 5 uses of assert.strictEqual on float results
assert.strictEqual(jStat.geomean([1, 2, 3]), 1.8171205928321397);
assert.strictEqual(jStat([1, 2, 3]).geomean(), 1.8171205928321397);
assert.strictEqual(jStat([[1, 2], [3, 4]]).geomean(true), 2.2133638394006434);
assert.strictEqual(val, 1.8171205928321397);
assert.strictEqual(val, 2.2133638394006434);

// 2 uses of assert.deepStrictEqual on float arrays
assert.deepStrictEqual(jStat([[1, 2], [3, 4]]).geomean(), [1.7320508075688772, 2.8284271247461903]);
assert.deepStrictEqual(val, [1.7320508075688772, 2.8284271247461903]);
```

### 2.3 Replacement File

Replace the entire contents of `test/vector/geomean-test.js` with:

```javascript
const { describe, it } = require('node:test');
const { jStat, assertEpsilon, assertArrayEpsilon } = require('../helpers.js');

const EPS = 1e-14;

describe('geomean', function () {
  it('return basic geomean', function () {
    assertEpsilon(EPS, jStat.geomean([1, 2, 3]), 1.8171205928321397);
  });
  it('geomean from instance', function () {
    assertEpsilon(EPS, jStat([1, 2, 3]).geomean(), 1.8171205928321397);
  });
  it('geomean matrix cols', function () {
    assertArrayEpsilon(
      EPS,
      jStat([
        [1, 2],
        [3, 4]
      ]).geomean(),
      [1.7320508075688772, 2.8284271247461903]
    );
  });
  it('geomean full matrix', function () {
    assertEpsilon(
      EPS,
      jStat([
        [1, 2],
        [3, 4]
      ]).geomean(true),
      2.2133638394006434
    );
  });
});

describe('#geomean vector', function () {
  it('geomean callback', function (t, done) {
    jStat([1, 2, 3]).geomean(function (val) {
      assertEpsilon(EPS, val, 1.8171205928321397);
      done();
    });
  });
});

describe('#geomean matrix cols', function () {
  it('geomean matrix cols callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).geomean(function (val) {
      assertArrayEpsilon(EPS, val, [1.7320508075688772, 2.8284271247461903]);
      done();
    });
  });
});

describe('#geomean full matrix', function () {
  it('geomean full matrix callback', function (t, done) {
    jStat([
      [1, 2],
      [3, 4]
    ]).geomean(true, function (val) {
      assertEpsilon(EPS, val, 2.2133638394006434);
      done();
    });
  });
});
```

**Changes from the original:**

| Change | Count | Description |
|--------|------:|-------------|
| Remove `assert` import | 1 | No longer needed -- all assertions use helpers |
| Import `assertEpsilon`, `assertArrayEpsilon` | 1 | From `test/helpers.js` |
| Add `EPS` constant | 1 | `1e-14` tolerance for float comparison |
| `assert.strictEqual` to `assertEpsilon` | 5 | Scalar float comparisons |
| `assert.deepStrictEqual` to `assertArrayEpsilon` | 2 | Array float comparisons |

### 2.4 Verify the Fix

```bash
npm test
```

Expected: **382 tests, 382 passing, 0 failing.**

This is the first time in the modernization project that all tests pass. Confirm
the count is exactly 382 with 0 failures before proceeding.

### 2.5 Verify Lint and Format

The modified test file must still pass lint and format:

```bash
npm run lint
npm run format:check
```

Both should exit 0. If Prettier reformats the file, run `npm run format` first,
then re-verify.

### 2.6 Commit

```
fix: use epsilon comparison for geomean tests (7 float-precision failures)
```

This commit modifies only `test/vector/geomean-test.js`.

---

## 3. Step 2: Add `engines` Field to `package.json`

### 3.1 Why

The modernized codebase requires Node.js >= 20.0.0:

- `node:test` is stable from Node 20 onward.
- ESLint 10 requires Node >= 20.19.0.
- Node 18 is EOL (ended April 2025).

The `engines` field documents this minimum for consumers and tooling.

### 3.2 Change

Add the `engines` field to `package.json`. Place it after the `repository` field
and before `devDependencies`:

**Before:**

```json
  "repository": {
    "type": "git",
    "url": "http://github.com/jstat/jstat.git"
  },
  "devDependencies": {
```

**After:**

```json
  "repository": {
    "type": "git",
    "url": "http://github.com/jstat/jstat.git"
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "devDependencies": {
```

### 3.3 Verify

```bash
node -e "const p = require('./package.json'); console.log(JSON.stringify(p.engines))"
```

Expected: `{"node":">=20.0.0"}`

**Note:** The `engines` field is advisory by default. It does not prevent
installation on older Node versions unless the consumer sets
`engine-strict=true` in their `.npmrc`. This is the standard approach for
library packages.

### 3.4 Verify Tests Still Pass

```bash
npm test
```

Expected: 382 tests, 382 passing, 0 failing.

### 3.5 Do NOT Commit Yet

This change will be committed together with the workflow files in Step 3 to keep
the CI-related changes in a single commit.

---

## 4. Step 3: Create CI Workflow

### 4.1 Create Directory

```bash
mkdir -p .github/workflows
```

### 4.2 Create `.github/workflows/ci.yml`

Create the file with the following exact contents:

```yaml
name: CI

on:
  push:
    branches: [2.x, 1.x]
  pull_request:
    branches: [2.x, 1.x]
  workflow_call:   # Allow reuse from release.yml

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  lint-and-format:
    name: Lint & Format
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24.x
          cache: npm
          cache-dependency-path: package.json

      - name: Install dependencies
        run: npm install

      - name: Lint
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

  build-and-test:
    name: Test (Node ${{ matrix.node-version }})
    runs-on: ubuntu-latest
    needs: lint-and-format
    strategy:
      matrix:
        node-version: ['20.x', '22.x', '24.x']
      fail-fast: false
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
          cache-dependency-path: package.json

      - name: Install dependencies
        run: npm install

      - name: Build and test
        run: npm test

  verify-build:
    name: Verify Build Output
    runs-on: ubuntu-latest
    needs: build-and-test
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24.x
          cache: npm
          cache-dependency-path: package.json

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Verify dist files exist and are non-trivial
        run: |
          echo "Checking dist/jstat.js..."
          test -f dist/jstat.js || (echo "FAIL: dist/jstat.js not found" && exit 1)
          size=$(wc -c < dist/jstat.js)
          test "$size" -gt 100000 || (echo "FAIL: dist/jstat.js too small ($size bytes)" && exit 1)
          echo "  OK ($size bytes)"

          echo "Checking dist/jstat.min.js..."
          test -f dist/jstat.min.js || (echo "FAIL: dist/jstat.min.js not found" && exit 1)
          size=$(wc -c < dist/jstat.min.js)
          test "$size" -gt 40000 || (echo "FAIL: dist/jstat.min.js too small ($size bytes)" && exit 1)
          echo "  OK ($size bytes)"

          echo "Checking dist/jstat.esm.mjs..."
          test -f dist/jstat.esm.mjs || (echo "FAIL: dist/jstat.esm.mjs not found" && exit 1)
          size=$(wc -c < dist/jstat.esm.mjs)
          test "$size" -gt 100000 || (echo "FAIL: dist/jstat.esm.mjs too small ($size bytes)" && exit 1)
          echo "  OK ($size bytes)"

          echo "Checking dist/jstat.cjs.js..."
          test -f dist/jstat.cjs.js || (echo "FAIL: dist/jstat.cjs.js not found" && exit 1)
          size=$(wc -c < dist/jstat.cjs.js)
          test "$size" -gt 100000 || (echo "FAIL: dist/jstat.cjs.js too small ($size bytes)" && exit 1)
          echo "  OK ($size bytes)"

      - name: Verify UMD bundle loads
        run: node -e "const j = require('./dist/jstat.js'); console.assert(typeof j.mean === 'function', 'jstat.mean not a function'); console.log('UMD OK')"

      - name: Verify CJS bundle loads
        run: node -e "const j = require('./dist/jstat.cjs.js'); console.assert(typeof j.mean === 'function', 'jstat.mean not a function'); console.log('CJS OK')"

      - name: Verify ESM bundle loads
        run: node --input-type=module -e "import j from './dist/jstat.esm.mjs'; console.assert(typeof j.mean === 'function', 'jstat.mean not a function'); console.log('ESM OK')"
```

### 4.3 Design Decisions

| Decision | Rationale |
|----------|-----------|
| `ubuntu-latest` for all jobs | Pure JS library, no platform-specific behavior. Cheapest and fastest runner. |
| `actions/checkout@v6`, `actions/setup-node@v6` | Current stable versions maintained by GitHub. |
| `cache: npm` with `cache-dependency-path` | Caches `~/.npm` keyed on `package.json`. Required because jStat has no lockfile and `cache: npm` defaults to keying on `package-lock.json`. |
| `npm install` (not `npm ci`) | jStat intentionally omits `package-lock.json`. `npm ci` requires a lockfile and would fail. |
| `fail-fast: false` on test matrix | All Node versions run to completion even if one fails. Helps diagnose version-specific issues. |
| `needs` dependency chain | Lint runs first (~30s). If it fails, test matrix (3 jobs) is skipped, saving runner minutes. |
| `permissions: contents: read` | Least privilege. CI does not need write access. GitHub security best practice. |
| `concurrency` with `cancel-in-progress` | Cancels stale CI runs when new pushes arrive to the same branch. Saves runner minutes. |
| `workflow_call` trigger | Allows the release workflow to reuse the CI workflow, running the full CI suite before publishing. |
| Branches `[2.x, 1.x]` only | `master` is dormant (1.8.x era code without modern test infra). Would fail CI. |

### 4.4 Job Structure Explained

```
lint-and-format    (fast, ~30s, single Node version)
    |
    v
build-and-test     (matrix: Node 20.x, 22.x, 24.x; ~1-2min per version)
    |
    v
verify-build       (single Node version, smoke tests dist outputs)
```

1. **`lint-and-format`** catches code style issues immediately without wasting
   matrix runner minutes.
2. **`build-and-test`** runs `npm test` (which builds first, then tests) across
   the full Node.js version matrix.
3. **`verify-build`** smoke-tests that all four dist formats (UMD, minified UMD,
   ESM, CJS) exist, are non-trivial in size, and are loadable.

### 4.5 Node.js Version Matrix

| Version | Reason |
|---------|--------|
| `20.x` | Oldest supported LTS (EOL April 2026) |
| `22.x` | Maintenance LTS (EOL April 2027), current development environment |
| `24.x` | Active LTS (EOL April 2028), latest stable |

When Node 20 reaches EOL in April 2026:
1. Remove `20.x` from the matrix.
2. Update `engines` in `package.json` to `>=22.0.0`.
3. When Node 26 enters LTS (expected October 2026), add it.

### 4.6 Verify YAML Syntax Locally

```bash
node -e "
const fs = require('fs');
const yaml = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
console.log('YAML file size:', yaml.length, 'bytes');
console.log('Contains workflow_call:', yaml.includes('workflow_call'));
console.log('Contains matrix:', yaml.includes('matrix'));
console.log('Contains verify-build:', yaml.includes('verify-build'));
"
```

All three checks should print `true`. For full YAML validation, use:

```bash
npx yaml '.github/workflows/ci.yml'
```

Or if you have `python3` available:

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"
```

### 4.7 Simulate CI Steps Locally

Run each CI step locally to confirm they will pass on GitHub:

```bash
# Step 1: Lint
npm run lint

# Step 2: Format check
npm run format:check

# Step 3: Build and test
npm test

# Step 4: Verify dist files
test -f dist/jstat.js && echo "UMD exists"
test -f dist/jstat.min.js && echo "UMD min exists"
test -f dist/jstat.esm.mjs && echo "ESM exists"
test -f dist/jstat.cjs.js && echo "CJS exists"

wc -c dist/jstat.js dist/jstat.min.js dist/jstat.esm.mjs dist/jstat.cjs.js

# Step 5: Smoke test bundles
node -e "const j = require('./dist/jstat.js'); console.assert(typeof j.mean === 'function'); console.log('UMD OK')"
node -e "const j = require('./dist/jstat.cjs.js'); console.assert(typeof j.mean === 'function'); console.log('CJS OK')"
node --input-type=module -e "import j from './dist/jstat.esm.mjs'; console.assert(typeof j.mean === 'function'); console.log('ESM OK')"
```

All steps should succeed. If any fail, debug and fix before proceeding.

### 4.8 Do NOT Commit Yet

The CI workflow, release workflow, and `package.json` `engines` field will be
committed together in a single commit after Step 4.

---

## 5. Step 4: Create Release Workflow

### 5.1 Create `.github/workflows/release.yml`

Create the file with the following exact contents:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'   # Trigger on version tags like v1.10.0, v2.0.0

permissions:
  contents: read
  id-token: write   # Required for npm trusted publishing

jobs:
  ci:
    name: CI
    uses: ./.github/workflows/ci.yml

  publish:
    name: Publish to npm
    runs-on: ubuntu-latest
    needs: ci
    environment: release
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24.x
          registry-url: https://registry.npmjs.org
          cache: npm
          cache-dependency-path: package.json

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Verify package version matches tag
        run: |
          TAG_VERSION="${GITHUB_REF_NAME#v}"
          PKG_VERSION=$(node -p "require('./package.json').version")
          if [ "$TAG_VERSION" != "$PKG_VERSION" ]; then
            echo "FAIL: Tag version ($TAG_VERSION) does not match package.json version ($PKG_VERSION)"
            exit 1
          fi
          echo "Version match: $PKG_VERSION"

      - name: Publish to npm
        run: npm publish --provenance
```

### 5.2 Design Decisions

| Decision | Rationale |
|----------|-----------|
| Trigger on `v*` tags only | Only version tags trigger a release. Branch pushes do not. |
| `uses: ./.github/workflows/ci.yml` | Reuses the CI workflow via `workflow_call`. Full CI runs before publish. |
| `needs: ci` | Publish only runs if the entire CI suite passes. |
| `environment: release` | Ties to a GitHub Environment for optional protection rules (required reviewers, branch restrictions). |
| `id-token: write` | Required for npm OIDC Trusted Publishing (no stored secrets). |
| `registry-url: https://registry.npmjs.org` | Configures npm to publish to the public registry. |
| Version tag/package.json match check | Prevents publishing when someone forgets to bump `package.json` before tagging. |
| `npm publish --provenance` | Generates SLSA provenance attestations on the published package. Requires npm >= 11.5.1 (ships with Node 24). |

### 5.3 Release Process (for Maintainers)

With the release workflow in place, the release process becomes:

1. Update `version` in `package.json` (e.g., `2.0.0`)
2. Commit: `git commit -am "Release 2.0.0"`
3. Tag: `git tag v2.0.0`
4. Push: `git push && git push --tags`
5. The release workflow automatically:
   - Runs the full CI suite (lint, format, test matrix, build verification)
   - Verifies the tag matches `package.json` version
   - Publishes to npm with provenance

**Note:** The release workflow will not function until npm Trusted Publishing is
configured (Step 7). The workflow file can be committed now -- it is inert until
a `v*` tag is pushed, and that push would fail at the publish step until the
trust relationship is established. This is safe.

### 5.4 Commit All CI/CD Changes

Commit the `engines` field, CI workflow, and release workflow together:

```
ci: add GitHub Actions CI and release workflows
```

This commit includes:
- `package.json` (added `engines` field)
- `.github/workflows/ci.yml` (CI workflow)
- `.github/workflows/release.yml` (release workflow)

---

## 6. Step 5: Push and Verify

### 6.1 Push to Remote

```bash
git push origin 2.x
```

GitHub will automatically detect the new workflow files and run the CI workflow.

### 6.2 Verify CI Passes

Check the Actions tab on GitHub or use the `gh` CLI:

```bash
gh run list --branch 2.x --limit 1
```

Wait for the run to complete:

```bash
gh run watch
```

### 6.3 Verification Checklist

All of the following must be true:

| Check | How to Verify |
|-------|---------------|
| `Lint & Format` job passed | Green check in Actions tab |
| `Test (Node 20.x)` job passed | Green check in Actions tab |
| `Test (Node 22.x)` job passed | Green check in Actions tab |
| `Test (Node 24.x)` job passed | Green check in Actions tab |
| `Verify Build Output` job passed | Green check in Actions tab |
| All 382 tests pass on all Node versions | Check job logs for "382 tests" and "0 failures" |
| Build verification shows correct sizes | Check job logs for file sizes > thresholds |
| UMD, CJS, ESM smoke tests pass | Check job logs for "OK" messages |

### 6.4 If Any Job Fails

1. Check the job logs on GitHub (`gh run view --log-failed`).
2. Reproduce locally by running the failing step.
3. Fix, commit, and push. The `concurrency` setting will cancel the stale run
   and start a new one.

Common failure causes:
- **`npm install` fails:** Check that `package.json` has valid dependency
  specifications. Remember, no lockfile exists.
- **Tests fail on a specific Node version:** Check for version-specific API
  differences. The test suite uses only `node:test` and `node:assert`, both
  stable since Node 20.
- **ESM smoke test fails:** Verify `dist/jstat.esm.mjs` has a valid default
  export.
- **Size checks fail:** Verify the size thresholds in the workflow match the
  actual built output sizes. Adjust if needed.

---

## 7. Step 6: Configure Branch Protection

Branch protection is a **repository-level setting on GitHub**, not a file in the
repository. This step requires repository admin access and is performed in the
GitHub web UI (or via the `gh` CLI).

### 7.1 Protection Rules for `2.x`

Navigate to **Settings > Branches > Add branch protection rule** for `2.x`:

| Rule | Setting | Rationale |
|------|---------|-----------|
| Require status checks to pass before merging | **Yes** | CI must pass before merge |
| Required status checks | `Lint & Format`, `Test (Node 20.x)`, `Test (Node 22.x)`, `Test (Node 24.x)`, `Verify Build Output` | All CI jobs must pass |
| Require branches to be up to date before merging | **Yes** | PR must be rebased on latest target |
| Require pull request reviews before merging | **Optional** | Up to maintainer; may be excessive for single-maintainer project |
| Require linear history | **Optional** | Keeps history clean with rebase merges |
| Allow force pushes | **No** | Prevent history rewriting on shared branch |
| Allow deletions | **No** | Prevent accidental branch deletion |

### 7.2 Protection Rules for `1.x`

Apply the same rules as `2.x`, or stricter. This branch contains the published
releases and should be carefully guarded.

### 7.3 Status Check Names

The required status check names correspond exactly to the `name` field of each
job in `ci.yml`:

- `Lint & Format`
- `Test (Node 20.x)`
- `Test (Node 22.x)`
- `Test (Node 24.x)`
- `Verify Build Output`

**Important:** Changing job names in the workflow YAML will require updating the
branch protection settings. The names are stable because they are defined in the
workflow, not auto-generated.

### 7.4 Verify via CLI (Optional)

If using the `gh` CLI:

```bash
gh api repos/jstat/jstat/branches/2.x/protection
```

This returns the current protection rules as JSON. Verify the required status
checks match the list above.

---

## 8. Step 7: Configure npm Trusted Publishing

npm Trusted Publishing uses OIDC to allow GitHub Actions to publish to npm
without any stored secrets. This step requires access to the `jstat` npm package
settings and is performed on npmjs.com.

### 8.1 One-Time npm Setup

1. Go to `https://www.npmjs.com/package/jstat/access`
2. Navigate to "Trusted Publishers" settings
3. Add a trusted publisher with:
   - **Repository owner:** `jstat`
   - **Repository name:** `jstat`
   - **Workflow filename:** `release.yml`
   - **Environment:** `release`

### 8.2 Create GitHub Environment

1. Go to repository **Settings > Environments > New environment**
2. Name: `release`
3. Configure deployment branches: Add `2.x` and `1.x` only
4. Optional: Add required reviewers (the tag push itself is the authorization
   signal since only maintainers can push tags)

### 8.3 Verify the Release Workflow

To test the release workflow end-to-end:

1. Bump version in `package.json` to a test version (e.g., `2.0.0-rc.1`)
2. Commit: `git commit -am "Release 2.0.0-rc.1"`
3. Tag: `git tag v2.0.0-rc.1`
4. Push: `git push && git push --tags`
5. Watch the release workflow:
   ```bash
   gh run list --workflow=release.yml --limit 1
   gh run watch
   ```

The workflow should:
1. Run the full CI suite (via `workflow_call`)
2. Verify the tag version matches `package.json`
3. Publish to npm with provenance

Check the published package:

```bash
npm view jstat@2.0.0-rc.1
```

If using a pre-release tag for testing, it will not affect the `latest` tag on
npm (npm treats pre-release versions separately).

### 8.4 Requirements for Trusted Publishing

| Requirement | Status |
|-------------|--------|
| npm CLI >= 11.5.1 | Node 24.x ships with npm 11.x (satisfied) |
| Node.js >= 22.14.0 | Release workflow uses Node 24.x (satisfied) |
| `id-token: write` permission | Set in `release.yml` (satisfied) |
| `environment: release` in job | Set in `release.yml` (satisfied) |
| Trust relationship on npmjs.com | Must be configured (Step 8.1) |
| GitHub Environment created | Must be configured (Step 8.2) |

---

## 9. Completion Criteria

All of the following must be true before Phase 5 is considered complete:

| Criterion | How to Verify |
|-----------|---------------|
| All 382 tests pass (0 failures) | `npm test` shows 382 passing, 0 failing |
| `engines` field in `package.json` | `node -e "console.log(require('./package.json').engines)"` shows `{ node: '>=20.0.0' }` |
| `.github/workflows/ci.yml` exists | `cat .github/workflows/ci.yml` |
| `.github/workflows/release.yml` exists | `cat .github/workflows/release.yml` |
| CI runs on push to `2.x` | Push to `2.x` triggers workflow; `gh run list --branch 2.x` |
| CI runs on pull requests to `2.x` | Open a test PR; verify CI runs |
| Lint job passes | `Lint & Format` job green in Actions tab |
| Test matrix passes on all 3 Node versions | `Test (Node 20.x)`, `Test (Node 22.x)`, `Test (Node 24.x)` all green |
| Build verification passes | `Verify Build Output` job green |
| ESLint still clean | `npm run lint` exits 0 |
| Prettier still clean | `npm run format:check` exits 0 |
| Zero new dependencies | `package.json` `devDependencies` still has exactly 5 entries |
| Zero new npm scripts | `package.json` `scripts` unchanged (6 entries) |
| Release workflow present | `.github/workflows/release.yml` exists and is valid YAML |

### Commit Summary

Phase 5 produces exactly 2 commits:

| # | Message | Files |
|---|---------|-------|
| 1 | `fix: use epsilon comparison for geomean tests (7 float-precision failures)` | `test/vector/geomean-test.js` |
| 2 | `ci: add GitHub Actions CI and release workflows` | `package.json`, `.github/workflows/ci.yml`, `.github/workflows/release.yml` |

### External Configuration (Not in Git)

These are configured in the GitHub and npm web UIs, not in repository files:

| Configuration | Where | Step |
|---------------|-------|------|
| Branch protection rules | GitHub repo Settings > Branches | Step 6 |
| `release` environment | GitHub repo Settings > Environments | Step 7 |
| npm Trusted Publisher | npmjs.com package access settings | Step 7 |

### What is NOT Done in Phase 5

| Item | Phase |
|------|-------|
| TypeScript types / `@typescript-eslint` | Phase 6 |
| Documentation updates | Phase 7 |
| Pre-commit hooks (`husky`, `lint-staged`) | Out of scope (CI gates are sufficient) |
| Cross-platform CI (Windows, macOS) | Not needed (pure JS library) |
| Code coverage reporting | Future enhancement |
| Dependabot / Renovate | Future enhancement |
| API changes | Never in an infrastructure phase |
