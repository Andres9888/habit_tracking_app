# Interactive Onboarding Flow

## Context

The app currently **auto-skips onboarding** for all new users (`useOnboardingStatus.ts` line 25-29 sets `ONBOARDING_KEY = true` immediately). The existing 3-screen carousel (chain, strength meter, template grid) was passive — just informational slides users swiped past.

This plan replaces it with a **3-step interactive flow** that leads with doing — the user creates their first real habit, tries completing it, and celebrates. No preamble, no goal-selection gates. They learn by using the actual app.

---

## Flow Design

| Step | Name | Interactive Element | What It Does |
|------|------|-------------------|--------------|
| 0 | **Add Your First Habit** | Browse template cards by category OR type a custom name | Creates a real habit via `importTemplate` or `habits.create` |
| 1 | **Try Completing It** | Tap the `QuickCompleteButton` | Calls `toggleHabit` — a real day-1 completion |
| 2 | **You're All Set** | Confetti + "Start Building Habits" CTA | Marks onboarding complete, transitions to app |

Users can skip at any step via "I'll explore later" (same as current).

---

## Architecture

**Routing**: No changes to `AuthGate.tsx`. It already routes `signed in + !onboarded → OnboardingScreen`. The `OnboardingScreen` component gets rewritten internally.

**State machine**: A `useOnboardingFlow` hook manages step index + created habit ID. Each step is a standalone component receiving data + callbacks.

**Data layer**: Reuses existing Convex mutations — `api.templates.importTemplate`, `api.habits.toggle.toggleHabit`. Queries: `api.templates.list` (by category), `api.templates.getPopular`.

---

## Step Details

### Step 0: Add Your First Habit

**Headline**: "Let's add your first habit" (Literata displayLarge)
**Subtitle**: "Pick one to get started — you can always add more later."

**UI layout**:
- Category pill row at top (horizontal scroll): Popular, Health, Mindfulness, Productivity, Learning, Sleep — tapping filters the list below
- Scrollable grid of `MiniTemplateCard` components showing templates from the selected category
- Tapping a template card calls `importTemplate` immediately and advances to step 1
- Below the grid: a "Or create your own" text link that opens the existing `CreateHabitModalCentered` — on successful creation, also advances to step 1

**Data**: Pre-fetch `api.templates.getPopular` on mount (shown in "Popular" default tab). Each category pill triggers `api.templates.list({ category })`. Templates are public queries — no auth latency concern.

**Why this works**: The user sees real templates with emoji icons and names, taps one, and they immediately have a habit. One tap to proceed. No abstract goal-selection gate. The existing `MiniTemplateCard` already has import animations, loading states, and haptic feedback built in.

### Step 1: Try Completing It

**Headline**: "Nice! Now let's try it" (Literata displayLarge)
**Subtitle**: "Tap to complete your first habit for today."

**UI layout**:
- Centered card showing the habit they just created (emoji, name, color)
- Large `QuickCompleteButton` below the card — same button used throughout the app
- After completion: confetti burst fires, card shows check state, "Chain: Day 1!" text animates in
- "Continue" button fades in after ~1s delay

**Data**: Uses `useQuery(api.habits.list)` to get the freshly created habit. Calls `toggleHabit` on tap. The `QuickCompleteButton` already handles confetti, haptics, and check animation internally.

### Step 2: You're All Set

**Headline**: "You're all set!" (Literata displayLarge)
**Subtitle**: "Come back tomorrow to keep your chain going."

**UI layout**:
- Full-screen celebration using confetti system from `CelebrationSystem`
- Mini preview of their habit with the chain showing "1 day"
- "Start Building Habits" primary button (full width) — completes onboarding

**Data**: Calls `safeSetBoolean(ONBOARDING_KEY, true)` then `onComplete()` which triggers `markComplete()` in AuthGate.

---

## File Plan

### Modified Files

**`src/screens/onboarding/useOnboardingStatus.ts`** — Remove auto-skip. The `else` branch (new user, line 25-29) should call `setComplete(false)` instead of `safeSetBoolean(ONBOARDING_KEY, true)`.

**`src/screens/onboarding/OnboardingScreen.tsx`** — Full rewrite as 3-step orchestrator. Renders current step component + `StepProgressBar` + skip button. Uses `useOnboardingFlow` for state. Animated transitions between steps (`FadeInDown.springify().damping(18)` / `FadeOut`).

**`src/screens/onboarding/OnboardingScreen.styles.ts`** — Updated for new layout.

**`src/screens/onboarding/onboarding.data.ts`** — Keep `ONBOARDING_KEY` export only, remove `PAGES`/`PageData`/visual imports.

### New Files — Foundation

| File | Purpose | ~Lines |
|------|---------|--------|
| `onboarding/onboarding.types.ts` | Step type, step prop types, flow state type | ~40 |
| `onboarding/useOnboardingFlow.ts` | State machine: step index, created habit ID, navigation | ~70 |

### New Files — Shared Components

