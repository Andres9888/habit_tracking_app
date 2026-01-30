---
type: report
title: CI-004 Performance Budget Enforcement Implementation
created: 2026-01-22
tags:
  - performance
  - ci-cd
  - budget-enforcement
  - automation
related:
  - "[[SECURITY-PERFORMANCE-SPEC]]"
  - "[[PERF-001-performance-baseline-report]]"
  - "[[CI-002-performance-regression-tests-report]]"
---

# CI-004: Performance Budget Enforcement

## Summary

Implemented a comprehensive performance budget enforcement system in the CI pipeline that automatically validates bundle sizes, runtime thresholds, and code quality metrics against predefined budgets.

## Files Created

### 1. `.github/workflows/performance-budget.yml` (~350 lines)

**Purpose:** GitHub Actions workflow for automated performance budget validation

**Jobs Implemented:**

| Job | Description |
|-----|-------------|
| `bundle-analysis` | Analyzes JS/CSS/asset sizes against bundle budgets |
| `budget-validation` | Validates runtime thresholds are properly defined |
| `performance-tests` | Executes performance test suite |
| `component-analysis` | Checks for files exceeding 100-line limit |
| `budget-summary` | Aggregates results and enforces budgets |

**Triggers:**
- Push to `main` or `dev` branches
- Pull requests to `main` or `dev`
- Manual dispatch with optional strict mode toggle

**Key Features:**
- Concurrency control (cancels previous runs on same branch)
- Artifact upload for bundle analysis and test results
- Step summaries for GitHub PR integration
- Configurable strict mode enforcement

### 2. `performance.budget.json` (~125 lines)

**Purpose:** Centralized budget configuration for CI and local tooling

**Budget Categories:**

```
Bundle Budgets:
├── JavaScript: 2MB max (1.8MB warning)
├── CSS: 500KB max
├── Assets: 5MB max
└── Total: 7MB max

Runtime Budgets:
├── Startup
│   ├── TTI: 3000ms
│   ├── FCP: 1500ms
│   └── Warm Start: 1500ms
├── Rendering
│   ├── FPS: 60 target (55 minimum)
│   ├── Frame Time: 16.67ms
│   └── Jank Threshold: 5%
├── Memory
│   ├── Max Usage: 200MB
│   └── Leak Threshold: 10MB
└── Network
    ├── P50 Latency: 100ms
    └── P95 Latency: 200ms
```

## Integration with Existing Infrastructure

### Source of Truth Alignment

The workflow validates against `src/lib/performance/types.ts` which defines `DEFAULT_THRESHOLDS`:

```typescript
export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  maxFrameTime: 16.67,
  maxMemoryUsage: 200 * 1024 * 1024, // 200MB
  maxNetworkLatency: 200,
  maxRenderTime: 16,
  maxStartupTime: 3000,
  targetFPS: 60,
};
```

### CI Pipeline Integration

The performance budget workflow complements:
- `ci.yml` - Main CI with security and performance tests
- `security.yml` - Security scanning
- `quarterly-security-audit.yml` - Scheduled audits

### Local Development

Developers can validate budgets locally:

```bash
# Run performance tests
npm run test:performance

# Check file sizes (ESLint max-lines)
npm run lint:max-lines
```

## Workflow Details

### Bundle Analysis Job

1. Builds the web export using Expo
2. Calculates file sizes by type (JS, CSS, assets)
3. Compares against defined budgets
4. Reports utilization percentage
5. Outputs status for summary job

### Budget Validation Job

1. Verifies `DEFAULT_THRESHOLDS` exists in source
2. Validates specific threshold values haven't changed
3. Counts performance test files
4. Reports coverage by category

### Performance Tests Job

1. Runs Jest with `--testPathPattern="performance"`
2. Outputs JSON results for parsing
3. Reports pass/fail counts
4. Uploads artifacts for debugging

### Component Analysis Job

1. Finds `.tsx` files exceeding 100 lines
2. Reports violations sorted by size
3. References decomposition patterns doc
4. Purely informational (doesn't fail build)

### Budget Summary Job

1. Aggregates all job outputs
2. Generates final summary table
3. Enforces strict mode if enabled
4. Fails pipeline on budget violations

## Configuration Options

### Workflow Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `strict_mode` | boolean | `true` | Fail on any budget violation |

### Budget JSON Structure

```json
{
  "budgets": {
    "bundle": { /* size limits */ },
    "runtime": { /* timing limits */ },
    "codeQuality": { /* file metrics */ }
  },
  "enforcement": {
    "strict": true,
    "failOnWarning": false,
    "blockMerge": true
  }
}
```

## Example Output

### GitHub Step Summary

```markdown
# Performance Budget Summary

| Check | Status |
|-------|--------|
| Bundle Size (1250KB) | Within Budget |
| Budget Definitions | Valid |
| Performance Tests | Passed |
| Component Analysis | Analyzed |

## All Performance Budgets Met
```

### Bundle Analysis Table

```markdown
| Asset Type | Size | Budget | Status |
|------------|------|--------|--------|
| JavaScript | 950KB | 2048KB | OK |
| CSS | 80KB | N/A | OK |
| Other Assets | 220KB | 5120KB | OK |
| **TOTAL** | **1250KB** | **7168KB** | **OK** |

Bundle utilization: 17%
```

## Testing the Workflow

### Manual Trigger

```bash
gh workflow run performance-budget.yml \
  --ref main \
  -f strict_mode=true
```

### Local Validation

```bash
# Run performance tests
npm run test:performance

# Check for large files
find src -name "*.tsx" -exec wc -l {} + | \
  awk '$1 > 100 {print $0}' | sort -rn
```

## Future Enhancements

1. **Historical Trending** - Store baselines in artifacts for trend analysis
2. **PR Comments** - Post budget comparison to PRs
3. **Lighthouse Integration** - Add web vitals for web builds
4. **Bundle Diff** - Show size changes between commits
5. **Slack/Discord Alerts** - Notify on budget violations

## Related Documentation

- [PERF-001 Performance Baseline](./PERF-001-performance-baseline-report.md)
- [CI-002 Performance Regression Tests](./CI-002-performance-regression-tests-report.md)
- [DECOMPOSITION_PATTERNS](../DECOMPOSITION_PATTERNS.md)
- [Performance Types](../../src/lib/performance/types.ts)
