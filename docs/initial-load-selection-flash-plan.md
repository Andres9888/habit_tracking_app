# Fix Plan: Initial-Load Selection Flash (day shape / week bar flips after first paint)

**Status:** Implemented (2026-07-12). Zero-flash: wait for real `settings.get` only (no timeout defaults), dual gate (`AuthGate` + list skeleton), surfaces never paint appearance until preference exists.
**Symptom:** On cold start the habit list first paints one selection state (square day cells, week completion bar visible), then visibly flips to the user's actual saved selection (e.g. circle cells, no week bar) a moment later. The user should see exactly what they selected from the very first frame — no change in between.

---

## Root cause (verified 2026-07-12 against `main` @ 1364214ad)

Two independent defects stack:

### Defect A — divergent hard-coded fallback constants

Commit `740541e57` flipped the product default `DEFAULT_SETTINGS.dayShape` from `'square'` to `'circle'` in `convex/settings/types.ts:35`, but the client still hard-codes `'square'` as the loading-state fallback in **five** places:

| #   | Site                                                                                   | Current code                        |
| --- | -------------------------------------------------------------------------------------- | ----------------------------------- |
| 1   | `src/features/habits/hooks/useHabitsListState.ts:162`                                  | `settings?.dayShape ?? 'square'`    |
| 2   | `src/features/habits/hooks/useHabitRenderItem.tsx:16`                                  | param default `dayShape = 'square'` |
| 3   | `src/features/habits/components/HabitsModals/SettingsModalSection.tsx:155`             | `settings?.dayShape ?? 'square'`    |
| 4   | `src/components/BinaryHeatmap/MonthlyCalendarGrid/useMonthlyCalendarGridDisplay.ts:31` | `settings?.dayShape ?? 'square'`    |
| 5   | `src/screens/HabitDetailScreen/components/YearStrip.tsx:36`                            | `settings?.dayShape ?? 'square'`    |

Additionally one fallback is **inverted** relative to the default:

| #   | Site                                                  | Current code                              | `DEFAULT_SETTINGS` value |
| --- | ----------------------------------------------------- | ----------------------------------------- | ------------------------ |
| 6   | `src/features/habits/hooks/useHabitsListState.ts:167` | `settings?.showWeekCompletionBar ?? true` | `false`                  |

So while `settings.get` is still `undefined`, the list paints square cells **plus** a week completion bar; when the query resolves (server merges `DEFAULT_SETTINGS` in `convex/settings/getResponse.ts`, so it always returns concrete values), both flip. Meanwhile `useHabitsSettings.ts:40` and `SettingsModal.hooks.ts:55` fall back to the whole `DEFAULT_SETTINGS` object (`dayShape: 'circle'`) — so different surfaces can even disagree with each other during the same loading window.

### Defect B — first paint is not gated on settings existing

There _is_ a cold-start gate: `src/components/auth/AuthGate.tsx:64` holds `BrandedLoadingScreen` until `useQueryCacheHydrated()` is true. But `QueryCacheProvider` (`src/providers/QueryCacheProvider/QueryCache.provider.tsx:26`) marks hydrated when `hydrateQueryCache(scope)` **finishes** — an empty cache "hydrates" instantly and the gate opens with `settings === undefined`. The gate guarantees _the cache was read_, not _a settings value exists_.

Windows where the cache has no `settings.get` row and the flash is guaranteed:

1. Fresh install / first launch after onboarding.
2. Sign-out → sign-in (scope change calls `resetQueryCache()`, wiping memory + hydrated flag; new scope has no persisted rows yet).
3. Cache entry `version` bump (`src/lib/queryCache/registry.ts:32`, currently `version: 1`, storage `'secure'`).
4. Secure-storage read miss/failure (`src/lib/offline/persistence/offlineStorage.ts` → Keychain/Keystore via `sensitiveStorage`).

On a warm start with an intact persisted row, `useCachedQuery` returns the cached settings on the first app frame (resolution order live → previousLive → cached, `src/lib/queryCache/hooks/resolveCachedValue.ts`) and there is no flash. All `settings.get` consumers already go through `useCachedQuery` (verified — no plain `useQuery(api.settings.get)` anywhere).

---

## Step 0 — Diagnostic (do this before fixing)

The fixes below are correct regardless, but if the reporter sees the flash on _every_ cold start (not just fresh installs), the persisted row may be missing entirely — that would point at secure-storage write/read failing on this device/build. Verify:

1. Launch app warm (second+ launch, signed in), watch Metro logs for `[queryCache] persist failed` (`src/lib/queryCache/persistence/writeEntry.ts:42`).
2. Temporarily log the hydration result in `hydrateQueryCache` (`src/lib/queryCache/hydrate.ts:24`): does a `settings.get` row come back with a value?
3. If the row is absent on warm starts, fix persistence first (likely `sensitiveStorage` failing in the dev client) — then still implement Fix 1 + Fix 2.

Beware two known false-repro traps (from project history): a stale dev-client instance showing a 17h-old bundle (terminate + relaunch `com.chainday.app` after installing), and a sibling worktree's Metro hijacking the installed app — verify the bundle you're testing is the one you built.

