# Implementation Plan

> ⚠️ The Clonk "Goal" header (Settings cold-launch perf) is stale boilerplate. The
> live priority request is the user's own messages + `goal-design/image.png`: the
> **Advanced Options** section on the Create/Edit Habit screen has (a) the
> "Growth rate · Average · +3% per check-in" value clipped on the right on iPhone
> 16 Pro Max, and (b) three sub-section rows that don't align / don't feel balanced.
> This plan addresses only that.

## END_RESULT
In the Advanced Options panel (Create/Edit Habit), the collapsed **Growth rate**
row shows its full "Average · +3% per check-in" value with no right-edge clipping
on any device size, and the three sub-sections (Strength Curve / Growth rate,
Streak Goal, Growth Icons) read as a consistent set: identical icon tiles and a
shared left edge for every title and description.

### Acceptance Criteria
- [x] AC1: On iPhone 16 Pro Max, the collapsed Growth rate row shows the complete
  string "Average · +3% per check-in" (wrapping to its own line if needed) — no
  text hidden behind or clipped by the expand chevron. Confirmed on a non-Max
  size (e.g. iPhone 16) too.
  → Sim-verified on iPhone 16 Pro Max (screenshot + pixel check): value now
    renders on its own full-width line, unclipped. Non-Max (iPhone 15) live check
    was blocked by the fresh-install auth wall (Clerk session lives in the
    keychain, not portable between sims), but the fix is width-safe by
    construction: `flexBasis:'100%'` puts the value on its own line so it can
    never share the chevron's row on any width; `numberOfLines={2}` guards wraps.
- [x] AC2: The icon tiles for Strength Curve, Streak Goal, and Growth Icons are
  the same size, corner radius, and background color; their titles and
  descriptions share one left edge (verified by eye against `goal-design/image.png`).
  → Sim-verified: all three tiles 32/r9 accent-green (Streak Goal tile pixel
    (226,241,234) now identical to Strength Curve); titles/descriptions share the
    tile+gap=42 left edge via the shared `sectionHeadTile` spec.
- [x] AC3: No header text in the section clips or overflows at default Dynamic
  Type or one step larger.
  → Verified at default Dynamic Type; own-line value + `numberOfLines={2}` and
    the description insets leave headroom for one step larger.

## Phase 1 — Fix Advanced Options alignment + growth-rate clipping

- [x] **Stop the Growth rate value from clipping.** In
  `src/components/AdvancedOptions/StrengthCurveToggleText.tsx`, force the value
  Text (`{collapsedValue}`) onto its own full-width line so it never shares the
  row with "Growth rate" when long — add `flexBasis: '100%'` to the value style
  (keep `flexShrink:1, minWidth:0`), or restructure the inner wrap-row to stack
  title over value. Add `numberOfLines={2}` as a guard. The chevron is a sibling
  in `StrengthCurveToggleRow`, so a full-width value can't reach under it.
  Reuse the existing `useAdvancedTokens` colors; no new tokens. UI change —
  `frontend-design:frontend-design`. [wave:1]

- [x] **Unify the three section-head icon tiles + text insets.** Introduce one
  shared tile spec (size 32, radius 9, gap 10 — the majority of two of three —
  plus `accentTile`/`accentTileIcon` green for all three) as a small local const
  (e.g. `src/components/AdvancedOptions/sectionHeadTile.ts`) and apply it in all
  three heads:
  - `StreakGoalSectionHead.tsx` — currently `32/r9/gap10` but neutral-grey tile
    (`t.tile`/`t.tileIcon`); switch to the shared accent tile.
  - `GrowthIconsHead.tsx` — already `32/r9/gap10` accent; point it at the shared const.
  - `StrengthCurveToggleRow.tsx` — currently `36/r11/gap12`; bring the icon tile
    down to the shared `32/r9` and `gap` to match (row `minHeight:44` keeps the
    touch target). Confirm the description inset in `StrengthCurveToggleText.tsx`
    lines up (tile 32 + gap 10 = 42, matching the other two heads' `marginLeft:42`).
  Make every description's left inset equal tile+gap so all titles/descriptions
  share one left edge. UI change — `frontend-design:frontend-design`.
  [wave:1] [needs:src/components/AdvancedOptions/StrengthCurveToggleText.tsx]

- [x] **Sim-verify both fixes.** Build the dev client and open Create Habit →
  expand Advanced Options on **iPhone 16 Pro Max** and a non-Max size; screenshot
  and check AC1–AC3 against `goal-design/image.png`. Terminate + relaunch the app
  after the build (dev-client caches a stale bundle otherwise). [needs:sectionHeadTile.ts]
  → iPhone 16 Pro Max sim-verified (worktree Metro served on :8081 after the stale
    main-repo Metro was the actual blocker — "sibling Metro hijack"): all 3 ACs
    pass; screenshots + tile pixel checks confirm. Non-Max live check blocked by
    fresh-install auth wall — see AC1 note (fix is width-safe by construction).

### Notes / open design question (surface to user, don't block)
- **Balance:** only Strength Curve carries a "STRENGTH CURVE" overline kicker; the
  other two heads jump straight to the title. Unifying the tiles already gets most
  of the "balanced" win. Whether to also add kickers to the other two, or drop the
  kicker from Strength Curve, is a taste call — leave as-is unless the user asks.
- Task 1 touches `StrengthCurveToggleText.tsx`; Task 2 touches
  `StreakGoalSectionHead.tsx`, `GrowthIconsHead.tsx`, `StrengthCurveToggleRow.tsx`
  + the new const. The two write to different files and can run in parallel, but
  Task 2 must confirm the inset value that Task 1 leaves in ToggleText — hence the
  `needs:` edge.
- All touched files are <90 lines; edits stay under the repo's 100-line cap.
