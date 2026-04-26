# Plan — Continue Wave 2.3 (Canonical Spring Migration), Bias Calm

## Context

The redesign-consistency-check branch has 99 uncommitted modified files spanning Waves 0–2 of `REMEDIATION_PLAN.md`. Andres reviewed an animation in-app, said it "looks good" but is worried about it being "too bouncy and chaotic," then said "keep going with wave."

The most relevant in-progress wave is **Wave 2.3 — Canonical Spring Migration** (`damping/stiffness`/`friction/tension` → `springs.*` presets from `src/theme/animations.ts`).

While scoping I found a real bug: **4 sites import `springs.gentle` then immediately override the values, making the migration a visual no-op while *appearing* adopted.** The original tuned values (which are bouncier than `gentle` in 3 of 4 cases) still take effect. Andres's "not too bouncy" concern is partially driven by this — the springs were never actually calmed.

This plan finishes Wave 2.3 cleanly with a calm bias (preferring `gentle` / `standard` / `settle` over `bouncy` / `pop`).

---

## Scope

Three concrete steps. No new components, no architectural changes.

### Step A — Fix the 4 spread+override no-op sites (drop overrides)

| File | Current | After | Net feel |
|------|---------|-------|----------|
| `src/components/HabitCard/entrance/constants.ts:12-15` | `...springs.gentle, damping: 24` | `...springs.gentle` (damping 20) | Slightly more responsive, still calm |
| `src/components/StrengthRing/useStrengthRingAnimation.ts:37-41` | `...springs.gentle, damping: 15, overshootClamping: false` | `...springs.gentle, overshootClamping: false` | **Calmer** (15 → 20 damping) |
| `src/components/DraggableHabit/useCardStrengthFill.ts:50-54` | `...springs.gentle, damping: 12, mass: 0.8, stiffness: 80` | `...springs.gentle, mass: 0.8` | **Calmer** (gentle replaces bouncier override) |
| `src/components/DraggableHabit/useStrengthAnimation.ts:68-72` | `...springs.gentle, damping: 12, mass: 0.8, stiffness: 80` | `...springs.gentle, mass: 0.8` | **Calmer** (gentle replaces bouncier override) |

Rationale: 3 of 4 sites become measurably calmer (matches "not too bouncy"). The entrance site (#1) becomes marginally less damped but `gentle`'s stiffness:100 keeps it stable.

Reference for `gentle`: `damping: 20, stiffness: 100` (`src/theme/animations.ts:100`).

### Step B — Migrate 5 production raw damping/stiffness sites still on Reanimated

These already use `withSpring` but never imported a canonical preset. Map by intent:

| File | Current | Canonical | Why |
|------|---------|-----------|-----|
| `src/components/CreateHabitModal/components/SuggestionChips.tsx:50-51` | damping:12, stiffness:200 | `springs.standard` | Chip selection — micro-interaction |
| `src/components/CreateHabitModal/components/PremiumTeaser/usePremiumTeaserAnimations.ts:21-23` | damping:15, stiffness:150 | `springs.standard` | Already near-canonical, just adopt |
| `src/components/CreateHabitModal/components/HeroNameInput/useHeroNameInputAnimations.ts:58-59` | damping:15, stiffness:200 | `springs.standard` | Input field response |
| `src/components/CreateHabitModal/components/useColorButtonAnimations.ts:23-24` | damping:12, stiffness:180 | `springs.standard` | Button feedback |
| `src/lib/timing/config.ts:142,147` | damping:10, stiffness:100 | Verify intent first | Library default — may be deliberately loose |

Calm bias: every one of these gets damping ≥ 18 (more damped than current).

### Step C — Adopt canonical for `cardPressAnimation`

`src/utils/animations/cardPressAnimation.ts:26-27` already uses literal `damping: 18, stiffness: 150` — exactly `springs.standard`. Replace literals with `...springs.standard` so future tuning happens in one place.

### Out of scope (intentionally deferred)

- **47 legacy `friction/tension` sites across 12 files** (`HabitChainVisualizer/*`, `WeeklySummaryCard`, `CalendarTimeline/CompletionDot`, `CreateHabitModal/EnhancedReminderSelector/*`, `CreateHabitModal/QuickPicksRow/*`, `CreateHabitModal/HabitPreview/*`, `CreateHabitModal/ColorPickerSection/*`). These use the legacy `Animated.spring` API tied to `Animated.Value`. Migrating spring config requires migrating to Reanimated first — that's Wave 3.3 territory, not a Wave 2.3 swap. Doing them surgically here would mean touching the animation runtime per-file, which violates "minimal scope."
- **Test-file spring values** — those are mock fixtures intentionally drifted from canonical to test edge cases.

---

## Critical files

- `src/theme/animations.ts` — canonical spring definitions (read-only reference, lines 83–128)
- 4 files in Step A
- 5 files in Step B
- 1 file in Step C

Total: **10 files modified**, all surgical 1–4 line changes.

---

## Verification

After each step:

1. `npx tsc --noEmit` — types still compile
2. `grep -rnE "damping:\s*[0-9]+|stiffness:\s*[0-9]+" src --include='*.ts' --include='*.tsx' | grep -v "src/theme" | grep -v "__tests__" | grep -v "\.test\." | grep -v "springs\." | grep -v "// "` — should drop from 14 lines → 0 lines after Steps A+B+C
3. Spot-launch the dev build, exercise each touched surface:
   - Habit card entrance (open Today tab, observe new-card slide-in)
   - Strength ring update (toggle a habit complete/incomplete)
   - Strength fill on draggable habit (drag a card)
   - Suggestion chip tap, premium teaser open, hero name input focus, color button tap, color picker swatch tap
4. Side-by-side: before vs. after for any animation Andres flags as "still too bouncy"

If anything feels wrong after migration, revert that single file — surgical scope makes rollback trivial.

---

## Anti-criteria (what NOT to do)

- ❌ Don't touch the 47 legacy `friction/tension` sites — they need the Reanimated migration first (Wave 3.3)
- ❌ Don't change any spring to `bouncy`, `pop`, or `celebration` (Andres explicitly flagged bouncy/chaotic as a concern)
- ❌ Don't gut or rearchitect any animation hook — only swap the config object
- ❌ Don't commit anything — the user has 99 uncommitted files in flight; let them stage/commit when they're ready
