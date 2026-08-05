# Plan — Restore "Weekly Duration" visibility + Bypass onboarding gate

## Context

Two changes bundled on branch `weekly-habit-duration`:

**(A) Weekly duration visibility.** `WeeklyTimeCard` shipped in commit `0c9f2c326` as its own section under a dedicated `'time'` scroll-spy anchor in `HabitDetailContent.tsx`. The current working tree (uncommitted) refactored that away — the card was moved inside `GoalsTabContent/GoalsTabContent.tsx` and now sits under the "Goals" tab anchor alongside the streak goal card. User reports: "I don't see weekly duration." On a branch whose purpose is weekly duration, the surface for it is now buried under a generic "Goals" tab and pushed below Calendar + Strength in the scroll. Restore it as a first-class, immediately-visible tab + section.

**(B) Onboarding bypass.** User wants onboarding skipped on this branch. After sign-in, users go straight to the app (or paywall, if no entitlement). Surgical scope: edit only `src/components/auth/AuthGate.tsx`. The onboarding-v2 directory tree (43 files) and legacy onboarding directory (11 files) stay on disk, untouched, easily revertible. Loses no work — just unwires the gate.

## Recommended approach — (A) Weekly duration

Restore a dedicated **"Time"** tab + section, distinct from "Goals." Keep the working-tree consolidation otherwise (Goals stays for streak-target only; new `GoalsTabContent/` folder structure is preserved minus the WeeklyTimeCard).

### Tab order (sticky pill)

`Calendar · Strength · Time · Goals · Why`

Five tabs is fine on the existing pill — `DetailViewTabs.tsx:25-30` already lays out tabs evenly with a flex indicator that scales to count.

### Section order in the ScrollView

1. Calendar (unchanged)
2. Strength (unchanged, gated on `habit.createdAt`)
3. **Time** ← new anchor; renders `<WeeklyTimeCard>` directly
4. Goals (now just `<StreakGoalSection>` — no WeeklyTimeCard)
5. Why (unchanged)

This gives weekly duration its own discoverable scroll-spy target and tab pill, matching the branch's intent.

## Files to modify — (A) Weekly duration

### 1. `src/screens/HabitDetailScreen/components/DetailViewTabButton.tsx`
- Extend the `DetailView` union type from `'calendar' | 'strength' | 'goals' | 'why'` to include `'time'`.

### 2. `src/screens/HabitDetailScreen/components/DetailViewTabs.tsx`
- Add `{ label: 'Time', view: 'time' }` to the `TABS` array (line 25-30), inserted between `'strength'` and `'goals'`.
- No other changes needed — the indicator math at lines 60-68 already divides by `TABS.length`.

### 3. `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx`
- Import `WeeklyTimeCard` directly: `import { WeeklyTimeCard } from './WeeklyTimeCard';`
- Compute the props the card needs at the same place `habitColor` and `completionRate` are computed (lines 41-42). The card needs `habit._id`, `habitColor`, `habit.dailyMinutesGoal`, `habit.weeklyMinutesGoal` — already available on `habit`.
- Insert a new `<View>` block between Strength (line 75-91) and Goals (line 93-101):
  ```tsx
  <View className='mx-4 mt-4' onLayout={makeSectionLayoutHandler('time')}>
    <ErrorBoundary>
      <WeeklyTimeCard
        dailyMinutesGoal={habit.dailyMinutesGoal}
        habitColor={habitColor}
        habitId={habit._id}
        weeklyMinutesGoal={habit.weeklyMinutesGoal}
      />
    </ErrorBoundary>
  </View>
  ```

### 4. `src/screens/HabitDetailScreen/components/GoalsTabContent/GoalsTabContent.tsx`
- Remove the `<WeeklyTimeCard>` block (lines 19-26) and its import (line 8).
- Component now renders only the `StreakGoalSection`. Update the file's JSDoc header (lines 1-5) accordingly: "Goals tab — streak target only."

### 5. `src/screens/HabitDetailScreen/components/useDetailScrollSpy.ts`
- Verify the scroll-spy hook tolerates an unknown number of section keys (it should — it works off whatever keys `handleSectionLayout` is called with). If it has a hardcoded list of `DetailView` keys, add `'time'` there.

## Recommended approach — (B) Onboarding bypass

Surgical edit to `src/components/auth/AuthGate.tsx`. Drop the `'onboarding'` branch from the screen-key state machine so signed-in users go straight to `'app'` (or `'paywall'` if `!isPremium`). Remove the now-unused hook call, imports, type member, and loading guards. Leave `OnboardingFlowV2` and `useOnboardingV2Complete` source files on disk untouched — only the wire-up is removed.

### Files to modify — (B) Onboarding bypass

### 6. `src/components/auth/AuthGate.tsx`

Concrete edits, current line numbers:

- **JSDoc (lines 1-9):** drop the line `* OnboardingFlowV2 (Chain Builder) for first-time users after sign-up,`.
- **Imports (lines 21-24):** remove the `OnboardingFlowV2, useOnboardingV2Complete` import block entirely.
- **`ScreenKey` type (line 33):** change `type ScreenKey = 'welcome' | 'onboarding' | 'paywall' | 'app';` → `type ScreenKey = 'welcome' | 'paywall' | 'app';`.
- **`getScreenKey` (lines 35-43):** remove the `onboardingComplete` parameter and the `if (!onboardingComplete) return 'onboarding';` line. New body:
  ```ts
  function getScreenKey(isSignedIn: boolean, hasEntitlement: boolean): ScreenKey {
    if (!isSignedIn) return 'welcome';
    return hasEntitlement ? 'app' : 'paywall';
  }
  ```
