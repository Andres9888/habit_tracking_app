# Spec: Kill the cold-start "circle flash" on habit cards

**Status:** Ready for implementation
**Date:** 2026-07-11
**Symptom:** On initial app load, habit card day markers paint as **circles** for ~0.4–1s, then snap to **squares** (the user's persisted preference). Confirmed via frame extraction on Jul 10.

---

## Root cause (verified against current `main` @ 1364214ad)

1. **Server fabricates defaults when unauthenticated.**
   `convex/settings/settings.ts:17-34` (`settings.get`): when `ctx.auth.getUserIdentity()` returns null (which it does during the auth handshake window on _every_ cold start), `settings` stays undefined and the handler returns `toSettingsResponse(undefined)` — a **complete defaults payload**, including `dayShape: 'circle'`. The client cannot distinguish this from a real user preference.

2. **The default flip exposed it.**
   Commit `740541e57` (Jul 9) flipped `DEFAULT_SETTINGS.dayShape` from `'square'` to `'circle'` in `convex/settings/types.ts:35` ("Chain is now the default" — deliberate product intent for NEW users; do **not** revert). Before the flip, the pre-auth defaults response was indistinguishable from a square user's preference, so the bug was invisible.

3. **Cache poisoning makes it persistent.**
   `settings.get` is a persisted query-cache entry (`src/lib/queryCache/registry.ts:32`, `storage: 'secure', version: 1`) hydrated at cold start by `src/lib/queryCache/hydrate.ts`. If a pre-auth defaults response ever gets written into that entry, the _hydrated first paint_ on subsequent cold starts shows circles even before any network response arrives.

**Non-causes (verified — don't chase these):** every client-side `dayShape` fallback is already `'square'` (`useHabitsListState.ts:162`, `useMonthlyCalendarGridDisplay.ts:31`, `YearStrip.tsx:36`, `DraggableHabit.tsx:53`, `useHabitRenderItem.tsx:16`, `SettingsModalSection.tsx:155`, `SettingsMainView.renderContent.tsx:39`). The circle can ONLY come from a server-resolved response (live pre-auth, or a cached copy of one).

---

## Fix design

### F1 — `settings.get` returns `null` when unauthenticated (server)

In `convex/settings/settings.ts`, when `identity` is null, return `null` instead of `toSettingsResponse(undefined)`.

- Update `settingsReturnValidator` (`convex/settings/validators.ts`) to a union with `v.null()`.
- The primary client consumer already normalizes: `const settings = (settingsQuery ?? undefined)` at `src/features/habits/hooks/useHabitsListState.ts:155` — null flows into the existing `?? 'square'` fallbacks. **Audit every other `api.settings.get` consumer** (`rg -n "api.settings.get" src/`) and make sure each treats null like undefined (loading), not as a crash or a defaults object.
- Keep the existing behavior for an authenticated user with no settings doc: still return `toSettingsResponse(undefined)` (defaults, circle) — that's the legitimate new-user case and preserves the "Chain is default" product intent.

### F2 — Never persist a null/pre-auth response into the query cache (client)

In the `useCachedQuery` / query-cache persistence path (`src/lib/queryCache/persistence/writeEntry.ts` and the hook layer in `src/lib/queryCache/hooks/`):

- A `null` result from `settings.get` must **not** overwrite the persisted cache entry or the in-memory `:latest` slot. It should be treated as "still loading" so the hydrated (real) value keeps painting.
- Verify how the store handles a live `null` arriving after hydration — the hydrated square response must not be clobbered by a transient null. Check `queryCacheStore.set` semantics in `src/lib/queryCache/store/`.

### F3 — Invalidate already-poisoned caches (client, one line)

Bump the `settings.get` registry entry version `1 → 2` in `src/lib/queryCache/registry.ts:32`. Existing installs with a poisoned circle-defaults entry get a clean slate; first post-fix cold start hydrates nothing for settings (falls back to `'square'` client defaults — acceptable, matches pre-auth reality) and re-persists the authenticated response.

### Explicitly out of scope

- Do NOT revert `DEFAULT_SETTINGS.dayShape` to `'square'`.
- No backfill/migration of existing `userSettings` docs.
- Don't touch the AuthGate hydration latch (`markQueryCacheHydrated` machinery) — it works; this bug is upstream of it.

---

## Acceptance criteria

1. `tsc` exit 0 (`npx tsc --noEmit`); no new failures in `npx jest src/lib/queryCache` (note: broader jest suite has known pre-existing RN-mock failures — only queryCache + settings-adjacent suites must be green).
2. Convex codegen/validators consistent: `settings.get` return type is `Response | null` and every consumer compiles + handles null.
3. Unit test added: `toSettingsResponse`/handler-level test asserting unauth → null (or hook-level test asserting null result never writes to cache — whichever layer is testable in this repo's setup).
4. Cache-write guard test: a `null` live value does not overwrite a hydrated non-null `settings.get` entry.
5. Behavior (to be sim-verified after implementation — implementer documents steps, main-session will run them):
   - Cold start with persisted `dayShape:'square'`: first painted frame of habit cards shows **squares**; no circle frame at any point (video → `ffmpeg fps=10` frame extraction).
   - Fresh new user: cards show circles (Chain default) — unchanged.
   - Warm one session before judging, then verify across 3 cold starts (poisoned-cache heal takes one session).

## Verification protocol notes (from prior debugging of this exact area)

- Sim-verify from the **main repo** checkout; kill any sibling Metro first (`lsof -ti:8081`), start `npx expo start --port 8081 --clear`, confirm the bundle request appears in _this_ Metro's log before trusting what's on screen (sibling-Metro hijack has caused false "still broken" reports twice).
- First cold start after the fix may still flash once (stale poisoned cache); judge from the second cold start onward.