| File | Purpose |
|------|---------|
| `onboarding/components/StepProgressBar.tsx` + `.styles.ts` | 3-segment animated progress bar |
| `onboarding/components/OnboardingHeader.tsx` | Reusable title + subtitle with entry animation |
| `onboarding/components/CategoryPills.tsx` + `.styles.ts` | Horizontal scrolling category filter pills |

### New Files — Steps

| File | Purpose |
|------|---------|
| `onboarding/steps/AddHabitStep.tsx` | Template browsing by category + "create your own" link |
| `onboarding/steps/AddHabitStep.styles.ts` | Styles |
| `onboarding/steps/AddHabitStep.hooks.ts` | Template queries + import handler |
| `onboarding/steps/TryCompletionStep.tsx` | Habit card + `QuickCompleteButton` |
| `onboarding/steps/TryCompletionStep.styles.ts` | Styles |
| `onboarding/steps/TryCompletionStep.hooks.ts` | Habit query + toggle logic |
| `onboarding/steps/CelebrationStep.tsx` | Confetti + final CTA |
| `onboarding/steps/CelebrationStep.styles.ts` | Styles |

### Deleted Files

| File | Reason |
|------|--------|
| `ChainVisualization.tsx` | Passive visual, no longer used |
| `StrengthMeter.tsx` | Same |
| `TemplateGrid.tsx` | Same |
| `DotIndicators.tsx` | Replaced by `StepProgressBar` |
| `onboarding.visuals.styles.ts` | No longer needed |
| `useOnboardingHandlers.ts` | Logic absorbed by `useOnboardingFlow` |

---

## Key Components Reused

| Component | From | Used In |
|-----------|------|---------|
| `Button` | `src/components/Button/` | All steps (Continue/CTA) |
| `MiniTemplateCard` | `src/components/MiniTemplateCard/` | Step 0 (template browsing) |
| `CreateHabitModalCentered` | `src/components/CreateHabitModal/` | Step 0 ("create your own" path) |
| `QuickCompleteButton` | `src/components/QuickCompleteButton/` | Step 1 (try completion) |
| Celebration system | `src/components/CelebrationSystem/` | Step 2 (confetti) |
| `triggerHaptic` | `src/utils/haptics` | All steps |
| `useThemeColors` | `src/theme/ThemeContext` | All steps |
| `ScreenErrorBoundary` | `src/components/ErrorBoundary` | Orchestrator wrapper |

---

## Template Category Mapping for Pills

| Pill Label | Convex Category |
|-----------|----------------|
| Popular | (uses `getPopular` query, no category filter) |
| Health | `health_fitness` |
| Mindfulness | `mindfulness` |
| Productivity | `productivity` |
| Morning | `morning_routine` |
| Learning | `learning` |
| Sleep | `sleep` |

---

## Implementation Sequence

### Phase 1: Foundation
1. Modify `useOnboardingStatus.ts` — remove auto-skip (3-line change)
2. Create `onboarding.types.ts`
3. Create `useOnboardingFlow.ts` (state machine)

### Phase 2: Shared Components
4. Create `StepProgressBar` + styles
5. Create `OnboardingHeader`
6. Create `CategoryPills` + styles

### Phase 3: Steps
7. `AddHabitStep` + hooks + styles (the core step — template browsing + import)
8. `TryCompletionStep` + hooks + styles
9. `CelebrationStep` + styles

### Phase 4: Integration
10. Rewrite `OnboardingScreen.tsx` as orchestrator
11. Update `OnboardingScreen.styles.ts`
12. Clean up `onboarding.data.ts`, delete old files

---

## Edge Cases

- **Template loading**: `getPopular` pre-fetched on mount. Category queries are fast (~200 templates total). Show skeleton while loading.
- **Import failure**: Try/catch in `AddHabitStep.hooks.ts`. Toast on error, don't advance. User can retry.
- **"Create your own" path**: Opens existing `CreateHabitModalCentered`. On successful creation (modal `onSuccess` callback), store the new habit ID and advance to step 1. On dismiss without creating, stay on step 0.
- **User already has habits** (re-onboarding edge case): Check count before import. If at free tier limit (3), show "You already have 3 habits" and skip to step 1 using their most recent habit.
- **App backgrounded mid-onboarding**: State resets — acceptable for a <1 min flow. `ONBOARDING_KEY` only set on final step.
- **Convex auth timing**: `AuthGate` already ensures Convex is ready + `getOrCreateUser` called before rendering onboarding.

---

## Verification

1. **Template path**: Sign up → see templates by category → tap one → habit created → tap complete → confetti → enter app with habit visible in list
2. **Custom path**: Sign up → tap "create your own" → fill form → save → habit created → tap complete → confetti → enter app
3. **Skip flow**: Any step → "I'll explore later" → onboarding complete → enter empty app
4. **Back navigation**: Step 1 → back → return to step 0 with category preserved
5. **Dark mode**: All steps render correctly in both themes
6. **Reduced motion**: All animations respect `useReducedMotion()`
7. **Free tier**: Template import respects 3-habit server-side limit
8. **Run existing tests**: `npm test` should pass (no changes to AuthGate contract)
