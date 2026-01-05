# Habit Strength Redesign - CodeRabbit Review Checklist

## Pre-Review Setup

- [ ] All tasks from `habit-strength-redesign-tasks.md` are complete
- [ ] Component renders correctly on iOS simulator
- [ ] Component renders correctly on Android emulator
- [ ] No TypeScript errors in the codebase
- [ ] ESLint passes with no warnings

---

## Code Quality

### Component Architecture
- [ ] Components follow single responsibility principle
- [ ] Props interfaces are properly typed with JSDoc comments
- [ ] Default props are defined where appropriate
- [ ] Component names match file names
- [ ] Exports are organized in `index.ts`

### TypeScript
- [ ] No `any` types used
- [ ] All props have explicit types
- [ ] Return types are specified for utility functions
- [ ] Enums/union types used for fixed value sets (e.g., TimeRange)

### React Best Practices
- [ ] `useMemo` used for expensive calculations
- [ ] `useCallback` used for event handlers passed to children
- [ ] `React.memo` applied to pure sub-components
- [ ] No inline object/array creation in render (causes re-renders)
- [ ] Keys are stable and unique in lists

### Reanimated Animations
- [ ] Animated values created with `useSharedValue`
- [ ] Derived values use `useDerivedValue`
- [ ] Worklets are properly defined (run on UI thread)
- [ ] `useReducedMotion` is respected
- [ ] No unnecessary re-renders from animation changes

---

## Visual & UX

### Design Fidelity
- [ ] Matches mockup: `.superdesign/design_iterations/habit_strength_with_calendar_1.html`
- [ ] Circular progress ring is 72x72px
- [ ] Chart height is 112px (or 128px for taller variant)
- [ ] Colors match design system (emerald-500, stone-50, etc.)
- [ ] Typography matches (Inter font, correct weights/sizes)

### Responsive Behavior
- [ ] Component adapts to different screen widths
- [ ] Chart fills available width correctly
- [ ] No horizontal overflow or clipping
- [ ] Tested on small screens (iPhone SE) and large (iPhone Pro Max)

### Animations
- [ ] Ring fill animation is smooth (60fps)
- [ ] Number count-up is synchronized with ring
- [ ] Chart path draws smoothly
- [ ] Pulsing dot animation loops infinitely
- [ ] No animation jank on time range switch

### States
- [ ] Loading state shows skeleton/placeholder
- [ ] Empty state (no completions) shows encouraging message
- [ ] Error state is handled gracefully
- [ ] Time range toggle reflects current selection

---

## Accessibility

### Screen Reader Support
- [ ] Progress ring has `accessibilityRole="progressbar"`
- [ ] Progress ring has `accessibilityValue={{ min: 0, max: 100, now: X }}`
- [ ] Chart has descriptive `accessibilityLabel` (e.g., "Strength chart showing upward trend from 10% to 70%")
- [ ] Time range buttons have `accessibilityRole="button"`
- [ ] All interactive elements are focusable

### Color & Contrast
- [ ] Text meets WCAG AA contrast ratio (4.5:1)
- [ ] Information not conveyed by color alone
- [ ] Focus indicators are visible

### Motion
- [ ] Animations disabled when `reduceMotion` is true
- [ ] Static fallback shown instead of animated elements

---

## Performance

### Bundle Size
- [ ] No new large dependencies added
- [ ] SVG paths are optimized (no unnecessary precision)
- [ ] Constants extracted (not recreated each render)

### Render Performance
- [ ] Component profiles under 16ms render time
- [ ] No excessive re-renders (React DevTools Profiler)
- [ ] Chart path calculation is memoized
- [ ] Time range switch doesn't cause full tree re-render

### Memory
- [ ] No memory leaks from animation subscriptions
- [ ] Cleanup in `useEffect` return functions
- [ ] Large data arrays are not duplicated unnecessarily

---

## Testing

### Unit Tests
- [ ] `TimeRangeToggle` tests selection and callback
- [ ] `StrengthHero` tests with 0%, 50%, 100% values
- [ ] `StrengthChart` tests path generation algorithm
- [ ] `StrengthStatsRow` tests formatting of positive/negative/zero deltas
- [ ] Main component tests composition and state

### Snapshot Tests
- [ ] Snapshot for each strength level (weak/developing/strong)
- [ ] Snapshot for each time range (1m/1y/all)
- [ ] Snapshot for empty state

### Integration Tests
- [ ] Time range changes update chart data
- [ ] Props from parent are passed correctly to children

---

## Documentation

### Code Comments
- [ ] Complex algorithms have explanatory comments
- [ ] Bezier curve calculation is documented
- [ ] Animation timing choices are explained
- [ ] TODO items are tracked (no orphaned TODOs)

### JSDoc
- [ ] All exported components have JSDoc descriptions
- [ ] Props interfaces have property descriptions
- [ ] Utility functions have param/return documentation

### README/Spec
- [ ] Spec document is up to date
- [ ] Tasks checklist reflects actual implementation
- [ ] Any deviations from spec are documented

---

## Security

- [ ] No sensitive data logged to console
- [ ] No hardcoded API keys or secrets
- [ ] User data is not exposed in error messages

---

## Final Verification

### Manual Testing Checklist
- [ ] Open HabitDetailScreen for a habit with completions
- [ ] Verify ring shows correct percentage
- [ ] Verify chart shows historical data
- [ ] Tap each time range option (1M, 1Y, All)
- [ ] Verify stats row shows correct deltas
- [ ] Test with a brand new habit (no completions)
- [ ] Test with a habit that has 1+ year of history
- [ ] Toggle device accessibility settings (VoiceOver/TalkBack)
- [ ] Toggle Reduce Motion setting

### Sign-Off
- [ ] Developer self-review complete
- [ ] Code passes all CI checks
- [ ] PR description includes screenshots/videos
- [ ] Ready for CodeRabbit automated review

---

## CodeRabbit Configuration

Add to PR description:
```
## Summary
Redesigns the Habit Strength section with new UI combining time range switcher, circular progress ring, full-width chart, and comparison stats.

## Changes
- New `HabitStrengthSection` component
- Updated `HabitDetailScreen` integration
- Extended `useHabitStrength` hook for time range filtering

## Testing
- Unit tests added for all sub-components
- Manual testing on iOS/Android
- Accessibility audit complete

## Screenshots
[Attach before/after screenshots]
```
