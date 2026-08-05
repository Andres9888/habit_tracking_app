# Habit Detail Screen — UX Value Audit & Improvements

**Date:** 2026-06-26
**Status:** Design — approved scope (all 12 changes), pending spec review
**Surface:** `src/screens/HabitDetailScreen/` (+ `src/components/HabitStrengthSection/`, `src/components/BinaryHeatmap/`)

## Context

The habit detail screen is the home base for a single habit. We audited every rendered element (69 elements, one analyst per region + an adversarial retention/conversion skeptic per recommendation) to decide whether each part earns its place, and how to improve by moving / adding / removing / explaining better.

**Lens (approved):** every element must do one of —
- **(a) frictionless daily tap** — marking done is instant, one-tap, never buried;
- **(b) progress felt** — streak / strength / milestones / identity ("I'm becoming someone who does this") — the retention engine past week one;
- **(c) deepen investment** — visible accumulated value / sunk cost; in a single-tier app (no feature gating) conversion is *indirect* — the more progress a user can see, the more a subscription feels like protecting what they built.

If an element serves none, it's a candidate to move/merge/cut/explain. Prefer **fewer, stronger payoffs** over many half-payoffs. The daily tap must never slow.

**Findings:** No P0 — the screen is fundamentally sound (fast optimistic tap, haptics, calm confirmation; strong payoffs already exist). The skeptic pass rejected ~40 "improvements" as neutral/busywork. The real weakness is two patterns: **(1)** the same number is restated many times (one wow split into fragments — reads as a dashboard), and **(2)** a few **trust leaks and dead-ends** that hurt the at-risk cohort. This spec fixes both.

**Out of scope (verified neutral — do NOT touch):** tab rename/icon swaps, chart grid-line softening, pinned-title streak token, icon-tile celebration, label streak echo, time-range toggle (1M/3M/1Y) changes, GoalAdjustSheet redundancy churn, header close/edit button changes.

---

## The 12 changes

### A · Protect the progress wall (trust / correctness)

**A1 — Year-heatmap cell: stop silent past-day toggling.** `ret↑ conv↑ · M`
- *Where:* `components/YearHeatmapSection.tsx` (handleHeatmapDayPress), `useCalendarHandlers.ts` (toggle path), `src/components/BinaryHeatmap/BinaryHeatmapNew.tsx` (tooltip-after-toggle).
- *Current:* a tap on a ~6px year cell fires `onNavigateToMonth` **and** `onDayPress`, which calls `toggleHabitMutation` with no confirmation (only future dates blocked). The tooltip opens *after* the toggle, so it shows post-toggle state. One mis-tap silently flips a past day's completion — corrupting the streak/heatmap wall, the exact asset that drives retention + conversion.
- *Change:* year cell = **inspect + jump-to-month only**. Drop the `onDayPress` toggle from the year cell; keep `onNavigateToMonth` + tooltip. Route ALL toggling exclusively through `MonthlyCalendarGrid` (big targets, already wired).
- *Why:* removes a data-integrity hole in the progress wall. Removes behavior (survives YAGNI).

**A2 — Calendar backfill on the optimistic store.** `ret↑ · S`
- *Where:* `useCalendarHandlers.ts` (handleCalendarDayPress), `useHabitDetailScreenState.ts` (optimistic wiring), the `completedDates` Set build.
- *Current:* the optimistic overlay is applied to **today only**. Backfilling a past day calls the raw mutation (no `pendingToggles` write) and `pendingToggleDate` globally locks the whole grid until the server replies. On a slow network the streak-repair moment feels laggy/frozen.
- *Change:* route backfill through the shared optimistic-toggle store so the tapped past date writes `pendingToggles`; overlay `pendingToggles` onto `completedDates` for the whole calendar; scope the toggle lock **per-cell** (`pendingToggleDate === day.dateString`) so rapid multi-day backfill stays fluid.
- *Why:* honors the app's optimistic-toggle invariant; makes the at-risk streak-repair instant. (Note: prior unification covered *today*, not arbitrary backfill dates.)

**A3 — "Best" column: show the prior record, not a duplicate digit.** `ret↑ conv↑ · S`
- *Where:* `components/DetailHeroStats.tsx`; streak source `convex/.../updateStreak.ts` (`bestStreak = max(current, best)`).
- *Current:* on a record/tie, the band renders two identical adjacent mono digits (`streak 12 | best 12`) while the pill announces the record — reads as a dashboard glitch.
- *Change:* display the **prior record** in the best column (e.g. `streak 12 | best · prev 9`) so beating your old self is legible; the pill celebrates crossing it. If no `previousBestStreak` is cheaply derivable, fallback: suppress/relabel the best column **only** in the exact tie state (dash or "record" badge). Do not cut the column.
- *Why:* gives the current streak a finish line (b) and is the cheapest visible sunk-cost anchor (c).

