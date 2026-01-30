---
type: template
title: Quarterly Security Audit Checklist
created: 2026-01-22
tags:
  - security
  - audit
  - checklist
  - template
related:
  - '[[SECURITY-PERFORMANCE-SPEC]]'
  - '[[CI-003-quarterly-security-audits]]'
---

# Quarterly Security Audit Checklist

**Audit Period:** Q**\_ \_\_**
**Auditor:** ******\_\_\_\_******
**Date Started:** \_**\_-**-**
**Date Completed:** \_\_**-**-**
**Status:** [ ] In Progress / [ ] Complete / [ ] Blocked

---

## Pre-Audit Preparation

- [ ] Review previous quarter's audit report and remediation status
- [ ] Update security testing tools to latest versions
- [ ] Verify access to all required environments
- [ ] Schedule time with relevant team members if needed

---

## 1. Authentication Security (SEC-AUTH)

### 1.1 Token Management

- [ ] **SEC-AUTH-001**: All API calls include valid JWT token
  - [ ] Verified in Convex queries
  - [ ] Verified in Convex mutations
  - [ ] Verified in HTTP actions
- [ ] **SEC-AUTH-002**: Token refresh occurs before expiration
  - [ ] Clerk token refresh mechanism verified
- [ ] **SEC-AUTH-003**: Failed auth attempts are rate-limited
  - [ ] Clerk rate limiting configuration verified
- [ ] **SEC-AUTH-004**: Session invalidates on logout
  - [ ] Sign-out clears all tokens
  - [ ] Server-side session invalidation works
- [ ] **SEC-AUTH-005**: Social login uses PKCE flow
  - [ ] Google OAuth verified
  - [ ] Apple Sign-In verified

### 1.2 Secure Storage

- [ ] JWT tokens stored in expo-secure-store only
- [ ] No sensitive data in AsyncStorage
- [ ] No tokens logged to console
- [ ] No hardcoded credentials in codebase

### 1.3 Authentication Testing

- [ ] Run security test suite: `npm test -- --testPathPattern="security.*auth"`
- [ ] Manual test: Expired token handling
- [ ] Manual test: Invalid token rejection

**Authentication Score:** **_/100
**Issues Found:** _**
**Notes:**

```
[Add notes here]
```

---

## 2. Data Protection (SEC-DATA)

### 2.1 User Data Isolation

- [ ] **SEC-DATA-001**: All queries scoped by clerkId
  - [ ] habits queries verified
  - [ ] notes queries verified
  - [ ] letters queries verified
  - [ ] affirmations queries verified
  - [ ] reflections queries verified
  - [ ] voice notes queries verified
  - [ ] vision board queries verified
- [ ] Cross-user data access is impossible

### 2.2 Sensitive Data Handling

- [ ] **SEC-DATA-002**: Sensitive logs are redacted
  - [ ] No tokens in logs
  - [ ] No user IDs in client-visible logs
  - [ ] Sentry sanitization active
- [ ] **SEC-DATA-003**: Export data is encrypted
  - [ ] Data export feature review
- [ ] **SEC-DATA-004**: Voice notes use secure storage
  - [ ] URL security verified
  - [ ] Expiration policy verified
- [ ] **SEC-DATA-005**: Vision board images access-controlled
  - [ ] URL security verified
  - [ ] User ownership verified

### 2.3 Input Validation

- [ ] Habit name validation (max 100 chars, sanitized)
- [ ] Notes validation (max 5000 chars, XSS blocked)
- [ ] URL validation (HTTPS only, domain allowlist)
- [ ] Time format validation
- [ ] Color validation
- [ ] Dangerous pattern detection active

### 2.4 Data Protection Testing

- [ ] Run: `npm test -- --testPathPattern="security.*data|validation"`
- [ ] Manual test: XSS injection attempt
- [ ] Manual test: SQL injection attempt
- [ ] Manual test: Cross-user data access attempt

**Data Protection Score:** **_/100
**Issues Found:** _**
**Notes:**

```
[Add notes here]
```

---

## 3. API Security (SEC-API)

### 3.1 Mutation Security

- [ ] **SEC-API-001**: All mutations validate user ownership
  - [ ] toggle.ts verified
  - [ ] archive.ts verified
  - [ ] pause.ts verified
  - [ ] reorder.ts verified
  - [ ] toggleCompletion.ts verified
  - [ ] notesMutations.ts verified
  - [ ] reflectionsMutations.ts verified
  - [ ] lettersMutations.ts verified
  - [ ] affirmationsCRUD.ts verified
  - [ ] settings.ts verified
  - [ ] voiceNotesMutations.ts verified
  - [ ] visionBoardImagesMutations.ts verified

### 3.2 Error Handling

- [ ] **SEC-API-002**: Input validation on all user-provided data
- [ ] **SEC-API-004**: No sensitive data in error responses
  - [ ] Error messages are generic
  - [ ] No stack traces exposed to client
  - [ ] No internal IDs exposed

### 3.3 Rate Limiting

- [ ] **SEC-API-003**: Rate limiting on expensive operations
  - [ ] AI generation endpoints
  - [ ] Batch operations
  - [ ] File upload operations

### 3.4 Server-Side Secrets

- [ ] **SEC-API-005**: OpenAI API key server-side only
- [ ] No EXPO*PUBLIC* prefix on secrets
- [ ] Environment variables properly scoped

### 3.5 API Security Testing

