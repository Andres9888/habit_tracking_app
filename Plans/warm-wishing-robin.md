# Security Audit Plan

## Context

Comprehensive security review of the habit tracking app (React Native + Convex + Clerk). The app already has a previous security audit documented in `docs/SECURITY.md` (Feb 2026). This review validates current state and identifies remaining gaps.

---

## Overall Security Posture: STRONG

The codebase has solid security fundamentals. No critical vulnerabilities were found. The items below are the actionable findings.

---

## Findings

### 1. Dead Guard Clause in `convex/auth.config.ts` (BUG)

**File:** `convex/auth.config.ts:11-17`

The comment says the domain comes from an env var, but it's hardcoded as a string literal. The `if (!authDomain)` guard on line 13 can never be false — it's checking a non-empty string constant, making it dead code.

**Fix:** Use `process.env.CLERK_AUTH_DOMAIN` with the hardcoded value as fallback (matching the pattern in `convex/config/apiConstants.ts:28-29`):

```typescript
const authDomain = process.env.CLERK_AUTH_DOMAIN || 'https://vital-elf-64.clerk.accounts.dev';
```

---

### 2. npm Dependency Vulnerabilities (MEDIUM)

**9 vulnerabilities:** 5 low, 1 moderate, 3 high

High-severity packages:
- **flatted** (<3.4.0) — unbounded recursion DoS in `parse()`
- **undici** (<=6.23.0) — WebSocket overflow, HTTP smuggling, CRLF injection
- **tar** — known vulnerability

**Fix:** Run `npm audit fix`. For remaining issues, run `npm audit fix --force` and test for regressions.

---

### 3. No Rate Limiting on Mutations (LOW)

No per-user rate limiting on Convex mutations. The free tier limit (3 habits) provides partial protection, but authenticated users could spam mutations.

**Fix (optional):** Consider Convex rate limiting middleware for write-heavy mutations. Low priority since Convex has built-in platform-level protections.

---

### 4. Server-Side MIME Validation Gap (LOW)

`storage.generateUploadUrl` requires auth but doesn't enforce file types server-side. Client validates JPEG + 10MB limit, but a malicious client could bypass this.

**Mitigated by:** URL expiry (1hr), signed URLs, ownership verification, storage garbage collection.

**Fix (optional):** Add MIME type check via Convex storage metadata if abuse is observed.

---

## What's Already Secure (No Action Needed)

| Area | Status | Notes |
|------|--------|-------|
| Auth on all mutations | Secure | `ctx.auth.getUserIdentity()` checked consistently |
| Ownership verification | Secure | `userId === identity.subject` on all resource access |
| Input validation | Secure | 467-line validation module with XSS/injection patterns |
| Webhook signatures | Secure | HMAC-SHA256 + timing-safe comparison |
| Premium gating | Secure | Server-side enforcement, no client bypass |
| XSS/injection | Secure | No eval, innerHTML, dangerouslySetInnerHTML |
| Token storage | Secure | expo-secure-store, not localStorage |
| Error messages | Secure | Generic errors, no info leakage |
| Sentry PII | Documented | Token redaction implemented |
| Database queries | Secure | Type-safe Convex queries, no injection possible |
| File deletion | Secure | Direct deletion disabled, domain-specific only |
| Public endpoints | Intentional | Templates/articles only — no user data |

---

## Implementation Plan

### Step 1: Fix dead guard clause
- **File:** `convex/auth.config.ts`
- Change line 11 to read from `process.env.CLERK_AUTH_DOMAIN` with fallback

### Step 2: Fix npm vulnerabilities
- Run `npm audit fix`
- Verify no regressions with `npm run test`

### Step 3 (optional): Document findings
- Update `docs/SECURITY.md` with audit date and new findings

---

## Verification

1. `npx convex dev` — confirm Convex still deploys with auth config change
2. `npm audit` — confirm vulnerability count drops
3. `npm test` — no regressions from dependency updates
