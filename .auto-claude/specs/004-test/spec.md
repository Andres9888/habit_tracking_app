# Quick Spec: Run Test Suite

## Overview
Execute the existing Jest test suite to verify all tests pass. This is a verification task to ensure the test infrastructure is healthy before proceeding with development work.

## Workflow Type
- **Type**: Verification / Simple
- **Scope**: Read-only operation - no code modifications required

## Task Scope
- Run `npm test` to execute the Jest test suite
- The project already has:
  - Jest configured in package.json
  - Test files in `__tests__/` directory
  - Component tests in `src/components/*/tests/` directories
  - Convex backend tests in `convex/*.test.ts`
- **Files to Modify**: None (verification task only)

## Success Criteria
- [ ] `npm test` completes successfully
- [ ] All test suites pass
- [ ] No test failures or errors

## Notes
- If tests fail, the output will indicate which tests need attention
- This is a read-only verification task with no code changes