**A4 — "Day X of your journey": count real effort, or cut.** `fixes a trust leak · M`
- *Where:* `components/DetailHero.tsx` (the `daysTracking`-based line); `totalCompletions` already a `DetailHero` prop.
- *Current:* `daysTracking` is pure wall-clock `floor((now − createdAt)/day)` — it climbs on idle days, so a lapsed user sees "Day 38" directly above a streak of 0. Reads as accusation; teaches that the number is meaningless, discrediting the honest streak/total in the same card.
- *Change:* re-base to **real completions** with identity framing that the stat band doesn't already carry (e.g. "23 days showing up"), so it only moves when work happens. If a framing distinct from the "total" stat isn't worth it, **cut the line** and let the band's "total" carry longevity.
- *Why:* removes idle-inflation trust leak; adds a distinct identity/sunk-cost cue without duplicating "total". Daily tap untouched (tertiary caption).

### B · One strong payoff, not fragments (de-dup)

**B5 — Strength tab: cut the redundant progress bar; relocate its one unique line.** `ret↑ · M`
- *Where:* `src/components/HabitStrengthSection/HabitStrengthSection.tsx` (the `StrengthProgressBar` instance, ~L94-103) and `StrengthHero/`.
- *Current:* the same strength % is rendered by the ring (StrengthHero), the MilestoneTrack ladder, AND a `size=large` StrengthProgressBar between them. The bar's only unique payload is its "X% to <next level>" hint (its level label is already off).
- *Change:* **remove the `StrengthProgressBar` JSX instance** in HabitStrengthSection (keep the shared component — used by HabitCard/journey). Render "X% to <NextLevel>" **under the ring's level label** in StrengthHero (this reverts a prior bad split — StrengthHero's own comment notes it pushed the hint down). Handle the Automatic/`next === null` case (hide hint). Optionally tint the MilestoneTrack connector segment to the fractional progress.
- *Why:* collapses 3 renders of one number into 2; lands "almost there" in the most-looked-at spot.

**B6 — StrengthStatsRow: drop the tautological "since start".** `clarity · S`
- *Where:* `src/components/HabitStrengthSection/` StrengthStatsRow; `metricsCalculation.ts` (`sinceStart = round(currentStrength)` = the ring number).
- *Current:* "since start" column = the ring number restated. (The other two are real deltas.)
- *Change:* cut "since start"; keep **last-week + last-month deltas**, centered (2-up). Do **not** swap in total/best/days-since — those already live in the hero and would re-create duplication.
- *Why:* removes a tautology; two real deltas beat three where one is a duplicate.

**B7 — Goal title "Aiming for N days" → quiet eyebrow.** `clarity · S`
- *Where:* `components/GoalTabContent.tsx` (the `heading3` title, ~L66/76).
- *Current:* "Aiming for 66 days" duplicates the numeral's "of 66 days" subtitle two lines below, and out-weights the actual hero numeral.
- *Change:* convert the title to a quiet uppercase eyebrow ("STREAK GOAL", matching the existing "CURRENT STREAK" kicker), keeping the Adjust pill anchored on the left. Do not cut entirely (orphans the pill) and do not restate N.
- *Why:* removes a duplicate N; numeral becomes the clean single headline.

### C · Close dead-ends + the one missing beat

**C8 — "Goal reached — extend it?" becomes a real affordance.** `conv↑ · M`
- *Where:* `components/SimpleStreakGoalHero.tsx` (currently static `Text`, ~L76); `GoalAdjustSheet/GoalAdjustSheet.hooks.ts` (opens at `currentGoal`).
- *Current:* the highest-investment moment on the screen (goal reached) is **static text** — a dead end. The only path forward is the small "Adjust" pill.
- *Change:* make the line a **Pressable** that opens the Adjust sheet. Open pre-set to `currentGoal` (existing default) and let the user pick a higher target — do **not** auto-advance to the next preset (avoids over-setting and manufacturing failure). ~10-line change.
- *Why:* turns a peak emotional moment into a re-commit; removes a broken-looking dead-end. (Caveat: helps the already-retained cohort — real but narrow.)

**C9 — Salvage the broken-streak reframe from dead `GoalCoachLine`.** `ret↑ · M`
- *Where:* `components/GoalCoachLine/` (DEAD CODE — zero importers, only self-refs + tests); target `components/SimpleStreakGoalHero.tsx` (label-state branch); `habit.bestStreak` already plumbed.
- *Current:* `GoalCoachLine` + `useCoachMessage` are fully built and unit-tested but mounted nowhere. Of its 6 messages, only one is differentiated: the broken-streak reset ("Reset happens. Today is day 1 again.") — it fires at the highest-churn moment and exists nowhere else.
- *Change:* **delete** `GoalCoachLine.tsx` + index + tests + tone-color coupling. **Salvage only** the broken-streak branch (`currentStreak === 0 && bestStreak > 0`) into `SimpleStreakGoalHero` as a new highest-priority label state above `isGoalReached`. Drop the other five generic brackets (they compete with the factual progress labels).
- *Why:* removes dead weight AND ships the one real at-risk save, without splitting the hero into six fragments.

