# Phase 5 Research: CI/CD

Research document for adding continuous integration and continuous delivery
pipelines to the jStat project using GitHub Actions, following the completion of
Phases 1-4 (test migration, build system modernization, code modernization, and
linting & formatting).

---

## Table of Contents

1. [Environment and Baseline](#1-environment-and-baseline)
2. [Scope Definition](#2-scope-definition)
3. [Current Project State](#3-current-project-state)
4. [GitHub Actions Architecture](#4-github-actions-architecture)
5. [Node.js Version Matrix](#5-nodejs-version-matrix)
6. [CI Workflow Design](#6-ci-workflow-design)
7. [Release/Publish Workflow Design](#7-releasepublish-workflow-design)
8. [Branch Protection](#8-branch-protection)
9. [Migration Steps](#9-migration-steps)
10. [Risks and Open Questions](#10-risks-and-open-questions)

---

## 1. Environment and Baseline

### 1.1 Development Environment

- **Node.js version:** 22.14.0
- **npm version:** 10.9.2
- **OS:** Linux (Ubuntu-based)
- **Current build:** Rollup 4.59.0 with `@rollup/plugin-terser`
- **Current test runner:** `node:test` (Node built-in, stable since Node 20)
- **Current linter:** ESLint 10.0.2
- **Current formatter:** Prettier 3.8.1
- **Repository hosting:** GitHub (`github.com/jstat/jstat`)

### 1.2 Current Dev Dependencies

```json
{
    "@rollup/plugin-terser": "^0.4.4",
    "eslint": "^10.0.2",
    "eslint-config-prettier": "^10.1.8",
    "prettier": "^3.8.1",
    "rollup": "^4.59.0"
}
```

Zero production dependencies. Five dev dependencies. Phase 5 adds **zero** new
dependencies -- CI/CD is purely configuration files.

### 1.3 Current npm Scripts

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

All scripts needed for CI already exist. The CI workflow will invoke these
scripts directly -- no new scripts are needed.

### 1.4 Current Test Results

- **382 tests total, 375 passing, 7 failing**
- All 7 failures are the known `geomean` floating-point precision issue (not
  real bugs -- tests assert bit-exact equality on float results)
- **0 ESLint errors** (11 warnings, all `no-shadow`, intentional)
- **Prettier: fully clean** (`format:check` passes with no changes)

### 1.5 Current CI/CD Configuration

**None.** There is no `.github/workflows/` directory, no `.travis.yml`, no
`.circleci/` directory, and no other CI configuration anywhere in the repository.
The project has never had automated CI/CD.

### 1.6 Git Branch Structure

```
master          Origin's default branch (old, points to 1.8.x era)
1.x             Published release branch (1.9.6 is latest tag)
2.x             Active development branch (Phases 1-4 committed here)
```

The modernization work is on the `2.x` branch, which is 4 commits ahead of
`1.x`:

```
1005532 (HEAD -> 2.x) Add ESLint, Prettier, and EditorConfig; format and lint entire codebase
58a0fe7 Modernize source code: const/let, arrows, rest params, IIFE removal
21ac1f5 Modernize build system from Makefile concatenation to Rollup
5738b78 Migrate test suite from Vows.js to node:test
72f367f (origin/1.x, 1.x) update README header jstat.org hyperlink
```

### 1.7 npm Publishing

The package is published as `jstat` on npm. The latest published version is
1.9.6. There is currently no automated publishing -- releases have been done
manually via `npm publish`.

---

## 2. Scope Definition

### 2.1 What IS Phase 5

Phase 5 adds automated quality gates and optional release automation:

- **CI workflow:** Runs on every push and pull request. Builds the project,
  runs the test suite across multiple Node.js versions, checks linting, and
  checks formatting.
- **Release workflow (optional):** Publishes to npm when a GitHub Release is
  created or a version tag is pushed.
- **Branch protection rules:** Recommendations for protecting the default branch
  by requiring CI to pass before merging.

### 2.2 What is NOT Phase 5

- **No TypeScript** -- that is Phase 6.
- **No documentation changes** -- that is Phase 7.
- **No API changes** -- the public API surface remains 100% identical.
- **No new npm scripts** -- CI uses the existing scripts.
- **No new dev dependencies** -- CI configuration is YAML files only.
- **No pre-commit hooks** -- while these are sometimes grouped with CI, adding
  `husky` or `lint-staged` would introduce new dev dependencies and affect local
  developer workflow. This is out of scope. CI gates are sufficient -- if code
  does not pass lint/format, the PR will fail.

### 2.3 Files to Create

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | CI workflow (test, lint, format, build) |
| `.github/workflows/release.yml` | Optional release/publish workflow |

### 2.4 Files to Modify

| File | Change |
|------|--------|
| `package.json` | Add `engines` field specifying supported Node.js versions |

---

## 3. Current Project State

### 3.1 Build System

Rollup 4.59.0 bundles `src/index.js` into four output formats:

| Output | Format | File |
|--------|--------|------|
| UMD (unminified) | `umd` | `dist/jstat.js` |
| UMD (minified) | `umd` + terser | `dist/jstat.min.js` |
| ESM | `es` | `dist/jstat.esm.mjs` |
| CJS | `cjs` | `dist/jstat.cjs.js` |

All outputs include source maps. The build is invoked via `npm run build`
(which runs `rollup -c`).

### 3.2 Test Runner

Node's built-in test runner (`node:test`) with explicit file glob:

```bash
node --test "test/**/*-test.js"
```

The `npm test` script runs `npm run build && node --test "test/**/*-test.js"`,
which builds first, then tests. This is important for CI -- the test step
implicitly depends on a successful build.

The test runner uses `describe`/`it` blocks with `node:assert/strict`. A custom
`assertEpsilon` helper in `test/helpers.js` provides approximate floating-point
comparison (since `node:assert` has no built-in tolerance support).

**115 test files** across 8 directories, totaling **382 individual tests**.

### 3.3 Lint and Format

- **ESLint** (`eslint .`): Flat config in `eslint.config.js`. Lints
  `src/**/*.js`, `test/**/*-test.js`, `test/helpers.js`, and
  `rollup.config.mjs`. Currently produces 0 errors and 11 `no-shadow` warnings.
- **Prettier** (`prettier --check .`): Config in `.prettierrc.json`. Checks all
  files except those in `.prettierignore` (`dist/`, `node_modules/`, `build/`,
  `doc/`, `*.min.js`).

### 3.4 Build Artifacts

The `dist/` directory is gitignored for some outputs (`.map`, `.mjs`, `.cjs.js`)
but `dist/jstat.js` and `dist/jstat.min.js` are **not** gitignored. This means
the UMD bundles are committed to the repository. This is a legacy pattern from
before the Rollup migration -- the built files were the primary way consumers
got the library (via a script tag pointing to the GitHub raw URL).

For CI purposes, this means:
- The build step produces files, some of which are tracked by git.
- CI should build from source and test the built output -- it should NOT rely on
  committed dist files.
- We should not add a "verify dist is up to date" step since we may want to
  move away from committing dist files in the future.

---

## 4. GitHub Actions Architecture

### 4.1 Why GitHub Actions

The project is hosted on GitHub (`github.com/jstat/jstat`). GitHub Actions is
the natural choice:

- **Zero additional service signup** -- built into GitHub.
- **Free for public repositories** -- jStat is MIT-licensed and public.
- **Native npm integration** -- `setup-node` action handles Node.js versions,
  npm caching, and npm registry authentication.
- **Matrix builds** -- test across multiple Node.js versions and OS in parallel.
- **Branch protection integration** -- required status checks tie directly to
  workflow job names.
- **npm trusted publishing** -- OIDC-based publishing without long-lived tokens
  (npm deprecated classic tokens in December 2025).

### 4.2 Runner Selection

Use `ubuntu-latest` for all CI jobs. Rationale:

- jStat is a pure JavaScript library with zero native dependencies. There is
  no platform-specific behavior that would require testing on Windows or macOS.
- `ubuntu-latest` is the cheapest and fastest runner.
- If cross-platform testing is ever needed (e.g., for a native addon), it can
  be added later as a matrix dimension.

### 4.3 Action Versions

| Action | Version | Purpose |
|--------|---------|---------|
| `actions/checkout` | `v6` | Check out repository code |
| `actions/setup-node` | `v6` | Install Node.js and configure npm cache |

Both actions are maintained by GitHub and are the current stable versions.

### 4.4 Caching Strategy

`actions/setup-node@v6` has built-in npm caching via the `cache` input. Setting
`cache: 'npm'` caches the npm global cache directory (`~/.npm`) keyed on
`package-lock.json` (or `package.json` if no lockfile exists).

jStat does not commit `package-lock.json` (it is in `.gitignore`). The cache
key will be based on `package.json`. This is fine for a library -- the lockfile
is intentionally omitted so that consumers get the latest compatible versions of
dev dependencies.

**Important:** Since there is no lockfile, `npm install` (not `npm ci`) must be
used. `npm ci` requires a lockfile and will fail without one.

---

## 5. Node.js Version Matrix

### 5.1 Node.js LTS Schedule (as of February 2026)

| Version | Codename | Status | EOL Date |
|---------|----------|--------|----------|
| Node.js 18 | Hydrogen | **EOL** | April 30, 2025 |
| Node.js 20 | Iron | Maintenance LTS | April 30, 2026 |
| Node.js 22 | Jod | Maintenance LTS | April 30, 2027 |
| Node.js 24 | Krypton | **Active LTS** | April 30, 2028 |

### 5.2 Version Selection

The architecture document (Section 4.5) specifies testing against Node.js
18, 20, and 22. That was written before Phase 1 was implemented. The situation
has changed:

1. **Node.js 18 is EOL** (ended April 2025). It should not be in the CI matrix.
2. **`node:test` was experimental in Node 18** and only became stable in
   Node 20. The test suite uses `describe`/`it` from `node:test` which may not
   work reliably on Node 18.
3. **ESLint 10 requires Node >= 20.19.0**. `npm install` would fail on Node 18.
4. **Node.js 24 is the current Active LTS** and should be included.

**Recommended CI matrix:**

| Version | Reason |
|---------|--------|
| `20.x` | Oldest supported LTS (maintenance until April 2026) |
| `22.x` | Maintenance LTS (until April 2027), development environment |
| `24.x` | Active LTS (until April 2028), latest stable |

Once Node 20 reaches EOL in April 2026, the matrix should drop it and add
Node 26 when it enters LTS.

### 5.3 `engines` Field

The `package.json` should declare the minimum supported Node.js version:

```json
{
    "engines": {
        "node": ">=20.0.0"
    }
}
```

Rationale:
- `node:test` is stable from Node 20 onward.
- ESLint 10 requires Node >= 20.19.0.
- Node 18 is EOL.
- The `>=20.0.0` floor is the practical minimum for the modernized codebase.

**Note:** The `engines` field is advisory by default. It does not prevent
installation on older Node versions unless the consumer sets
`engine-strict=true` in their `.npmrc`. This is the conventional approach for
library packages.

---

## 6. CI Workflow Design

### 6.1 Trigger Events

The CI workflow should run on:

| Event | Branches | Rationale |
|-------|----------|-----------|
| `push` | `2.x`, `1.x` | Validate every push to active branches |
| `pull_request` | `2.x`, `1.x` | Gate PRs with required checks |

**Note:** `master` is excluded. It points to old 1.8.x code without modern test
infrastructure and is effectively dormant. See Section 10.8 for discussion.

The `pull_request` event runs on the merge commit (base + head), which is the
correct behavior for validating that a PR will not break the target branch.

### 6.2 Job Structure

The CI workflow has three jobs:

```
lint-and-format    (fast, ~30s, single Node version)
    |
    v
build-and-test     (matrix, ~1-2min per Node version, depends on lint)
    |
    v
verify-build       (single Node version, depends on build-and-test)
```

**Why this structure:**

1. **`lint-and-format` runs first** -- if code style is wrong, fail fast without
   wasting matrix runner minutes. This takes ~30 seconds.
2. **`build-and-test` runs the full matrix** -- builds and tests across all
   Node.js versions. This is the core validation step.
3. **`verify-build` runs last** -- checks that the build output is sane (e.g.,
   dist files are non-empty, the UMD bundle is loadable). This is a smoke test
   to catch build configuration regressions.

### 6.3 Job Details

#### Job 1: `lint-and-format`

Runs on a single Node.js version (latest LTS). Checks code quality without
building or testing.

Steps:
1. Checkout code
2. Setup Node.js (24.x)
3. Install dependencies (`npm install`)
4. Run ESLint (`npm run lint`)
5. Run Prettier check (`npm run format:check`)

#### Job 2: `build-and-test`

Runs the full build + test suite across the Node.js version matrix. Depends on
`lint-and-format` passing first.

Steps:
1. Checkout code
2. Setup Node.js (matrix: 20.x, 22.x, 24.x)
3. Install dependencies (`npm install`)
4. Run tests (`npm test`, which builds first then runs `node --test`)

**Note on the 7 known test failures:** The CI will report 7 failures (all
`geomean` float precision). These are known and tracked. There are two options:

- **Option A: Fix the tests** -- Change the 7 `geomean` tests to use
  `assertEpsilon` instead of strict equality. This is the correct fix and should
  be done regardless of CI. Once fixed, CI can enforce zero failures.
- **Option B: Allow known failures** -- Do not set `--test-force-exit` or
  special flags; let the 7 failures cause CI to fail, and fix them before
  merging the CI workflow.

**Recommendation:** Option A. Fix the `geomean` tests before or as part of the
CI setup. The CI should enforce **zero test failures** -- known failures that
are allowed to persist undermine the value of CI entirely.

#### Job 3: `verify-build`

Runs a quick smoke test on the build output to catch build configuration issues
that tests might not catch (e.g., Rollup config change that produces an empty
file).

Steps:
1. Checkout code
2. Setup Node.js (24.x)
3. Install dependencies
4. Build (`npm run build`)
5. Verify dist files exist and are non-trivial:
   - `dist/jstat.js` exists and is > 100KB
   - `dist/jstat.min.js` exists and is > 40KB
   - `dist/jstat.esm.mjs` exists and is > 100KB
   - `dist/jstat.cjs.js` exists and is > 100KB
6. Verify the CJS bundle loads correctly:
   ```bash
   node -e "const j = require('./dist/jstat.cjs.js'); console.assert(typeof j.mean === 'function')"
   ```
7. Verify the ESM bundle loads correctly:
   ```bash
   node --input-type=module -e "import j from './dist/jstat.esm.mjs'; console.assert(typeof j.mean === 'function')"
   ```
8. Verify the UMD bundle loads correctly:
   ```bash
   node -e "const j = require('./dist/jstat.js'); console.assert(typeof j.mean === 'function')"
   ```

### 6.4 Full CI Workflow

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

### 6.5 Design Decisions Explained

#### `fail-fast: false`

By default, GitHub Actions cancels all matrix jobs if any one fails. Setting
`fail-fast: false` ensures all Node versions run to completion even if one
fails. This is important because:

- A failure on Node 20 does not necessarily mean Node 22 and 24 will also fail.
- Seeing which specific versions fail helps diagnose version-specific issues.
- The total runtime is the same (matrix jobs run in parallel).

#### `needs` Dependencies

The `needs` keyword creates a dependency chain:

1. `lint-and-format` runs first, alone.
2. `build-and-test` starts only after `lint-and-format` succeeds.
3. `verify-build` starts only after `build-and-test` succeeds.

This saves runner minutes by not running 3 test matrix jobs when the code
doesn't even pass lint. The lint job takes ~30 seconds. If it fails, the
developer gets feedback immediately without waiting for 3 parallel test jobs.

#### Permissions

`permissions: contents: read` restricts the `GITHUB_TOKEN` to read-only access.
CI workflows do not need write access. This follows the principle of least
privilege and is a GitHub-recommended security practice.

#### Why `npm install` instead of `npm ci`

jStat intentionally does not commit `package-lock.json` (it is in `.gitignore`).
The rationale is that as a library (not an application), jStat should work with
any compatible version of its dev dependencies within the semver ranges specified
in `package.json`. `npm ci` requires a lockfile and will fail without one.
`npm install` is the correct command here.

---

## 7. Release/Publish Workflow Design

### 7.1 Publishing Strategy

There are two approaches to automated npm publishing:

**Option A: Manual publishing (current approach)**

The maintainer runs `npm publish` locally after verifying the release. This is
the simplest approach and has been used for all 1.x releases to date.

**Option B: Automated publishing via GitHub Actions**

A GitHub Actions workflow publishes to npm automatically when a GitHub Release
is created or a version tag is pushed. This is more reproducible and eliminates
the need for maintainers to have npm credentials configured locally.

**Recommendation:** Implement Option B. npm deprecated classic tokens in
December 2025 and the recommended approach is now OIDC Trusted Publishing, which
is designed specifically for CI/CD workflows. This eliminates long-lived secrets
and provides provenance attestations on published packages.

### 7.2 npm Trusted Publishing (OIDC)

npm Trusted Publishing (generally available since July 2025) allows GitHub
Actions to publish to npm without any stored secrets. Instead:

1. A trust relationship is configured on npmjs.com linking the `jstat` package
   to the `jstat/jstat` GitHub repository and a specific workflow file.
2. When the workflow runs, it obtains a short-lived OIDC token from GitHub.
3. npm verifies the token against the trust relationship and allows the publish.
4. Provenance attestations are automatically generated.

**Requirements:**
- npm CLI >= 11.5.1
- Node.js >= 22.14.0
- The workflow must have `id-token: write` permission
- The job must have `environment: release` (or whatever environment is
  configured in the npm trust relationship)

### 7.3 One-Time npm Setup

Before the release workflow can work, the following must be done **once** on
npmjs.com by a package maintainer:

1. Go to `https://www.npmjs.com/package/jstat/access`
2. Navigate to "Trusted Publishers" settings
3. Add a trusted publisher with:
   - **Repository owner:** `jstat`
   - **Repository name:** `jstat`
   - **Workflow filename:** `release.yml`
   - **Environment:** `release`

### 7.4 Release Workflow

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

### 7.5 Release Process (for maintainers)

With the release workflow in place, the release process becomes:

1. Update `version` in `package.json` (e.g., `1.10.0`)
2. Commit: `git commit -am "Release 1.10.0"`
3. Tag: `git tag v1.10.0`
4. Push: `git push && git push --tags`
5. The release workflow automatically:
   - Runs the full CI suite
   - Verifies the tag matches `package.json` version
   - Publishes to npm with provenance

The version verification step (7.4, "Verify package version matches tag")
prevents accidental publishes where someone forgets to bump `package.json`
before tagging.

### 7.6 GitHub Environment Protection

The release workflow uses the `release` environment. GitHub Environments allow
optional protection rules:

- **Required reviewers:** Require one or more people to approve the deployment
  before it runs.
- **Wait timer:** Add a delay before the deployment starts.
- **Deployment branches:** Restrict which branches can trigger deployments.

For jStat, the recommended configuration is:

- **Environment name:** `release`
- **Deployment branches:** Restrict to `2.x` and `1.x` only (no publishing
  from feature branches or `master`)
- **Required reviewers:** Optional -- the tag push itself is the authorization
  signal since only maintainers can push tags to the repository.

---

## 8. Branch Protection

### 8.1 Recommended Rules

Branch protection is a repository-level setting on GitHub, not a file in the
repository. These are recommendations for the repository administrator.

For the `2.x` branch (primary development branch):

| Rule | Setting | Rationale |
|------|---------|-----------|
| Require status checks to pass | **Yes** | CI must pass before merge |
| Required checks | `Lint & Format`, `Test (Node 20.x)`, `Test (Node 22.x)`, `Test (Node 24.x)`, `Verify Build Output` | All CI jobs must pass |
| Require branches to be up to date | **Yes** | PR must be rebased on latest target |
| Require pull request reviews | **Optional** | Up to the maintainer; may be excessive for a single-maintainer project |
| Require linear history | **Optional** | Keeps history clean with rebase merges |
| Allow force pushes | **No** | Prevent history rewriting on shared branch |
| Allow deletions | **No** | Prevent accidental branch deletion |

For the `1.x` branch (stable release branch):

Same rules as `2.x`, or stricter. This branch contains the published releases
and should be carefully guarded.

### 8.2 Status Check Names

The required status check names correspond to the `name` field of each job in
the CI workflow:

- `Lint & Format`
- `Test (Node 20.x)`
- `Test (Node 22.x)`
- `Test (Node 24.x)`
- `Verify Build Output`

These names are stable because they are defined in the workflow YAML. Changing
job names in the workflow would require updating the branch protection settings.

---

## 9. Migration Steps

### Step 1: Fix the 7 Known Test Failures

Before CI can enforce zero failures, the 7 `geomean` tests must be fixed. These
tests use `assert.strictEqual` (bit-exact comparison) on floating-point results.
They should use `assertEpsilon` with a tolerance of ~1e-14.

The failing tests are in `test/vector/geomean-test.js`. The fix is mechanical:
change `assert.strictEqual(actual, expected)` to
`assertEpsilon(1e-14, actual, expected)` for the 7 affected assertions, and
similarly for `assert.deepStrictEqual` on array results (use
`assertArrayEpsilon`).

This fix should be committed before or in the same PR as the CI workflow, so
that the CI is green from the start.

### Step 2: Add `engines` Field to `package.json`

Add the `engines` field:

```json
{
    "engines": {
        "node": ">=20.0.0"
    }
}
```

This documents the minimum supported Node.js version.

### Step 3: Create CI Workflow

Create `.github/workflows/ci.yml` with the content from Section 6.4.

### Step 4: Push and Verify

Push the changes to the `2.x` branch. GitHub will automatically run the CI
workflow. Verify that:

1. All three jobs pass (lint-and-format, build-and-test, verify-build).
2. The test matrix runs on all three Node.js versions.
3. The verify-build job confirms all dist formats are loadable.

If any jobs fail, debug locally and push fixes.

### Step 5: Create Release Workflow (Optional)

Create `.github/workflows/release.yml` with the content from Section 7.4.

This step requires a one-time configuration on npmjs.com to set up the trusted
publisher relationship (Section 7.3). This must be done by a package maintainer
with access to the `jstat` npm package settings.

### Step 6: Configure Branch Protection (Optional)

Configure branch protection on the `2.x` branch as described in Section 8.1.
This requires repository admin access.

### Step 7: Create GitHub Environment (Optional)

If the release workflow is added, create a `release` environment on GitHub:

1. Go to repository Settings > Environments > New environment
2. Name: `release`
3. Deployment branches: Add `2.x` and `1.x`
4. Optional: Add required reviewers

---

## 10. Risks and Open Questions

### 10.1 The 7 Known Test Failures

**Risk:** If the `geomean` test failures are not fixed before CI is added, the
CI will fail on every push. This renders CI useless.

**Mitigation:** Fix the 7 tests (Step 1) before or alongside the CI workflow.
The fix is trivial and well-understood.

### 10.2 No `package-lock.json`

**Risk:** Without a lockfile, `npm install` may install different versions of
dev dependencies on different CI runs. A breaking change in a dev dependency
(e.g., ESLint, Rollup, Prettier) could cause CI to fail even though no code
changed.

**Mitigation:** All dev dependencies use `^` (caret) ranges, which allow minor
and patch updates but not major updates. Major version changes in any dependency
would require a manual `package.json` update. The risk of a breaking change in
a minor/patch release is low but nonzero.

If this becomes a problem in practice, the options are:
1. Pin exact versions in `devDependencies` (e.g., `"rollup": "4.59.0"` instead
   of `"^4.59.0"`).
2. Start committing `package-lock.json` and switch CI to `npm ci`.

For now, the current approach is acceptable for a library with a small
dependency footprint (5 dev dependencies).

### 10.3 Committed `dist/` Files

**Risk:** The UMD bundles (`dist/jstat.js`, `dist/jstat.min.js`) are committed
to git. CI builds from source, producing fresh dist files. If a developer
forgets to rebuild before committing, the committed dist files will be stale.
CI will not catch this because it rebuilds anyway.

**Mitigation:** This is a pre-existing issue, not introduced by CI. The
long-term fix is to stop committing dist files to git and only publish them via
npm. This is beyond the scope of Phase 5 but should be considered for a future
cleanup.

### 10.4 `npm install` Timing

**Risk:** `npm install` without a lockfile can be slower than `npm ci` because
it must resolve dependency versions. With caching enabled (via `setup-node`
`cache: npm`), the download step is fast, but resolution still takes time.

**Mitigation:** jStat has only 5 dev dependencies. `npm install` takes ~5-10
seconds with a warm cache. This is negligible compared to the test suite
runtime (~6 seconds locally, likely ~10-15 seconds on CI runners).

### 10.5 Node 20 Approaching EOL

**Risk:** Node.js 20 reaches EOL on April 30, 2026 (2 months from now). After
that date, it will no longer receive security updates.

**Mitigation:** When Node 20 reaches EOL:
1. Remove `20.x` from the CI matrix.
2. Update the `engines` field to `>=22.0.0`.
3. When Node 26 enters LTS (expected October 2026), add it to the matrix.

This is a routine maintenance task and can be done in a single commit.

### 10.6 ESLint Warning Noise

**Risk:** The CI lint step runs `npm run lint`, which currently produces 11
`no-shadow` warnings. These are intentional and not errors. However, seeing
warnings in CI output can cause confusion.

**Mitigation:** ESLint exits with code 0 when there are only warnings (no
errors). The CI step will pass. The warnings are visible in the output but do
not block the pipeline. If the noise is undesirable, the options are:
1. Suppress warnings in CI with `eslint --quiet .` (only shows errors).
2. Downgrade `no-shadow` from `warn` to `off` in the ESLint config.
3. Leave as-is -- warnings are informational and not blocking.

Recommendation: Leave as-is for now. The 11 warnings are well-understood.

### 10.7 Release Workflow: npm CLI Version

**Risk:** npm Trusted Publishing requires npm CLI >= 11.5.1 and Node >= 22.14.0.
The release workflow uses Node 24.x, which ships with a compatible npm version.
However, if the workflow were changed to use an older Node version, publishing
could fail.

**Mitigation:** The release workflow hardcodes `node-version: 24.x`. As long as
Node 24 ships with npm >= 11.5.1 (it does -- Node 24 ships with npm 11.x),
this is not an issue.

### 10.8 Open Question: Should CI Run on `master`?

The `master` branch points to very old code (1.8.x era) and is no longer the
active development branch. Running CI on pushes to `master` would fail because
the old code does not have the modern test infrastructure.

**Options:**
1. Include `master` in the CI triggers but accept that it will fail for
   existing code (only new pushes would need to pass).
2. Exclude `master` from CI triggers since it is effectively dormant.
3. Update `master` to point to the current `2.x` HEAD and redirect development
   there.

**Recommendation:** Exclude `master` from the CI triggers for now. The active
branches are `2.x` (development) and `1.x` (stable releases). If `master` is
revived, CI can be re-enabled. Updated trigger config:

```yaml
on:
  push:
    branches: [2.x, 1.x]
  pull_request:
    branches: [2.x, 1.x]
```

### 10.9 Open Question: Concurrency Control

**Risk:** If multiple pushes happen in quick succession to the same branch,
multiple CI runs will execute simultaneously. This wastes runner minutes since
only the latest push matters.

**Mitigation:** Add a `concurrency` block to the CI workflow:

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

This cancels any in-progress CI run for the same branch when a new push arrives.
The `cancel-in-progress: true` setting is safe for CI (as opposed to deployment
workflows where cancellation could leave things in a broken state).

**Recommendation:** Include the concurrency block. It has no downside and saves
runner minutes.

### 10.10 Open Question: When to Create the Release Workflow

The release workflow (Section 7) depends on:
1. npm Trusted Publishing being configured on npmjs.com (one-time setup).
2. A GitHub Environment named `release` being created.
3. The maintainer being ready to switch from manual `npm publish` to automated
   publishing.

These are external dependencies that the CI workflow does not have. The CI
workflow can be merged and used immediately. The release workflow can be added
later when the maintainer is ready.

**Recommendation:** Implement the CI workflow (Steps 1-4) first. Add the release
workflow (Steps 5-7) as a separate follow-up when the maintainer is ready to
configure npm Trusted Publishing.
