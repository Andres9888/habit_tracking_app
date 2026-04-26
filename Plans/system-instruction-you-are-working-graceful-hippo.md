# Plan — Move from 3-habit free cap to "free trial with all features"

## Context

Today, free users are capped at 3 active habits and the server blocks creation past that. The user wants to flip the model: **everyone gets full access during a free trial, then the paywall locks the entire app**. The RevenueCat-backed paywall, trial detection, and webhook→Convex sync are all already wired — they just don't gate the app entry. This plan rewires the gate point and rips out the 3-habit cap.

## Defaults I'm assuming (call these out if wrong)

- **Paywall UI:** existing `src/components/RevenueCatPaywall/` — already styled, has Monthly/Annual selector, "Start Free Trial — [Plan]" CTA, restore link.
- **Trial mechanism:** **RevenueCat-managed** (no app-side day counter). Trial duration is configured in the App Store Connect / Play Console offering, not in code. The SDK already returns `periodType === 'TRIAL'` and `expirationDate`; the Convex webhook handler already sets `userSettings.hasPremium = true` for trialing users (`convex/subscriptions.ts:116`). So "trial active" === "premium active" for gating purposes — no server change needed there.
- **Gate placement:** Hard gate at `AuthGate`, **after onboarding completes**, **before the main app**. User must subscribe or start trial to enter.
- **Trial-end behavior:** When `hasPremium` flips to `false` (RevenueCat EXPIRATION webhook), the same gate re-engages on next app open.

## Open questions worth deciding before execution (I'll proceed with the marked default if you don't object)

