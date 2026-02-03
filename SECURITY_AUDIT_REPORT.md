# Security Audit Report: Query Authentication

**Date:** 2026-02-03  
**Auditor:** Security Subagent  
**Scope:** Convex backend queries - authentication and authorization

## Executive Summary

A comprehensive security audit of Convex queries revealed **19 critical vulnerabilities** where queries lacked proper authentication checks and user authorization, potentially exposing sensitive user data across the application.

## Critical Findings

### Severity: CRITICAL ⚠️

All findings allow **unauthorized data access** - any unauthenticated user or authenticated user could access other users' private data.

---

## Vulnerabilities by Module

### 1. Analytics Queries (5 vulnerabilities)

**Impact:** Complete exposure of all users' habit analytics data

| File | Query | Issue |
|------|-------|-------|
| `analyticsCompliance.ts` | `getComplianceData` | No auth check, queries all habits |
| `analyticsDistribution.ts` | `getStrengthDistribution` | No auth check, queries all habits |
| `analyticsOverview.ts` | `getOverviewStats` | No auth check, queries all habits |
| `analyticsTrend.ts` | `get30DayTrend` | No auth check, queries all habits |
| `analyticsWeekly.ts` | `getWeeklyInsights` | No auth check, queries all habits |

**Attack Vector:** Any user can view aggregate analytics of all users' habits, streaks, and completion patterns.

---

### 2. Predictions Queries (3 vulnerabilities)

**Impact:** Exposure of habit prediction algorithms and user behavior patterns

| File | Query | Issue |
|------|-------|-------|
| `predictionsAtRisk.ts` | `getHabitsAtRisk` | No auth check, queries all habits |
| `predictionsAtRisk.ts` | `getHabitPrediction` | No auth check, can query any habit by ID |
| `predictions7Day.ts` | `predict7Days` | No auth check, can query any habit by ID |

**Attack Vector:** User can enumerate habit IDs and view predictions for any user's habits.

---

### 3. Notes Queries (3 vulnerabilities)

**Impact:** Complete exposure of all user notes across all habits

| File | Query | Issue |
|------|-------|-------|
| `notesQueries.ts` | `list` | No auth check, returns ALL notes from ALL users |
| `notesQueries.ts` | `search` | No auth check, can search through any notes |
| `notesQueries.ts` | `get` | No auth check, can get any note by ID |

**Attack Vector:** Any user can read all notes from all users - potentially containing highly sensitive personal information.

---

### 4. Letters Queries (6 vulnerabilities)

**Impact:** Exposure of private letters users write to their future selves

| File | Query | Issue |
|------|-------|-------|
| `lettersQueries.ts` | `listByHabit` | No auth check, can query any habit's letters |
| `lettersQueries.ts` | `getUnreadUnlocked` | No auth check, can query any habit's letters |
| `lettersQueries.ts` | `getUpcomingUnlocks` | No auth check, accepts userId param without validation |
| `lettersQueries.ts` | `get` | No auth check, can get any letter by ID |
| `lettersQueries.ts` | `countByHabit` | No auth check |
| `lettersQueries.ts` | `getStats` | No auth check |

**Attack Vector:** User can enumerate habit/letter IDs and read highly personal letters intended for the author's eyes only.

---

### 5. Reflections Queries (3 vulnerabilities)

**Impact:** Exposure of daily habit reflections and personal thoughts

| File | Query | Issue |
|------|-------|-------|
| `reflectionsQueries.ts` | `getByHabitAndDate` | No auth check |
| `reflectionsQueries.ts` | `listByHabit` | No auth check |
| `reflectionsQueries.ts` | `listRecent` | No auth check, returns recent reflections from ANY user |

---

### 6. Affirmations Schedule Queries (2 vulnerabilities)

**Impact:** Exposure of scheduled affirmations

| File | Query | Issue |
|------|-------|-------|
| `affirmationsScheduleQueries.ts` | `listScheduled` | No auth check, can query any habit |
| `affirmationsScheduleQueries.ts` | `get` | No auth check, can get any affirmation by ID |

---

### 7. Habits Query (1 vulnerability)

**Impact:** Direct habit data exposure

| File | Query | Issue |
|------|-------|-------|
| `habits/get.ts` | `get` | No auth check, can get any habit by ID |

**Note:** The `habits/list.ts` query correctly implements authentication.

---

## Positive Findings ✅

The following query modules **correctly implement** authentication:

- `voiceNotesQueries.ts` - All queries properly authenticated
- `visionBoardImagesQueries.ts` - All queries properly authenticated
- `lettersQueriesExtra.ts` - All queries properly authenticated
- `habits/list.ts` - Properly authenticated

All mutations (`notesMutations.ts`, `lettersMutations.ts`, `affirmationsCRUD.ts`, etc.) properly implement authentication and authorization.

---

## Security Fixes Applied

### Pattern: Standard Authentication Check

```typescript
// Added to every vulnerable query:
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  throw new Error('Unauthenticated: Must be logged in to view [resource]');
}
```

### Pattern: User Filtering

```typescript
// For list queries:
const data = await ctx.db
  .query('table')
  .filter((q) => q.eq(q.field('userId'), identity.subject))
  .collect();
```

### Pattern: Ownership Verification

```typescript
// For single-item queries via habitId:
const habit = await ctx.db.get(args.habitId);
if (!habit) {
  throw new Error('Habit not found');
}
if (habit.userId !== identity.subject) {
  throw new Error('Not authorized to view this habit');
}
```

---

## Files Modified

### Analytics (5 files)
- `convex/analyticsCompliance.ts`
- `convex/analyticsDistribution.ts`
- `convex/analyticsOverview.ts`
- `convex/analyticsTrend.ts`
- `convex/analyticsWeekly.ts`

### Predictions (2 files)
- `convex/predictionsAtRisk.ts`
- `convex/predictions7Day.ts`

### Feature Queries (5 files)
- `convex/notesQueries.ts`
- `convex/lettersQueries.ts`
- `convex/reflectionsQueries.ts`
- `convex/affirmationsScheduleQueries.ts`
- `convex/habits/get.ts`

**Total:** 12 files modified, 19 vulnerabilities fixed

---

## Testing Recommendations

1. **Unit Tests:** Add tests verifying unauthenticated requests are rejected
2. **Integration Tests:** Verify users cannot access other users' data
3. **Security Scan:** Run automated security scanner on all Convex queries
4. **Code Review:** Establish pattern that ALL queries must authenticate unless explicitly public

---

## Prevention Measures

### Recommended Lint Rule

Create a custom ESLint rule or pre-commit hook that flags any `query()` export without `ctx.auth.getUserIdentity()` call.

### Code Review Checklist

- [ ] Does the query require authentication?
- [ ] Is userId filter applied when querying collections?
- [ ] Is ownership verified when accessing single items?
- [ ] Are error messages generic (no data leakage)?

---

## Impact Assessment

**Severity:** CRITICAL  
**Exploitability:** HIGH (no technical sophistication required)  
**Data Exposed:** All user habits, notes, letters, reflections, analytics  
**Compliance Risk:** HIGH (GDPR, privacy regulations)

---

## Conclusion

This audit uncovered systematic missing authentication in query functions. All identified vulnerabilities have been fixed by adding proper authentication checks and user filtering. A comprehensive PR with all fixes has been prepared.

**Recommendation:** Deploy these fixes immediately and conduct similar audit on any remaining query files not covered in this report.
