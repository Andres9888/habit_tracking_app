---
type: report
title: CI-002 Performance Regression Tests in CI
created: 2026-01-22
tags:
  - ci
  - performance
  - regression-testing
related:
  - "[[SECURITY-PERFORMANCE-SPEC]]"
  - "[[PERF-001-performance-baseline-report]]"
  - "[[CI-001-security-tests-ci-report]]"
---

# CI-002: Performance Regression Tests in CI Pipeline

## Summary

Added a dedicated `performance-tests` job to the GitHub Actions CI workflow that runs performance benchmark tests and enforces performance budgets on every push/PR.

## Files Modified

### `.github/workflows/ci.yml`
Added new `performance-tests` job (~140 lines) with the following steps:

1. **Run Performance Tests** - Executes `npm test -- --testPathPattern="performance"` with coverage
2. **Extract Performance Metrics** - Documents thresholds in GitHub Step Summary
3. **Performance Test Coverage** - Reports code coverage from performance tests
4. **Generate Performance Baseline Artifact** - Creates JSON baseline for historical comparison
5. **Upload Results** - Stores test output and baseline as 30-day artifacts
6. **Regression Check** - Documents performance budgets in step summary

### CI Summary Job Updated
- Added `performance-tests` to job dependencies
- Added `PERFORMANCE_RESULT` to status check
- Pipeline fails if performance tests fail

## Performance Thresholds Enforced

| Metric | Budget | Source |
|--------|--------|--------|
| Time to Interactive (TTI) | < 3,000ms | `DEFAULT_THRESHOLDS.maxStartupTime` |
| First Contentful Paint (FCP) | < 1,500ms | Spec requirement |
| Target Frame Rate | 60 FPS | `DEFAULT_THRESHOLDS.targetFPS` |
| Memory Budget | < 200MB | `DEFAULT_THRESHOLDS.maxMemoryUsage` |
| API Latency (P95) | < 200ms | `DEFAULT_THRESHOLDS.maxApiLatency` |
| Max Render Time | < 16ms | `DEFAULT_THRESHOLDS.maxRenderTime` |

## Test Coverage (105+ tests)

| Category | Test File | Approx. Tests |
|----------|-----------|---------------|
| Startup Performance | `startup-performance.test.ts` | 7 |
| Render Performance | `render-performance.test.ts` | 12 |
| Memory Profiling | `memory-profiling.test.ts` | 9 |
| Network Performance | `network-performance.test.ts` | 10 |
| Stress Testing | `stress-testing.test.ts` | 10 |
| Baseline Benchmarks | `baseline-benchmarks.test.ts` | 12 |
| Unit Tests | Various `*.test.ts` | ~45 |

## Artifact Structure

```
performance-test-results/
├── performance-test-output.txt    # Full test output
├── performance-results.json       # Jest JSON results
├── performance-reports/
│   └── baseline.json              # Threshold baseline
└── coverage/                      # Coverage reports
```

## Baseline JSON Schema

```json
{
  "timestamp": "2026-01-22T00:00:00Z",
  "commit": "<sha>",
  "branch": "main",
  "thresholds": {
    "tti_ms": 3000,
    "fcp_ms": 1500,
    "fps_target": 60,
    "memory_mb": 200,
    "api_latency_p95_ms": 200,
    "render_time_ms": 16
  },
  "test_results": {
    "startup_tests": "passed",
    "render_tests": "passed",
    "memory_tests": "passed",
    "network_tests": "passed",
    "stress_tests": "passed"
  }
}
```

## GitHub Step Summary Output

The CI job generates a rich step summary including:
- Test execution results (passed/total)
- Performance threshold table with status
- Test category breakdown
- Code coverage metrics
- Regression analysis guidance

## Security Considerations

- Uses environment variables for GitHub context (`COMMIT_SHA`, `BRANCH_NAME`) instead of direct interpolation to prevent command injection
- No user-controlled inputs used in shell commands
- Follows GitHub Actions security best practices

## Future Improvements

1. **Historical Comparison** - Download previous baseline artifacts and compare metrics
2. **Trend Analysis** - Track performance metrics over time in a dashboard
3. **PR Comments** - Post performance diff as PR comment
4. **Fail on Regression** - Fail CI if metrics exceed previous baseline by X%
