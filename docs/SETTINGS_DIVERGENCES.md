# Settings — Kept Divergences From `settings-page-v2.html`

Source: OD project `daf2a886…` ("Improve habit card"), mock `settings-page-v2.html`.
Tracks intentional gaps between the mock and the shipped app per
`docs/settings-continuous-improvement-plan.md` (Phases 1–5).

## Kept divergences

- **Native time picker** over the mock's 7/8/9 PM preset radios for Chain-care
  reminder time. Native `DateTimePicker` covers arbitrary times; presets would
  regress functionality. Premium nudge for per-habit time already wired.
- **Sort direction picker** (asc/desc segmented control) kept alongside the
  mock's family-only picker — mock has no direction concept. Functionality
  predates this round and nothing consumes its removal.
- **Stats destination** — Account page no longer shows streak/active-habits/
  completions metrics (mock: "analytics live in Habit Detail Insights only").
  Dropped from Settings now; surfacing them in Habit Detail Insights is a
  separate, unscoped follow-up — not built as part of this round.

## Deferred (not built this round)

- **Nested-stack VoiceOver focus restore** — returning from Account or
  Calendar Look to the main Settings list does not yet restore focus to the
  row that opened the sub-page. `useAccessibilityFocus` (src/hooks) is in
  place and used for the DeleteAccountSheet's on-open title focus; wiring the
  same hook through `SettingsMainView`'s view-switch back-navigation needs
  live VoiceOver verification in a simulator, which this environment can't
  run headlessly. Follow-up: wire a ref registry keyed by sub-page name in
  `SettingsMainView`, call `.focus()` on transition back to `'settings'`.

## Closing gate

Screenshot sweep vs `settings-page-v2.html` (light + dark, 390 + small-width)
is unrun — no simulator/browser available in this session. Run before calling
the round done.
