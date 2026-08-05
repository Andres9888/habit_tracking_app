# SPEC: Settings Page Improvements v2

**Status:** Ready for implementation (Phases 0–3). Phase 4 requires user variant confirmation first.
**Design source:** `.superdesign/design_iterations/settings_improvements_2.html` — open it in a browser; it shows every change with before/after and the A/B/C variants referenced below.
**Origin:** Scoped 2026-06-11 from a code audit (Explore + Plan agents) plus user-reviewed visual mock. All codebase facts below were verified against actual code that day — re-verify with a quick grep if main has moved significantly.

---

## Context

The settings UI lives in `src/components/SettingsModal/`. It recently shipped a live calendar preview, Theme + High-contrast rows (commit `232c8c60a`), and an accordion close-animation fix. Remaining problems this spec fixes:

1. **~250 lines of dead code** (an unused account-row chain).
2. **Visible jank**: the streak-reminders inset (time row + upsell) is a raw conditional render — it mounts/unmounts in one frame and shoves the layout. Same for the iOS time spinner.
3. **A lying preview**: the calendar preview's strength fill is hardcoded to 78% while the preview's own data peaks at 92%.
4. **Six files carry `eslint-disable max-lines`** against the repo's ≤100-line rule (`max-lines` is `error`, max 100, skipping blanks/comments — see `eslint.config.js`, and `docs/DECOMPOSITION_PATTERNS.md` for the canonical patterns).
5. **Inconsistent picker**: Sort order is the only setting that navigates to a separate page; theme/shape/icon are all inline.
6. Minor: a misleading color token, an obfuscated platform check, a sound picker with its own hand-rolled animation that ignores reduce-motion.

## Verified facts the implementing agent must trust (negative knowledge — do not re-learn these the hard way)

- **`useSettingsSectionAccordion.ts` is NOT dead code. Do not delete it.** It is the engine of every section accordion (`SettingsSection` → `CollapsibleSectionCard` → `useSettingsSectionAccordion` → `useExpandAnimation`) and contains the measure-and-lock pattern (lock height while collapsed) that fixed the accordion close animation. You will _copy_ this pattern in Phase 2.
- **The actually-dead chain is 3 files**: `AccountRow.tsx` (imported by nothing) → `HighContrastAccountRow.tsx` (imported only by AccountRow) → `AccountRowContent.tsx` (imported only by those two). `AccountPage.tsx` uses `ProfileCard` + `sections/` instead. Verified by repo-wide grep including tests.
- **Sort has 7 modes, not 3**: `SortPicker.constants.ts` defines `manual`, `name_asc/desc`, `strength_asc/desc`, `streak_asc/desc`. A single segmented control cannot hold them — hence the hybrid design in Phase 4.
- **SoundPicker already animates inline** (hand-rolled `withTiming` + measure-once `naturalHeight`, ~lines 37–63). Its problems are: not using the shared `useExpandAnimation`, and ignoring reduce-motion.
- **CalendarPreview.tsx line ~47** wraps a static `width: '78%'` in `useAnimatedStyle` because `StrengthFillBackground`'s `strengthFillStyle` prop requires an animated style. Keep the wrapper; change the value.

## Repo gotchas (violating any of these has bitten before)

- **`npm install` first** — Conductor worktrees have incomplete `node_modules`; `npx eslint` fails with `ERR_MODULE_NOT_FOUND` until you do.
- **Accordions/expanding height**: always `useExpandAnimation`; if spring, only `springs.gentle` (`src/theme/animations.ts`). Never an underdamped spring on clipped height — it causes a gap flash.
- **Never conditionally detach `useAnimatedStyle`** — branch _inside_ the worklet. Conditional detachment causes stale native color bugs.
- **Function-form Pressable styles silently drop in this app** — always plain style arrays/objects on `Pressable`.
- **Never prettier-write files you didn't otherwise touch** — the pre-commit hook blocks unrelated formatting churn.
- **Single-tier monetization** — there is no Pro/freemium gating. Do NOT add new gating, crowns, or "unlock" copy anywhere. Phase 4 Decision 4 is presentation-only.
- **Scope boundary** — no unrelated refactors, no branch renames, nothing outside `src/components/SettingsModal/`, `src/theme/settingsColors.ts`, and the files named below.
- If a literal `${HOME}/` directory appears in the repo root, delete it (PAI hook artifact, gitignored).

---

## Phase 0 — Delete dead code (zero risk, do first)

