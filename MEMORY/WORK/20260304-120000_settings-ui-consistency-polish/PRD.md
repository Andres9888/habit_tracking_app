---
task: Audit and polish settings page UI consistency
slug: 20260304-120000_settings-ui-consistency-polish
effort: standard
phase: complete
progress: 9/9
mode: interactive
started: 2026-03-04T12:00:00-05:00
updated: 2026-03-04T12:00:30-05:00
---

## Context

Andres wants to audit the Settings modal for UI/UX inconsistencies and polish them. The settings page is well-structured with reusable SettingsRow/SettingsSection components, but several inconsistencies have crept in across sections. This is a polish pass — no new features, no redesign, just making everything consistent with the app's established design language.

### Risks
- PremiumStatus gradient CTA has intentionally different styling — must not break its visual distinction
- SortPicker is a separate sub-screen — changes need to feel cohesive but not break navigation

## Criteria

- [x] ISC-1: Settings header uses px-4 matching all other modal headers
- [x] ISC-2: "Export habits & stats" uses distinct icon (not duplicate Share2)
- [x] ISC-3: "Made with ❤️" text renders below the About card, not inside it
- [x] ISC-4: SortPicker border uses theme colors instead of hardcoded hex
- [x] ISC-5: SortPicker check icon uses theme primary color not hardcoded green
- [x] ISC-6: StreakReminders description uses NativeWind classes not inline styles
- [x] ISC-7: PremiumStatus non-premium CTA icon container matches standard 40x40 rounded-xl
- [x] ISC-8: Badge background uses semantic color token from theme
- [x] ISC-9: No duplicate icons exist between Data and App sections

## Decisions

- ISC-8 (PremiumStatus SettingsSection wrapping) removed — the non-premium gradient CTA intentionally uses custom layout for visual distinction; wrapping in SettingsSection would add unwanted double rounding/shadows
- Export icon: use `Download` from lucide instead of `Share2` (which duplicates AppActions "Share with Friends")
- PremiumStatus icon container: change from h-11 w-11 rounded-[14px] to h-10 w-10 rounded-xl to match standard SettingsRow icon sizing

## Verification

All 9 ISC criteria verified by grep/read of modified files. No new TS errors introduced (only pre-existing module resolution issues from missing node_modules). Files modified: 8 files, all surgical single-line or small-block edits.
