# Implementation Plan

> **Note:** The template goal in this worktree ("instant Habit Library cold-open")
> is stale. The user's priority messages + reference image (`goal-design/image.png`)
> are about a **layout bug in the Create-Habit → Advanced Options section**:
> (1) the three rows don't align, and (2) the "Growth rate" value is cut off on
> iPhone 16 Pro Max. This plan addresses that.

## END_RESULT
In the Create/Edit Habit sheet, when **Advanced Options** is expanded, the three
rows — **Growth rate** (Strength Curve), **Streak Goal**, and **Growth Icons** —
share one consistent icon column and one text left-edge, so the section reads as a
single balanced list. The "Growth rate" summary value (`Average · +3% per check-in`)
is fully visible on the widest device (iPhone 16 Pro Max) and never collides with
the chevron.

### Acceptance Criteria
- [x] AC1: The icon tiles of all three rows are the **same size/radius**, and the
      title + description text of all three rows begin at the **same x-position**
      (no more ~6px indent step on the Growth rate row).
- [x] AC2: On iPhone 16 Pro Max, `Average · +3% per check-in` renders in full —
      either on one line or wrapped — with no truncation and no overlap with the
      round chevron button.
- [x] AC3: No regression to the expanded content below each head (type bar / streak
      chips / emoji slots) or to dark mode; `tsc` and `npm run lint:max-lines` stay green.

## Root cause (verified in code)
| Row | File | Icon tile | Gap | Text left-edge |
|-----|------|-----------|-----|----------------|
| Growth rate | `StrengthCurveToggleRow.tsx` | 36×36 r11 | 12 | ~48px |
| Streak Goal | `StreakGoalSectionHead.tsx` | 32×32 r9 | 10 | ~42px (desc `marginLeft:42`) |
| Growth Icons | `GrowthIconsHead.tsx` | 32×32 r9 | 10 | ~42px (desc `marginLeft:42`) |

Canonical app primitive `AdvancedOptionRow.tsx` already uses **36 / r11 / gap12** →
unify the two section heads UP to that; the Strength Curve trigger is already correct.
The clip has an existing `flexWrap` guard in `StrengthCurveToggleText.tsx` (comment +
"Strength Curve fit" commit) — task 2 verifies it actually engages, hardens only if not.

## Phase 1 — Align & de-clip the Advanced Options rows
Skill: `frontend-design:frontend-design` for the row geometry; sim-verify per
memory `habit-app-sim-verify-gotchas` (full native rebuild, `ui_tap` in points).

- [x] **Task 1 — Unify the icon column across the two section heads.** Add a single
      shared spec (icon `36×36`, radius `11`, row `gap 12`, description `marginLeft 48`)
      and apply it in `src/components/AdvancedOptions/StreakGoalSectionHead.tsx` and
      `src/components/AdvancedOptions/GrowthIconsHead.tsx`, replacing their 32/r9/gap10/
      marginLeft42 values. Prefer a tiny shared constant (e.g. `advancedRowSpec.ts`, or
      extend `useAdvancedTokens.ts`) that mirrors the values already in
      `StrengthCurveToggleRow.tsx` / `AdvancedOptionRow.tsx`, so the columns can't drift
      again. Keep each head's `alignItems: 'center'` (single-line titles). [wave:1]
- [x] **Task 2 — Guarantee the Growth-rate value can't clip on 16 Pro Max.** In
      `src/components/AdvancedOptions/StrengthCurveToggleText.tsx`, confirm the existing
      `flexWrap`/`flexShrink`/`minWidth:0` row actually wraps `Average · +3% per check-in`
      instead of truncating (RN default `flexShrink` is 0 — verify the value Text keeps
      its explicit `flexShrink:1`). If it still clips at runtime, drop the value to its
      own full-width line beneath "Growth rate" (stacked, not inline). Source string lives
      in `mockTokens.ts` (`CURVE_MOCK_COPY`). [wave:1]
- [x] **Task 3 — Sim-verify on iPhone 16 Pro Max + static gates.** Rebuild, open
      Create Habit → expand Advanced Options; screenshot the three rows and confirm AC1
      (aligned icon column + text left-edges) and AC2 (full "+3% per check-in", no chevron
      overlap). Also eyeball the "Daily Reminder" row above for the same left-edge so the
      whole sheet reads consistently. Run `tsc` + `npm run lint:max-lines`. Capture
      before/after screenshots. [needs:Task 1][needs:Task 2]

## Verification result (iPhone 16 Pro Max, iOS 26.2)
- **Task 1:** Added `advancedRowSpec.ts` (icon `36×36` / r`11` / gap`12`, derived
  `advancedRowTextInset = 48`) and applied it in `StreakGoalSectionHead.tsx` +
  `GrowthIconsHead.tsx` (replacing 32/r9/gap10/marginLeft42). Growth-Icons emoji bumped
  16→18 for proportional balance in the larger tile. Sim-confirmed: all three icon
  tiles same size, all titles + descriptions left-aligned at 48px.
- **Task 2:** No code change needed — the existing `flexWrap` guard in
  `StrengthCurveToggleText.tsx` engages on 16 Pro Max: `Average · +3% per check-in`
  wraps to a second line, fully legible, clear of the chevron (no truncation). The
  stacked-line fallback was not required.
- **Task 3:** `tsc` clean; no new `max-lines` violations. After screenshot:
  `docs/verification/advanced-options-aligned-16promax-after.jpg` (before =
  `goal-design/image.png`).