Delete:

- `src/components/SettingsModal/AccountRow.tsx`
- `src/components/SettingsModal/HighContrastAccountRow.tsx`
- `src/components/SettingsModal/AccountRowContent.tsx`

Then re-grep `AccountRow` and `AccountRowPalette` repo-wide to confirm zero remaining references. Run the SettingsModal tests.

## Phase 1 — Decompose oversized files (behavior-preserving, no visual change)

Goal: **zero `eslint-disable max-lines` headers in `src/components/SettingsModal/`**. Follow `docs/DECOMPOSITION_PATTERNS.md`. Preserve import paths via `index.ts` barrels or by keeping the original filename and extracting children into a `components/` sibling (the directory already uses a `sections/` folder — match that local convention). `AppearanceSection.tsx` (~63 lines) is the model of what orchestration components should look like.

### 1a. `SettingsRow.tsx` (198 lines) — do first; highest fan-out, run full test suite after

```
SettingsModal/SettingsRow/
├── index.ts                      # re-export, preserves './SettingsRow' imports
├── SettingsRow.tsx               # layout + AnimatedPressable wrap (~70)
├── SettingsRow.types.ts          # SettingsRowProps (incl. rightAccessory, hapticStyle)
├── SettingsRow.hooks.ts          # toggle pulse animation + haptic handlers (~45)
└── components/RowAccessory.tsx   # the 4 accessory types: toggle/selection/info/navigation+badge (~75)
```

Move `SettingsRow.colors.ts` into the folder.

### 1b. `SettingsModal.tsx` (209 lines)

Keep `SettingsModal.tsx` (ErrorBoundary + Modal shell + view switching; `SettingsModal.hooks.ts` already exists and stays). Extract:

- `components/SettingsModalFallback.tsx` — the error-fallback Modal (~35)
- `components/SettingsMainView.tsx` — skeleton/header/SettingsContent + the ~30-prop mapping (~95)

### 1c. `SettingsContent.tsx` (295 lines)

Keep as scroll wrapper + section list (~85). Extract:

- `components/BehaviorSection.tsx` — sort row + sound toggle + SoundPicker + sticky-header row (~75)
- `components/HabitManagementSection.tsx` — archived + export rows (~50)
- `SettingsContent.constants.ts` — stagger animation helper + scroll-border styles (~25)

### 1d. `StreakRemindersSection.tsx` (252 lines) — combined with Phase 2

```
SettingsModal/StreakRemindersSection/
├── index.ts
├── StreakRemindersSection.tsx        # SettingsSection + toggle row + animated regions (~70)
├── StreakRemindersSection.hooks.ts   # time-picker state, handleTimeChange, expand wiring (~50)
├── components/ReminderInsetCard.tsx  # the inset tray (~45)
├── components/ReminderTimeRow.tsx    # clock row + DateTimePicker + expand animation (~80)
└── components/PremiumUpsellRow.tsx   # existing upsell row, unchanged behavior (~60)
```

### 1e. Stretch (same patterns, lower priority)

`useAccountActions.ts` (125 — split share/rate/links from feedback-modal state) and `sections/PremiumStatus.tsx`.

## Phase 2 — Fix the streak-reminders jank (do during the 1d extraction)

- Wrap (a) the entire enabled inset block and (b) the `DateTimePicker` region in animated containers driven by `useExpandAnimation` (`src/hooks/useExpandAnimation.ts` — height/opacity/chevron, reduce-motion aware) plus the **measure-and-lock layout pattern copied from `useSettingsSectionAccordion.ts`**.
- Use the same motion as the section accordions (timing default; if spring, `springs.gentle` only).
- Crossfade the disabled-state hint text instead of hard-swapping it.
- Keep `pointerEvents` gating while collapsed (SoundPicker shows the pattern).
- iOS: the spinner picker has a fixed natural height, so measure-once works. Android: the time picker is a dialog, so the inline animation only applies on iOS — **branch inside the worklet**, never conditionally detach the animated style.
- While in the file: replace the obfuscated `const nativeHandsetPlatform = ['and', 'roid'].join('')` (line ~24) with a plain `Platform.OS === 'android'` check.
- Replace the inline 36px icon-tile styles with the pattern `SettingsRow` uses; keep all colors on `useThemeColors()` / `highContrastColors` tokens.

## Phase 3 — Small fixes (independent; can run parallel to Phase 2)

