---
task: Fix sticky header toggle in settings panel
slug: 20260310-210000_fix-sticky-header-toggle-settings
effort: standard
phase: complete
progress: 8/8
mode: interactive
started: 2026-03-10T21:00:00-07:00
updated: 2026-03-10T21:01:00-07:00
---

## Context

The "Sticky calendar header" toggle in the Settings panel didn't disable the sticky header behavior. The setting was properly stored and toggled but `useStickyHeader()` never read the setting.

### Root Cause
`useStickyHeader()` always enabled sticky behavior based on scroll position with no way to disable it.

### Risks
- None materialized

## Criteria

- [x] ISC-1: `useStickyHeader` accepts an `enabled` parameter
- [x] ISC-2: When enabled=false, stickyProgress stays at 0 regardless of scroll
- [x] ISC-3: When enabled=true, sticky behavior works as before (scroll-driven)
- [x] ISC-4: `HabitsListContent` reads stickyCalendarHeader from props.modals.settings
- [x] ISC-5: `HabitsListContent` passes the setting value to `useStickyHeader`
- [x] ISC-6: Default value for enabled is true (backwards compatible)
- [x] ISC-7: TypeScript compiles with no errors on modified files
- [x] ISC-8: No other files need changes (surgical fix)

## Decisions

- Used `?? true` to default to sticky enabled when settings haven't loaded yet

## Verification

- Read both modified files — changes are minimal and correct
- TypeScript check shows no new errors from the changes
- Logic verified: `enabled && scrollY > threshold` is false when disabled, unchanged when enabled
