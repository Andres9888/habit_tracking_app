# Habit Details — Offer Engineering review (2026-09-02)

Lens: the attached "Offer Engineering" framework (ProsperityFrameworks). Rule: spend
20% on the desired result, 80% on removing the pain of getting there. Three
pain-removers, and a good offer needs at least two of three:

| Pillar | Removes | On a habit detail page this means |
|---|---|---|
| Done-for-you | action / effort | pre-made smallest version, defaults already chosen, one tap |
| Systems | thinking / overwhelm | tell me what to do and when, never make me compute |
| Support | fear / self-doubt | a miss must not read as a verdict; show the path, not the grade |

The "result" a user comes to this page for is one thing: keep this habit alive today.
Everything else is pain relief or noise.

Surface reviewed: `src/screens/HabitDetailScreen/` on `settings-lighter-1b` (HEAD 553e71125),
live on the sim in the recovery state (24-Hour Purchase Rule, two days missed, strength 8).

---

## 1. Research supplement (mobile habit apps)

- 43% of habit-app users quit inside 30 days, ~49% by day 60, median 70% by day 100
  ([scoping review, PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11694054/),
  [Together with Kai](https://togetherwithkai.com/blog/best-habit-tracker-apps)).
- The #1 named trigger is the broken streak: "streak resets to zero, red X appears, guilt
  spiral starts" ([Tyler Ward, 10 trackers in 30 days](https://medium.com/@wardtylerd/i-tested-10-habit-trackers-in-30-days-8-broke-me-the-same-way-9803ea20b228),
  [ViviDiary: missed days as data](https://blog.vividiary.live/inside/missed-days-as-data-not-failure-ux)).
- #2 is stat overload: apps praised for "no complicated charts, no analytics overload"
  ([habi.app ranking](https://habi.app/insights/best-habit-tracker-apps/), [AppRundown](https://apprundown.com/best/habit-tracker-apps)).
- Duolingo's streak freeze cut churn 21% among at-risk users; separating streak from daily
  goal lifted D14 retention 3.3% ([Apptitude teardown](https://apptitude.io/blog/how-duolingos-streak-mechanic-actually-works/),
  [Propel](https://www.trypropel.ai/resources/blogs/duolingo-customer-retention-strategy)).
- Implementation intentions ("after X, I do Y") d = 0.65 across 94 studies; contingent
  if-then format and rehearsal raise the effect ([Gollwitzer & Sheeran](https://www.sciencedirect.com/science/chapter/bookseries/abs/pii/S0065260106380021),
  [642-test meta-analysis](https://www.tandfonline.com/doi/abs/10.1080/10463283.2024.2334563)).
- Thumb zone: 96% tap accuracy in the bottom third vs 61% in the stretch zone; bottom CTAs
  are ~2.7x faster ([Parachute](https://parachutedesign.ca/blog/thumb-zone-ux/)).
- Progressive disclosure cuts task time 20–40% ([NN/g](https://www.nngroup.com/videos/progressive-disclosure/)).

Net: the two pains that kill retention are exactly the framework's "fear" and "thinking"
pillars. Detail already leans the right way (amber not red, strength survives a miss,
verdict-first Analytics). The gaps below are where it still grades instead of guides.

---

## 2. Component-by-component

Order on screen: header → hero title → state card → CTA + slot → This week → Strength →
Streak goal → The record doors → Insight line.

### 2.1 DetailBandHeader (Close · Edit)
- **Why it exists:** exit and the only route to change reminder / cue / why.
- **Pillar:** systems (barely).
- **Pain:** Edit is the only place a user learns *when* the reminder fires. Nothing on
  the page says it.
- **Keep.** No change; fix lives in 2.2.

### 2.2 HeroTitleRow (name + "Daily")
- **Why:** identity of the page; schedule context.
- **Pillar:** systems.
- **Pain:** `scheduleLabel` prints "Daily" or "Morning routine · Daily". The habit
  already stores `reminderTime`, `cueAfterBehavior`, `cueTime`, `cueLocation`. None
  reach this line. The user is left to remember the plan — the exact thinking cost the
  framework says to remove, and the thing implementation-intention research says
  doubles follow-through.
- **Fix (P2):** render the if-then plan when data exists:
  "After morning coffee · 7:30 reminder". Fallback to today's "Daily". Tapping opens Edit.

### 2.3 HeroStateCard / HeroWhyPill / HeroRecoveryCard
- **Why:** name today's state before asking for the tap; in recovery, reframe the miss.
- **Pillar:** support. This is the strongest fear-removal on the page.
- **Pain observed live:**
  1. Copy said "Yesterday got away" while the week strip showed Mon 31 *and* Tue 1
     missed. `missedLastScheduledDate` only looks at the last scheduled day, so a
     multi-day miss is described as one day. The user sees two dashed circles under a
     sentence that says one. Trust leak.
  2. "Your 2-day record still stands." A 2-day record is not reassurance, it is a
     reminder of how little there is. `recoveryBodyCopy` has no floor.
  3. The why pill is hidden in recovery and after completion — the two moments the why
     is most useful. `resolveWhy` output only renders in the neutral ready state.
- **Fix (P1):** count the misses since the last completion: "Two days got away. Today
  doesn't have to." Floor the record clause at ≥3 (`bestStreak < 3` → "Today starts the
  next one."). Show the why as one italic line under the recovery card and the
  completed card (`HeroWhyPill` compact variant).

### 2.4 HeroCheckInToggle + fixed secondary slot
- **Why:** the 20%: one control, both states, undo on the same control.
- **Pillar:** done-for-you. Best element on the page; keep its shape.
- **Pain:**
  1. Position. The CTA sits in the top third (stretch zone); after any scroll it is
     gone. The earlier redesign shipped a sticky bottom bar and it was later removed.
     Thumb-zone data says the bottom third is ~35 points more accurate and 2.7x faster.
  2. The two-minute hint is generated from the habit name: "Try two minutes of 24-Hour
     Purchase Rule." Nonsense for rule / abstinence / decision habits. `twoMinuteHint`
     has no knowledge of habit type, and templates already carry `startSmallVersion`
     which is never read here.
  3. "Stopping early still counts" is true, but nothing records it as the small
     version. `tracking.kind` (`'full' | 'minimal'`) exists in the schema (legacy) so a
     long-press "Log the 2-minute version" is possible without a schema change. Not
     needed for v1; flagged because the earlier note that this is schema-blocked is out
     of date.
- **Fix (P1 copy, P2 position):** hint = template `startSmallVersion` when the habit
  came from a template, else a type-neutral line: "Do the smallest version you'd still
  call done. It counts." Reintroduce a sticky bottom CTA that appears once the hero
  toggle scrolls off (same component, same state, no second affordance on screen at
  once).

### 2.5 ThisWeekCard
- **Why:** the week is the unit people plan in; tap a past day to correct it.
- **Pillar:** systems.
- **Pain:** header reads "0 days logged" above two dashed misses. That is the "red X"
  pattern the research names, in softer clothes. It is also the second grade on the
  page before the user has done anything. Missed dots are already gentle (dashed, no
  red) — the count is the problem.
- **Fix (P1):** when `doneCount === 0` and the week still has scheduled days left,
  show forward framing: "5 days left" (or nothing). When `doneCount > 0` keep
  "N days logged". Keeps the number once it means something.

### 2.6 StrengthSnapshot + StrengthDial
- **Why:** the one number that survives a miss; the reassurance in recovery.
- **Pillar:** support. Recovery caption "Dipped, not reset" is right.
- **Pain:** the dial shows a bare "8" with no visible unit; the word "Strength" is only
  in the a11y label. The default caption is a definition of the algorithm, not a
  message to the person. Level names ("Starting Out") do the labelling work the number
  should.
- **Fix (P1):** small overline "STRENGTH" above the level name, or "8 / 100" in the
  dial. Default caption → "Grows with every check-in. A miss dips it, never resets it."
  (shorter, same truth).

### 2.7 DetailGoalCard (unset state seen live)
- **Why:** give the run a finish line; ladder + date plan once set.
- **Pillar:** intended as systems; in the unset state it is the opposite.
- **Pain:** at streak 0, in recovery, strength 8, the card asks the user to *choose* a
  commitment (7 / 21 / 30 / Custom) and explains the record ("Your record is 2 days")
  that the recovery card just stated. That is thinking + fear + a duplicate number on
  the same screen. "Give this run a finish line" when there is no run.
  The set state is good: "7 days — day 1 starts today" plus "Reach 7 days on Sep 9" is
  a plan in dates (implementation-intention shaped).
- **Fix (P2, done-for-you):** apply `suggestedGoal(bestStreak)` automatically on habit
  creation / first open, render the ladder immediately with a quiet "Change" link. The
  Adjust sheet stays the only place to remove or customise. If auto-apply is rejected,
  at minimum collapse the picker in recovery to one line: "Set a 7-day target →".

### 2.8 RecordDoors
- **Why:** the only route to History and Analytics.
- **Pillar:** systems (labels predict the destination — good).
- **Pain:** "Patterns & trends · See what helps you stay consistent" promises support
  that does not exist until `MIN_DAYS_OF_DATA = 14` plus per-insight thresholds
  (8 timestamped check-ins, 55% share; 3 occurrences per weekday, 20% gap; 4 months
  for trend). For a new habit the door opens onto a page with no verdict and no rows.
  A dead end dressed as a promise.
- **Fix (P1):** subtitle becomes a countdown while locked: "Unlocks after 14 days of
  check-ins · 9 to go", then the current copy. Turns the wait into visible progress
  (the framework's "clarity on what to do and when").

### 2.9 InsightLine
- **Why:** one grounded sentence, evidence behind it.
- **Pillar:** support.
- **Pain:** none structural. Hidden below 14 days (correct). When present it states a
  pattern, and the evidence page offers an optional step. Good progressive disclosure.
- **Keep.**

### 2.10 Sub-screens (Day, History, Analytics, Insight)
- Day: honest, correctable, stepper between days. Keep.
- Analytics: verdict-first with retrospective next step ("Covering Fridays would have put
  August at 93%") — best support element in the app. Keep; door subtitle is the fix.
- History: frame + one interactive month. Keep.
- Insight evidence: "It describes what you logged — it does not explain why." Keep.

---

## 3. Flow-level findings

1. **Three grades before one instruction.** In recovery the page shows, top to bottom:
   miss → 0 days logged → strength 8 → record 2 days. The only instruction is the CTA
   plus a generic hint. Offer engineering says invert: one honest state line, one clear
   action with the smallest version pre-made, then the numbers.
2. **No "not today" path.** Every scheduled day is complete or missed. The strength
   model already absorbs misses, so a freeze is not needed for the number, but the
   *calendar* still shows a dashed miss for a planned rest day. Duolingo's data says
   letting people declare a skip protects retention. Bigger bet: a "rest day" mark on
   the Day screen (needs a tracking kind or a separate table). Not P1.
3. **Plan lives in Edit, not on the page.** Cue, time, why, small version all exist as
   data and none are surfaced at the moment of action.
4. **Live bug (incidental):** home strip showed "Today · Sep 1" while Detail's week
   strip showed Wed Sep 2 as today (device date Sep 2, 10:04). Known midnight-rollover
   gap; two `today` computations on different cadences. Worth fixing before the copy
   work because it undermines every date sentence on the page.

---

## 4. Prioritised changes

| # | Change | Pillar | Effort | Files |
|---|---|---|---|---|
| 1 | Multi-day miss count in recovery headline; record clause floor at 3 | support | S | `insights/recoveryCopy.ts`, `useHabitDetailDayState.ts` |
| 2 | Habit-aware small-version hint (template `startSmallVersion`, neutral fallback) | done-for-you | S | `DetailHeroBanner.utils.ts` |
| 3 | Analytics door countdown subtitle while locked | systems | S | `RecordDoors.tsx` + `MIN_DAYS_OF_DATA` |
| 4 | "0 days logged" → forward framing until first log | support | S | `ThisWeekCard/WeekCardHeader.tsx` |
| 5 | Dial unit + shorter default caption | systems | S | `StrengthSnapshot.tsx` |
| 6 | Why line visible in recovery + completed states | support | S | `DetailHeroBanner.tsx` |
| 7 | If-then plan line under the title (cue · reminder) | systems | M | `HeroTitleRow.tsx`, `scheduleLabel` |
| 8 | Auto-apply suggested goal; ladder by default | done-for-you | M | `DetailGoalCard`, habit create |
| 9 | Sticky bottom CTA after hero scrolls off | done-for-you | M | `HabitDetailContent.tsx` |
| 10 | Rest-day mark (product decision + data) | support | L | Day screen, tracking |
| 0 | Fix home/detail `today` mismatch | trust | S–M | date hooks |

1–6 are copy and conditionals; one mock, one PR. 7–9 change structure and want a mock
first (`.superdesign/design_iterations/`). 10 needs a product decision.
