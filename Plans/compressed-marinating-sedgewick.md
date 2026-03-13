# Plan: Comprehensive Design Consistency Pass

## Context

The app has a well-structured design system in `src/theme/` but significant drift between the system and actual usage. A Feb 14 audit found ~2,300 violations. Phase 1 (color identity) is complete; Phases 2-9 are documented but unstarted. Beyond token usage, there are animation, button, and motion inconsistencies that need attention.

This plan covers **everything**: colors, typography, shadows, border radius, animations, button patterns, micro-interactions, and motion consistency. Organized by impact — main pages first, then secondary screens.

---

## Part 1: Button & Press Feedback Standardization

**Problem:** Only ~15-20% of interactive elements use the Button component. The rest are ad-hoc with inconsistent scale values (0.9, 0.95, 0.97, 1.08), inconsistent haptic feedback, and 3 legacy TouchableOpacity instances.

### 1a. Standardize press scale constant

- Define `PRESS_SCALE = 0.97` as the single standard in `src/components/Button/constants.ts`
- Update all deviating components to use this constant:
  - `TimeRangeButton` (0.95 → 0.97)
  - `PlayPauseButton` (0.9 → 0.97)
  - `ColorSwatch` (0.95 → 0.97)
  - `RetryButton` (0.95 → 0.97)
  - `DismissButton` (opacity-only → add scale 0.97)

### 1b. Ensure universal haptic feedback on press

- Components missing haptics: `DismissButton`, `TimeRangeButton`, legend items, `ComplianceHeatmap` cells
- Add `triggerHaptic('tap')` to all interactive press handlers

### 1c. Migrate 3 legacy TouchableOpacity → Pressable

- `src/components/ComplianceHeatmap/HeatmapCell.tsx`
- `src/components/StrengthDistributionChart/Legend.tsx`
- `src/components/FeedbackModal.tsx` (if exists)

### 1d. Fix undersized touch targets

- `PlayPauseButton`: 40pt → 44pt minimum
- Any remaining buttons below 44pt from the audit

**Files:**

- `src/components/Button/constants.ts` (new or existing)
- `src/components/Button/useButtonAnimation.ts`
- Components listed above

---

## Part 2: Animation & Motion Consistency

**Problem:** FAB uses deprecated Animated API, toast durations mismatch, some non-standard spring configs, onboarding uses isolated animation pattern.

### 2a. Migrate FAB to react-native-reanimated

- `src/features/habits/components/FloatingActionButton/useFABAnimations.ts`
- Replace `Animated.timing()` loop with `withRepeat(withSequence(withTiming(...)))` from reanimated
- Use `springs.standard` instead of custom config

### 2b. Standardize non-standard spring configs

- `src/features/habits/components/HabitsList/LockedHabitCard.tsx` — damping:12/stiffness:140 → use `springs.celebration` or `springs.gentle`
- `src/features/habits/components/SortBottomSheet/constants.ts` — stiffness:120 → `springs.gentle` (20, 100)
- `src/features/habits/components/HabitsHeader/useButtonHandler.ts` — damping:15/stiffness:300 → `springs.snappy`
- `src/features/habits/components/HabitsEmptyStateMinimal/animations/springConfigs.ts` — 6 custom configs → map to nearest theme presets
- `src/components/HabitCard/entrance/constants.ts` — import from `@/theme/animations` directly instead of `constants/motion`

### 2c. Fix toast duration inconsistency

- `CompletionToast`: 2.5s with no progress indicator
- `ArchiveUndoToast`: 5s with linear progress bar
- Decision needed: either add progress bar to CompletionToast or accept the difference (CompletionToast is celebratory, ArchiveUndoToast is actionable — different intents may justify different patterns)

### 2d. Fix ArchiveUndoToast progress bar animation

- `src/components/ArchiveUndoToast/useArchiveUndoToast.ts` line 107
- Replace string percentage width (`\`${progressWidth.value}%\``) with numeric `scaleX` transform for smoother animation

**Files:**

- `src/features/habits/components/FloatingActionButton/useFABAnimations.ts`
- `src/features/habits/components/HabitsList/LockedHabitCard.tsx`
- `src/features/habits/components/SortBottomSheet/constants.ts`
- `src/features/habits/components/HabitsHeader/useButtonHandler.ts`
- `src/features/habits/components/HabitsEmptyStateMinimal/animations/springConfigs.ts`
- `src/components/HabitCard/entrance/constants.ts`
- `src/components/ArchiveUndoToast/useArchiveUndoToast.ts`

---

## Part 3: Hardcoded Colors → Theme Tokens (Main Pages)

**Problem:** ~1,688 hardcoded hex values. Focus on main user-facing screens first.

### 3a. Home screen components

- `src/features/habits/components/FloatingActionButton/FloatingActionButton.tsx` — `bg-[#059669]` → theme token
- `src/features/habits/components/HabitsHeader/HabitsHeader.tsx` — `#78716c` → `colors.gray[500]`
- `src/features/habits/components/HabitsHeader/AddHabitButton.tsx` — `#101828` → `colors.gray[900]`
- `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx` — 5+ hardcoded colors
- `src/features/habits/components/HabitsEmptyStateMinimal/constants.ts` — entire local palette

### 3b. Settings modal

- `src/components/SettingsModal/colors.ts` — migrate to use theme tokens
- `src/components/SettingsModal/sections/PremiumStatus.tsx` — `shadowColor: '#6366f1'`, shimmer rgba values
- `src/components/SettingsModal/SortPicker.tsx` — inline dark/light rgba ternaries → helper function

