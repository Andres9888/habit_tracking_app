---
type: report
title: Security Remediation Plan - Loop 00001
created: 2026-02-22
tags:
  - security
  - vulnerabilities
  - remediation
related:
  - '[[Security Vulnerabilities - Loop 00001]]'
---

# Security Remediation Plan - Loop 00001

## Summary

- **Total Findings:** 5
- **Auto-Remediate (PENDING):** 1
- **Manual Review:** 0
- **Won't Do / False Positive:** 0
- **Implemented This Loop:** 2

## Risk Summary

| Severity | Count | Auto-Fix | Manual | Won't Do |
| -------- | ----- | -------- | ------ | -------- |
| CRITICAL | 1     | 1        | 0      | 0        |
| HIGH     | 4     | 1        | 0      | 0        |
| MEDIUM   | 0     | 0        | 0      | 0        |
| LOW/INFO | 0     | 0        | 0      | 0        |

---

## PENDING - Ready for Auto-Remediation

### SEC-001: Unauthenticated Global Deletion of Archived Habits

- **Status:** `IMPLEMENTED`
- **Vuln ID:** VULN-001
- **Severity:** CRITICAL
- **Remediability:** MEDIUM
- **File:** `convex/habits/archive.ts`
- **Line:** 69
- **Implemented In:** Loop 00001
- **Issue:** `deleteAllArchived` accepts unauthenticated calls and deletes all archived habits and related tracking rows without owner checks.
- **Fix Applied:** Added `ctx.auth.getUserIdentity()` check, scoped archived-habit query to `userId`, and verified user ownership before deleting related tracking rows and habits.
- **Fix Strategy:**
  1. Add `ctx.auth.getUserIdentity()` check and return error for unauthenticated callers.
  2. Filter habit query by `identity.subject` before delete.
  3. Verify each habit belongs to requester before deleting child tracking records.
  4. Return explicit failure for not-found or empty-scope cases.
- **Verification:**
  - Confirm unauthenticated callers receive auth error.
  - Confirm authenticated user can only delete their own archived habits.
  - Confirm other users' archived habits and tracking rows remain untouched.
- **Files Modified:** `convex/habits/archive.ts`
- **Verified:** Manual review confirmed auth check, user-scoped query, and ownership guard.

### SEC-002: Notes API Enables Cross-User Data Read and Tampering (IDOR Chain)

- **Status:** `IMPLEMENTED`
- **Vuln ID:** VULN-002
- **Severity:** HIGH
- **Remediability:** MEDIUM
- **File:** `convex/notesQueries.ts`, `convex/notesMutations.ts`
- **Line:** 9
- **Issue:** Notes endpoints expose and mutate note records across users by accepting unscoped note IDs and missing ownership checks on list, search, and write operations.
- **Fix Strategy:**
  1. Add `ctx.auth.getUserIdentity()` checks to all notes queries and mutations.
  2. Scope `list` and `search` results to `identity.subject` and reject unauthenticated callers.
  3. Enforce ownership checks on `get`, `create`, `update`, and `remove` by validating `note.userId === identity.subject`.
- **Verification:**
  - Confirm unauthenticated calls fail for all notes APIs.
  - Confirm authenticated users cannot read, update, or delete notes for another `subject`.
  - Confirm note creation sets `userId` from identity rather than caller input.
- **Implemented In:** Loop 00001
- **Fix Applied:** Added explicit ownership guards for legacy notes lacking `userId` in note detail/update/delete paths; these now require either matching `userId` or verified `habit.userId` ownership before mutating/returning a note.
- **Files Modified:** `convex/notesQueries.ts`, `convex/notesMutations.ts`
- **Verified:** Manual review confirmed unauthenticated access remains blocked, cross-user `noteId` reads/updates/deletes are denied when `userId` is missing, and existing owner-scoped query behavior is unchanged.

## PENDING - MANUAL REVIEW

_No entries yet._

