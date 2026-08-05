# SPEC: Readability Cleanup — Follow-ups

**Status:** Phases 1–2 and the `@expo/cli` item are **done** (branch `readability-followups`). The two remaining Phase 3 items (knip unused exports, `@/*` alias migration) are large separate initiatives — see the revised notes below; do not bundle them here.
**Origin:** Scoped 2026-07-04 from the code review of branch `codebase-readability-tips` (the dead-code sweep + 7-component decomposition, merged to `main` in commits `1dbf52d9`, `78b369b1`, `9d4028ab`, `62dc0f41`). Every file path and line reference below was verified against the tree at `62dc0f41`; re-grep if `main` has moved.

## Progress (2026-07-04, follow-up branch)

- **Phase 1 — done.** Motion values in ConflictNotification, WeekNavRow, and useHabitDayToggleAnimations now use `durations`/`enterEasing`/`exitEasing` (`@/theme/animations`) and `SCALE` (`@/constants/ui-values`). The RN-`Animated` easings in `useHabitDayToggleAnimations.helpers` were later tokenized via `Motion.easing.*` (`@/constants/motion`, which wraps RN's `Easing`) in the review-round follow-ups; only `HYDRATION_WINDOW_MS` and `FORGE_FLASH_MS` stay as documented local constants (not motion tokens).
- **Review-round follow-ups — done (PRs #1396–#1398 + this branch).** Restored the metro-referenced `reactNativeUrlPolyfillAuto.js` the knip sweep wrongly deleted (registered as a knip `entry`; `react-native-url-polyfill` declared as a direct dep); finished motion tokenization (`Motion.easing`/`Motion.duration`, added `breathing`/`inOutEase` tokens); inlined and deleted the single-consumer `ConflictNotification.constants.ts`; corrected the `useToastAnimations` docstring; and swept stale knip-ignore / tsconfig-exclude globs. The step-by-step "Phase 1" section far below is the **original plan** (e.g. it references `ConflictNotification.constants.ts`, now deleted) — retained for history, do not re-execute.
- **Phase 2 — done, via the lighter path, after evidence.** The full folder+barrel migration was **rejected**: the flat `X.tsx` + `X.hooks.ts` sibling pattern is already widespread (AnimatedHabitCard, PersonalBestsCard, SoundPicker, DetailCompleteButton, …), so wrapping the 7 components in folders would fight an established convention. The genuine wart was the three invented `*Parts/` folders (they exist nowhere else). Each was imported only by its own orchestrator, so its sub-components were moved up as **flat peers** of that orchestrator — the repo's dominant pattern — and their relative imports decremented one level. All three `*Parts/` folders are gone.
- **`@expo/cli` — done.** Removed as a redundant devDependency (`expo` provides the CLI and depends on it transitively); the lockfile was also re-synced with the previously-declared-but-unlocked expo modules.
- **knip unused exports — NOT done, and much larger than scoped.** A fresh `npx knip --exports` reports **1163** unused exports, not ~31: ~996 are `index.ts` barrel re-exports and ~122 are `default` exports. This is **not** a safe mechanical sweep — knip does not trace `React.lazy(() => import('./X'))` default-import usage, so removing a "unused" default export can break a lazy-loaded screen at runtime with a clean `tsc`. Treat as its own scoped initiative with per-export verification (grep for `lazy(`/dynamic imports and test usage before deleting each). Do not bulk-delete.
- **`@/*` alias migration — not started** (unchanged; separate initiative).

---

## Context

The readability branch removed ~420 knip-confirmed dead files, dropped two unused deps, and decomposed 7 oversized components into orchestrator + companion files. A follow-up review (`fix: restore RevenueCat SDK dependency + repair review fallout`, `62dc0f41`) already landed the must-fix items: the accidentally-uninstalled `react-native-purchases` SDK, the stale test suites, the duplicate `TemplatePreviewModal` companion files, and one hardcoded-motion cleanup.

What remains are three buckets of **non-blocking** work the review surfaced:

1. **Convention drift** — the new decompositions invented a flat-file + `*Parts/` layout that contradicts the `ComponentName/` folder + `index.ts` barrel + `components/` subfolder pattern documented in `CLAUDE.md` and used by the reference decompositions.
2. **Remaining hardcoded motion values** — three companion files still inline durations/easings/scales that exist as canonical theme tokens.
3. **Backlog** — knip's unused default exports, the `@expo/cli` devDependency question, the `@/*` import-alias migration, and a pre-existing test-infra gap for the e2e scenario suite.

## Verified facts the implementing agent must trust

- **The canonical decomposition layout is real and has prior art.** `src/components/FullsizeTemplatePreview/` and `src/components/ProgressSectionConsolidated/TodaysFocusCard/` both use: a `ComponentName/` folder containing `ComponentName.tsx` (orchestrator), flat `ComponentName.constants.ts` / `.styles.ts` / `.types.ts` siblings **inside that folder**, a `components/` subfolder for sub-components, an optional `hooks/` subfolder, and an `index.ts` barrel. `CLAUDE.md` → "Decomposition Quick Reference" prescribes the same.
- **The 7 new decompositions did NOT follow it.** They dropped flat files next to the component (e.g. `WeekNavRow.tsx`, `WeekNavRow.hooks.ts`, `WeekNavRow.types.ts` directly in `src/components/CalendarTimeline/components/`, no `WeekNavRow/` folder, no barrel) and put sub-components in three ad-hoc `*Parts/` folders. TemplatePreviewModal and SyncStatus used `components/` (correct) but still lack the folder+barrel wrapper.
- **The three `*Parts/` folders** are: `src/components/CalendarTimeline/components/WeekNavRowParts/`, `src/screens/CharacterScreen/components/CharacterCardParts/`, `src/screens/StrengthCurvePicker/StrengthBarHeroParts/`. No other `*Parts/` directory exists in `src/`.
- **The canonical motion tokens** live in `src/theme/animations.ts`: `durations.enter` (280), `durations.transition` (220), `durations.quick` (150), `durations.breathing` (1500), `enterEasing` (`Easing.out(Easing.cubic)`), `exitEasing` (`Easing.in(Easing.cubic)`). Press scales live in `src/constants/ui-values.ts` → `SCALE.pressLarge` (0.97), `SCALE.pressMedium` (0.95). These are plain numbers/values, usable with both reanimated and RN `Animated`.
- **`react-native-purchases` is now a direct dependency** (pinned `9.7.1`). Do NOT remove it — `src/lib/purchases/client.ts:45` `require()`s it at runtime and it is no longer pulled in transitively.

## Repo gotchas (violating any of these has bitten before)

- **`npm install` first** — Conductor worktrees ship incomplete `node_modules`; `npx eslint`/`tsc` fail with module-not-found until you do.
- **`tsc -p tsconfig.app.json` does not cover tests or e2e** — it excludes `**/tests/**` and `*.test.ts`. After any import/path change, also run the affected Jest suites; a green `tsc` is not sufficient proof.
- **Jest resolves `jest.mock('…')` and static `require('…')` paths at load time** — renaming or moving a module silently breaks any test that references the old path by string. Grep tests + `__mocks__` + e2e setup after every move.
- **Never prettier-write files you didn't otherwise touch** — the lint-staged pre-commit hook blocks unrelated formatting churn.
- **Motion tokens are values, not React** — importing `durations`/`enterEasing` into a `.constants.ts` is safe (no hook/JSX), so there is no render-time cost to centralizing them.

---

## Phase 1 — Centralize remaining hardcoded motion values

Low-risk, pure token substitution. No behavior change (the literals already equal the tokens).

**Files and exact edits:**

1. `src/components/SyncStatus/ConflictNotification.constants.ts:5` — `ANIMATION_DURATION = 280` → import and re-export/use `durations.enter` from `@/theme/animations`.
2. `src/components/SyncStatus/ConflictNotification.hooks.ts` (lines 33, 37, 52, 65) — the four `Easing.out(Easing.cubic)` / `Easing.in(Easing.cubic)` inline builds → `enterEasing` / `exitEasing`.
3. `src/components/CalendarTimeline/components/WeekNavRow.constants.ts` — line 14 `easing: Easing.in(Easing.cubic)` → `exitEasing`; lines 8–9 `pressScale: 0.97` / `0.95` → `SCALE.pressLarge` / `SCALE.pressMedium` from `@/constants/ui-values`.
4. `src/components/HabitChainVisualizer/useHabitDayToggleAnimations.helpers.ts` — durations `220` (line 83) → `durations.transition`, `150` (line 90) → `durations.quick`, `1500` (lines 103/109 and the `HYDRATION_WINDOW_MS` const line 3) → `durations.breathing`. Leave the `Easing.*.ease` easings that have no token as-is (only `Easing.out/in(Easing.cubic)` map to `enterEasing`/`exitEasing`).

**Verification:** `npx tsc -p tsconfig.app.json -noEmit` clean; `npx jest src/components/SyncStatus src/components/HabitChainVisualizer src/components/CalendarTimeline` no new failures; grep the four files for literal `280`/`220`/`150`/`1500`/`0.97`/`0.95`/`Easing.out(Easing.cubic)`/`Easing.in(Easing.cubic)` returns nothing (except the untokenized `.ease` easings).

## Phase 2 — Normalize the decomposition layout to the canonical pattern

Bring the 7 decompositions in line with `FullsizeTemplatePreview/` / `TodaysFocusCard/` and `CLAUDE.md`. Do this **one component at a time**, each as its own commit, verifying between.

For each of the 7 components (`WeekNavRow`, `ConflictNotification`, `CharacterCard`, `AttributeCard`, `StrengthBarHero`, `TemplatePreviewModal`, `useHabitDayToggleAnimations`):

1. Create a `ComponentName/` folder (for the hook, `useHabitDayToggleAnimations/`).
2. Move the orchestrator + flat `.hooks/.styles/.types/.constants` siblings into it.
3. Rename the `*Parts/` folder to `components/` (merging with any existing `components/`).
4. Add an `index.ts` barrel re-exporting the public surface, and update all external importers to import from the folder (barrel) rather than the internal files.
5. Use `git mv` so history follows, and update every `jest.mock`/`require`/import path — including tests, `__mocks__`, and `tests/e2e-scenarios/`.

**Decision to confirm before starting:** this is churn for consistency, not correctness. If the maintainer prefers, an acceptable lighter alternative is to **only** rename the three `*Parts/` → `components/` (item 3) and skip the folder+barrel wrapping — that removes the invented convention without a large move. Pick one and apply it uniformly.

**Verification per component:** `tsc` clean; the component's own suite + any suite that mocks it passes; `npm run lint:max-lines` still compliant; grep for the old paths returns nothing.

## Phase 3 — Backlog (each optional; confirm scope first)

- **knip unused default exports (~31 at last run).** Run `npx knip --no-progress` for the current list. These are `Name|default` "unused exports" entries, not unused _files_, so removing them is per-export judgment (some are public API kept intentionally). Triage, don't bulk-delete.
- **`@expo/cli` devDependency (`package.json:107`).** The original readability plan flagged it as possibly removable but never confirmed. Verify whether any script or `expo` invocation needs it before removing; `expo` CLI is normally provided by the `expo` package itself.
- **`@/*` import-alias migration.** Many of the touched files still use deep relative imports (`../../../theme/...`) alongside `@/`. A repo-wide normalization to the `@/` alias is a separate, mechanical initiative — scope and land on its own branch.
- **e2e scenario test-infra gap (pre-existing, not caused by this work).** `tests/e2e-scenarios/setup.scenarios.js` mocks many native modules but not `expo-task-manager`/`expo-background-task` (pulled in via `src/lib/offline/backgroundSync/registerBackgroundSync.ts`), and `src/features/habits/tests/HabitsApp.fab.test.tsx` fails on an unmocked `expo-av` (`ExponentAV`). Both fail on `main` too. If the scenario suite is meant to run in CI, add the missing mocks; otherwise document that it is opt-in.

## iOS native follow-up (must run on a Mac)

The dependency removal hand-edited `ios/Podfile.lock` and `ios/ChainDay.xcodeproj/project.pbxproj` to drop `RNPaywalls`/`RevenueCatUI` (CocoaPods cannot run in the Linux sandbox). Before the next iOS build, run `cd ios && pod install` on macOS and confirm it reports no changes / the lockfile round-trips cleanly. If `pod install` rewrites anything, commit the regenerated files.

---

## Verification (whole spec)

- `npx tsc -p tsconfig.app.json -noEmit` exits 0.
- `npm run lint:max-lines` reports compliant for all touched files.
- Jest failure count ≤ the post-merge baseline (no new failures introduced).
- `pod install` on macOS is clean (iOS follow-up).
- No file references a moved/renamed path (grep sweep after Phase 2).