### 3c. Template previews

- `src/components/FullsizeTemplatePreview/components/ModalHeader.tsx` — `#D1D5DB`
- `src/components/FullsizeTemplatePreview/components/FooterSection.tsx` — raw rgba gradients
- `src/components/FullsizeTemplatePreview/styles/footer.styles.ts` — `#15803d`, `#22c55e` branded shadows

### 3d. Calendar & heatmap components

- `src/components/CalendarTimeline/components/DayCellRing.styles.ts` — multiple `rgba(232,185,77,...)` → `colors.streak[500]` with opacity
- `src/components/CalendarTimeline/components/MiniCalendarPopup.tsx` — `rgba(0,0,0,0.4)` overlay

### 3e. Streak & progress components

- `src/components/HabitCard/components/StreakBadge.tsx` — 4+ hardcoded amber rgba values
- `src/components/NextHabitSuggestion/styles.ts` — 8+ hardcoded colors
- `src/components/TrialCountdownBanner/TrialCountdownBanner.tsx` — `#1f2937`, `#6b7280`, `#ffffff`

---

## Part 4: Hardcoded Colors → Theme Tokens (Secondary Screens)

### 4a. Auth screens (heaviest violators)

- `src/screens/auth/SignInScreen.tsx` — 15+ hardcoded colors
- `src/screens/auth/WelcomeScreen.styles.ts` — 10+ hardcoded colors
- `src/screens/auth/components/FormInput/useFormInputAnimations.ts` — `#10b981`, `#e7e5e4`, `#ffffff`
- `src/screens/auth/components/PasswordInput/usePasswordInputAnimations.ts` — same duplicated constants
- `src/screens/auth/components/PasswordInput/PasswordInput.tsx` — `#ef4444` → `colors.error`
- `src/constants/auth.ts` — 4 hardcoded hex values

### 4b. Error boundaries

- `src/components/ErrorBoundary/errorFallbackStyles.ts` — font sizes 14→13, 12→13, 16→17
- `src/components/ErrorBoundary/ScreenErrorFallback.tsx` — font size 12→13
- `src/components/ErrorBoundary/RetryButton.tsx` — font size 16→17
- `src/lib/sentry/ErrorBoundary/ErrorFallback.tsx` — font sizes 14→13, 20→22

### 4c. Auth utility components

- `src/components/auth/LoadingTimeoutCard.tsx` — font sizes 16→17, 14→13
- `src/components/auth/AuthGate.tsx` — font size 14→13, 16→17, borderRadius 32→24
- `src/components/auth/BrandedLoadingScreen.tsx` — borderRadius 32→24

### 4d. Remaining small components

- `src/utils/accessibility/focusRing.ts` — `#047857`, `#059669` → `colors.primary[700]`, `colors.primary[600]`
- `src/components/CompletionToast/styles.ts` — font size 12→13
- `src/components/StrengthRing/StrengthRing.constants.ts` — font size 18→17

---

## Part 5: Shadow System Consolidation

**Problem:** ~530 inline shadow declarations duplicate theme shadows.

### 5a. Audit and replace inline shadows in main components

- Replace raw `shadowColor/shadowOffset/shadowOpacity/shadowRadius` with `shadows.card`, `shadows.subtle`, `shadows.floatingActionButton`, `shadows.modal` from `@/theme/spacing`
- Priority: HabitCard, SettingsModal, FullsizeTemplatePreview, MonetizationHero

### 5b. Remove branded shadow colors

- `MonetizationHero` — `shadowColor: '#312e81'` (indigo) → remove or use `shadows.card`
- `FullsizeTemplatePreview/footer.styles.ts` — `shadowColor: '#15803d'`, `'#22c55e'` → standard shadow color
- `PasswordResetForm.tsx` — conditional error shadow → standard shadow

---

## Part 6: Typography Scale Fixes

**Problem:** 80+ rogue font sizes outside the 10/13/15/17/22/34 scale.

Apply these systematic replacements across all files listed in the audit:

- `12` → `13` (caption)
- `14` → `13` (caption)
- `16` → `17` (body)
- `18` → `17` (body)
- `24` → `22` (title)
- `20` → `22` (title) — context-dependent
- `8` → `10` (labelSmall minimum)

Key files: `SignInScreen.tsx`, `SuccessOverlay/styles.ts`, `TemplatePreviewModal/styles.ts`, `formStyles.ts`, `StatCard.styles.ts`, `TemplateScienceModal/styles/`, `ProgressSectionConsolidated/` styles, `NextHabitSuggestion/styles.ts`

---

## Part 7: Border Radius Normalization

Replace all off-system values:

- `2, 3` → `4` (xs)
- `20` → `16` (large/card) or `24` (xl)
- `32, 40` → `24` (xl)
- `50, 60, 80` → `9999` (full/pill)

Key files: `SuccessOverlay/styles.ts`, `HeroAnimation.styles.ts`, `BrandedLoadingScreen.tsx`, `AuthGate.tsx`, `StreakMilestoneCelebration/`, `MilestoneCelebration/`, `Modal.styles.ts`, `HabitStrengthIndicator/styles.ts`

---

## Verification

1. `npx tsc --noEmit` — no type errors
2. `npm run lint:max-lines` — no new violations
3. Grep modified files for remaining hardcoded hex values
4. Visual check on device that colors/animations haven't regressed
5. Test button press animations feel consistent
6. Test modal open/close animations
7. Test habit completion celebration flow
8. Verify reduce-motion still works
