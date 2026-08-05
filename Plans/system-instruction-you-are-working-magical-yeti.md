# Remove Onboarding (Temporarily)

## Context
The user wants to remove onboarding "for now" — they want signed-in users to skip the OnboardingFlowV2 (Chain Builder) and go straight from auth → paywall/app. The phrasing "for now" implies this is reversible, so we keep the onboarding-v2 source tree intact and only bypass the gate. Reversal = revert this commit.

## Approach
Surgical change to **one file**: `src/components/auth/AuthGate.tsx`. Strip the onboarding branch from the screen-key logic and stop rendering `OnboardingFlowV2`. Leave `src/screens/onboarding-v2/` and `src/screens/onboarding/` untouched on disk so the feature can be restored cleanly.

## Files to modify

### `src/components/auth/AuthGate.tsx`
Changes:
1. **Remove import** of `OnboardingFlowV2` and `useOnboardingV2Complete` (lines 22–24).
2. **Remove hook call** (lines 49–51): `const { complete: onboardingComplete, markComplete } = useOnboardingV2Complete(...)`.
3. **Drop `'onboarding'` from `ScreenKey`** type (line 33) → `'welcome' | 'paywall' | 'app'`.
4. **Simplify `getScreenKey`** (lines 35–43) to drop the `onboardingComplete` parameter and the `if (!onboardingComplete) return 'onboarding'` line.
5. **Update `isWaitingForPremium`** (lines 73–76) to remove the `onboardingComplete === true` clause.
6. **Update the loading guard** (lines 78–84) to remove `(isSignedIn && onboardingComplete === null)`.
7. **Update `getScreenKey` call** (lines 86–90) to drop the `onboardingComplete` argument.
8. **Remove the `screenKey === 'onboarding'` render branch** (lines 102–109).
9. **Update the doc comment** (lines 1–9) to drop the onboarding line.

Net effect: signed-in user → paywall (if no entitlement) or app (if entitled). Same as before, minus the onboarding step.

## Files NOT touched (intentional)
- `src/screens/onboarding-v2/**` — kept on disk for easy restoration.
- `src/screens/onboarding/**` — already unused; leave alone.
- AsyncStorage keys (`@chainday_onboarding_v2_*`) — leave existing values on user devices; they're harmless.
- Convex schema / `userSettings` — no onboarding fields to clean up.

## Verification
1. **TypeScript**: `npx tsc --noEmit` — no unused-import or type errors.
2. **Lint**: `npm run lint -- src/components/auth/AuthGate.tsx`.
3. **Runtime smoke**: start the Expo dev server (`npm start`), sign out, sign back in. Confirm:
   - Signed-out users see WelcomeScreen.
   - After sign-in (with no entitlement): paywall appears, NOT the chain-builder onboarding.
   - After sign-in (with entitlement): goes straight to HabitsApp.
4. **Reversal sanity**: `git show HEAD -- src/components/auth/AuthGate.tsx` should show a tight diff confined to that single file, easy to revert later.

## Out of scope
- Deleting onboarding source files. (User said "for now" — keep restorable.)
- Touching memory notes about Onboarding-V2 branch state. They remain accurate as historical context.
- Modifying `WelcomeScreen` or auth flow.
