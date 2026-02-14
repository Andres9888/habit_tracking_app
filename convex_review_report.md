# Convex Backend Code Review Report

**Date:** 2026-02-14  
**Reviewer:** Code Review Agent  
**Branch:** `convex-review` (origin/main)

---

## Executive Summary

A comprehensive security, performance, and data integrity review was conducted on the `convex/` backend directory. The review identified **4 Critical/High severity issues** requiring immediate attention:

1. **CRITICAL: Analytics Data Leakage** - Multiple analytics queries expose ALL users' habits to any authenticated user
2. **HIGH: Missing Ownership Check in getStats** - Allows unauthorized access to habit statistics
3. **HIGH: Predictions at-Risk Data Leakage** - Exposes all users' at-risk habits
4. **HIGH: Missing Ownership Check in getHabitPrediction** - No authorization on prediction queries

---

## Issues Found

### 🔴 CRITICAL: Analytics Data Leakage

**Affected Files:**
- `analyticsOverview.ts`
- `analyticsTrend.ts`
- `analyticsWeekly.ts`
- `analyticsDistribution.ts`
- `analyticsCompliance.ts`

**Issue:** Multiple analytics queries fetch ALL habits from the database without filtering by the authenticated user. Any authenticated user can view all other users' habit data.

**Example from `analyticsOverview.ts`:**
```typescript
const habits = await ctx.db.query('habits').collect();
// ❌ No user filtering - returns ALL users' habits
```

**Impact:**
- Privacy violation: Users can see other users' habit names, streaks, and progress
- Data breach: Complete exposure of the habit database to any authenticated user

**Recommended Fix:**
Add user identity check and filter by `userId`:
```typescript
const identity = await ctx.auth.getUserIdentity();
if (!identity) return { /* empty */ };

const habits = await ctx.db
  .query('habits')
  .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
  .collect();
```

---

### 🔴 HIGH: Missing Ownership Check in getStats

**Affected File:** `habits/stats.ts`

**Issue:** The `getStats` query fetches tracking data for any habit without verifying ownership. While it requires a `habitId`, any authenticated user can query statistics for any habit in the system.

```typescript
handler: async (ctx, args) => {
  const tracking = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
    .collect();
  // ❌ No check that habit.userId === identity.subject
```

**Impact:** Unauthorized users can view tracking history and streaks for habits they don't own.

**Recommended Fix:**
Add ownership verification:
```typescript
const habit = await ctx.db.get(args.habitId);
if (!habit) return { streak: 0, consistency: 0 };
if (habit.userId !== identity?.subject) return { streak: 0, consistency: 0 };
```

---

### 🔴 HIGH: Predictions Data Leakage

**Affected Files:**
- `predictionsAtRisk.ts` - `getHabitsAtRisk`
- `predictionsAtRisk.ts` - `getHabitPrediction`

**Issue:** The predictions system exposes ALL users' habits to any authenticated user.

**Example from `getHabitsAtRisk`:**
```typescript
const habits = await ctx.db
  .query('habits')
  .filter((q) => q.eq(q.field('archived'), false))
  .collect();
// ❌ Returns ALL at-risk habits, not just the user's
```

**Impact:**
- Reveals which habits other users are struggling with
- Exposes user habit names and risk levels to unauthorized users

**Recommended Fix:**
Filter by authenticated user:
```typescript
const identity = await ctx.auth.getUserIdentity();
if (!identity) return [];

const habits = await ctx.db
  .query('habits')
  .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
  .filter((q) => q.eq(q.field('archived'), false))
  .collect();
```

---

### 🟡 MEDIUM: Performance - N+1 Query Pattern in get30DayTrend

**Affected File:** `analyticsTrend.ts`

**Issue:** The function iterates over each habit and makes a separate query for tracking data.

```typescript
for (const habitId of habitIds) {
  const habitTrackings = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q) => q.eq('habitId', habitId))
    .collect();
  // ❌ N+1 queries
}
```

**Impact:** Performance degradation with many habits.

**Recommended Fix:**
Use `by_user_and_date` index or fetch all tracking in a single query:
```typescript
const trackings = await ctx.db
  .query('tracking')
  .withIndex('by_user_and_date', (q) =>
    q.eq('userId', identity.subject).gte('date', thirtyDaysAgo)
  )
  .collect();
```

---

## Positive Findings

### Security ✅
- `habits/create.ts`, `habits/update.ts`, `habits/toggle.ts`: Proper authentication and ownership checks
- `lettersMutations.ts`, `notesMutations.ts`, `reflectionsMutations.ts`: Comprehensive ownership verification
- `visionBoardImagesMutations.ts`, `voiceNotesMutations.ts`: Proper authorization
- `affirmationsCRUD.ts`: Ownership checks in place

### Performance ✅
- `habits/list.ts`: Uses `by_userId` index effectively
- `habits/getTracking.ts`: Efficient use of `by_user_and_date` compound index
- `analyticsWeekly.ts`: Uses batch streak computation (documented improvement)

### Data Integrity ✅
- Proper validation in most mutation files
- Input validation via `lib/inputValidation.ts`
- Tracking records properly backfilled with userId

---

## Recommendations

1. **Immediate (Critical):** Fix analytics queries to filter by authenticated user
2. **Immediate (High):** Add ownership checks to `habits/stats.ts` and prediction queries
3. **High Priority:** Run a security audit on all query functions
4. **Medium Priority:** Optimize `analyticsTrend.ts` N+1 queries

---

*Generated by Code Review Agent - GLM-5*
