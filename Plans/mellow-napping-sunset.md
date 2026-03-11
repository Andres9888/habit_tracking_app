# Design System Consistency Audit & Fixes

## Context

Comprehensive audit of the app's design system covering animations, haptic feedback, layout consistency, and UX patterns. The codebase is **very well-organized** (overall 9/10 consistency) with centralized theme tokens. This plan addresses the handful of deviations found.

---

## Audit Summary

### Haptic Feedback: PASS (10/10)
- 10 named patterns in `src/utils/haptics/patterns.ts` — all used consistently
- Same interaction types always trigger the same haptic (tap=Light, toggle=Medium, etc.)
- Reduce motion support present
- **No fixes needed**

### Design Tokens: PASS (9.5/10)
- Colors, spacing, typography, shadows, border radius — all centralized in `src/theme/`
- 8px grid followed throughout
- WCAG AA contrast verified
- Dark mode fully implemented
- **No fixes needed**

### Screen Layout: PASS (9/10)
- Consistent `ScreenHeader`, safe area handling, modal patterns, toast positioning
- FAB, cards, buttons, icons — all standardized
- Accessibility excellent (roles, labels, hints, live regions)
- **Minor suggestions below**

### Animations: 4 inconsistencies found

---

## Fixes (4 items)

### Fix 1: Entrance animation duration — 320ms → 280ms
**File:** `src/components/DraggableHabit/useEntranceAnimation.ts:15`
**Issue:** Uses `duration: 320` while design system standard is `durations.enter` (280ms)
**Fix:** Import `durations` from `@/theme/animations` and use `durations.enter`

### Fix 2: Template list stagger — 100ms → 60ms
**File:** `src/components/CreateHabitModal/components/TemplateListItem/useTemplateListItemAnimations.ts:13`
**Issue:** `ENTRANCE_STAGGER_DELAY = 100` while design system standard is `durations.stagger` (60ms)
**Fix:** Import `durations` from `@/theme/animations` and use `durations.stagger`

### Fix 3: Migrate sparkle burst from Animated API to Reanimated
**File:** `src/components/microinteractions/useSparkleBurstAnimation.ts`
**Issue:** Only file using legacy `Animated` from `react-native` instead of `react-native-reanimated`
**Fix:** Rewrite to use `useSharedValue`, `useAnimatedStyle`, `withTiming` from reanimated. Same timing (400ms), same easing, same values (opacity 0.9→0, scale 0.6→1.6). Keep reduced motion support.

### Fix 4: Add reduced motion support to entrance animation
**File:** `src/components/DraggableHabit/useEntranceAnimation.ts`
**Issue:** Always animates regardless of user's reduce motion preference
**Fix:** Accept `reduceMotion` parameter; when true, set values instantly without animation

---

## Acceptable Deviations (no action needed)

- **`useStrengthAnimation.ts`** uses custom spring `{damping: 12, mass: 0.8, stiffness: 80}` — intentional for progress bar physics (slow fill feels satisfying). This doesn't match `springs.standard` but serves a distinct purpose.
- **`useTemplateListItemAnimations.ts`** uses `ENTRANCE_DURATION = 350` — slightly above `durations.moderate` (300ms) but close enough for list entrance context. Will be brought closer via the stagger fix.

---

## UX Improvement Suggestions (optional, not in scope)

These are observations, not action items for this PR:

1. **Pull-to-refresh** only exists on AnalyticsScreen — could extend to home screen
2. **Card padding variance** — some cards use `spacing.md` (12px) instead of `spacing.base` (16px) for internal padding. Worth a follow-up audit of specific card components.
3. **Header subtitle** usage is inconsistent across screens — some have it, some don't. Not a bug, but could be standardized.

---

## Verification

1. **Build check:** `npx expo start` — app launches without errors
2. **Lint:** `npm run lint` — no new violations
3. **Animation test suite:** `npx jest --testPathPattern="animation"` — existing tests pass
4. **Manual check (ideal):** Open the app, complete a habit (entrance animation plays at 280ms), browse templates (stagger feels snappier at 60ms), trigger sparkle burst (still works with reanimated)
5. **Reduced motion:** Enable "Reduce Motion" in iOS Settings > Accessibility > Motion — DraggableHabit entrance should be instant