- [ ] Run: `npm test -- --testPathPattern="security.*api"`
- [ ] Manual test: Unauthorized mutation attempt
- [ ] Manual test: Invalid input handling

**API Security Score:** **_/100
**Issues Found:** _**
**Notes:**

```
[Add notes here]
```

---

## 4. RevenueCat Security (SEC-RC)

### 4.1 Premium Validation

- [ ] **SEC-RC-001**: Server-side receipt validation via webhook
  - [ ] Webhook endpoint configured
  - [ ] HMAC signature verification active
- [ ] **SEC-RC-002**: Premium status syncs from server, not local
  - [ ] Client cannot forge premium status
  - [ ] Premium features gate on server state
- [ ] **SEC-RC-003**: User ID set after authentication
- [ ] **SEC-RC-004**: Platform-specific API keys configured

### 4.2 Webhook Security

- [ ] Webhook signature verification working
- [ ] Timing-safe comparison used
- [ ] Failed signature requests rejected with 401
- [ ] Webhook secret stored securely

### 4.3 RevenueCat Testing

- [ ] Run: `npm test -- --testPathPattern="webhook|revenuecat"`
- [ ] Manual test: Invalid webhook signature rejection
- [ ] Manual test: Client premium bypass prevention

**RevenueCat Security Score:** **_/100
**Issues Found:** _**
**Notes:**

```
[Add notes here]
```

---

## 5. Environment Security (SEC-ENV)

### 5.1 Secret Management

- [ ] **SEC-ENV-001**: No secrets in source control
  - [ ] .env files in .gitignore
  - [ ] No committed secrets in history
- [ ] **SEC-ENV-002**: Server-only keys without EXPO*PUBLIC* prefix
- [ ] **SEC-ENV-003**: Production keys differ from development
  - [ ] Clerk keys separated
  - [ ] Convex deployments separated
  - [ ] RevenueCat environments separated

### 5.2 Secret Scanning

- [ ] Run Gitleaks scan: `gitleaks detect --source .`
- [ ] Review GitHub secret scanning alerts
- [ ] Verify no secrets in CI logs

**Environment Security Score:** **_/100
**Issues Found:** _**
**Notes:**

```
[Add notes here]
```

---

## 6. Dependency Security

### 6.1 Vulnerability Scanning

- [ ] Run: `npm audit`
- [ ] Critical vulnerabilities: \_\_\_
- [ ] High vulnerabilities: \_\_\_
- [ ] Moderate vulnerabilities: \_\_\_
- [ ] Low vulnerabilities: \_\_\_

### 6.2 Dependency Updates

- [ ] Review Dependabot PRs
- [ ] Update critical security patches
- [ ] Update outdated packages (where safe)

### 6.3 License Compliance

- [ ] Run: `npx license-checker --production --summary`
- [ ] No copyleft licenses in production
- [ ] All licenses are approved

**Dependency Security Score:** **_/100
**Issues Found:** _**
**Notes:**

```
[Add notes here]
```

---

## 7. Security Test Suite

### 7.1 Automated Tests

- [ ] Run full security test suite: `npm run test:security`
- [ ] Tests passed: \_\_\_
- [ ] Tests failed: \_\_\_
- [ ] Coverage: \_\_\_%

### 7.2 Manual Testing

- [ ] Authentication flow testing
- [ ] Authorization boundary testing
- [ ] Input validation testing
- [ ] Error handling testing

**Security Test Score:** \_\_\_/100
**Notes:**

```
[Add notes here]
```

---

## Audit Summary

### Scores

| Category        | Score          | Issues     | Status                               |
| --------------- | -------------- | ---------- | ------------------------------------ |
| Authentication  | \_\_\_/100     | \_\_\_     | [ ] Pass / [ ] Review / [ ] Fail     |
| Data Protection | \_\_\_/100     | \_\_\_     | [ ] Pass / [ ] Review / [ ] Fail     |
| API Security    | \_\_\_/100     | \_\_\_     | [ ] Pass / [ ] Review / [ ] Fail     |
| RevenueCat      | \_\_\_/100     | \_\_\_     | [ ] Pass / [ ] Review / [ ] Fail     |
| Environment     | \_\_\_/100     | \_\_\_     | [ ] Pass / [ ] Review / [ ] Fail     |
| Dependencies    | \_\_\_/100     | \_\_\_     | [ ] Pass / [ ] Review / [ ] Fail     |
| **Overall**     | **\_\_\_/100** | **\_\_\_** | **[ ] Pass / [ ] Review / [ ] Fail** |

### Critical Issues (Require Immediate Action)

1. [ ] ***
2. [ ] ***
3. [ ] ***

### High Priority Issues

1. [ ] ***
2. [ ] ***
3. [ ] ***

### Medium Priority Issues

1. [ ] ***
2. [ ] ***

### Low Priority / Improvements

1. [ ] ***
2. [ ] ***

---

## Remediation Plan

| Issue | Priority | Owner | Target Date | Status |
| ----- | -------- | ----- | ----------- | ------ |
|       |          |       |             |        |
|       |          |       |             |        |
|       |          |       |             |        |

---

## Sign-Off

**Auditor Signature:** **********\_\_\_**********
**Date:** \_**\_-**-\_\_

**Reviewer Signature:** **********\_\_\_**********
**Date:** \_**\_-**-\_\_

---

_Template version: 1.0 | Created: 2026-01-22 | Based on SECURITY-PERFORMANCE-SPEC.md_
