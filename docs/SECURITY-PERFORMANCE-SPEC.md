# Security & Performance Specification

**Document Version:** 1.0
**Created:** 2026-01-22
**Author:** Murat (Master Test Architect)
**Status:** Draft for Review

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Security Specification](#2-security-specification)
3. [Performance Specification](#3-performance-specification)
4. [Risk Assessment Matrix](#4-risk-assessment-matrix)
5. [Testing Requirements](#5-testing-requirements)
6. [Acceptance Criteria](#6-acceptance-criteria)
7. [Implementation Roadmap](#7-implementation-roadmap)

---

## 1. Executive Summary

### 1.1 Purpose

This specification defines security and performance requirements for the Habit Tracking App, a React Native/Expo application with Convex backend, Clerk authentication, and RevenueCat monetization.

### 1.2 Scope

| Area            | Coverage                                                   |
| --------------- | ---------------------------------------------------------- |
| Authentication  | Clerk OAuth, JWT tokens, session management                |
| Data Protection | User data, credentials, premium status                     |
| API Security    | Convex backend, rate limiting, input validation            |
| Performance     | Render optimization, memory management, network efficiency |
| Monetization    | RevenueCat integration, receipt validation                 |

### 1.3 Current State Assessment

| Component              | Security Status      | Performance Status |
| ---------------------- | -------------------- | ------------------ |
| Authentication (Clerk) | ✅ Implemented       | ✅ Optimized       |
| Token Storage          | ✅ expo-secure-store | N/A                |
| Convex Backend         | ⚠️ Needs audit       | ✅ Indexed         |
| RevenueCat             | ⚠️ Partial setup     | N/A                |
| Frontend Rendering     | N/A                  | ⚠️ 7 large files   |
| Testing                | ⚠️ No security tests | ⚠️ No perf tests   |

---

## 2. Security Specification

### 2.1 Authentication Security

#### 2.1.1 Requirements

| ID           | Requirement                                    | Priority | Status           |
| ------------ | ---------------------------------------------- | -------- | ---------------- |
| SEC-AUTH-001 | All API calls must include valid JWT token     | Critical | ✅ Implemented   |
| SEC-AUTH-002 | Token refresh must occur before expiration     | High     | ✅ Clerk handles |
| SEC-AUTH-003 | Failed auth attempts must be rate-limited      | High     | ⬜ Clerk config  |
| SEC-AUTH-004 | Session must invalidate on logout              | Critical | ✅ Implemented   |
| SEC-AUTH-005 | Social login (Google/Apple) must use PKCE flow | High     | ✅ Clerk default |

#### 2.1.2 Token Management

```
┌─────────────────────────────────────────────────────────────┐
│                    TOKEN LIFECYCLE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  Login   │───►│  Clerk   │───►│  Store   │              │
│  │  Screen  │    │   Auth   │    │  Token   │              │
│  └──────────┘    └──────────┘    └────┬─────┘              │
│                                       │                     │
│                       ┌───────────────▼───────────────┐    │
│                       │     expo-secure-store         │    │
│                       │  (iOS Keychain / Android KS)  │    │
│                       └───────────────┬───────────────┘    │
│                                       │                     │
│  ┌──────────┐    ┌──────────┐    ┌───▼──────┐              │
│  │  Convex  │◄───│   JWT    │◄───│  Fetch   │              │
│  │  Query   │    │  Header  │    │  Token   │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 2.1.3 Secure Storage Requirements

| Storage Type      | Use Case                          | Encryption               |
| ----------------- | --------------------------------- | ------------------------ |
| expo-secure-store | JWT tokens, sensitive credentials | Platform native          |
| AsyncStorage      | Non-sensitive preferences         | None (avoid for secrets) |
| Convex            | User data, habits                 | TLS + at-rest            |

### 2.2 Data Protection

#### 2.2.1 Sensitive Data Classification

| Classification | Data Types                     | Protection Required                    |
| -------------- | ------------------------------ | -------------------------------------- |
| **Critical**   | JWT tokens, API keys           | Encrypted storage, never log           |
| **High**       | Email, user ID, premium status | Encrypted transit, access control      |
| **Medium**     | Habits, notes, reflections     | User-scoped queries, backup encryption |
| **Low**        | App settings, preferences      | Standard storage                       |

#### 2.2.2 Data Protection Requirements

| ID           | Requirement                                     | Priority | Status             |
| ------------ | ----------------------------------------------- | -------- | ------------------ |
| SEC-DATA-001 | All user data queries must be scoped by clerkId | Critical | ✅ Implemented     |
| SEC-DATA-002 | Sensitive logs must be redacted                 | High     | ⚠️ Partial         |
| SEC-DATA-003 | Export data must be encrypted                   | Medium   | ⬜ Not implemented |
| SEC-DATA-004 | Voice notes must use secure storage URLs        | High     | ⬜ Needs audit     |
| SEC-DATA-005 | Vision board images must be access-controlled   | Medium   | ⬜ Needs audit     |

#### 2.2.3 Row-Level Security Pattern

```typescript
// REQUIRED: All Convex queries must verify user identity
export const getHabits = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const clerkId = identity.subject;
    return ctx.db
      .query('habits')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .collect();
  },
});
```

### 2.3 API Security

#### 2.3.1 Requirements

| ID          | Requirement                                    | Priority | Status              |
| ----------- | ---------------------------------------------- | -------- | ------------------- |
| SEC-API-001 | All mutations must validate user ownership     | Critical | ⚠️ Needs audit      |
| SEC-API-002 | Input validation on all user-provided data     | High     | ⚠️ Partial          |
| SEC-API-003 | Rate limiting on expensive operations          | Medium   | ⬜ Not implemented  |
| SEC-API-004 | No sensitive data in error responses           | High     | ⚠️ Needs audit      |
| SEC-API-005 | OpenAI API key must never be exposed to client | Critical | ✅ Server-side only |

#### 2.3.2 Input Validation Rules

| Field Type        | Validation                      | Max Length |
| ----------------- | ------------------------------- | ---------- |
| Habit name        | Alphanumeric, emoji, spaces     | 100 chars  |
| Notes/reflections | Sanitized text                  | 5000 chars |
| Email             | RFC 5322 format                 | 254 chars  |
| URLs (images)     | HTTPS only, allowlisted domains | 2048 chars |

### 2.4 RevenueCat Security

#### 2.4.1 Requirements

| ID         | Requirement                                         | Priority | Status                |
| ---------- | --------------------------------------------------- | -------- | --------------------- |
| SEC-RC-001 | Server-side receipt validation                      | Critical | ⬜ Not implemented    |
| SEC-RC-002 | Premium status must sync from RevenueCat, not local | Critical | ⬜ Needs verification |
| SEC-RC-003 | User ID must be set after authentication            | High     | ✅ Implemented        |
| SEC-RC-004 | API keys must be platform-specific                  | High     | ✅ Implemented        |

#### 2.4.2 Premium Status Validation Flow

```
┌─────────────────────────────────────────────────────────────┐
│              PREMIUM VALIDATION (REQUIRED)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────┐         ┌──────────────┐                    │
│   │  Client  │────────►│  RevenueCat  │                    │
│   │  (App)   │         │    Server    │                    │
│   └──────────┘         └──────┬───────┘                    │
│                               │                             │
│                               │ Webhook                     │
│                               ▼                             │
│                        ┌──────────────┐                    │
│                        │   Convex     │                    │
│                        │  (Backend)   │                    │
│                        └──────┬───────┘                    │
│                               │                             │
│                               │ Update                      │
│                               ▼                             │
│                        ┌──────────────┐                    │
│                        │ userSettings │                    │
│                        │  hasPremium  │                    │
│                        └──────────────┘                    │
│                                                             │
│   ⚠️ NEVER trust client-side premium status                │
│   ✅ ALWAYS validate via server webhook                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.5 Environment Security

#### 2.5.1 Environment Variables

| Variable                            | Exposure      | Risk Level                |
| ----------------------------------- | ------------- | ------------------------- |
| `EXPO_PUBLIC_CONVEX_URL`            | Client bundle | Low (public endpoint)     |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client bundle | Low (designed for client) |
| `EXPO_PUBLIC_REVENUECAT_*_KEY`      | Client bundle | Low (designed for client) |
| `CONVEX_DEPLOYMENT`                 | Server only   | Medium                    |
| `OPENAI_API_KEY`                    | Server only   | Critical                  |

#### 2.5.2 Requirements

| ID          | Requirement                                       | Priority | Status                |
| ----------- | ------------------------------------------------- | -------- | --------------------- |
| SEC-ENV-001 | No secrets in source control                      | Critical | ✅ .env in .gitignore |
| SEC-ENV-002 | Server-only keys must not use EXPO*PUBLIC* prefix | Critical | ✅ Verified           |
| SEC-ENV-003 | Production keys must differ from development      | High     | ⬜ Needs verification |

---

## 3. Performance Specification

### 3.1 Performance Budgets

#### 3.1.1 Startup Performance

| Metric                    | Target  | Current       | Status         |
| ------------------------- | ------- | ------------- | -------------- |
| Time to Interactive (TTI) | < 3s    | ⬜ Unmeasured | Needs baseline |
| First Contentful Paint    | < 1.5s  | ⬜ Unmeasured | Needs baseline |
| JS Bundle Size            | < 2MB   | ⬜ Unmeasured | Needs baseline |
| Initial Data Load         | < 500ms | ⬜ Unmeasured | Needs baseline |

#### 3.1.2 Runtime Performance

| Metric         | Target        | Current       | Status         |
| -------------- | ------------- | ------------- | -------------- |
| Frame Rate     | 60 FPS        | ⬜ Unmeasured | Needs baseline |
| Animation Jank | < 16ms frames | ⬜ Unmeasured | Needs baseline |
| List Scroll    | 60 FPS        | ⬜ Unmeasured | Needs baseline |
| Memory Usage   | < 200MB       | ⬜ Unmeasured | Needs baseline |

#### 3.1.3 Network Performance

| Metric                  | Target                | Current       | Status               |
| ----------------------- | --------------------- | ------------- | -------------------- |
| API Response Time (P95) | < 200ms               | ⬜ Unmeasured | Needs baseline       |
| Offline Tolerance       | Graceful degradation  | ⚠️ Partial    | NetworkStatusContext |
| Data Caching            | Convex reactive cache | ✅ Built-in   | Convex handles       |

### 3.2 Rendering Optimization

#### 3.2.1 Requirements

| ID              | Requirement                             | Priority | Status           |
| --------------- | --------------------------------------- | -------- | ---------------- |
| PERF-RENDER-001 | List components must be virtualized     | High     | ✅ FlatList used |
| PERF-RENDER-002 | Expensive computations must use useMemo | High     | ✅ 132 instances |
| PERF-RENDER-003 | Event handlers must use useCallback     | Medium   | ✅ Implemented   |
| PERF-RENDER-004 | Pure components should use React.memo   | Medium   | ✅ Strategic use |
| PERF-RENDER-005 | Files must be ≤100 lines                | Medium   | ⚠️ 7 violations  |

#### 3.2.2 Component Optimization Patterns

```typescript
// ✅ CORRECT: Memoized list item
const HabitListItem = React.memo(({ habit, onPress }) => {
  const handlePress = useCallback(() => onPress(habit.id), [habit.id, onPress]);
  return <Pressable onPress={handlePress}>...</Pressable>;
});

// ❌ INCORRECT: Inline function causes re-render
const HabitListItem = ({ habit, onPress }) => {
  return <Pressable onPress={() => onPress(habit.id)}>...</Pressable>;
};
```

#### 3.2.3 Critical Files Requiring Decomposition

| File                          | Lines | Priority | Decomposition Strategy            |
| ----------------------------- | ----- | -------- | --------------------------------- |
| `TemplateScienceModal.tsx`    | 1,375 | P1       | Extract sections to subcomponents |
| `LettersSection.tsx`          | 1,320 | P1       | Extract letter CRUD operations    |
| `AffirmationsSection.tsx`     | 1,133 | P1       | Extract affirmation management    |
| `HabitsEmptyState.tsx`        | 1,094 | P2       | Extract animation logic           |
| `FullsizeTemplatePreview.tsx` | 1,047 | P2       | Extract preview sections          |
| `TemplatesScreen.tsx`         | 1,039 | P2       | Extract filter/search logic       |
| `TodaysFocusCard.tsx`         | 991   | P2       | Extract card sections             |

### 3.3 Memory Management

#### 3.3.1 Requirements

| ID           | Requirement                                 | Priority | Status           |
| ------------ | ------------------------------------------- | -------- | ---------------- |
| PERF-MEM-001 | Subscriptions must be cleaned up on unmount | Critical | ⚠️ Needs audit   |
| PERF-MEM-002 | Images must be properly sized and cached    | High     | ⬜ Needs audit   |
| PERF-MEM-003 | Animations must dispose properly            | High     | ⚠️ Needs audit   |
| PERF-MEM-004 | No memory leaks in long-running sessions    | Critical | ⬜ Needs testing |

#### 3.3.2 Memory Leak Prevention Pattern

```typescript
// ✅ CORRECT: Cleanup on unmount
useEffect(() => {
  const subscription = someObservable.subscribe(handleData);
  return () => subscription.unsubscribe();
}, []);

// ✅ CORRECT: Reanimated cleanup
useEffect(() => {
  return () => {
    cancelAnimation(animatedValue);
  };
}, []);
```

### 3.4 Network Optimization

#### 3.4.1 Requirements

| ID           | Requirement                          | Priority | Status          |
| ------------ | ------------------------------------ | -------- | --------------- |
| PERF-NET-001 | Batch related queries where possible | Medium   | ⬜ Needs review |
| PERF-NET-002 | Use optimistic updates for mutations | High     | ⬜ Partial      |
| PERF-NET-003 | Implement proper error retry logic   | High     | ⬜ Needs audit  |
| PERF-NET-004 | Cache static assets appropriately    | Medium   | ⬜ Needs review |

#### 3.4.2 Offline Support Requirements

| Scenario                  | Expected Behavior                    | Status             |
| ------------------------- | ------------------------------------ | ------------------ |
| No connectivity           | Show offline banner, queue mutations | ⚠️ Partial         |
| Intermittent connectivity | Retry with exponential backoff       | ⬜ Not implemented |
| Reconnection              | Sync queued changes, refresh data    | ⬜ Not implemented |

### 3.5 Animation Performance

#### 3.5.1 Requirements

| ID            | Requirement                                      | Priority | Status                          |
| ------------- | ------------------------------------------------ | -------- | ------------------------------- |
| PERF-ANIM-001 | Animations must run on UI thread                 | Critical | ✅ Reanimated                   |
| PERF-ANIM-002 | Gesture handlers must be native                  | High     | ✅ react-native-gesture-handler |
| PERF-ANIM-003 | Complex animations must not block JS thread      | High     | ⬜ Needs audit                  |
| PERF-ANIM-004 | Animation timing must be < 300ms for UI feedback | Medium   | ⬜ Needs audit                  |

---

## 4. Risk Assessment Matrix

### 4.1 Security Risks

| Risk ID      | Description                            | Likelihood | Impact   | Risk Level | Mitigation                         |
| ------------ | -------------------------------------- | ---------- | -------- | ---------- | ---------------------------------- |
| RISK-SEC-001 | Premium bypass via client manipulation | Medium     | High     | **High**   | Server-side validation via webhook |
| RISK-SEC-002 | User data exposure via query injection | Low        | Critical | **High**   | Convex type-safe queries           |
| RISK-SEC-003 | Token theft via insecure storage       | Low        | Critical | **Medium** | expo-secure-store                  |
| RISK-SEC-004 | Session hijacking                      | Low        | High     | **Medium** | Clerk token rotation               |
| RISK-SEC-005 | Voice note/image URL exposure          | Medium     | Medium   | **Medium** | Signed URLs with expiration        |

### 4.2 Performance Risks

| Risk ID       | Description                          | Likelihood | Impact | Risk Level | Mitigation                  |
| ------------- | ------------------------------------ | ---------- | ------ | ---------- | --------------------------- |
| RISK-PERF-001 | Memory leak in long sessions         | Medium     | High   | **High**   | Subscription cleanup audit  |
| RISK-PERF-002 | Jank in habit list with 100+ items   | Medium     | Medium | **Medium** | Virtualization verified     |
| RISK-PERF-003 | Slow startup with large data         | Low        | Medium | **Medium** | Lazy loading, pagination    |
| RISK-PERF-004 | Animation stutter on low-end devices | Medium     | Low    | **Low**    | Reduce animation complexity |

---

## 5. Testing Requirements

### 5.1 Security Testing

#### 5.1.1 Required Test Categories

| Category           | Description                  | Test Count | Status    |
| ------------------ | ---------------------------- | ---------- | --------- |
| Authentication     | Login, logout, token refresh | 10+        | ⬜ Needed |
| Authorization      | User data isolation          | 15+        | ⬜ Needed |
| Input Validation   | XSS, injection prevention    | 20+        | ⬜ Needed |
| Premium Validation | Receipt verification         | 5+         | ⬜ Needed |
| Session Management | Timeout, invalidation        | 5+         | ⬜ Needed |

#### 5.1.2 Security Test Scenarios

```gherkin
# SEC-TEST-001: User Data Isolation
Given User A is authenticated
And User B has created habits
When User A queries habits
Then User A should only see their own habits
And User B's habits should not be accessible

# SEC-TEST-002: Premium Bypass Prevention
Given a user has not purchased premium
When the user manually sets hasPremium=true in client state
Then server-side premium checks should still fail
And premium features should remain locked

# SEC-TEST-003: Token Expiration Handling
Given a user's token has expired
When the user makes an API request
Then the request should fail with 401
And the app should redirect to login
```

### 5.2 Performance Testing

#### 5.2.1 Required Test Categories

| Category            | Description                    | Test Count | Status    |
| ------------------- | ------------------------------ | ---------- | --------- |
| Startup Time        | Cold/warm start measurements   | 5+         | ⬜ Needed |
| Render Performance  | Frame timing, FPS monitoring   | 10+        | ⬜ Needed |
| Memory Profiling    | Leak detection, usage tracking | 5+         | ⬜ Needed |
| Network Performance | Latency, throughput            | 5+         | ⬜ Needed |
| Stress Testing      | High data volume scenarios     | 5+         | ⬜ Needed |

#### 5.2.2 Performance Test Scenarios

```gherkin
# PERF-TEST-001: Habit List Scroll Performance
Given a user has 100 habits
When the user scrolls through the habit list
Then frame rate should stay above 55 FPS
And no frame should exceed 20ms

# PERF-TEST-002: Startup Performance
Given the app is freshly installed
When the user launches the app
Then time to interactive should be under 3 seconds
And first contentful paint should be under 1.5 seconds

# PERF-TEST-003: Memory Stability
Given a user navigates through all app screens
When the user repeats this 10 times
Then memory usage should not increase significantly
And no memory leaks should be detected
```

### 5.3 E2E Test Requirements (ATDD)

#### 5.3.1 Critical User Journeys

| Journey                                          | Priority | Security | Performance |
| ------------------------------------------------ | -------- | -------- | ----------- |
| Sign up → Create first habit → Toggle completion | P0       | ✓        | ✓           |
| Login → View habits → Check streak               | P0       | ✓        | ✓           |
| Purchase premium → Access premium features       | P1       | ✓        | -           |
| Offline → Queue actions → Sync on reconnect      | P1       | -        | ✓           |
| Delete account → Verify data removal             | P1       | ✓        | -           |

---

## 6. Acceptance Criteria

### 6.1 Security Acceptance Criteria

| ID         | Criteria                                        | Verification Method                |
| ---------- | ----------------------------------------------- | ---------------------------------- |
| AC-SEC-001 | No user can access another user's data          | E2E test + manual penetration test |
| AC-SEC-002 | Premium features cannot be bypassed client-side | Server-side validation test        |
| AC-SEC-003 | All sensitive data is encrypted at rest         | Security audit                     |
| AC-SEC-004 | No secrets are exposed in client bundle         | Bundle analysis                    |
| AC-SEC-005 | Session expires after 30 days of inactivity     | Integration test                   |

### 6.2 Performance Acceptance Criteria

| ID          | Criteria                                | Verification Method    |
| ----------- | --------------------------------------- | ---------------------- |
| AC-PERF-001 | App launches in under 3 seconds         | Performance test suite |
| AC-PERF-002 | 60 FPS maintained during normal use     | Frame timing analysis  |
| AC-PERF-003 | Memory usage stays under 200MB          | Memory profiling       |
| AC-PERF-004 | No memory leaks after 30 minutes of use | Leak detection test    |
| AC-PERF-005 | API responses under 200ms (P95)         | Monitoring dashboard   |

---

## 7. Implementation Roadmap

### 7.1 Phase 1: Security Hardening (Priority: Critical)

- [x] **SEC-001**: Audit all Convex mutations for user ownership validation
  - **Completed:** 2026-01-22 by security-performance agent
  - **Report:** `docs/Working/SEC-001-security-audit-report.md`
  - **Summary:** Fixed 11 mutation files with 25+ vulnerable endpoints. Added authentication checks via `ctx.auth.getUserIdentity()` and ownership verification via `habit.userId` or parent entity checks. Files patched: toggle.ts, archive.ts, pause.ts, reorder.ts, toggleCompletion.ts, notesMutations.ts, reflectionsMutations.ts, lettersMutations.ts, affirmationsCRUD.ts, settings.ts
- [x] **SEC-002**: Implement server-side RevenueCat webhook for premium validation
  - **Completed:** 2026-01-22 by security-performance agent
  - **Files Created:**
    - `convex/webhooks/revenuecat.ts` - Main webhook handler (86 lines)
    - `convex/webhooks/revenuecatSignature.ts` - HMAC-SHA256 signature verification (85 lines)
  - **Files Modified:**
    - `convex/schema.ts` - Added `subscriptions` table with status, product, dates, and audit fields
    - `convex/router.ts` - Added `/revenuecat-webhook` POST endpoint
  - **Implementation Details:**
    - Webhook endpoint: `https://<deployment>.convex.site/revenuecat-webhook`
    - Events handled: INITIAL_PURCHASE, RENEWAL, PRODUCT_CHANGE, UNCANCELLATION, CANCELLATION, EXPIRATION, BILLING_ISSUE
    - Signature verification using HMAC-SHA256 (timing-safe comparison)
    - Delegates to existing internal mutations (grantPremium, revokePremium, setBillingIssue)
  - **Configuration Required:**
    - Set `REVENUECAT_WEBHOOK_SECRET` env var in Convex
    - Configure webhook URL in RevenueCat Dashboard → Integrations → Webhooks
- [x] **SEC-003**: Add input validation to all user-provided fields
  - **Completed:** 2026-01-22 by security-performance agent
  - **Files Created:**
    - `convex/lib/inputValidation.ts` - Centralized validation utilities (273 lines)
    - `convex/habits/validation.ts` - Habit-specific validation (198 lines)
    - `convex/lib/inputValidation.test.ts` - Comprehensive test suite (246 lines)
  - **Files Modified:**
    - `convex/habits/create.ts` - Added validation for name, notes, cue fields, times, colors
    - `convex/habits/update.ts` - Added validation for all updatable fields
    - `convex/notesMutations.ts` - Added body text validation with XSS protection
    - `convex/reflectionsMutations.ts` - Added emoji and note validation
    - `convex/lettersMutations.ts` - Added title and content validation
    - `convex/affirmationsCRUD.ts` - Added affirmation text validation
    - `convex/voiceNotesMutations.ts` - Added URL validation with domain allowlist (CRITICAL)
    - `convex/visionBoardImagesCreate.ts` - Added caption validation + auth checks
    - `convex/visionBoardImagesMutations.ts` - Added caption validation + auth checks
  - **Validation Rules Implemented:**
    - Habit name: max 100 chars, alphanumeric/emoji/spaces, XSS blocked
    - Notes/reflections/letters: max 5000 chars, sanitized text, XSS blocked
    - Short text (captions/affirmations): max 500 chars, sanitized
    - URLs: HTTPS required, domain allowlist enforced (convex.cloud, etc.)
    - Time format: HH:MM validation (00:00-23:59)
    - Colors: hex (#RGB/#RRGGBB) or named colors
    - Emojis: max 20 chars, dangerous patterns blocked
    - Identifiers: alphanumeric with hyphens/underscores only
  - **Security Patterns:**
    - Dangerous pattern detection blocks: script tags, event handlers, javascript: URLs, iframe injection, SQL injection patterns
    - URL domain allowlist prevents malicious URL storage
    - All validation errors use generic messages (no information leakage)
- [x] **SEC-004**: Audit voice note and image URL security
  - **Completed:** 2026-01-22 by security-performance agent
  - **Report:** `docs/Working/SEC-004-security-audit-report.md`
  - **Summary:** Fixed 10 vulnerable queries in 3 files that lacked authentication/ownership checks
  - **Files Modified:**
    - `convex/voiceNotesQueries.ts` - Added auth+ownership to: listByHabit, getDay1Note, get, countByHabit
    - `convex/visionBoardImagesQueries.ts` - Added auth+ownership to: listByHabit, get, countByHabit, listByUser
    - `convex/lettersQueriesExtra.ts` - Added auth+ownership to: getMostRecentUnlocked, listByUser
  - **Breaking API Changes:**
    - `listByUser` functions no longer accept userId parameter (use authenticated user's ID instead)
  - **Architectural Finding:** Convex native storage URLs do not expire; consider R2/ConvexFS for signed URLs
- [x] **SEC-005**: Create security test suite (auth, authorization, input validation)
  - **Completed:** 2026-01-22 by security-performance agent
  - **Files Created:**
    - `convex/lib/security.auth.test.ts` - Authentication pattern tests (98 lines)
    - `convex/lib/security.validation.test.ts` - Input validation edge cases (99 lines)
    - `convex/webhooks/revenuecatSignature.test.ts` - Webhook signature tests (98 lines)
    - `tests/integration/security/security-scenarios.test.ts` - E2E security scenarios (147 lines)
  - **Test Coverage (51 tests total):**
    - SEC-001 Authentication: Error message security, auth check order, ownership verification patterns
    - SEC-003 Validation: Unicode bypass attempts, URL security edge cases, SQL injection prevention
    - SEC-002 Webhook: HMAC timing-safe comparison, signature format, request validation
    - E2E Scenarios: User data isolation, premium bypass prevention, token security, XSS prevention

### 7.2 Phase 2: Performance Baseline (Priority: High)

- [x] **PERF-001**: Establish performance measurement baseline
  - **Completed:** 2026-01-22 by security-performance agent
  - **Report:** `docs/Working/PERF-001-performance-baseline-report.md`
  - **Files Created:**
    - `src/lib/performance/` - Core measurement utilities (7 files, ~622 lines)
      - `types.ts` - Type definitions for all performance metrics
      - `PerformanceTimer.ts` - High-precision timing with marks and measures
      - `FrameMonitor.ts` - FPS tracking and jank detection
      - `MemoryMonitor.ts` - Memory usage tracking and leak detection
      - `RenderTracker.ts` - Component render performance tracking
      - `NetworkMonitor.ts` - API latency and error rate monitoring
    - `src/contexts/PerformanceContext/` - React context provider (4 files, ~275 lines)
    - `src/hooks/performance/` - Custom hooks for components (6 files, ~314 lines)
      - `usePerformance` - Main context access hook
      - `useRenderCount` - Track component render counts
      - `useComponentTiming` - Measure mount/unmount timing
      - `useFPSMonitor` - Real-time FPS monitoring
      - `useMemoryMonitor` - Memory usage monitoring
    - `tests/performance/` - Baseline tests (5 files, ~526 lines)
  - **Performance Thresholds Defined:**
    - Startup Time (TTI): < 3,000ms
    - Target FPS: 60 (frame budget: 16.67ms)
    - Max Memory Usage: 200MB
    - API Latency (P95): < 200ms
    - Max Render Time: 16ms per component
  - **Total:** 22 files, ~1,737 lines of code
- [x] **PERF-002**: Audit subscription cleanup across all components
  - **Completed:** 2026-01-22 by security-performance agent
  - **Report:** `docs/Working/PERF-002-subscription-cleanup-audit-report.md`
  - **Audit Score:** 95/100 initially, 98/100 after fixes
  - **Issues Found & Fixed (2):**
    1. `src/components/OfflineQueueProcessor/OfflineQueueProcessor.tsx`
       - Problem: `setTimeout` in `useOnlineCallback` was not tracked
       - Fix: Added `onlineTimeoutRef` to track and cleanup timeout on unmount
    2. `src/features/habits/components/HabitsList/useHabitsListAnimations.ts`
       - Problem: Animation timeout and `Animated.CompositeAnimation` not tracked
       - Fix: Added `animationTimeoutRef` and `animationRef` with proper cleanup
  - **Patterns Verified (All PASS):**
    - Event Listeners: NetInfo, AppState, Notifications, BackHandler, Accessibility
    - Timer/Intervals: All intervals properly cleared with `clearInterval()`
    - Animation Cleanup: Reanimated `cancelAnimation()`, RN Animated `.stop()`
    - Subscriptions: RevenueCat listener removal, Performance frame data unsubscribe
  - **No Memory Leaks Detected** - All subscriptions have proper cleanup
- [x] **PERF-003**: Decompose 7 critical large files
  - **Completed:** 2026-01-22 by security-performance agent
  - **Summary:** All 7 files (1,000+ lines each) decomposed into modular folder structures following established patterns from `docs/DECOMPOSITION_PATTERNS.md`
  - **Decomposition Results:**
    | Original File | Original Lines | Files After | Total Lines |
    |--------------|----------------|-------------|-------------|
    | TemplateScienceModal.tsx | 1,375 | 39 | 2,244 |
    | LettersSection.tsx | 1,320 | 34 | 1,930 |
    | AffirmationsSection.tsx | 1,133 | 28 | 1,764 |
    | HabitsEmptyState.tsx | 1,094 | 24 | 1,308 |
    | FullsizeTemplatePreview.tsx | 1,047 | 31 | 1,696 |
    | TemplatesScreen.tsx | 1,039 | 40 | 2,326 |
    | TodaysFocusCard.tsx | 991 | 20 | 1,303 |
  - **ESLint Compliance:** All 216 decomposed files pass `max-lines` rule (100 lines, excluding blanks and comments)
  - **Patterns Applied:**
    - Component Pattern: Main component + hooks, types, styles, constants, and components/ folders
    - Hook Pattern: Main hook orchestrating sub-hooks (state, effects, handlers)
    - Barrel exports (index.ts) maintain public API compatibility
- [ ] **PERF-004**: Implement performance test suite
- [ ] **PERF-005**: Add performance monitoring (consider Sentry Performance)

### 7.3 Phase 3: Resilience & Monitoring (Priority: Medium)

- [ ] **RES-001**: Implement comprehensive offline support
- [ ] **RES-002**: Add optimistic updates to key mutations
- [ ] **RES-003**: Implement error tracking (Sentry/similar)
- [ ] **RES-004**: Create performance dashboard
- [ ] **RES-005**: Implement automated security scanning in CI

### 7.4 Phase 4: Continuous Improvement (Priority: Ongoing)

- [ ] **CI-001**: Add security tests to CI pipeline
- [ ] **CI-002**: Add performance regression tests to CI
- [ ] **CI-003**: Regular security audits (quarterly)
- [ ] **CI-004**: Performance budget enforcement
- [ ] **CI-005**: Dependency vulnerability scanning

---

## Appendix A: Testing Tools Recommendations

| Category            | Tool                           | Purpose                  |
| ------------------- | ------------------------------ | ------------------------ |
| E2E Testing         | Maestro / Detox                | User journey validation  |
| Security Testing    | OWASP ZAP                      | Vulnerability scanning   |
| Performance Testing | Flashlight                     | React Native performance |
| Memory Profiling    | Flipper                        | Memory leak detection    |
| Network Monitoring  | Charles Proxy                  | API traffic analysis     |
| Bundle Analysis     | react-native-bundle-visualizer | Bundle size optimization |

## Appendix B: Security Checklist for Code Review

```markdown
## Security Review Checklist

### Authentication

- [ ] User identity verified via ctx.auth.getUserIdentity()
- [ ] Token handling follows secure patterns
- [ ] No hardcoded credentials

### Data Access

- [ ] Query scoped by clerkId or user identifier
- [ ] Mutation verifies resource ownership before modification
- [ ] No sensitive data in logs or error messages

### Input Handling

- [ ] User input validated and sanitized
- [ ] No raw user input in queries
- [ ] URL inputs restricted to HTTPS

### Dependencies

- [ ] No known vulnerabilities in dependencies
- [ ] Minimal dependency surface area
```

## Appendix C: Performance Review Checklist

```markdown
## Performance Review Checklist

### Rendering

- [ ] Lists use FlatList or virtualization
- [ ] Expensive computations use useMemo
- [ ] Event handlers use useCallback
- [ ] File is under 100 lines

### Memory

- [ ] Subscriptions cleaned up in useEffect return
- [ ] Animations properly cancelled
- [ ] No closures over large objects

### Network

- [ ] No unnecessary API calls
- [ ] Data properly cached via Convex
- [ ] Error handling with retry logic
```

---

**Document End**

_This specification should be reviewed and updated quarterly, or when significant architectural changes occur._