## Fix 1 — single source of truth for loading-state fallbacks (small, mechanical)

Replace every inline literal fallback with a reference to `DEFAULT_SETTINGS` from `convex/settings/types.ts`:

- Sites 1, 3, 4, 5: `settings?.dayShape ?? DEFAULT_SETTINGS.dayShape`
- Site 2 (`useHabitRenderItem.tsx:16`): default the param to `DEFAULT_SETTINGS.dayShape` (or make it required and pass from the caller, which already resolves it).
- Site 6: `settings?.showWeekCompletionBar ?? DEFAULT_SETTINGS.showWeekCompletionBar`
- While there, sweep `useHabitsListState.ts:158-169` — the other fallbacks currently happen to match `DEFAULT_SETTINGS` but should reference it so they can't drift again. Same for `useMonthlyCalendarGridDisplay.ts:32` (`connectorStyle ?? 'full'`) and `useHabitsSettings.ts:48-51`.

This alone removes the flash for every user whose saved selection equals the current default, and removes the surface-vs-surface disagreement. It does **not** fix users whose saved value differs from the default (square-selecting user on a fresh cache still sees circle → square). That's Fix 2.

## Fix 2 — settings-readiness gate on first paint (the real fix)

Extend the existing cold-start gate so the loading screen holds until `settings.get` has a **value** (cached or live), not merely until hydration finished.

Design requirements (each one guards against a specific failure mode):

1. **Subscribe at gate level.** The settings query must be mounted _while the loading screen shows_, otherwise the gate deadlocks waiting for a query nobody is running. Concretely: a small hook (e.g. `useSettingsReady()`) called inside `AuthGate` that runs `useCachedQuery(api.settings.get, {}, { entryName: 'settings.get' })` and returns `value !== undefined`. Convex's client dedupes the subscription with the app-tree consumers, so this costs nothing extra.
2. **Only gate when it can matter.** Add `isSettingsReady` to `shouldShowLoadingScreen` (`AuthGate.tsx:37-59`) only for the signed-in, onboarding-complete path — welcome/onboarding screens don't render settings-dependent selections.
3. **Bound it.** Add a timeout fallback (~2.5s via `useEffect` timer) that force-opens the gate with defaults. Rationale: offline fresh install (no cached row, no server) must not hang on the splash. Offline _returning_ users have a cached row and open instantly; brand-new users have no saved selection, so painting defaults is not a perceived flip.
4. **Don't regress warm start.** With an intact cache, `useCachedQuery` returns the persisted row synchronously post-hydration — the gate adds 0 extra frames. Cold start with empty cache waits one settings round-trip (small payload, typically well under the timeout).

Note: `useOnboardingV2Complete` and `usePremium` already impose similar readiness waits in this gate, so this follows the established pattern.

## Explicitly out of scope

- Do not touch entitlement/premium logic while in `AuthGate` (`hasPremium` is webhook-only; never add client-writable entitlement paths).
- Do not "fix" cross-device flips (setting changed on another device arriving mid-session) — that's sync working as intended.
- Do not add per-component loading skeletons for settings; the single gate is the chosen design.

## Verification checklist (implementing session)

1. `npx tsc --noEmit` — the reliable gate in this repo (jest is ~17% red from RN mock env; don't chase it).
2. `npm run lint` — note `react/jsx-no-leaked-render` is at **error** severity: use `cond ? <X/> : null`, never `&&`. `npm run lint:max-lines` — files must stay ≤100 lines; if `AuthGate.tsx` (100 lines now) grows, extract the readiness hook to its own file.
3. Sim scenarios (in order of importance):
   a. **Warm start, saved `dayShape: 'square'`** → first painted list frame shows squares, no flip (record with sim video; single-frame check).
   b. **Fresh cache** (delete + reinstall, or sign out/in), saved `'square'` on server → loading screen holds briefly, first list frame shows squares. No circle frame ever.
   c. **New user** → defaults paint (circles), no flip.
   d. Toggle `showWeekCompletionBar` off → cold start never shows the bar momentarily.
4. Sim-verify traps (project history): stale main-repo Metro on 8081 serving an old bundle, sibling worktrees re-hijacking the installed app, dev client needing terminate+relaunch. If the fix "doesn't work," verify bundle provenance before debugging code.

## File map (everything the implementer needs)

- `convex/settings/types.ts` — `DEFAULT_SETTINGS` (source of truth)
- `convex/settings/getResponse.ts` — server merges defaults into every response
- `src/features/habits/hooks/useHabitsListState.ts:148-169` — main consumer + divergent fallbacks
- `src/features/habits/hooks/useHabitsSettings.ts:40` — whole-object `DEFAULT_SETTINGS` substitution
- `src/components/auth/AuthGate.tsx` — the gate to extend
- `src/providers/QueryCacheProvider/QueryCache.provider.tsx` — hydration lifecycle + scope reset
- `src/lib/queryCache/` — `hydrate.ts`, `hooks/useCachedQuery.ts`, `hooks/resolveCachedValue.ts`, `registry.ts` (settings entry line 32), `persistence/writeEntry.ts`
- Fallback sites: see tables in Root cause section above
