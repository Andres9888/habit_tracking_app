# Phase 01: Shadow Unification

**Priority:** P0 - Critical
**Scope:** Replace all hardcoded shadow colors with theme tokens
**Context:** The theme defines warm-toned shadows using `#2D2A26` in `src/theme/spacing.ts` (shadows object), but the codebase uses 10+ different shadow colors (`#000`, `#1c1917`, brand colors, etc.). This breaks visual depth hierarchy and makes the app look inconsistent.

## Rules

- Import `shadows` from `src/theme/spacing.ts` and spread the appropriate level (`shadows.subtle`, `shadows.card`, `shadows.floatingActionButton`, `shadows.modal`, `shadows.alert`)
- Where a component already uses `useThemeColors()`, use `colors.text.primary` as the shadow color (it resolves to the correct value per theme)
- Brand-colored glow shadows (e.g., green glow on FAB, amber on streak icons) are **intentional design** and should NOT be changed - only change neutral/depth shadows
- Do NOT change shadows that use `colors.text.primary` or `colors.primary[N]` as these are already theme-aware
- Do NOT change `shadowColor: 'transparent'` as these are intentional

---

- [ ] **Auth screens shadow unification.** In the following files, replace hardcoded `shadowColor: '#1c1917'` and `shadowColor: '#000'` with theme shadow tokens. Files to update: `src/screens/auth/components/VerificationView/VerificationForm.tsx` (line 31), `src/screens/auth/components/AnimatedLogo.tsx` (line 91), `src/screens/auth/components/AuthError/AuthError.tsx` (line 17), `src/screens/auth/components/ForgotPasswordModal/PasswordResetForm.tsx` (line 32 - keep the `error ? '#ef4444'` conditional but change the non-error case), `src/screens/auth/components/ForgotPasswordModal/PasswordResetSuccess.tsx` (lines 17, 45), `src/screens/auth/components/ForgotPasswordModal/PasswordResetButtons.tsx` (line 45), `src/screens/auth/components/SubmitButton/SubmitButton.tsx` (line 62), `src/screens/auth/SignInScreen.styles.ts` (lines 106, 121), `src/screens/auth/WelcomeScreen.styles.ts` (line 43). In each file: import `shadows` from the theme spacing module and use the appropriate shadow level spread (e.g., `...shadows.card`). If the component already uses `useThemeColors()`, prefer `shadowColor: colors.text.primary` with appropriate opacity. Verify the file compiles with `npx tsc --noEmit` on the changed files.

- [ ] **Onboarding screen shadow unification.** In these files, replace `shadowColor: '#000'` with theme shadows: `src/screens/onboarding/OnboardingScreen.styles.ts` (lines 22, 51), `src/screens/onboarding/onboarding.visuals.styles.ts` (line 75), `src/screens/onboarding/OnboardingScreen.tsx` (lines 340, 360), `src/screens/onboarding/components/TemplateGrid.tsx` (line 55). Import `shadows` from `src/theme/spacing.ts` and use the appropriate level. For inline styles in .tsx files, use `colors.text.primary` from `useThemeColors()` if already available in the component.

- [ ] **Bottom action bar and FAB shadows.** In `src/features/habits/components/BottomActionBar/BottomActionBar.styles.ts` (line 11), replace `shadowColor: '#000'` with theme shadow. NOTE: Do NOT change `src/features/habits/components/BottomActionBar/ProgressRingFAB.styles.ts` (line 21) or `ProgressRingFAB.tsx` (line 36) - these use `#059669` and `colors.primary[500]` intentionally as a brand glow effect.

- [ ] **Habit list and sort sheet shadows.** Fix these files: `src/features/habits/hooks/HabitRenderContent.tsx` (line 97 - replace `#000` with theme shadow, keep the `transparent` on line 105), `src/features/habits/components/HabitsHeader/AddHabitButton.tsx` (line 18 - replace `#1c1917`), `src/features/habits/components/SortBottomSheet/SortBottomSheet.tsx` (line 61 - replace `isDark ? '#000000' : '#1c1917'` with `colors.text.primary`), `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx` (lines 48, 76 - replace `#1c1917` and `#312e81`).

- [ ] **PerformanceDashboard shadows.** In these files replace `#1c1917` with theme shadows: `src/components/PerformanceDashboard/components/StatusIndicator.tsx` (line 44), `src/components/PerformanceDashboard/components/DashboardFAB.tsx` (line 49), `src/components/PerformanceDashboard/styles.ts` (lines 30, 54), `src/components/PerformanceDashboard/PerformanceDashboard.styles.ts` (line 16). Import `shadows` from theme and use the appropriate spread level.

- [ ] **Skeleton loader shadows.** In `src/components/SkeletonLoader/skeletons/AttributeRowSkeleton.tsx` (line 11) and `src/components/SkeletonLoader/skeletons/CharacterCardSkeleton.tsx` (line 11), replace `#1c1917` shadow color with theme shadows.

- [ ] **Modal, toast, and misc component shadows.** Fix these files: `src/components/StatsNotesModal/StatsNotesModal.tsx` (line 17 - replace `#1c1917`), `src/components/DayHabitsBottomSheet/styles.ts` (line 11 - replace `#1c1917`), `src/components/BinaryHeatmap/MonthlyCalendarGrid/styles.ts` (line 20 - replace `#1c1917`), `src/components/ArchiveUndoToast/styles.ts` (line 70 - replace `isDark ? '#000' : '#78716c'` with `colors.text.primary`), `src/components/DeleteUndoToast/styles.ts` (line 68 - keep the `isDark ? '#000' :` pattern but note: the `#dc2626` red shadow is an intentional destructive glow, so ONLY change the dark mode fallback from `#000` to theme shadow). After all changes, run `npx tsc --noEmit` to verify type safety.

- [ ] **Update theme README shadow examples.** In `src/theme/README.md` (around line 217-223), the shadow usage examples show `shadowColor: '#000'`. Update these documentation examples to use the actual theme shadow tokens (e.g., `...shadows.card`) so future developers follow the correct pattern.
