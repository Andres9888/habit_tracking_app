# Plan: Replace Custom Paywalls with RevenueCat Native Paywall UI

## Context

The app has `react-native-purchases-ui@^9.7.1` installed but completely unused. Instead, three custom paywall components exist (~40 files total):
- `RevenueCatPaywall` (16 files) — main paywall with plan selector, hero, features list
- `PremiumPaywall` (20 files) — blur overlay variants for analytics/motivation
- `PaywallSheet` (4 files) — bottom sheet for templates screen

The RevenueCat native paywall is remotely configurable (no app update needed for design changes) and supports built-in A/B testing. Switching to it eliminates ~40 files of custom paywall UI code.

---

## Approach: Imperative `presentPaywall()` API

`react-native-purchases-ui` provides `RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier })` which returns a Promise resolving to `PURCHASED | RESTORED | CANCELLED | ERROR | NOT_PRESENTED`. This is **imperative** — no `paywallVisible` state or component rendering needed.

---

## Step 1: Create `useNativePaywall` hook

**New files:**
- `src/hooks/useNativePaywall/index.ts` — barrel export
- `src/hooks/useNativePaywall/useNativePaywall.ts` — main hook
- `src/hooks/useNativePaywall/presentNativePaywall.ts` — platform-guarded async function
- `src/hooks/useNativePaywall/types.ts` — type definitions

The hook:
1. Lazy-loads `react-native-purchases-ui` (same pattern as `src/lib/purchases/client.ts`)
2. On web/Expo Go → sets `webFallbackVisible` state instead (reuses existing `WebFallback`)
3. On native → calls `RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: 'premium' })`
4. Fires haptic feedback on success
5. Calls optional `onSuccess` callback
6. Logs analytics via `logInteraction`

```ts
// API shape
interface PresentOptions {
  source: string;           // e.g. 'habit_limit', 'templates_import'
  onSuccess?: () => void;   // called after PURCHASED or RESTORED
}

interface UseNativePaywallReturn {
  presentPaywall: (options: PresentOptions) => Promise<void>;
  webFallbackVisible: boolean;
  dismissWebFallback: () => void;
}
```

---

## Step 2: Refactor Habits screen (3 trigger points)

### `src/features/habits/useHabitsAppHandlers.ts`
- Remove: `paywallVisible` state, `handlePaywallClose`, `handlePaywallSuccess`
- Add: `presentPaywall` from `useNativePaywall` (either called internally or passed as param)
- `handleUpgradeIntent` → `presentPaywall({ source: 'home_hero' })`
- `handleUpgradeConfirm` → `presentPaywall({ source: 'home_prompt' })`
- `handleCreateHabitRequest` (limit hit) → remove `Alert.alert()`, call `presentPaywall({ source: 'habit_limit', onSuccess: openCreateHabitScreen })` directly

### `src/features/habits/components/HabitsAppOverlays.tsx`
- Remove: lazy `RevenueCatPaywall` import + `<Suspense>` render
- Remove: `paywallVisible`, `onPaywallClose`, `onPaywallSuccess` from props interface
- Add: `webFallbackVisible` + `onDismissWebFallback` props (for web platform)
- Render `WebFallback` component for web only (moved from RevenueCatPaywall/)

### `src/features/habits/HabitsApp.tsx`
- Remove: `handlers.paywallVisible`, `handlers.handlePaywallClose`, `handlers.handlePaywallSuccess` from `HabitsAppOverlays` props
- Wire `webFallbackVisible`/`dismissWebFallback` from the hook if web support needed

### `src/features/habits/postLaunchPreload.ts`
- Remove: `import('../../components/RevenueCatPaywall')` preload

---

## Step 3: Refactor Templates screen (2 trigger points)

### `src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts`
- Lines 45, 68-70: Replace `() => state.setShowPaywall(true)` with `() => { void presentPaywall({ source: 'templates_import' }) }` and `() => { void presentPaywall({ source: 'templates_premium_pack' }) }`
- Call `useNativePaywall()` inside this hook (or pass `presentPaywall` from parent)

### `src/screens/TemplatesScreen/TemplatesScreen.hooks.ts`
- Remove: `showPaywall` and `setShowPaywall` state (line 45)
- Remove from return object: `showPaywall`, `setShowPaywall`

### `src/screens/TemplatesScreen/components/TemplatesScreenModals.tsx`
- Remove: `PaywallSheet` import and rendering (line 50)
- Remove: `showPaywall`, `onClosePaywall` from props interface

