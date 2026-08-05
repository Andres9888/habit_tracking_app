---
type: report
title: Performance Fix Log - security-test
tags:
  - performance
  - convex
  - startup
created: 2026-02-25
related:
  - '[[LOOP_00001_PLAN]]'
---

---

## [2026-02-25 16:30] - Remove duplicate Convex bootstrap on web

**Agent:** security-test
**Project:** security-test
**Loop:** 00001
**File:** `src/main.tsx`
**Line(s):** [1-3, 64-79]
**Change Type:** initialization optimization

### What Was Changed

Removed the redundant web-only Convex client bootstrap and nested `ConvexProvider` in `src/main.tsx` so the app uses the existing canonical `ConvexClerkProvider` path.

### Before

```tsx
import { ConvexProvider, ConvexReactClient } from 'convex/react';
...
const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
if (!convexUrl) {
  throw new Error('VITE_CONVEX_URL is required but was not provided');
}
const convex = new ConvexReactClient(convexUrl);
...
createRoot(rootElement).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ConvexProvider>
  </StrictMode>
);
```

### After

```tsx
import React, { StrictMode } from 'react';
...
createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
```

### Expected Impact

Medium startup performance gain from removing an extra client initialization and nested provider layer in web rendering path.

### Verification

- [x] Code compiles/parses without obvious import or syntax issues from the edited section
- [x] No linter-facing unused imports introduced by the change
- [x] Change matches the proposed fix from `LOOP_00001_PLAN.md`

---

## [2026-02-25 16:54] - Restrict trend tracking query to 30-day window

**Agent:** security-test
**Project:** security-test
**Loop:** 00001
**File:** `convex/analyticsTrend.ts`
**Line(s):** [22-34]
**Change Type:** query optimization

### What Was Changed

Constrained the `get30DayTrend` tracking query to only fetch rows for the current user and last 30 days using the existing `by_user_and_date` index range bounds.

### Before

```ts
// PERF: Single query for all user's tracking records instead of N queries
const allTrackings = await ctx.db
  .query('tracking')
  .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
  .collect();

// Filter to only active habits
const trackings = allTrackings.filter((t) => habitIds.has(t.habitId));
```

### After

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

### Expected Impact

Reduces scanning and materialization of historical tracking rows for high-volume users by limiting DB reads to only the 30-day analysis window.

### Verification

- [x] Code compiles/parses without obvious errors in the edited area (static inspection)
- [x] No obvious linter issues introduced in touched section (static inspection)
- [x] Change matches the proposed fix from `LOOP_00001_PLAN.md`
