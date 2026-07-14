# Implementation Plan

## END_RESULT

After this ships, the first Habit Library open after a cold launch presents visible full-screen library chrome immediately, then fills in cached or live catalog content without blocking the tap path; the Advanced Options Strength Curve row also fits cleanly on iPhone 16 Pro Max with the Growth rate and Average value balanced instead of clipped.

### Acceptance Criteria

- [ ] AC1: From a cold app launch, tapping the home Habit Library button shows visible library UI or skeleton chrome on the first frame instead of a blank/null lazy-loading gap.
- [ ] AC2: `templates.list` and `templates.getImportedTemplateIds` keep using the existing query-cache/warmup path, with no duplicate cache layer and no added startup subscription before the home screen is ready.
- [ ] AC3: The active Templates catalog path renders the first screen with bounded work: memoized section derivation, conservative `SectionList` virtualization, and collapsed row details not mounted until needed.
- [ ] AC4: In the Create Habit Advanced Options card on iPhone 16 Pro Max, the Strength Curve summary displays `Growth rate` and `Average · +3% per check-in` without horizontal clipping or chevron overlap, while Streak Goal and Growth Icons remain visually aligned.
- [ ] AC5: Relevant focused tests/static checks pass, and the final report includes measured click-to-visible timing where runtime tooling is available or clearly labels any remaining proof as static-only.

## Phase 1 - Habit Library Cold-Open + Advanced Options Alignment

- [x] Add click-to-visible instrumentation around `src/features/habits/components/BottomActionBar/BottomActionBar.tsx`, `src/features/habits/hooks/buildModalsStateReturnValue.ts`, and `src/features/habits/components/HabitsModals/TemplatesModalSection.tsx`, reusing existing performance utilities where possible; capture first visible modal/skeleton timing before changing behavior. [wave:1]
- [x] Tighten the existing post-launch preload path in `src/features/habits/postLaunchPreload.ts` and related tests so `HabitsAppOverlays`, `TemplatesModalSection`, and `TemplatesScreen` are warmed after home readiness without delaying the initial app frame; keep `useTemplatesWarmup.ts` bounded by online/non-expensive/freshness checks. [wave:1]
- [ ] Make `src/features/habits/components/HabitsModals/SecondaryModalSections.tsx` and `TemplatesModalSection.tsx` show an immediate full-screen Habit Library fallback using the existing `TemplatesLoadingState` while lazy imports or cached queries resolve, so the tap never waits on a null Suspense fallback. [needs:postLaunchPreload]
- [ ] Reduce first-render catalog work in `src/screens/TemplatesScreen/views/CatalogSectionList.tsx` and `src/screens/TemplatesScreen/components/ExploreAllSection/TemplateReadRowDrawer.tsx`: memoize section mapping/render callbacks, add conservative `SectionList` batching/window props, and defer collapsed drawer/science content until expansion. [wave:1]
- [ ] Fix the iPhone 16 Pro Max Advanced Options clipping in `src/components/AdvancedOptions/StrengthCurveToggleText.tsx` and `StrengthCurveToggleRow.tsx` by stacking or wrapping the value under `Growth rate` with stable min-width/flex rules; only adjust `AdvancedOptionsSection.tsx` padding if the row still feels cramped against the reference image. [wave:1]
- [ ] Add focused regression coverage: update `src/features/habits/__tests__/overlayStartup.performance.test.ts`, `src/features/habits/hooks/__tests__/useTemplatesWarmup.test.tsx`, `src/screens/TemplatesScreen/__tests__/useWarmTemplatesCache.test.tsx`, Templates catalog performance tests, and a Create Habit/Advanced Options render test covering the uncut Strength Curve value. [needs:all implementation tasks]
- [ ] Verify with `git diff --check`, focused Jest for the touched tests, `tsc -p tsconfig.app.json --noEmit --pretty false` where available, and a cold-launch runtime check on iPhone 16 Pro Max or simulator; report before/after click-to-visible timing or explicitly state if runtime measurement was blocked. [needs:tests]