### `src/screens/TemplatesScreen/hooks/useImportFeedback.ts`
- No changes needed — `onShowPaywall` callback signature stays `() => void`

---

## Step 4: Refactor Analytics screen (1 trigger point)

### `src/screens/AnalyticsScreen/hooks/useAnalyticsActions.ts`
- Remove: `showPaywall`/`setShowPaywall` state
- `handleExportPress`: Replace `setShowPaywall(true)` with `presentPaywall({ source: 'analytics_export' })`
- Remove: `handleStartTrial` (no longer needed)
- Add: call `useNativePaywall()` in this hook

### `src/screens/AnalyticsScreen/AnalyticsScreen.tsx`
- Remove: `PremiumPaywall` import and the early-return block (lines 56-65)
- For non-premium users: either auto-present paywall via `useEffect` or show a simple locked-state with CTA button that calls `presentPaywall`
- Remove: `showPaywall`, `setShowPaywall`, `handleStartTrial` from destructured hook values

---

## Step 5: Move WebFallback to shared location

- Move `src/components/RevenueCatPaywall/WebFallback.tsx` → `src/components/WebPaywallFallback.tsx`
- Update imports in `HabitsAppOverlays.tsx` (only place that still needs it for web)

---

## Step 6: Delete custom paywall components

After all trigger points are migrated:

| Directory | Files | Notes |
|-----------|-------|-------|
| `src/components/RevenueCatPaywall/` | 16 files | Delete entire directory (WebFallback already moved) |
| `src/components/PaywallSheet/` | ~4 files | Delete entire directory |
| `src/components/PremiumPaywall/` | ~20 files | Delete entire directory |

Also clean up:
- Related test files for deleted components
- Re-exports from `src/components/MotivationSystem/Premium/index.ts` if they reference deleted paywalls
- `src/screens/TemplatesScreen/data/paywallPerks.ts` (only used by PaywallSheet)

---

## Files Modified (Summary)

| File | Action |
|------|--------|
| `src/hooks/useNativePaywall/` (4 new files) | **Create** — shared hook wrapping RevenueCat UI |
| `src/components/WebPaywallFallback.tsx` | **Move** from RevenueCatPaywall/WebFallback.tsx |
| `src/features/habits/useHabitsAppHandlers.ts` | **Edit** — remove paywall state, use `presentPaywall` |
| `src/features/habits/components/HabitsAppOverlays.tsx` | **Edit** — remove RevenueCatPaywall rendering |
| `src/features/habits/HabitsApp.tsx` | **Edit** — remove paywall props |
| `src/features/habits/postLaunchPreload.ts` | **Edit** — remove paywall preload |
| `src/screens/TemplatesScreen/TemplatesScreen.hooks.ts` | **Edit** — remove showPaywall state |
| `src/screens/TemplatesScreen/hooks/useTemplatesScreenProps.ts` | **Edit** — wire presentPaywall |
| `src/screens/TemplatesScreen/components/TemplatesScreenModals.tsx` | **Edit** — remove PaywallSheet |
| `src/screens/AnalyticsScreen/hooks/useAnalyticsActions.ts` | **Edit** — remove paywall state |
| `src/screens/AnalyticsScreen/AnalyticsScreen.tsx` | **Edit** — remove PremiumPaywall |
| `src/components/RevenueCatPaywall/` (16 files) | **Delete** |
| `src/components/PaywallSheet/` (~4 files) | **Delete** |
| `src/components/PremiumPaywall/` (~20 files) | **Delete** |

---

## Verification

1. **Build check**: `npx expo start` — ensure no import errors after deletions
2. **Lint check**: `npm run lint:max-lines` — all new/edited files under 100 lines
3. **Habits screen**: Tap "Add Habit" with 3 habits → native RevenueCat paywall appears
4. **Habits screen**: Tap upgrade CTA → native paywall appears
5. **Templates screen**: Import template at limit → native paywall appears
6. **Analytics screen**: Non-premium user → paywall presented or locked-state shown
7. **Web platform**: Any paywall trigger → WebFallback modal appears (not native paywall)
8. **Purchase flow**: Complete purchase in native paywall → entitlements update, callbacks fire
9. **Cancel flow**: Dismiss native paywall → no errors, returns to previous screen
10. **Existing tests**: Run `npm test` — fix any broken imports from deleted components
