---
type: report
title: RES-005 - Automated Security Scanning Implementation
created: 2026-01-22
tags:
  - security
  - ci-cd
  - automation
  - devops
related:
  - "[[SECURITY-PERFORMANCE-SPEC]]"
  - "[[SEC-001-security-audit-report]]"
  - "[[SEC-005-security-tests-report]]"
---

# RES-005: Automated Security Scanning in CI

**Status:** ✅ Completed
**Completed By:** security-performance agent
**Date:** 2026-01-22

---

## Executive Summary

Implemented comprehensive automated security scanning in CI/CD pipeline with:
- **5 scanning jobs** covering different vulnerability vectors
- **Dependabot** for automated dependency updates
- **Gitleaks** custom configuration for app-specific secrets
- **Weekly scheduled scans** for proactive vulnerability detection

---

## Implementation Details

### Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `.github/workflows/security.yml` | ~200 | Main security scanning workflow |
| `.github/dependabot.yml` | ~80 | Automated dependency updates |
| `.gitleaks.toml` | ~80 | Secret scanning configuration |

**Total:** 3 files, ~360 lines

---

## Security Scanning Jobs

### 1. npm Audit (Dependency Vulnerabilities)

**Purpose:** Detect known vulnerabilities in npm dependencies.

**Configuration:**
- Audit level: `high` (fails on high or critical)
- Output: JSON report artifact
- Summary: GitHub Actions step summary

**Exit Criteria:**
- ✅ PASS: No high/critical vulnerabilities
- ❌ FAIL: 1+ high or critical vulnerabilities

### 2. CodeQL (Static Analysis)

**Purpose:** GitHub's semantic code analysis for security vulnerabilities.

**Coverage:**
- `src/` - React Native application code
- `convex/` - Backend functions
- `app/` - Expo router pages

**Exclusions:**
- `node_modules/`
- Test files (`*.test.ts`, `__tests__/`)
- Mock files (`__mocks__/`)

**Query Suite:** `security-and-quality`
- Detects: SQL injection, XSS, path traversal, insecure crypto
- Code quality: Unused variables, dead code, complexity issues

### 3. Secret Scanning (Gitleaks)

**Purpose:** Detect accidentally committed secrets/credentials.

**Custom Rules Added:**
| Rule ID | Description | Pattern |
|---------|-------------|---------|
| `convex-admin-key` | Convex Admin API Key | 32+ char alphanumeric |
| `revenuecat-secret-key` | RevenueCat Secret Key | 32+ char alphanumeric |
| `clerk-secret-key` | Clerk Secret Key | `sk_test_` or `sk_live_` |
| `openai-api-key` | OpenAI API Key | `sk-` prefix |
| `sentry-dsn` | Sentry DSN with embedded auth | Full DSN URL |
| `webhook-secret` | Webhook secrets | 16+ char alphanumeric |

**Allowlisted Patterns:**
- `EXPO_PUBLIC_*` (designed for client exposure)
- `pk_test_*`, `pk_live_*` (Clerk publishable keys)
- Placeholder values (`your_api_key`, `example_key`)
- Test files and documentation

### 4. OWASP Dependency Check

**Purpose:** More comprehensive vulnerability database than npm audit.

**Features:**
- NVD (National Vulnerability Database) integration
- SARIF output for GitHub Security tab
- CVSS threshold: 7.0 (fails on high severity)

**Output:**
- HTML report (human-readable)
- JSON report (programmatic)
- SARIF (GitHub Security integration)

### 5. License Compliance

**Purpose:** Ensure all dependencies use approved licenses.

**Allowed Licenses:**
```
MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC,
0BSD, Unlicense, CC0-1.0, CC-BY-3.0, CC-BY-4.0,
Python-2.0, PSF-2.0, BlueOak-1.0.0
```

**Output:** `license-report.json` artifact

---

## Dependabot Configuration

### NPM Dependencies

**Schedule:** Weekly (Mondays at 09:00 UTC)
**PR Limit:** 10 open PRs max

**Grouped Updates:**
| Group | Packages | Update Types |
|-------|----------|--------------|
| `react-native` | `react-native*`, `expo*`, `@expo/*` | minor, patch |
| `testing` | `jest*`, `@testing-library/*` | minor, patch |
| `linting` | `eslint*`, `prettier*` | minor, patch |
| `dev-tools` | `typescript`, `husky`, `lint-staged` | minor, patch |

**Major Version Ignores:**
- `react` - requires manual migration
- `react-native` - requires Expo SDK update
- `expo` - requires full upgrade path
- `convex` - requires API compatibility review

### GitHub Actions

**Schedule:** Weekly
**PR Limit:** 5 open PRs max

---

## Workflow Triggers

