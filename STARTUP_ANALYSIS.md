# Chain Day App Startup Performance Analysis

## Current Initialization Chain

### 1. App Launch (main.tsx)
- ✅ ConvexReactClient created (fast)
- ✅ Error boundary wrapped (minimal overhead)
- No blocking operations

### 2. App.tsx Provider Stack
- ✅ Sentry init deferred via requestIdleCallback (GOOD)
- ❌ Clerk, Convex, Paper, SafeArea all initialize synchronously
- All 8 providers nest and initialize on first render

### 3. AuthGate Component
- ✅ Shows splash screen while loading (UX good)
- ✅ Waits for Clerk auth + Convex ready before showing app
- ✅ Fetches user via getOrCreateUser mutation

### 4. HabitsApp Mount (Authenticated User)
- ❌ **ISSUE #1**: Fires TWO Convex queries immediately:
  - `api.habits.list` - loads all habits
  - `api.settings.get` - loads user settings
- ❌ These queries block list rendering (skeleton shows but queries are in flight)
- ❌ No query parallelization strategy

### 5. Subsequent Hooks
- useHabitsTracking - light calculation work
- useHabitsModalsState - may fire additional queries
- useCompletionSound - initializes audio (premium feature)
- useRewardToast - sets up event listeners

## Performance Issues Found

### Issue #1: Eager Convex Queries (High Impact)
**Location**: `src/features/habits/hooks/useHabitsListState.ts`
**Problem**: Queries fire on every component mount, no deferred loading
**Impact**: First paint delayed while waiting for network roundtrip
**Solution**: Defer non-critical queries (settings) until first interaction

### Issue #2: Sequential Provider Initialization (Medium Impact)
**Location**: `src/App.tsx`
**Problem**: 8 providers nest - each waits for parent to render
**Impact**: Waterfalls of initialization, slower mount time
**Solution**: Parallelize provider setup where possible

### Issue #3: No Code Splitting (Low Impact)
**Location**: `src/App.tsx`, `src/features/habits/HabitsApp.tsx`
**Problem**: All feature code imported at root level
**Impact**: Larger initial bundle, slower parse time
**Solution**: Lazy load modal/overlay components

### Issue #4: Purchases Initialization (Low Impact)
**Location**: `src/components/providers/PurchasesProvider.tsx`
**Problem**: RevenueCat SDK initializes on every mount
**Impact**: ~100-200ms delay for RevenueCat setup
**Solution**: Already using requestIdleCallback pattern - implement for purchases

### Issue #5: Splash Screen Timing
**Location**: `src/components/auth/AuthGate.tsx`
**Problem**: 10-second timeout with generic loading state
**Impact**: Poor UX for slow networks
**Solution**: Better timeout messaging, retry logic

## Optimization Opportunities

### Quick Wins (1-2s improvement)
1. ✅ Defer Purchases initialization to requestIdleCallback
2. ✅ Add query deduplication/caching layer
3. ✅ Move settings query to background (not blocking render)
4. ✅ Defer StreakMilestoneProvider initialization

### Medium Wins (500ms improvement)
1. ✅ Lazy load modal components
2. ✅ Parallelize Convex queries (Promise.all)
3. ✅ Use skeleton loaders while queries load

### Long-term Improvements
1. Implement data prefetching based on user patterns
2. Add IndexedDB cache for oft-accessed data
3. Consider service worker for offline-first loading
