# Phase 7: Screen Layout Standardization & Safe Area Handling

**Goal:** Standardize screen-level layout patterns so every screen uses consistent safe area handling, background colors, headers, and state management.

**Context (Updated Feb 2025):** Recent UI polish commits improved safe area handling — HabitDetailScreen and HabitEditScreen now both use `Math.max(insets.top + 4, 12)` consistently. However:

- Background colors are still set via hardcoded hex in multiple screens (`bg-[#faf9f7]` in HabitEditScreen, SignUpScreen)
- Auth screens still have different inset formulas (SignUpScreen: `insets.top + 16`)
- CharacterScreen may still use hardcoded `pt-[60px]`
- AnalyticsScreen and its components now properly use theme tokens (AnalyticsHeader, StatCard.styles.ts are clean)
- New hardcoded colors were introduced in DetailHeader.tsx, EditHeader.tsx, BrowseHeader.tsx during recent redesigns

---

- [x] **Standardize background color across all screens.** Every screen should use the same warm stone background `colors.light.background` (`#faf9f7`) from the theme. Fix:
  - `src/features/habits/HabitsApp.tsx` — replace hardcoded `#FAF8F5` with `colors.light.background` from `@/theme`
  - `src/screens/HabitEditScreen/HabitEditScreen.tsx` — replace `bg-[#faf9f7]` Tailwind class with `style={{ backgroundColor: colors.light.background }}`
  - `src/screens/CharacterScreen/CharacterScreen.tsx` — replace `bg-white` with `style={{ backgroundColor: colors.light.background }}`
  - `src/screens/auth/SignUpScreen.tsx` — replace `bg-[#faf9f7]` with `style={{ backgroundColor: colors.light.background }}`
  - `src/screens/HabitDetailScreen/HabitDetailScreen.tsx` — the LinearGradient `['#faf9f7', '#f5f3f0', '#faf9f7']` is intentional for visual depth, but ensure the base colors reference theme tokens
  - `src/screens/auth/SignInScreen.tsx` — same gradient note as above
  - `src/screens/AnalyticsScreen/AnalyticsScreen.tsx` — already uses `colors.background` (good, verify it matches)
  - Run lint on all modified files
  - **Completed:** Replaced hardcoded hex in 6 files + 1 styles file. Added `colors.light.gradientMid` (#f5f3f0) token for depth gradients. HabitsApp had `#FAF8F5` (slightly off), now uses `colors.light.background`. AnalyticsScreen confirmed already correct. 25 new tests pass.

- [x] **Verify SafeHeader adoption and fix CharacterScreen insets.** HabitDetailScreen and HabitEditScreen already use the consistent formula `Math.max(insets.top + 4, 12)` (verified Feb 2025). Fix CharacterScreen if it still uses hardcoded `pt-[60px]` to use `useSafeAreaInsets()` with `paddingTop: insets.top + 8`. For full screens (CharacterScreen, AnalyticsScreen), adopt `SafeHeader` or use consistent formula `paddingTop: insets.top + 8`.
  - **Completed:** Replaced hardcoded `pt-[60px]` in CharacterScreen → `Math.max(insets.top + 8, 16)` with `useSafeAreaInsets()`. Fixed AnalyticsHeader static `paddingTop: spacing.xl` (32) → dynamic `Math.max(insets.top + 8, 16)` with `useSafeAreaInsets()`. Removed unused `Text` import from AnalyticsHeader. SafeHeader component confirmed ready (defaults: +8, min 16) but inline formulas used for simplicity. 21 new tests pass.

- [x] **Standardize auth screen safe area insets.** The auth screens have wildly different top padding (16, 40, 60). Standardize:
  - `SignInScreen`: `paddingTop: insets.top + 24` (generous but not extreme)
  - `SignUpScreen`: `paddingTop: insets.top + 24` (match SignIn)
  - `WelcomeScreen`: `paddingTop: insets.top + 24` for the welcome content area; keep `BackButton` at `insets.top + 8` (this is a standard back button position)
  - This creates two standard inset patterns: `insets.top + 8` for headers/nav, `insets.top + 24` for full-screen content areas
  - **Completed:** Replaced `insets.top + 40` (SignIn), `insets.top + 16` (SignUp), `insets.top + 60` (WelcomeScreen content) → all `insets.top + 24`. WelcomeScreen BackButton remains at `insets.top + 8`. 15 new tests pass.

- [x] **Ensure ErrorBoundary wraps all screens.** Check if `ErrorBoundary` from `src/components/ErrorBoundary/ErrorBoundary.tsx` wraps the root app or individual screens. If not, add it at the app root level (likely in `src/App.tsx` or the main navigation wrapper). If already present at root, verify it catches errors from all screen paths. This is a safety net — no individual screen needs its own error boundary if a root-level one exists.
  - **Completed:** Verified dual-layer ErrorBoundary architecture already in place. `SentryErrorBoundary` wraps the entire provider tree in both `Providers` (production/Clerk path) and `DevProviders` (development path) in `App.tsx` — all screens covered. Additionally, 6 secondary `ErrorBoundary` instances wrap high-complexity leaf components: HabitCalendarModal, HabitDetailScreen, HabitEditScreen (in CalendarAndDetailModals), HabitStrengthSection, MonthlyCalendarGrid (in HabitDetailContent), and TemplatesScreen (in TemplatesModalSection). Sentry is initialized before any component renders. No code changes needed — added 15 verification tests.

- [x] **Standardize loading/empty state patterns.** Read the shared `EmptyState` component at `src/components/EmptyState/EmptyState.tsx` and verify it has variants for the most common cases. Then:
  - `HabitDetailScreen` — currently returns `null` when no habit data. Add a meaningful empty/loading state or at minimum a centered ActivityIndicator
  - `HabitEditScreen` — currently returns `null` when not visible. This is a modal so returning null is acceptable (the modal just doesn't render)
  - `CharacterScreen` — uses mock data and has no loading state. If it will eventually fetch real data, add a loading skeleton or ActivityIndicator pattern
  - Document which screens need loading states in a code comment for future reference
  - **Completed:** Created `DetailLoadingState` component (ActivityIndicator + theme colors + a11y labels) for HabitDetailScreen — now shows a centered spinner instead of returning null when modal is visible but habit data hasn't loaded. HabitEditScreen `return null` confirmed correct (modal not mounted pattern) — added documentation comment. CharacterScreen uses mock data — added loading state documentation comment for future real-data connection. EmptyState component verified: 4 variants (noHabits, noData, noResults, premiumLocked) with staggered animations. 15 new tests pass.
