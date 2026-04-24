# Plan: Copy pass on the Advanced section (Habit Detail)

## Context

The "Advanced" card on the Habit Detail screen (`AdvancedOptionsSection`) holds three per-habit controls — Growth Type, Growth Icons, and Streak Goal — each opening its own sheet. The current copy is on-brand but verbose: the Growth Type sheet subtitle is two sentences, several algorithm descriptions over-explain, and row subtitles spell out things that could be a glance. Goal: tighten everything in this section and make it clearer at first read, without losing meaning or the existing voice (direct, conversational, em-dashes, light science references).

Out of scope: copy outside the Advanced card, the algorithm card *examples* field (already empty), preset chip labels (already minimal: `7d`, `21d`, …), and stage labels (already single words).

---

## Files to modify

1. `src/components/AdvancedOptions/AdvancedOptionsSection.tsx` — three row subtitles + two sheet subtitles
2. `src/components/AlgorithmPicker/algorithmCopy.ts` — three algorithm descriptions
3. `src/components/AdvancedOptions/StreakGoalSheetBody.tsx` — in-sheet summary line (kept in sync with row subtitle)

No new files. No structural changes. Pure string edits.

---

## Proposed copy (before → after)

### A. Row subtitles (collapsed-card previews) — `AdvancedOptionsSection.tsx`

| Row | Before | After |
|---|---|---|
| Growth Type (line 90) | `${name} · ~${days} days to automatic` | `${name} · ~${days}-day build` |
| Growth Icons (line 170) | `${presetLabel} · levels up every 20%` | `${presetLabel} · 5 stages` |
| Streak Goal (line 100) | `Aim for ${n} day${...}` / `No goal set` | `${n}-day target` / `No target set` |

Rationale: row subtitles are glanceable hints, not explanations. The full "what does this mean" lives one tap away in the sheet.

### B. Sheet subtitles — `AdvancedOptionsSection.tsx`

**Growth Type** (line 193)
- Before: *"Habit strength grows with every check-in and dips with every miss. Tell us what kind of habit this is and we'll match the growth curve to fit."*
- After: *"Strength rises with check-ins and dips with misses. Pick the curve that fits this habit."*

**Growth Icons** (line 205)
- Before: *"Every 20% of habit strength unlocks the next icon — five stages from Starting Out to Unbreakable. Pick a theme or customize any stage."*
- After: *"Five stages, one for every 20% of strength. Pick a theme or customize any stage."*

**Streak Goal** (line 220)
- Before: *"Pick a target streak length to work toward."*
- After: *"Set a streak length to aim for."*

### C. Algorithm descriptions — `algorithmCopy.ts`

**Quick Win** (line 25)
- Before: *"Tiny moves you can knock out in seconds. Grows fast and forgives the occasional slip."*
- After: *"Tiny actions that take seconds. Grows fast, forgives slips."*

**Textbook** (line 35)
- Before: *"The research sweet spot. Most habits land near the 66-day mark — steady gains with honest setbacks when you miss. Based on UCL's classic habit-formation study."*
- After: *"The research default — steady gains, honest setbacks on misses. Based on UCL's 66-day study."*

**Long Haul** (line 45)
- Before: *"Big commitments — running, meditation, practice. Takes months to build and dips hard when you miss; the curve rewards steady showing up."*
- After: *"Big commitments like running or meditation. Months to build, drops hard on misses — rewards showing up."*

### D. Streak sheet summary — `StreakGoalSheetBody.tsx`

Line 37–39 currently mirrors the old row subtitle. Update to match the new row subtitle for consistency:
- Before: `Aim for ${n} day${...}` / `No goal set`
- After: `${n}-day target` / `No target set`

---

## What stays the same

- Section header: **"Advanced"**
- Row titles: **Growth Type / Growth Icons / Streak Goal**
- Sheet titles (match row titles)
- Algorithm names: **Quick Win / Textbook / Long Haul**
- Stage labels: Starting / Building / Developing / Strong / Automatic
- Streak presets: None / 7d / 21d / 30d / 66d / 100d / 1yr
- "Reset to default" link
- All `daysToForm` numbers (18 / 66 / 120)

---

## Verification

1. **Visual check** — start the dev server, open a habit's detail screen, expand Advanced. Confirm:
   - All three row subtitles render and fit on one line on a standard phone width.
   - Each sheet opens; the new subtitle reads cleanly under its title.
   - Algorithm cards in the Growth Type sheet show the new descriptions.
   - Picking a streak preset updates both the row subtitle and the in-sheet summary line in the new format.
2. **Type check** — `npx tsc --noEmit` (no type changes expected; safety net).
3. **Lint** — `npm run lint` on changed files.
4. **No-regression** — search for other consumers of `ALGORITHM_COPY[...].description` in case the text appears elsewhere; if it does, confirm the new wording still fits that surface.

---

## Open question (will confirm via ExitPlanMode)

If you'd rather keep the *Textbook* description's "sweet spot" framing or the *Quick Win* "knock out" phrasing, flag it and I'll preserve those phrases while still trimming length.