- **Hook call (lines 49-51):** delete the `useOnboardingV2Complete(...)` destructure entirely. `onboardingComplete` and `markComplete` are no longer referenced.
- **`isWaitingForPremium` (lines 73-76):** drop the `onboardingComplete === true` predicate. New:
  ```ts
  const isWaitingForPremium = isSignedIn === true && isPremiumLoading;
  ```
- **Loading guard (lines 78-84):** drop the `(isSignedIn && onboardingComplete === null)` clause. New:
  ```ts
  if (!isLoaded || isWaitingForPremium) {
    return <BrandedLoadingScreen />;
  }
  ```
- **`getScreenKey` call site (lines 86-90):** drop the `onboardingComplete ?? false` argument:
  ```ts
  const screenKey = getScreenKey(isSignedIn ?? false, isPremium || paywallDismissedForTesting);
  ```
- **JSX (lines 102-109):** delete the entire `screenKey === 'onboarding' ? ...` branch.

Net effect: a signed-in user with an active entitlement lands on `<HabitsApp />`. Without entitlement, they land on `<RevenueCatPaywall />`. Onboarding never shows, regardless of any AsyncStorage state. Files under `src/screens/onboarding-v2/` become orphaned but stay on disk.

## Files NOT to modify

- `WeeklyTimeCard/*` — component itself is correct, no internal changes needed.
- `CalendarTabContent`, `HabitWhyBenefitsCard`, `DetailHero` — untouched.
- `GoalsTabContent.types.ts`, `StreakGoalSection.tsx` — untouched.
- `src/screens/onboarding-v2/**` (43 files) — left on disk, orphaned but intact. Easy revert: re-add the imports + state branch in AuthGate.tsx.
- `src/screens/onboarding/**` (11 legacy files) — untouched.
- `src/assets/onboarding/**` — untouched.
- AsyncStorage keys (`@chainday_onboarding_v2_*`, `@chainday_onboarding_complete`) — left in place; harmless once the gate no longer reads them.

## Reuse note

Everything needed already exists:
- `WeeklyTimeCard` component at `src/screens/HabitDetailScreen/components/WeeklyTimeCard/WeeklyTimeCard.tsx`
- `makeSectionLayoutHandler` factory in `HabitDetailContent.tsx:44-46`
- `ErrorBoundary` at `src/components/ErrorBoundary`
- Tab pill auto-scales to N items in `DetailViewTabs.tsx`

No new utilities, no new hooks.

## Verification

### (A) Weekly duration

1. **Build & boot**: `npm start` → reload Metro; open the app; navigate into any habit's detail screen.
2. **Visual check**: confirm the sticky tab pill shows five labels: `Calendar · Strength · Time · Goals · Why`. Scrolling the page should highlight the "Time" pill when the WeeklyTimeCard is centered in viewport.
3. **Tap navigation**: tap each tab and confirm the ScrollView animates to the correct section. "Time" should jump to WeeklyTimeCard. "Goals" should jump to StreakGoalSection.
4. **Habit type coverage**: open a habit with `weeklyMinutesGoal === 0` and `dailyMinutesGoal === 0` — card still renders header + total row + 7-day breakdown (per `WeeklyTimeCard.tsx:35-92`). Open a habit with goals set — progress bar and daily caption appear.

### (B) Onboarding bypass

5. **Cold-launch as a fresh user**: clear AsyncStorage (or use a fresh simulator/device), open app → tap "Sign up", complete Clerk sign-up. Verify: lands directly on `HabitsApp` (or `RevenueCatPaywall` if no entitlement). Confirm the OnboardingFlowV2 chain builder is **never** shown.
6. **Cold-launch as returning user with `@chainday_onboarding_v2_complete=false`**: confirm same outcome — straight to app/paywall. The stale storage key must not trigger the old flow.
7. **Sign-out / sign-in cycle**: sign out → WelcomeScreen. Sign back in → app/paywall, no onboarding flash.
8. **Console check**: confirm no warnings about the unused exports from `src/screens/onboarding-v2`. (Orphaned files are tolerated; broken imports are not.)

### Shared

9. **Type check**: `npx tsc --noEmit` — confirm the `DetailView` union update, new tab entry, and `AuthGate` simplifications compile cleanly.
10. **Lint**: `npm run lint:max-lines` on the touched files. `HabitDetailContent.tsx` is currently 110 lines and will gain ~6 — if it pushes further past, extract the time-section JSX into a small `TimeTabContent` component (see Open question below). `AuthGate.tsx` will shrink, not grow.

## Open question

If keeping `HabitDetailContent.tsx` ≤100 lines is a hard requirement on this branch, the cleanest variant is to create `src/screens/HabitDetailScreen/components/TimeTabContent/` mirroring the `GoalsTabContent/` folder shape, with `TimeTabContent.tsx` rendering only `<WeeklyTimeCard>`. Then `HabitDetailContent.tsx` imports `TimeTabContent` the same way it imports `GoalsTabContent`. I'd recommend this variant for consistency — the diff is +1 small folder, same outcome.
