---
task: UX consistency audit for habit tracking app
slug: 20260310-160000_ux-consistency-audit-habit-app
effort: extended
phase: observe
progress: 0/20
mode: interactive
started: 2026-03-10T16:00:00-06:00
updated: 2026-03-10T16:05:00-06:00
---

## Context

Andres wants to improve the habit tracking app's visual consistency. The app has a comprehensive design system (colors, typography, spacing, animations, shadows, border radius) defined in `src/theme/`, but ~50% of components bypass these tokens with hardcoded values. Three prior audits exist (UX-AUDIT-02, UX-AUDIT-03, DESIGN_CONSISTENCY_AUDIT) documenting 1,688+ hardcoded color violations, 80+ rogue font sizes, and 530+ inline shadow declarations.

This session focuses on the **highest-impact consistency fixes** — things users actually notice — not exhaustive migration of every violation.

### Risks
- Touching too many files at once increases breakage risk
- Some "hardcoded" values may be intentional (e.g., emoji sizes, gradient stops)
- Prior audits identified issues but many remain unfixed — need to verify current state before fixing

## Criteria

### Color Token Compliance
- [ ] ISC-1: DetailHero fallback colors use theme tokens not hex literals
- [ ] ISC-2: Auth screen colors import from theme, not local AUTH_COLORS object
- [ ] ISC-3: SettingsModal/colors.ts eliminated, imports from theme instead
- [ ] ISC-4: HabitCard.colors.ts eliminated, imports from theme instead
- [ ] ISC-5: StatCard trend badge uses colors.success/colors.error not hex

### Typography Scale Compliance
- [ ] ISC-6: No fontSize: 12 in production code (should be 13 caption)
- [ ] ISC-7: No fontSize: 16 in production code (should be 17 body)
- [ ] ISC-8: No fontSize: 18 in production code (should be 17 body)
- [ ] ISC-9: No fontSize: 24 in production code (should be 22 heading)

### Border Radius Compliance
- [ ] ISC-10: No borderRadius: 2 in production code (should be 4/xs)
- [ ] ISC-11: No borderRadius values 40/50/60/80 (should be 24/xl or 9999/full)

### Touch Target Compliance
- [ ] ISC-12: SwipeableActionButton height >= 44pt
- [ ] ISC-13: OnboardingScreen buttons height >= 44pt

### Animation Consistency
- [ ] ISC-14: Button press scale standardized to 0.97 (not mixed 0.96/0.98)
- [ ] ISC-15: Hardcoded spring configs in renderHabitRow use Springs.standard import
- [ ] ISC-16: cardPressAnimation uses Springs.button import not inline config
- [ ] ISC-17: Error boundary components have 280ms fade-in entrance animation

### Modal/Sheet Header Consistency
- [ ] ISC-18: All bottom sheet close buttons use consistent 32px hit area
- [ ] ISC-19: All bottom sheet headers use consistent padding (24px horizontal)

### Anti-Criteria
- [ ] ISC-A1: No regressions in existing lint checks (npm run lint passes)

## Decisions

## Verification
