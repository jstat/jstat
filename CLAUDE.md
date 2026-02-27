# jStat - JavaScript Statistical Library

## Project Overview

jStat is a native JavaScript statistical library providing distributions, linear
algebra, regression, hypothesis tests, and more. Currently at v1.9.6 on the 1.x
branch. Zero production dependencies.

We are modernizing the project while maintaining 100% backwards compatibility.
See `doc/other/architecture.md` for the full plan and `doc/other/phase1-research.md`
for the current phase (test migration from Vows.js to node:test).

## Key Paths

- `src/` — Source files (concatenated into dist/jstat.js via Makefile)
- `dist/jstat.js` — Built output (UMD bundle)
- `test/` — Test files organized by module (core, vector, distribution, etc.)
- `doc/other/` — Architecture and research documents for modernization

## Build & Test

```bash
make core         # Build dist/jstat.js and dist/jstat.min.js
npm test          # Build then run tests (currently Vows, migrating to node:test)
```

## Working Guidelines

- **Always run code investigation and code changes in agents** to preserve
  context window. Use Task tool with appropriate subagent_type (Explore for
  research, general-purpose for multi-step work).
- **Always run /codex-review in an agent** (Task tool), never inline.
  The agent must invoke `/codex-review` via the Skill tool (it has permission;
  the outer context does not).
- All changes must be 100% backwards compatible with the existing public API.
- The public API surface is documented in `doc/other/architecture.md` Section 2.
- Source uses pre-ES6 patterns (`var`, no arrow functions) — this will be
  modernized in Phase 3, not before.

## Current Phase: Phase 1 — Test Infrastructure

Migrating from Vows.js to Node.js built-in test runner (`node:test`).
See `doc/other/phase1-research.md` for full details.