1. **Existing free users with active app data** — do they hit the hard paywall on next launch? **Default:** yes, treat them like everyone else (cleanest, but it's a UX cliff for the current cohort).
2. **Should the gate be dismissible?** **Default:** no — hard gate, no close button when used as the AuthGate barrier. (The same `RevenueCatPaywall` component stays dismissible everywhere else it's used today via a new prop.)
3. **MonetizationHero / UsageBanner / TrialPromptModal** — these exist because of the 3-habit model + "first-habit prompt" flow. Should I delete or repurpose? **Default:** **leave them in place, unwired** — per the surgical-fixes rule. Flag for follow-up cleanup once we confirm the new gate works in production.

## Changes

### 1. Branch rename (do first)

```
git branch -m free-trial-paywall
```

### 2. Server: remove 3-habit cap on creation

**File:** `convex/habits/create.ts`
- Delete line 13 (`const FREE_HABIT_LIMIT = 3;`).
- Delete lines 38–45 (the `activeHabits` filter, `isPremiumUser` check, and error throw). Keep `allHabits.collect()` — it's still needed for `findMaxOrder` on line 47.
- Delete the now-unused `hasPremiumAccess` import on line 10.

**Files NOT touched (intentional):**
- `convex/habits/archive.ts:50` and `convex/habits/batchArchive.ts:61` use `isPremiumUser` for archive-related logic, not the 3-habit cap. Leaving alone.
- `convex/templates/importTemplate.ts:49` uses `isPremiumUser` for premium template gating — separate concern.

### 3. Make `RevenueCatPaywall` support a non-dismissible "gate" mode

**File:** `src/components/RevenueCatPaywall/types.ts` — add optional prop:
```ts
dismissible?: boolean; // default true — when false, hide close button and disable onRequestClose
```

**File:** `src/components/RevenueCatPaywall/RevenueCatPaywall.tsx`
- Plumb `dismissible` through `PaywallContent`.
- When `dismissible === false`: pass a no-op to `<Modal onRequestClose>`, and don't render `<PaywallHeader>` (which contains the close X), or pass a `hideClose` flag down to it.

This preserves every current call site (which doesn't pass `dismissible`, so default `true` keeps the X visible).

### 4. AuthGate: insert paywall step between onboarding and main app

**File:** `src/components/auth/AuthGate.tsx`
- Import `usePremium` and `RevenueCatPaywall`.
- Extend `getScreenKey` (line 29) to a 4-state machine: `'welcome' | 'onboarding' | 'paywall' | 'app'`.
  - `!isSignedIn` → `'welcome'`
  - `!onboardingComplete` → `'onboarding'`
  - `!isPremium` (RevenueCat says no entitlement, neither active nor trial) → `'paywall'`
  - else → `'app'`
- Add an `Animated.View` block for `screenKey === 'paywall'` rendering `<RevenueCatPaywall visible dismissible={false} onPurchaseSuccess={...} />`. After purchase or restore, the `usePremium` hook re-derives `isPremium === true` and the gate falls through to `'app'`.
- Add a loading guard so the paywall doesn't flash before RevenueCat resolves `customerInfo` — extend the existing `if (!isLoaded || ...)` check on line 53 to also wait on `usePremium().isLoading`.

### 5. Client: rip out the 3-habit cap UI plumbing

**File:** `src/constants/app.ts` — delete `FREE_HABIT_LIMIT` (line 71–72) and update `src/constants/index.ts` to drop the re-export.

**File:** `src/features/habits/hooks/useHabitsListState.ts`
- Delete the import on line 39.
- Delete `habitSlotsUsed` derivation (line 272–274) and `hasReachedHabitLimit` (line 275–276).
- Drop `freeHabitLimit`, `habitSlotsUsed`, `hasReachedHabitLimit` from the return on lines 392, 396, 406.

**File:** `src/features/habits/hooks/habitsListState.types.ts` — remove the three field types.

**Downstream consumers** that read those three fields will type-error. Each must either lose the prop or become a no-op:
- `src/features/habits/HabitsApp.tsx`
- `src/features/habits/useHabitsAppHandlers.ts`
- `src/features/habits/components/HabitsList/MonetizationHero/MonetizationHero.tsx` + `.types.ts` + `useMonetizationAnimations.ts`
- `src/screens/TemplatesScreen/components/UsageBanner/UsageBanner.tsx` + `.hooks.ts` + `.types.ts`
- `src/screens/TemplatesScreen/hooks/useImportFeedback.ts`
- `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx` + `.hooks.ts`

**Approach (per surgical-fixes rule):** for each file, the smallest change that makes types pass — usually deleting the prop or replacing with a constant. **Do NOT delete the components themselves**, even if they become visually empty. Tag them with a `// TODO: cap-removal` comment and surface the list at the end of execution for a separate cleanup PR.

### 6. Verification

After implementing:

1. **Type check & lint:**
   ```
   npx tsc --noEmit
   npm run lint
   ```
2. **Server check (Convex):** `npx convex dev --once` — make sure `habits/create` still compiles.
3. **Manual flow on simulator** (RevenueCat sandbox):
   - **New user, no trial:** sign up → onboarding completes → paywall appears, **no close X visible**, can't swipe to dismiss → tap "Start Free Trial — Monthly" → sandbox completes → paywall vanishes → land in app → create 5+ habits, none blocked.
   - **Trial active:** force-quit + relaunch → land directly in app, no paywall flash.
   - **Trial expired:** in App Store Connect sandbox, accelerate expiration → relaunch → paywall reappears, hard-gated.
   - **Restore purchases:** on the gate paywall, hit "Restore" with a known active account → entitlement returns → paywall vanishes.
4. **Web build:** `npm run web` — `RevenueCatPaywall` already has a `WebFallback`; verify the gate doesn't softlock the web target.
5. **Critical regression check:** confirm habits list, archive, templates screens still render — they reference `hasReachedHabitLimit` today.

## Files modified (summary)

- `convex/habits/create.ts` (cap removal)
- `src/components/RevenueCatPaywall/types.ts` (new prop)
- `src/components/RevenueCatPaywall/RevenueCatPaywall.tsx` (gate mode)
- `src/components/RevenueCatPaywall/PaywallHeader.tsx` (hide-close support if needed)
- `src/components/auth/AuthGate.tsx` (4-state gate)
- `src/constants/app.ts` + `src/constants/index.ts` (delete cap constant)
- `src/features/habits/hooks/useHabitsListState.ts` + `.types.ts` (rip cap state)
- ~8 downstream consumer files (smallest-diff prop removal)

## Files deliberately NOT modified

- `src/components/TrialPromptModal/*` — leave the "first habit triggers trial prompt" flow alone. With the gate at AuthGate, this prompt becomes redundant but harmless. Tag for cleanup PR.
- `src/components/MonetizationHero/*` — same.
- `src/screens/TemplatesScreen/components/UsageBanner/*` — same: prop becomes meaningless, but the component stays per surgical-fixes rule.
- All `convex/habits/archive.ts`, `batchArchive.ts`, `templates/importTemplate.ts` premium checks — orthogonal concerns.
