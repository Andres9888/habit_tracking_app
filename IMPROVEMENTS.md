# Codebase Improvements

This document outlines potential improvements identified across the codebase.

## 🔴 High Priority

### 1. Remove Debug Console Logs
**Location:** Multiple files, especially `src/components/HabitCard/HabitCard.tsx`

**Issue:** Extensive debug `console.log` statements in production code (lines 246-340+)

**Impact:** 
- Performance overhead
- Security risk (exposing internal state)
- Cluttered console output

**Recommendation:**
- Remove all debug console.log statements
- Replace with proper logging utility (e.g., `src/lib/analytics/interactions.ts`)
- Use `__DEV__` guards for development-only logging
- Consider using a logging library with log levels

**Files Affected:**
- `src/components/HabitCard/HabitCard.tsx` (~50+ console.log statements)
- `src/components/HapticTest.tsx`
- `src/screens/AnalyticsScreen.tsx`
- `convex/habits.ts` (lines 203, 207, 222, 226, 229, 632)
- `convex/habitStrength.ts` (multiple console.log/error statements)

### 2. Implement Proper Error Handling & User Feedback
**Location:** Multiple components

**Issue:** 
- Errors are logged but not shown to users
- Missing toast notifications (TODO comments reference missing toast system)
- Inconsistent error handling patterns

**Recommendation:**
- Implement a centralized error handling system
- Add toast notifications for user-facing errors
- Replace `console.error` with proper error reporting
- Add error boundaries for React components

**Example:**
```typescript
// Current (HabitCard.tsx:315)
catch (error) {
  console.error('🔴 Toggle completion failed:', error);
  // TODO: Show toast notification when toast system is available
}

// Should be:
catch (error) {
  logError('toggle_habit_failed', { habitId, error });
  showToast({ 
    message: 'Failed to update habit. Please try again.',
    type: 'error' 
  });
}
```

### 3. Optimize Streak Calculation Performance
**Location:** `App.tsx` lines 406-431

**Issue:** Streak calculation happens inside render loop for each habit, recalculating on every render

**Recommendation:**
- Move streak calculation to backend (Convex query)
- Or memoize calculations properly
- Consider caching streak values in habit documents

**Current Code:**
```typescript
{orderedHabits.map((habit) => {
  const calculateStreak = () => {
    // This runs on every render!
    // Complex calculation with loops
  };
  const streak = calculateStreak();
  // ...
})}
```

### 4. Complete TODO Items
**Location:** Multiple files

**Critical TODOs:**
- `App.tsx:221` - Implement `reorderHabits` mutation (partially done, needs completion)
- `src/components/HabitCard/HabitCard.tsx:316` - Toast notification system
- `src/screens/AnalyticsScreen.tsx:119` - Premium status check
- `src/components/SettingsModal/SettingsModal.tsx:250, 284` - Navigation handlers

## 🟡 Medium Priority

### 5. Improve Type Safety
**Location:** Various files

**Issues:**
- ESLint allows `any` types (`@typescript-eslint/no-explicit-any: 'off'`)
- Some loose type definitions
- Missing return type annotations

**Recommendation:**
- Gradually enable stricter TypeScript rules
- Add explicit return types to functions
- Replace `any` with proper types or `unknown`

### 6. Code Organization & Splitting
**Location:** Large component files

**Issues:**
- `App.tsx` is 517 lines (could be split)
- `HabitCard.tsx` is very large with complex logic
- Some components mix concerns (UI + business logic)

**Recommendation:**
- Extract custom hooks from components
- Split large components into smaller, focused components
- Separate business logic from presentation

**Example Split:**
```
App.tsx (517 lines)
├── hooks/
│   ├── useHabitsData.ts
│   ├── useWeekNavigation.ts
│   └── useTheme.ts
├── components/
│   ├── HabitsHeader.tsx
│   ├── HabitsList.tsx
│   └── AddHabitForm.tsx
```

### 7. Improve Test Coverage
**Location:** Test files

**Current State:**
- 24 test files exist
- Coverage unknown (need to run `npm run test:coverage`)

