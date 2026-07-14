# Implementation Plan

<!-- Mission: cold-open Settings + Habit Library, Advanced Options alignment, release readiness -->

## END_RESULT

ChainDay cold-opens Settings and Habit Library with immediate shell feedback, keeps demand-driven data loading, and shows a non-clipping Strength Curve summary on iPhone 16 Pro Max. Release readiness items (auth, RevenueCat, reminders, storage, Sentry advanced monitoring) stay closed.

### Acceptance Criteria

- [x] AC1: Cold Settings tap paints a full-screen Settings shell before lazy modules resolve; content-ready timing uses derived loading state.
- [x] AC2: Cold Habit Library tap paints full-screen library chrome (`TemplatesModalFallback`) before lazy modules resolve; click-to-visible is instrumented.
- [x] AC3: Settings secondary views (Archived / Account / Calendar Look) lazy-load only when opened.
- [x] AC4: Habit Library catalog first paint uses memoized section mapping, bounded SectionList virtualization, and deferred science drawer content.
- [x] AC5: Advanced Options Strength Curve summary shows `Growth rate` + `Average · +3% per check-in` without clipping the chevron.
- [x] AC6: Sentry replay/profiling/logs are env-gated with privacy-sensitive capture surfaces disabled by default.
- [x] AC7: RevenueCat v10 and Convex 1.42 evaluation notes are recorded; existing native/CocoaPods caveats remain documented.

## Phase 1 — Settings Cold-Open

- [x] Add Settings open timing marks (tap / state / first-visible / content-ready)
- [x] Replace Settings `fallback={null}` with `SettingsModalLoadingFallback`
- [x] Lazy-load Archived / Account / Calendar Look secondary views
- [x] Keep Settings module prewarm in post-home secondary preload tier

## Phase 2 — Habit Library Cold-Open

- [x] Add Habit Library click-to-visible instrumentation
- [x] Warm Templates paths after home readiness (frequent idle tier)
- [x] Full-screen `TemplatesModalFallback` while lazy import resolves
- [x] Memoize catalog sections + virtualize SectionList; defer science content until expanded

## Phase 3 — Advanced Options Alignment

- [x] Strength Curve toggle text wraps/stacks so value never clips chevron
- [x] Toggle row aligns icon/chevron with multi-line text stack

## Phase 4 — Release Monitoring & SDK Notes

- [x] Sentry replay/profiling/logs opt-in env flags + privacy review doc
- [x] RevenueCat v10 + Convex 1.42 evaluation notes in AGENTS / plan

## Validation Notes

- Focused Jest for Settings shell, templates fallback, timing, catalog, and Sentry.
- Runtime cold-launch device timing may still need a local simulator/device pass.
- CocoaPods SPM post-install hook and Convex `habits.js:archive` codegen conflict remain pre-existing environment blockers.