**C10 — One calm milestone beat at completion.** `ret↑ · M`
- *Where:* near `components/DetailCompleteButton.tsx` (render after the optimistic flip, off the critical path); reuse `useCoachMessage` bracket logic.
- *Current:* milestone completions (streak crossing 7/30/100/365) fire flat `success` — the screen spends nothing on the rare high-emotion beat. (The everyday streak already ticks up in the adjacent hero stat band, so do NOT add an everyday "Day {streak}" label — that's a duplicate.)
- *Change:* gate a **milestone-only** one-line message on the streak crossing a round number *this completion*; render it as a brief quiet `FadeIn` line near the button **after** the optimistic flip. Never a modal, never a pop/burst — honor the existing "calm fade" + premium-not-cheap invariant. Verify on sim it fires on the crossing and not on undo/redo churn.
- *Why:* the only genuinely missing payoff; a real beat for the at-risk user hitting a milestone.

### D · Cheap hierarchy fixes

**D11 — Year-heatmap header: lead with the raw count.** `ret↑ · S`
- *Where:* `src/components/BinaryHeatmap/.../HeatmapHeader.tsx` (gridStats); both values already render.
- *Current:* the **percentage** gets the visual crown (18px mono, habit color); the raw count is demoted. A completion *rate* drops every missed day — for new/at-risk users it reads as a "ruined number" and punishes lapses.
- *Change:* lead with the **raw accumulated count** ("312 days", large, habit color); demote the % to the tertiary line (or cut). ~3-line hierarchy swap.
- *Why:* a big absolute number of accumulated wins is sunk-cost (c) + progress felt (b); a falling ratio in the crown slot is actively anti-retention.

**D12 — GoalEmptyIntro: promote the science line.** `conv↑ · S`
- *Where:* `components/GoalEmptyIntro.tsx`.
- *Current:* the science promise ("66 days is the science-backed sweet spot") — the strongest trust/conversion hook, unique to this moment — is styled **weakest** (caption, secondary), while the soft milestone line is emphasized. Inverted hierarchy.
- *Change:* flip the hierarchy — lead with the science line; demote/fuse the milestone line (e.g. "66 days is the science-backed sweet spot — we'll celebrate every milestone along the way"). Optionally drop the decorative Target tile. Do **not** touch the preset/CTA logic (pre-selection + one-tap save already correct).
- *Why:* the trust hook deserves the emphasis; marginal commitment-conversion lift on a one-shot config surface.

---

## Verification

After implementation:
1. `npx tsc -p tsconfig.app.json --noEmit` — no new errors (watch new props: `previousBestStreak`/A3, milestone flag/C10, salvaged label state/C9).
2. `npm run lint:max-lines` — compliant (decompose if any file crosses 100 lines).
3. Targeted unit tests: streak/best display (A3), optimistic backfill overlay (A2), milestone-crossing trigger fires once and not on undo (C10), broken-streak label state (C9).
4. iOS simulator (symlink `node_modules`, spare-port Metro `--clear` — radius/tokens routed through tailwind.config) — walk the screen and confirm:
   - Year cell tap inspects + jumps, never toggles; month-grid backfill fills instantly even throttled (A1/A2).
   - Record state shows prior record, no twin digits (A3); "Day X" only moves on real completions or is gone (A4).
   - Strength tab: ring carries "X% to next"; no standalone progress bar; 2-up stats; readable milestone labels (B5/B6).
   - Goal: eyebrow not duplicate title (B7); "Goal reached" opens Adjust (C8); broken-streak line appears at streak 0 with a past best (C9).
   - Milestone completion shows one calm fade-in line, no confetti, fires once (C10).
   - Year header leads with count (D11); empty-state leads with science line (D12).
   - Light + dark intact; daily complete tap unchanged in speed.

## Risks / notes
- A3/C9/C10 add small data/prop surface (prior-best derivation, milestone flag, salvaged label state) — keep optimistic-store as the source of truth for post-tap values.
- C8/C10 help narrower cohorts (already-retained / milestone-hitters); A1/A2/A4/D11 protect the broad at-risk cohort — sequence A first if split into phases.
- Honor existing invariants: optimistic-toggle store, calm-fade animation, premium-not-cheap (no shimmer/confetti), jsx-no-leaked-render (`cond ? <X/> : null`).