**Recommendation:**
- Run coverage report to identify gaps
- Add tests for:
  - Error handling paths
  - Edge cases
  - User interactions
  - Convex mutations/queries

### 8. Accessibility Improvements
**Location:** Interactive components

**Issues:**
- Some components may be missing accessibility props
- Need to verify all interactive elements have proper labels

**Recommendation:**
- Audit all interactive elements
- Ensure proper `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`
- Test with screen readers
- Verify keyboard navigation

### 9. Performance Optimizations

**Issues:**
- Multiple `useMemo` hooks in `App.tsx` but some calculations still run unnecessarily
- `useMemo` used incorrectly (line 201) - should be `useEffect`
- Large re-renders possible

**Recommendation:**
- Fix incorrect `useMemo` usage (line 201 should be `useEffect`)
- Add React.memo to expensive components
- Optimize Convex queries (consider pagination for large lists)
- Implement virtual scrolling for long habit lists

**Example Fix:**
```typescript
// Current (App.tsx:201)
useMemo(() => {
  if (habits.length > 0 && habitOrder.length === 0) {
    setHabitOrder(habits.map((h) => h._id));
  }
}, [habits, habitOrder.length]);

// Should be:
useEffect(() => {
  if (habits.length > 0 && habitOrder.length === 0) {
    setHabitOrder(habits.map((h) => h._id));
  }
}, [habits, habitOrder.length]);
```

### 10. Backend Query Optimization
**Location:** `convex/habits.ts`

**Issues:**
- `getTracking` query filters in memory after fetching range
- Could use indexes more efficiently
- Some queries fetch more data than needed

**Recommendation:**
- Use proper indexes for date range queries
- Consider pagination for large datasets
- Optimize `list` query sorting (currently sorts in memory)

## 🟢 Low Priority / Nice to Have

### 11. Documentation Improvements
**Location:** All files

**Recommendation:**
- Add JSDoc comments to public functions
- Document complex algorithms (e.g., habit strength calculation)
- Add inline comments for non-obvious logic
- Update README with architecture overview

### 12. Consistent Code Style
**Location:** Various files

**Issues:**
- Mix of inline styles and Tailwind classes
- Inconsistent prop ordering (though ESLint helps)
- Some files use different patterns

**Recommendation:**
- Establish and document style guide
- Use Prettier consistently (already configured)
- Consider adding more ESLint rules for consistency

### 13. Environment Configuration
**Location:** Configuration files

**Recommendation:**
- Document all environment variables
- Add validation for required env vars at startup
- Create `.env.example` file

### 14. Bundle Size Optimization
**Location:** `package.json`

**Recommendation:**
- Analyze bundle size
- Consider code splitting for routes
- Lazy load heavy components
- Remove unused dependencies

### 15. Security Improvements
**Location:** Various files

**Recommendation:**
- Review input validation (especially date formats)
- Ensure all user inputs are sanitized
- Review authentication flow (currently bypassed in dev)
- Add rate limiting for mutations

## 📊 Metrics to Track

1. **Code Quality:**
   - Number of console.log statements (target: 0 in production)
   - Number of TODO comments (track reduction)
   - Test coverage percentage (target: >80%)

2. **Performance:**
   - Component render times
   - Query response times
   - Bundle size

3. **Maintainability:**
   - Average file size
   - Cyclomatic complexity
   - Code duplication percentage

## 🎯 Quick Wins (Can be done immediately)

1. Remove debug console.log statements from `HabitCard.tsx`
2. Fix incorrect `useMemo` usage in `App.tsx:201`
3. Add error toast notifications
4. Complete `reorderHabits` mutation implementation
5. Add JSDoc comments to public API functions

## 📝 Implementation Priority

1. **Week 1:** Remove console.logs, fix useMemo bug, add error handling
2. **Week 2:** Complete TODOs, optimize streak calculation, improve types
3. **Week 3:** Split large components, improve test coverage
4. **Week 4:** Performance optimizations, accessibility audit

---

*Last Updated: Generated from codebase analysis*
