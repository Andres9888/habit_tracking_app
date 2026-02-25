---
type: report
title: Security Remediation Plan - Loop 00001
created: 2026-02-25
tags:
  - security
  - vulnerabilities
  - access-control
  - loop-00001
related:
  - '[[3_EVALUATE]]'
  - '[[LOOP_00001_VULNERABILITIES]]'
---

# Security Remediation Plan - Loop 00001

## Summary

- **Total Findings:** 1
- **Auto-Remediate (PENDING):** 1
- **Manual Review:** 0
- **Won't Do / False Positive:** 0

## Risk Summary

| Severity | Count | Auto-Fix | Manual | Won't Do |
| -------- | ----- | -------- | ------ | -------- |
| CRITICAL | 1     | 1        | 0      | 0        |
| HIGH     | 0     | 0        | 0      | 0        |
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
- **Issue:** Mutation deletes all archived habits and related tracking records without requiring authentication or enforcing user ownership, allowing cross-tenant data loss by any caller.
- **Implemented In:** Loop 00001
- **Fix Applied:** Added explicit ownership validation for each archived habit in `deleteAllArchived` so only records matching the authenticated user are deleted.
- **Files Modified:** `convex/habits/archive.ts`
- **Fix Strategy:**
  1. Add an `identity` check in `deleteAllArchived` using `ctx.auth.getUserIdentity()` and fail fast for unauthenticated callers.
  2. Scope archived-habit queries to the caller’s `userId` and stop using collection-wide deletion.
  3. Add per-record ownership checks before deleting each habit and its tracking records; return an error for unauthorized records.
- **Verification:** Confirm the mutation requires auth via a client-call check and verify a non-owner account cannot delete another user’s archived habits or tracking rows.

## PENDING - MANUAL REVIEW

## WON'T DO / FALSE POSITIVE

## Remediation Order

1. **SEC-001** - Unauthenticated Global Deletion of Archived Habits (CRITICAL)

## Dependencies

- **Group A:** None

---

## [Finding 1: Tracking queries read full user history for 30-day trend] - Evaluated 2026-02-25 16:53

**Source:** `LOOP_00001_CANDIDATES.md` (Tactic 3, Finding 1)
**File:** `convex/analyticsTrend.ts`
**Line(s):** 34-39

### Current Code

```ts
// PERF: Single query for all user's tracking records instead of N queries
const allTrackings = await ctx.db
  .query('tracking')
  .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
  .collect();

// Filter to only active habits
const trackings = allTrackings.filter((t) => habitIds.has(t.habitId));
```

### Proposed Fix

```ts
const startDate = getDateString(getDaysAgo(29));
const endDate = getDateString(new Date());

// PERF: Limit tracking query to 30-day date window
const trendTrackings = await ctx.db
  .query('tracking')
  .withIndex('by_user_and_date', (q) =>
    q.eq('userId', identity.subject).gte('date', startDate).lte('date', endDate)
  )
  .collect();

// Filter to only active habits
const trackings = trendTrackings.filter((t) => habitIds.has(t.habitId));
```

### Assessment

- **Complexity:** LOW - The change is a targeted query optimization using existing index shape with an added date range and no surrounding behavioral logic changes.
- **Gain:** MEDIUM - This avoids reading all tracking rows for high-volume users each time trend data is generated, reducing startup/interaction latency in this analytics path.
- **Dependencies:** `convex/analytics/index.ts` (for `getDaysAgo`, no code changes required)

### Implementation Notes

- Verify timezone/locale consistency for `getDateString(getDaysAgo(29))` and `getDateString(new Date())` remains `YYYY-MM-DD` ordering compatible with `by_user_and_date` index range bounds.
- Keep existing habit filtering so archived/paused exclusions remain intact.

### Status: PENDING