| Trigger | Description |
|---------|-------------|
| `push` to `main`, `dev` | Run on every push |
| `pull_request` to `main`, `dev` | Run on PR creation/update |
| `schedule` (weekly) | Monday 09:00 UTC |
| `workflow_dispatch` | Manual trigger available |

---

## Security Summary Job

The final `security-summary` job:
1. Aggregates results from all scanning jobs
2. Generates GitHub Actions step summary table
3. Fails the workflow if any critical scan fails

**Summary Table Example:**
```
| Check | Status |
|-------|--------|
| npm Audit | ✅ Passed |
| CodeQL | ✅ Passed |
| Secret Scanning | ✅ Passed |
| License Check | ⚠️ Review |
```

---

## Integration with GitHub Security

### Security Tab Integration

All scanning results integrate with GitHub's Security tab:
- CodeQL alerts appear in Code Scanning
- OWASP results uploaded as SARIF
- Secret scanning alerts (if enabled on repo)

### Branch Protection Recommendations

Add to branch protection rules:
```yaml
required_status_checks:
  strict: true
  contexts:
    - "npm Audit"
    - "CodeQL Analysis"
    - "Secret Scanning"
```

---

## Monitoring & Alerting

### Weekly Reports

The scheduled Monday runs provide:
- Proactive vulnerability discovery
- New CVE detection in dependencies
- License compliance drift detection

### Recommended Actions

1. **Critical/High npm audit findings:**
   - Immediate: Run `npm audit fix`
   - If not auto-fixable: Manual review and upgrade

2. **CodeQL findings:**
   - Review in GitHub Security tab
   - Prioritize by severity and exploitability

3. **Secret detection:**
   - Rotate compromised credentials immediately
   - Add to `.gitleaks.toml` allowlist if false positive

4. **License violations:**
   - Review the package
   - Consider alternative packages with compatible licenses

---

## Test Verification

### Workflow Syntax Validation

```bash
# Validate GitHub Actions syntax
actionlint .github/workflows/security.yml
```

### Local Gitleaks Testing

```bash
# Run gitleaks locally
gitleaks detect --source . --config .gitleaks.toml --verbose
```

### npm Audit Preview

```bash
# Preview audit results
npm audit --audit-level=high --json | jq '.metadata.vulnerabilities'
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY SCANNING CI                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│   │  npm Audit │  │   CodeQL   │  │  Gitleaks  │               │
│   │ (npm deps) │  │  (SAST)    │  │ (secrets)  │               │
│   └─────┬──────┘  └─────┬──────┘  └─────┬──────┘               │
│         │               │               │                        │
│   ┌─────┴──────┐  ┌─────┴──────┐  ┌─────┴──────┐               │
│   │   OWASP    │  │  License   │  │            │               │
│   │ Dep-Check  │  │   Check    │  │            │               │
│   └─────┬──────┘  └─────┬──────┘  │            │               │
│         │               │               │                        │
│         └───────────────┴───────────────┘                        │
│                         │                                        │
│                ┌────────▼────────┐                               │
│                │ Security Summary│                               │
│                │   (aggregate)   │                               │
│                └────────┬────────┘                               │
│                         │                                        │
│         ┌───────────────┼───────────────┐                        │
│         │               │               │                        │
│   ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐                │
│   │ PR Status │   │  GitHub   │   │ Artifacts │                │
│   │   Check   │   │ Security  │   │ (reports) │                │
│   └───────────┘   └───────────┘   └───────────┘                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Future Enhancements

### Phase 4 Integration (CI-001 through CI-005)

This implementation provides the foundation for:
- **CI-001:** Security tests already run via existing test job
- **CI-002:** Performance tests can be added similarly
- **CI-003:** Quarterly audit schedule established (weekly scans)
- **CI-004:** Performance budgets via CodeQL metrics
- **CI-005:** Dependency vulnerability scanning (Dependabot + npm audit)

### Recommended Additions

1. **Container Scanning** (if Docker used in future)
2. **SAST for native code** (if native modules added)
3. **Dynamic Application Security Testing (DAST)** (requires deployed app)
4. **Security scorecards** (OpenSSF Scorecard integration)

---

## Conclusion

The automated security scanning implementation provides:

1. **Comprehensive Coverage:** 5 different scanning tools covering dependencies, code, secrets, and licenses
2. **Shift-Left Security:** Catches issues in PRs before merge
3. **Proactive Monitoring:** Weekly scheduled scans find new CVEs
4. **Developer Experience:** Clear feedback in GitHub UI with actionable summaries
5. **Compliance Ready:** License tracking and audit trails

This establishes a solid security foundation that aligns with industry best practices and prepares the codebase for future CI-001 through CI-005 tasks.
