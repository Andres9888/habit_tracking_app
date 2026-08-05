---
status: fixing
trigger: "Investigate CI failures from attached logs and fix them."
created: 2026-03-20T00:00:00Z
updated: 2026-03-20T00:36:00Z
---

## Current Focus

hypothesis: after the Node 20 workflow bump, the remaining blocker is a stale lockfile; a fresh lock generated from the pinned manifest should restore `npm ci`, after which coverage generation can be verified locally
test: regenerate `package-lock.json` from the current manifest and rerun install plus coverage-producing test commands
expecting: lockfile regeneration should eliminate npm's sync errors, and the coverage test run should create `coverage/lcov.info`
next_action: run `npm install --package-lock-only --ignore-scripts`

## Symptoms

expected: GitHub Actions should complete successfully for CI, security, performance, and dependency scan workflows.
actual: Multiple jobs fail before real checks run.
errors: `npm ci` fails with ERESOLVE because `@eslint-react/eslint-plugin@3.0.0` requires `eslint ^10.0.0` while the repo resolves `eslint 9.39.2`. In the main CI test job, `codecov/codecov-action@v5` also runs after tests without any coverage artifacts being generated, producing `No coverage reports found`.
reproduction: Run `npm ci` on the current repo or inspect the attached CI logs. Then inspect `.github/workflows/ci.yml` test job.
started: Present in current PR CI run on 2026-03-20.

## Eliminated

## Evidence

- timestamp: 2026-03-20T00:05:00Z
  checked: .planning/debug/knowledge-base.md
  found: No knowledge base file or matching prior entry was present in the workspace.
  implication: Proceed with a fresh investigation rather than starting from a known pattern.
- timestamp: 2026-03-20T00:12:00Z
  checked: package.json
  found: The repo declares `@eslint-react/eslint-plugin` as `^3.0.0` in dependencies while eslint is declared as `^9.21.0` in devDependencies.
  implication: A peer dependency conflict is likely if plugin 3.x requires eslint 10.x.
- timestamp: 2026-03-20T00:12:00Z
  checked: package-lock.json
  found: The lockfile resolves `@eslint-react/eslint-plugin` to `3.0.0` and records multiple peer requirements of `eslint: ^10.0.0` under that package tree.
  implication: The install failure is encoded in the lockfile, not just the manifest range.
- timestamp: 2026-03-20T00:12:00Z
  checked: .github/workflows/ci.yml
  found: The `tests` job runs `npm test -- --passWithNoTests --maxWorkers=2` and then always invokes `codecov/codecov-action@v5`, but does not request `--coverage` or specify files.
  implication: Even if tests pass, the upload step has no guaranteed coverage artifacts to publish.
- timestamp: 2026-03-20T00:18:00Z
  checked: git diff -- package.json and git diff -- .github/workflows/ci.yml
  found: The worktree already contains uncommitted edits that pin `@eslint-react/eslint-plugin` to `2.13.0` and update the CI `tests` job to run Jest with coverage and upload `coverage/lcov.info` only when that file exists.
  implication: The likely fix direction is already partially staged in the worktree; the remaining task is to make the lockfile and local verification consistent without discarding those changes.
- timestamp: 2026-03-20T00:20:00Z
  checked: package-lock.json blocks for `@eslint-react/*`
  found: The current lockfile contains `@eslint-react/eslint-plugin` and related packages at `2.13.0` with peer support for eslint 8/9/10.
  implication: Downgrading from plugin 3.x to 2.13.0 removes the eslint-10-only peer requirement.
- timestamp: 2026-03-20T00:21:00Z
  checked: jest.config.js
  found: Jest is configured with `collectCoverageFrom`, but no default `collectCoverage: true`; coverage files are produced only when the command includes `--coverage`.
  implication: The original CI `tests` job could never satisfy Codecov, while the updated command should.
- timestamp: 2026-03-20T00:23:00Z
  checked: `npm ci`
  found: The install still failed because npm considered `package.json` and `package-lock.json` out of sync, reporting `Invalid: lock file's @eslint-react/eslint-plugin@3.0.0 does not satisfy @eslint-react/eslint-plugin@2.13.0` plus multiple missing entries.
  implication: The repo needs a fully regenerated lockfile, not just targeted text edits, before CI can install reliably.
- timestamp: 2026-03-20T00:31:00Z
  checked: npm registry metadata and workflow runtime declarations
  found: `@eslint-react/eslint-plugin@2.13.0` supports eslint 9.x but requires Node `>=20.19.0`, while all affected workflows are pinned to Node `18`.
  implication: Even after restoring a compatible plugin version, CI should run on Node 20+ to satisfy package engine requirements.

## Resolution

root_cause: The repo was moved to `@eslint-react/eslint-plugin` 3.x, which requires eslint 10 and Node 22, while the project still uses eslint 9 and CI workflows run on Node 18. A partial rollback to 2.13.0 left `package-lock.json` stale, so `npm ci` failed before tests. Separately, the main CI `tests` job invoked Codecov without running Jest in coverage mode or guarding on an actual coverage artifact.
fix:
verification:
files_changed: []
