# Design Consistency Audit Report

**Date:** 2026-02-14  
**Auditor:** Opus  
**Scope:** `src/` directory — 2,851 TypeScript/TSX files  
**Design System Reference:** `src/theme/` (colors, typography, spacing, animations)

---

## Summary

| Category | Violations Found | Severity |
|----------|-----------------|----------|
| Color Consistency | ~1,688 hardcoded hex values outside theme | High |
| Typography | 80+ rogue font sizes | Medium |
| Border Radius | Mostly compliant; ~15 off-system values | Low |
| Shadow System | ~530 inline shadow declarations | Medium |
| Animation | ~12 non-standard spring configs | Medium |
| Touch Targets | 3-5 undersized elements | High |
| Spacing | Pervasive inline values | Low |

---

## 1. COLOR CONSISTENCY

**Standard:** Use `colors` from `@/theme/colors` — primary green #047857/#059669, warm-stone palette.

### Critical: Hardcoded hex values that should use theme tokens

Many files duplicate theme colors as raw hex instead of importing:

| File | Line | Hardcoded Value | Should Be |
|------|------|----------------|-----------|
| `src/constants/auth.ts` | 14 | `#ffffff` | `colors.text.inverse` or white constant |
| `src/constants/auth.ts` | 20 | `#dc2626` | `colors.error` (#EF4444) — also wrong shade |
| `src/constants/auth.ts` | 26 | `#1c1917` | `colors.gray[900]` or `colors.text.primary` |
| `src/constants/auth.ts` | 38 | `#10b981` | `colors.primary[500]` |
| `src/features/habits/components/FloatingActionButton/FloatingActionButton.tsx` | 47 | `bg-[#059669]` | Should use theme token |
| `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx` | 31 | `#1c1917` | `colors.gray[900]` |
| `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx` | 40 | `text-[#a5b4fc]` | Not in design system |
| `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx` | 46 | `text-[#cbd5f5]` | Not in design system |
| `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx` | 94 | `bg-[#fbbf24]` | `colors.streak[300]` |
| `src/features/habits/components/HabitsHeader/HabitsHeader.tsx` | 18 | `#78716c` | Not in theme palette |
| `src/features/habits/components/HabitsHeader/AddHabitButton.tsx` | 35 | `#101828` | Not in theme palette |
| `src/features/habits/components/HabitsEmptyStateMinimal/constants.ts` | 110-147 | Entire local palette | Should import from `@/theme/colors` |
| `src/screens/auth/SignInScreen.tsx` | 129-327 | 15+ hardcoded colors | Should use theme tokens |
| `src/screens/auth/WelcomeScreen.styles.ts` | 20-83 | 10+ hardcoded colors | Should use theme tokens |
| `src/screens/auth/components/FormInput/useFormInputAnimations.ts` | 11-17 | `#10b981`, `#e7e5e4`, `#ffffff` | Should import from theme |
| `src/screens/auth/components/PasswordInput/usePasswordInputAnimations.ts` | 11-17 | Same duplicated constants | Should import from theme |
| `src/screens/auth/components/PasswordInput/PasswordInput.tsx` | 27 | `#ef4444` | `colors.error` |
| `src/utils/accessibility/focusRing.ts` | 3-4 | `#047857`, `#059669` | `colors.primary[700]`, `colors.primary[600]` |
| `src/components/SettingsModal/colors.ts` | — | Separate color file | Should use theme tokens |
| `src/components/HabitCard/HabitCard.colors.ts` | — | Separate color file | Should use theme tokens |
| `src/components/NextHabitSuggestion/styles.ts` | 13-57 | 8+ hardcoded colors | Should use theme tokens |
| `src/components/TrialCountdownBanner/TrialCountdownBanner.tsx` | 39-47 | `#1f2937`, `#6b7280`, `#ffffff` | Should use theme tokens |

### Non-palette colors (not in design system at all)

- `#a5b4fc` — indigo-300 (MonetizationHero)
- `#cbd5f5` — custom blue-gray (MonetizationHero)
- `#101828` — near-black (AddHabitButton)
- `#78716c` — stone-500 variant (HabitsHeader) — should be `colors.gray[500]` (#57534e)
- `#a1a1aa` — zinc-400 (FormInput, PasswordInput, NameInputSection) — should be `colors.gray[400]` (#6B7280)
- `#22c55e` — green-500 (SignInScreen, AnimatedDot) — should be `colors.success`
- `#065f46` — emerald-800 (NextHabitSuggestion) — not in palette
- `#312e81` — indigo-900 (MonetizationHero shadow)
- `#92400e` — amber-800 (SocialProofBadge)
- `#b45309` — amber-700 (NextHabitSuggestion) — matches `colors.streak[700]`

---

## 2. TYPOGRAPHY

**Standard:** 34/22/17/13 size scale (display/title/body/caption). Also allowed: 10 (labelSmall), 15 (bodyMedium/titleMedium), 28 (displayMedium/headlineLarge).

### Rogue font sizes (not in the 34/22/17/13/15/10/28 scale)

| File | Line | Size | Recommendation |
|------|------|------|---------------|
| `src/features/habits/components/HabitsEmptyStateMinimal/HabitInput/inputStyles.ts` | 34 | 16 | → 17 (body) |
| `src/features/habits/components/HabitsEmptyStateMinimal/HabitInput/inputStyles.ts` | 45 | 12 | → 13 (caption) |
| `src/screens/auth/SignInScreen.tsx` | 253 | 24 | → 22 (title) |
| `src/screens/auth/SignInScreen.tsx` | 278 | 12 | → 13 (caption) |
| `src/screens/auth/SignInScreen.tsx` | 289 | 40 | → 34 (display) or emoji-only exempt |
| `src/screens/auth/SignInScreen.tsx` | 312 | 14 | → 13 (caption) |
| `src/screens/auth/SignInScreen.tsx` | 321 | 16 | → 17 (body) |
| `src/screens/auth/components/SuccessOverlay/styles.ts` | 44 | 24 | → 22 (title) |
| `src/screens/templates/TemplatePreviewModal/styles.ts` | 47 | 24 | → 22 (title) |
| `src/screens/templates/TemplatePreviewModal/styles.ts` | 72 | 16 | → 17 (body) |
| `src/screens/templates/TemplatePreviewModal/styles.ts` | 78 | 14 | → 13 (caption) |
| `src/screens/templates/styles/formStyles.ts` | 6 | 12 | → 13 (caption) |
| `src/screens/AnalyticsScreen/components/StatCard.styles.ts` | 44 | 24 | → 22 (title) |
| `src/screens/AnalyticsScreen/components/AnalyticsHeader.tsx` | 56 | 28 | Allowed (headlineLarge) |
| `src/components/HabitCard/HabitCard.styles.ts` | 80 | 26 | → 28 (headlineLarge) for emoji |
| `src/components/HabitCard/HabitCard.styles.ts` | 85 | 15 | Allowed (bodyMedium) |
| `src/components/HabitCard/HabitCard.actionStyles.ts` | 27 | 15 | Allowed |
| `src/components/StreakIndicator/StreakIndicator.styles.ts` | 89 | 15 | Allowed |
| `src/components/ErrorBoundary/errorFallbackStyles.ts` | 20 | 14 | → 13 (caption) |
| `src/components/ErrorBoundary/errorFallbackStyles.ts` | 30 | 12 | → 13 (caption) |
| `src/components/ErrorBoundary/errorFallbackStyles.ts` | 49 | 16 | → 17 (body) |
| `src/components/ErrorBoundary/ScreenErrorFallback.tsx` | 77 | 12 | → 13 (caption) |
| `src/components/ErrorBoundary/ScreenErrorFallback.tsx` | 109 | 15 | Allowed |
| `src/components/ErrorBoundary/RetryButton.tsx` | 65 | 16 | → 17 (body) |
| `src/components/auth/LoadingTimeoutCard.tsx` | 43 | 16 | → 17 (body) |
| `src/components/auth/LoadingTimeoutCard.tsx` | 62 | 14 | → 13 (caption) |
| `src/components/auth/AuthGate.tsx` | 132 | 14 | → 13 (caption) |
| `src/components/auth/AuthGate.tsx` | 164 | 16 | → 17 (body) |
| `src/components/TemplateScienceModal/styles/section.styles.ts` | 41, 45 | 18 | → 17 (body) |
| `src/components/TemplateScienceModal/styles/science.styles.ts` | 31, 60, 70, 75 | 15, 18 | 15 allowed; 18 → 17 |
| `src/components/FullsizeTemplatePreview/styles/footer.styles.ts` | 43, 74 | 18 | → 17 (body) |
| `src/components/ProgressSectionConsolidated/TipQuickActionsSheet/styles.ts` | 75 | 18 | → 17 (body) |
| `src/components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles.ts` | 7 | 18 | → 17 (body) |
| `src/components/ProgressSectionConsolidated/WeeklySummaryStrip/dayCellStyles.ts` | 43 | 8 | → 10 (labelSmall) minimum |
| `src/components/WeeklyInsightsCard/WeeklyInsightsCard.styles.ts` | 35 | 10 | Allowed (labelSmall) |
| `src/components/NextHabitSuggestion/styles.ts` | 13 | 12 | → 13 (caption) |
| `src/components/NextHabitSuggestion/styles.ts` | 45 | 14 | → 13 (caption) |
| `src/components/TrialCountdownBanner/TrialCountdownBanner.tsx` | 39-47 | 14, 16 | → 13, 17 |
| `src/components/CompletionToast/styles.ts` | 38 | 12 | → 13 (caption) |
| `src/components/StrengthRing/StrengthRing.constants.ts` | 43 | 18 | → 17 (body) |
| `src/lib/sentry/ErrorBoundary/ErrorFallback.tsx` | 43, 73 | 14 | → 13 (caption) |
| `src/lib/sentry/ErrorBoundary/ErrorFallback.tsx` | 80 | 20 | → 22 (title) |

**Note:** Emoji sizes (40, 48, 64, 80, 120) and icon sizes (24, 32, 36) are exempt from the typography scale.

---

## 3. BORDER RADIUS

**Standard:** 16px cards, 12px buttons, 8px chips, 24px modals, 4px micro, 9999 pill.

### Violations

| File | Line | Value | Issue |
|------|------|-------|-------|
| `src/screens/auth/components/SuccessOverlay/styles.ts` | 7 | 40 | Non-standard; → 24 (xl) or context-specific |
| `src/screens/auth/components/SuccessOverlay/styles.ts` | 36 | 50 | Non-standard; → 9999 (pill) or 24 (xl) |
| `src/screens/auth/components/HeroAnimation/HeroAnimation.styles.ts` | 22 | 60 | Non-standard |
| `src/components/auth/BrandedLoadingScreen.tsx` | 69 | 32 | Non-standard; → 24 (xl) |
| `src/components/auth/AuthGate.tsx` | 147 | 32 | Non-standard; → 24 (xl) |
| `src/components/StreakMilestoneCelebration/styles.ts` | 33 | 50 | → 9999 (pill) |
| `src/components/StreakMilestoneCelebration/achievementCardStyles.ts` | 12 | 40 | → 24 (xl) |
| `src/components/MilestoneCelebration/styles.ts` | 37 | 80 | → 9999 (pill) |
| `src/components/TemplateScienceModal/styles/layout.styles.ts` | 38 | 3 | → 4 (xs) |
| `src/components/PredictionInsights/PredictionInsights.styles.ts` | 5 | 3 | → 4 (xs) |
| `src/components/OfflinePendingBanner/styles/stats.styles.ts` | 17 | 3 | → 4 (xs) |
| `src/components/Modal/Modal.styles.ts` | 38 | 2 | → 4 (xs) |
| `src/components/HabitStrengthIndicator/styles.ts` | 12, 16 | 2 | → 4 (xs) |

---

## 4. SHADOW SYSTEM

**Standard:** 5-level hierarchy defined in `src/theme/spacing.ts` — subtle/card/floatingActionButton/modal/alert.

~530 inline shadow declarations found. Most duplicate the `card` shadow (4px offset, 16px blur, 0.08 opacity) as raw values instead of importing `shadows.card`.

### Notable deviations

| File | Line | Issue |
|------|------|-------|
| `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx` | 33 | `shadowColor: '#1c1917'` with no offset/opacity — incomplete |
| `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx` | 59 | `shadowColor: '#312e81'` — non-standard shadow color |
| `src/screens/auth/components/ForgotPasswordModal/PasswordResetForm.tsx` | 24 | Conditional `shadowColor: error ? '#ef4444' : '#1c1917'` — error shadow not in system |
| `src/features/habits/components/HabitsEmptyStateMinimal/CtaButton.styles.ts` | 21 | `shadowColor: '#047857'` — branded shadow, not in elevation system |

---

## 5. ANIMATION

**Standard:** `springify().damping(18)`, 280ms duration, 60ms stagger. Spring configs from `@/theme/animations`.

### Non-standard spring configs

| File | Line | Config | Issue |
|------|------|--------|-------|
| `src/features/habits/components/HabitsList/LockedHabitCard.tsx` | 31-32 | `damping: 12, stiffness: 140` | Not in theme springs |
| `src/features/habits/components/SortBottomSheet/constants.ts` | 20-22 | `damping: 18, stiffness: 120` | stiffness 120 not standard (button is 240) |
| `src/features/habits/components/HabitsHeader/useButtonHandler.ts` | 4 | `damping: 15, stiffness: 300` | Not in theme springs — close to `micro` (15, 400) |
| `src/features/habits/components/HabitsEmptyStateMinimal/animations/springConfigs.ts` | 22-23 | `damping: 15, stiffness: 300` | Duplicates useButtonHandler deviation |
| `src/features/habits/components/HabitsEmptyStateMinimal/animations/springConfigs.ts` | 28-29 | `damping: 20, stiffness: 280` | Not in theme |
| `src/features/habits/components/HabitsEmptyStateMinimal/animations/springConfigs.ts` | 34-35 | `damping: 18, stiffness: 200` | Close to `sheet` (20, 200) |
| `src/features/habits/components/HabitsEmptyStateMinimal/animations/springConfigs.ts` | 40-41 | `damping: 25, stiffness: 180` | Not in theme |
| `src/features/habits/components/HabitsEmptyStateMinimal/animations/springConfigs.ts` | 46-47 | `damping: 10, stiffness: 200` | Close to `bouncy` (10, 180) |
| `src/features/habits/components/HabitsEmptyStateMinimal/animations/springConfigs.ts` | 55-56 | `damping: 20, stiffness: 200` | = `sheet` — should import it |

---

## 6. TOUCH TARGETS

**Standard:** Minimum 44pt (Apple HIG).

### Undersized touch targets

| File | Line | Size | Issue |
|------|------|------|-------|
| `src/screens/templates/styles/formStyles.ts` | 17 | `height: 36` | 36pt < 44pt minimum |
| `src/components/SwipeableActionButton/styles.ts` | 26 | `height: 36, width: 36` | 36pt < 44pt minimum |
| `src/screens/onboarding/OnboardingScreen.tsx` | 418 | `height: 36` | 36pt < 44pt minimum |
| `src/screens/onboarding/components/ChainVisualization.tsx` | 54 | `height: 36` | 36pt < 44pt minimum |
| `src/screens/auth/components/SocialSignInButton/LoadingSpinner.tsx` | 40 | `height: 20, width: 20` | Spinner, not a tap target — exempt |
| `src/components/SyncStatus/SyncedToast/styles.ts` | 36 | `height: 20` | Tap target if dismissible |
| `src/components/SyncStatus/ConflictNotification/styles.ts` | 37 | `height: 20` | Tap target if dismissible |

---

## 7. SPACING

**Standard:** 8pt grid (4, 8, 12, 16, 24, 32, 48, 64). Use `spacing` tokens from `@/theme/spacing`.

Spacing is largely compliant due to Tailwind/NativeWind usage. Inline numeric values generally follow multiples of 4. No critical deviations flagged beyond what's already covered by color/typography hardcoding.

---

## Fixes Applied in This PR

This PR addresses the **most impactful and safely fixable** violations:

1. **Typography** — Fixed all rogue font sizes (12→13, 14→13, 16→17, 18→17, 24→22, 20→22)
2. **Touch targets** — Fixed undersized buttons (36→44)
3. **Border radius** — Fixed non-standard values (2→4, 3→4, 32→24, 40→24, 50→9999, 80→9999)
4. **Color imports** — Fixed `focusRing.ts` to use theme tokens

### Not fixed (requires broader refactoring)

- ~1,688 hardcoded color hex values — needs a systematic migration pass
- ~530 inline shadow declarations — needs component-by-component refactoring
- Spring config consolidation — needs testing for animation feel
- Local color files (`auth.ts`, `HabitCard.colors.ts`, etc.) — architectural decision needed
