---
type: report
title: CI-001 Security Tests in CI Pipeline
created: 2026-01-22
tags:
  - security
  - ci-cd
  - testing
related:
  - "[[SEC-005-security-test-suite]]"
  - "[[RES-005-security-scanning-report]]"
---

# CI-001: Security Tests Added to CI Pipeline

## Summary

Added a dedicated security test job to the CI pipeline that runs all security-related tests and blocks merges on failures. This complements the existing security scanning workflow (RES-005) by ensuring security test suite passes on every PR.

## Changes Made

### Files Modified

1. **`.github/workflows/ci.yml`**
   - Added `security-tests` job that runs security-specific tests
   - Updated all actions to v4 for consistency (checkout, setup-node, codecov, upload-artifact)
   - Added `ci-summary` job for consolidated status reporting
   - Security test failures now block the pipeline

2. **`package.json`**
   - Added `test:security` script for local security test execution
   - Added `test:performance` script for local performance test execution

### Security Test Job Features

```yaml
security-tests:
  - Runs tests matching 'security' pattern
  - Generates coverage report
  - Outputs results to GitHub Step Summary
  - Uploads test results as artifacts (30-day retention)
  - Fails pipeline on any test failure
```

### Test Files Executed by Security Job

| File | Tests | Category |
|------|-------|----------|
| `convex/lib/security.auth.test.ts` | Authentication patterns | SEC-001 |
| `convex/lib/security.validation.test.ts` | Input validation | SEC-003 |
| `convex/webhooks/revenuecatSignature.test.ts` | Webhook verification | SEC-002 |
| `tests/integration/security/security-scenarios.test.ts` | E2E security scenarios | All |

**Total: 51+ security tests**

## CI Pipeline Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Code Quality CI                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  check-      │  │  typescript  │  │    tests     │      │
│  │  duplicates  │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                 │               │
│         │                 │                 │               │
│         │  ┌──────────────────────────────┐│               │
│         │  │     security-tests (NEW)     ││               │
│         │  │ - Run security-specific tests││               │
│         │  │ - Generate coverage report   ││               │
│         │  │ - Upload artifacts           ││               │
│         │  └──────────────────────────────┘│               │
│         │                 │                 │               │
│         └────────────────┬┴─────────────────┘               │
│                          │                                  │
│                   ┌──────▼──────┐                          │
│                   │  ci-summary │                          │
│                   │ (All jobs)  │                          │
│                   └─────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Integration with Existing Workflows

This CI job complements the existing `security.yml` workflow:

| Workflow | Purpose | Trigger |
|----------|---------|---------|
| `ci.yml` (security-tests) | Run security unit/integration tests | Every push/PR |
| `security.yml` | Dependency scanning, CodeQL, secrets | Push/PR + weekly |

## Local Development

Developers can run security tests locally:

```bash
# Run security tests with coverage
npm run test:security

# Run performance tests with coverage
npm run test:performance
```

## GitHub Actions Output

The security-tests job produces:

1. **Step Summary** - Displayed in Actions tab with:
   - Test pass/fail counts
   - Coverage percentages
   - Clear pass/fail status

2. **Artifacts** (30-day retention):
   - `security-test-output.txt` - Full test output
   - `coverage/` - Coverage reports

## Verification

To verify the implementation works:

1. Push this branch to trigger CI
2. Check that `security-tests` job appears
3. Verify security tests run and report to summary
4. Confirm failures block the pipeline

## Next Steps (CI-002)

The next task CI-002 will add performance regression tests to the pipeline, using a similar pattern with the existing performance test infrastructure.
