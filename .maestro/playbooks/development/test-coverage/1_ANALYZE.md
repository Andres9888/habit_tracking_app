# Test Coverage Analysis - Baseline Measurement

## Context

- **Playbook:** Testing
- **Agent:** security-test
- **Project:** /Users/andres/Code/habit_tracking_app.worktrees/security-test
- **Auto Run Folder:** /Users/andres/Code/habit_tracking_app/Auto Run Docs
- **Loop:** 00001

## Objective

Measure current test coverage and identify the testing landscape. This document establishes the baseline metrics that drive the test generation pipeline.

## Instructions

1. **Identify the test framework** - Detect what testing tools the project uses
2. **Run coverage analysis** - Execute test suite with coverage enabled
3. **Document current metrics** - Line, branch, and function coverage
4. **Identify testing patterns** - How existing tests are organized
5. **Output a coverage report** to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_COVERAGE_REPORT.md`

## Analysis Checklist

- [x] **Measure coverage (if needed)**: First check if `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_COVERAGE_REPORT.md` already exists with coverage data (look for "Overall Line Coverage:" with a percentage). If it does, skip the analysis and mark this task complete—the coverage report is already in place. If it doesn't exist, identify the project's test framework and run the test suite with coverage enabled. Document line coverage percentage and identify lowest-covered modules. Output results to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_COVERAGE_REPORT.md`.
  - Completion note: `LOOP_00001_COVERAGE_REPORT.md` already exists and includes baseline metrics, including Overall Line Coverage, framework, command, totals, module breakdown, and low-coverage files.

Execution notes:

- Test framework resolved from `package.json` scripts and `jest.config.js` as `Jest` (`jest-expo`, v29.7.0) with `testMatch` patterns for `*.test.ts`, `*.test.tsx`, and `*.spec.ts(x)`.
- Initial `npm run test:coverage` failed due missing `jest` in missing `node_modules` and then `minimatch` API mismatch from dependency versions (`test-exclude` expects minimatch function; installed minimatch is namespaced object).
- Installed dependencies (`npm ci`) and reran coverage with a temporary local compatibility shim for `minimatch`; baseline coverage completed with failures still present, generating a usable report.
- Resulting run status: `190 failed`, `156 passed`, `346 total` suites; `1059 failed`, `5528 passed`, `6590 total` tests.
- Report output: `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_COVERAGE_REPORT.md`.

## How to Find Coverage Commands

1. **Check project configuration files** for test scripts:
   - `package.json` scripts section
   - `Makefile` or `justfile` targets
   - `pyproject.toml` or `setup.py`
   - `Cargo.toml` for Rust
   - Build tool configs (Maven, Gradle, etc.)

2. **Look for existing coverage configuration**:
   - Coverage config files in project root
   - CI/CD pipeline definitions
   - README documentation

3. **Run with coverage flag** - Most test frameworks support a `--coverage` or similar flag

## Output Format

Create/update `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_COVERAGE_REPORT.md` with:

```markdown
# Coverage Report - Loop 00001

## Summary

- **Overall Line Coverage:** [XX.X%]
- **Target:** 80%
- **Gap to Target:** [XX.X%]
- **Test Framework:** [name and version]
- **Coverage Command Used:** [the command that was run]
- **Total Test Files:** [count]
- **Total Test Cases:** [count]

## Coverage by Module

| Module    | Lines | Branches | Functions | Status            |
| --------- | ----- | -------- | --------- | ----------------- |
| [module1] | XX%   | XX%      | XX%       | [NEEDS WORK / OK] |
| [module2] | XX%   | XX%      | XX%       | [NEEDS WORK / OK] |
| ...       | ...   | ...      | ...       | ...               |

## Lowest Coverage Files

Files with coverage below 50% that are good testing candidates:

1. **[filename]** - [XX%] line coverage
   - [Brief description of what this file does]
   - [Why it's important to test]

2. **[filename]** - [XX%] line coverage
   - ...

## Existing Test Patterns

### Test Location

- [x] Tests alongside source files (`src/.../__tests__`, `src/.../*.test.ts*`, and `src/.../*.spec.ts*`)
- [x] Tests in dedicated test directories (`tests/`, `__tests__/`, `specs/`)
- [x] Tests follow naming convention: `*.test.ts`, `*.test.tsx`, `*.spec.ts(x)`
- [x] Other: Most tests mix colocated `__tests__` folders and dedicated suites under `tests/` (`unit`, `integration`, `performance`, `e2e`), with no separate fixture catalog directory.

### Mocking Patterns

- [How the project handles mocks and test doubles]

### Fixture Patterns

- [How test data is organized - factories, fixtures, inline data]

## Recommendations

### Quick Wins (Easy to test, high impact)

1. [Module/file] - [why it's a quick win]

### Requires Setup (Need mocking infrastructure)

1. [Module/file] - [what setup is needed]

### Skip for Now (Low priority or too complex)

1. [Module/file] - [reason to skip]
```

## Guidelines

- **Be accurate**: Run actual coverage commands, don't estimate
- **Note patterns**: Understanding existing tests helps write consistent new ones
- **Identify blockers**: Some code may need refactoring before it's testable
- **Focus on gaps**: We care most about untested critical code