1. **Preview fill honesty** — `CalendarPreviewWeek.tsx`: export the preview week's peak strength (92) as a constant (e.g. `PREVIEW_STRENGTH_PERCENT`). `CalendarPreview.tsx` ~line 47: replace `'78%'` with the derived value. Keep the `useAnimatedStyle` wrapper (required by the prop type); add a one-line comment stating that constraint.
2. **Token rename** — `src/theme/settingsColors.ts`: rename the `circle` token → `dayMarker` (it colors both circle AND square icons). Only consumer is `DayMarkerShapeSettingsRow.tsx` (confirm with `grep -r "settings.circle" src/`). Update both palettes.
3. **SoundPicker unification** — migrate `SoundPicker.tsx` off its hand-rolled `progress`/`naturalHeight` animation onto `useExpandAnimation` + `useReduceMotion`. Keep the `everVisible` lazy-mount and `pointerEvents` gating. Preserve the plain style arrays on its `Pressable`s.

## Phase 4 — Design variants (⚠️ BLOCKED: confirm picks with the user before building)

The mock (`settings_improvements_2.html`, Part 2) presents five decisions. Recommended defaults below; **ask the user to confirm "1B 2A 3B 4B 5A" (or their overrides) before implementing this phase.**

| #   | Decision           | Recommended                                                                                                                                                                                                                                                                                                     | What it means                                    |
| --- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | Sort order         | **B** — inline segmented family picker (Custom/Name/Strength/Streak) + small ↑↓ direction chip shown for non-Custom (animated in via `useExpandAnimation`). Delete the `SortPicker` page + its routing branch in SettingsModal.                                                                                 | Kills the lone navigate-away picker              |
| 2   | Profile hero       | **A** — layered depth: two-layer shadow + hairline gradient ring on the avatar. No shimmer, theme tokens only.                                                                                                                                                                                                  | `ProfileHeroCard.tsx`                            |
| 3   | Section grouping   | **B** — fold Habit Management's 2 rows (archived, export) into Behavior; convert Support and About from accordions to static label groups (a `StaticSectionLabel` component already exists). Requires migrating persisted accordion-state keys in `useSettingsSectionStates` / `settingsSectionPreferences.ts`. | 7 cards → 6, chevrons only where collapsing pays |
| 4   | Premium upsell row | **B** — replace the crown row inside the reminders inset with a quiet one-line text link ("Want a different time per habit? Learn more →"). Presentation only; same onPremiumUpsell handler; **no new gating**.                                                                                                 | Fits single-tier positioning                     |
| 5   | Preview placement  | **A** — keep the calendar preview scrolling inside the Appearance accordion (status quo). Do NOT build the pinned variant; it fights the height-clip animation.                                                                                                                                                 | No work needed                                   |

Reuse for variant 1B: the segmented-control pattern from `ThemePicker`/`DayShapePicker`/`CompletionIconPicker` + `SegmentedControl.colors.ts`, and `SettingsRow`'s `rightAccessory` prop.

---

## Verification

Per phase:

1. `npm install` (once), then `npm run lint:eslint`, `npm run lint:max-lines` (target: "All files compliant!" — and confirm every `eslint-disable max-lines` header in `src/components/SettingsModal/` is gone by end of Phase 1), `npm run lint`, `npx jest src/components/SettingsModal`.
2. Run the app (iOS simulator primary). Check in light/dark × high-contrast × reduce-motion:
   - Open Settings: stagger entrance intact; hairline border appears after ~4px scroll.
   - Toggle every section accordion open/closed **twice** — no snap, no height fight on close.
   - Completion sound toggle: tray slides with the same curve as accordions; tapping each sound previews it.
   - Streak reminders toggle on/off: inset animates (no layout jump); hint text crossfades; time picker expands smoothly on iOS / opens dialog on Android; chosen time persists.
   - Appearance: preview gradient fill now ends at the strongest preview day; circle/square shape swap still works.
   - Account page unaffected by Phase 0 deletions (it never used AccountRow).
   - With reduce-motion ON: expansions snap instantly (no animation) including the sound picker.
3. Phase 4 only after user confirmation; re-verify the affected flows per the chosen variants (sort selection persists across app restart; section-state migration preserves users' collapsed sections).

## Out of scope

- Anything outside the settings surface; navigation/header redesign; the Account sub-page beyond Phase 0's deletions; new settings; onboarding/paywall surfaces; any new premium gating (single-tier model).
