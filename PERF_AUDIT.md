# Performance Audit Report - Habit Tracking App

**Date:** 2026-02-14  
**Auditor:** Claude (Subagent)  
**Scope:** Convex queries, React components, bundle imports

---

## Issues Found

### 1. **CRITICAL: Multiple Analytics Queries Without User Filter**

**Severity:** 🔴 CRITICAL (Security + Performance)

**Files Affected:**
- `convex/analyticsDistribution.ts`
- `convex/analyticsCompliance.ts`
- `convex/analyticsOverview.ts`
- `convex/analyticsTrend.ts`

**Issue:** These queries call `ctx.db.query('habits').collect()` without filtering by `userId`. This:
1. **Fetches ALL habits for ALL users** (massive performance impact)
2. **Leaks data** — a user can see other users' habit data
3. **Scales poorly** — as user base grows, queries get slower

**Current Code Pattern:**
```typescript
const habits = await ctx.db.query('habits').collect();
const activeHabits = habits.filter((h) => !h.archived && !h.paused);
```

**Should Be:**
```typescript
const identity = await ctx.auth.getUserIdentity();
if (!identity) return [];
const habits = await ctx.db
  .query('habits')
  .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
  .collect();
```

---

### 2. **N+1 Query Pattern in analyticsCompliance.ts**

**Severity:** 🔴 CRITICAL (Performance)

**File:** `convex/analyticsCompliance.ts`

**Issue:**
```typescript
for (const habitId of habitIds) {
  const habitTrackings = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q) => q.eq('habitId', habitId))
    .collect();  // ← One query per habit!
  trackings.push(...habitTrackings);
}
```

This is a **classic N+1 pattern**. For each habit, one DB query is executed. With 20 habits, that's 20 queries instead of 1.

**Fix:** Use a single user-level query instead:
```typescript
const trackings = await ctx.db
  .query('tracking')
  .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
  .collect();
```

---

### 3. **Missing Indexes**

**Severity:** 🟡 MEDIUM

**Findings:**
- ✅ Most tables have `by_userId` or `by_user` indexes
- ⚠️ `affirmations` table missing `by_user` filter in schedule queries
- ⚠️ `tracking` table: No combined `by_user` index (only `by_user_and_date`)

**Recommendation:** Consider adding:
```typescript
tracking.index('by_user', ['userId']) // For general user queries
```

---

### 4. **Unused Bundle Import: lucide-react (43MB)**

**Severity:** 🟡 MEDIUM (Bundle size)

**File:** Package dependencies

**Issue:** `lucide-react` is installed but not used anywhere. The project uses `lucide-react-native` instead.

**Fix:**
```bash
npm uninstall lucide-react
```

**Savings:** ~43MB

---

### 5. **Potential Lazy Loading Opportunities**

**Severity:** 🟠 LOW-MEDIUM

**Candidates:**
1. **OpenAI SDK** — Only used in Convex backend, not in React. ✅ Already optimal
2. **Voice/Gesture libraries** — Could be lazy-loaded on first use
   - `react-native-gesture-handler`
   - `expo-av` (for voice notes)

**Not Recommended:**
- `@shopify/react-native-skia` (435MB) — Already conditionally loaded
- `react-native-paper` — Used throughout app

---

## Performance Improvements Summary

| Issue | Type | Impact | Effort | Fix |
|-------|------|--------|--------|-----|
| Analytics security flaw | Security + Perf | 🔴 Critical | Easy | Add userId filter to 4 queries |
| N+1 in compliance query | Query Perf | 🔴 Critical | Medium | Batch tracking query |
| Unused lucide-react | Bundle | 🟡 Medium | Trivial | npm uninstall |
| Missing user index | Query Perf | 🟡 Medium | Easy | Add index to tracking table |
| Voice lib lazy load | Bundle | 🟠 Low | Medium | Dynamic import |

---

## Testing Recommendations

1. **Security Test:** Verify user A cannot see user B's habit data
2. **Performance Test:** Measure query times before/after fixes
3. **Bundle Test:** Confirm bundle size decreases after lucide-react removal

---

## Detailed Fixes Applied

See commits below.