## WON'T DO / FALSE POSITIVE

_No entries yet._

## Remediation Order

1. **SEC-001** - Unauthenticated Global Deletion of Archived Habits (CRITICAL)
2. **SEC-002** - Notes API Enables Cross-User Data Read and Tampering (HIGH)

## Dependencies

- **Group A:** SEC-001 - Access-control hardening for habit archive operations
- **Group B:** SEC-002 - Access-control hardening for notes endpoints

---

## Duplicate Convex client bootstrap on web - Evaluated 2026-02-25 16:29

**Source:** LOOP_00001_CANDIDATES.md - Tactic 1 Finding 1
**File:** `src/main.tsx`, `src/providers/ConvexClerkProvider.tsx`, `src/lib/appConfig.ts`
**Line(s):** 1-3, 24, 65-70, 78-82, 19-24

### Current Code

```tsx
// src/lib/appConfig.ts
import { ConvexReactClient } from 'convex/react';
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
export const convexClient = new ConvexReactClient(convexUrl);

// src/providers/ConvexClerkProvider.tsx
import { ConvexProvider } from 'convex/react';
import { convexClient } from '../lib/appConfig';
...
<ConvexProvider client={convexClient}>{children}</ConvexProvider>

// src/main.tsx
import { ConvexProvider, ConvexReactClient } from 'convex/react';
...
const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const convex = new ConvexReactClient(convexUrl);
...
<ConvexProvider client={convex}>
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
</ConvexProvider>
```

### Proposed Fix

```tsx
// src/main.tsx
import { createRoot } from 'react-dom/client';
...
// Remove the duplicate web-only Convex client bootstrap and provider.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id "root" not found in HTML');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
```

### Assessment

- **Complexity:** LOW - Removes a duplicated initialization path and keeps a single authoritative Convex client provided by existing `ConvexClerkProvider`.
- **Gain:** MEDIUM - Removes an extra web startup client creation and nested `ConvexProvider`, reducing startup allocations and initialization overhead on first paint.
- **Dependencies:** Ensure `EXPO_PUBLIC_CONVEX_URL` is consistently available in web runtime (current app client remains sourced from `appConfig.ts`).

### Implementation Notes

If we keep this change, validate environment config for web so `EXPO_PUBLIC_CONVEX_URL` remains defined at runtime; no other files need behavior changes for this candidate.

### Status: IMPLEMENTED

## Offline queue restoration runs synchronously on mount - Evaluated 2026-02-25 16:42

**Source:** LOOP_00001_CANDIDATES.md - Tactic 1 Finding 2  
**Files:** `src/providers/OfflineProvider/OfflineProvider.tsx:47-77`, `src/lib/offline/persistence/queueStorage.ts:85-112`, `src/lib/offline/queueManager/createManager.ts:90-93`
**Category:** Startup performance, offline persistence

- **Risk:** MEDIUM
- **Benefit:** MEDIUM
- **Status:** `PENDING - MANUAL REVIEW`
- **Risk Rationale:** Deferring or batching restoration changes app startup behavior and can affect timing-sensitive flows that assume the queue state is immediately available (e.g., first-run sync orchestration and optimistic queue writes), and the queue state is shared across multiple consumer paths.
- **Benefit Rationale:** Loading and JSON-parsing persisted queue data on mount can block the non-critical startup window, especially with large queued payloads; moving restore off the critical path can reduce startup latency and improve first-frame responsiveness.
- **Refactoring Approach:**
  1. Keep `restoreQueue` as-is to centralize queue hydration logic.
  2. Change auto-restore trigger to a deferred phase (`InteractionManager.runAfterInteractions`/`setTimeout(..., 0)` fallback) so mount render and initial interactions are not blocked.
  3. Ensure restore failures continue to populate `restorationError`, while leaving manual `restoreQueue()` path unchanged.
  4. Expand `OfflineProvider` tests for restore timing assumptions and action-while-restoring behavior before auto-implementing.
