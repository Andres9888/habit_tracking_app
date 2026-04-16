# Review: Habit Strength System — Is This a Good Direction?

## Context

Andres asked for a review of how habit strength works and whether it's a good direction. This is an assessment of the current implementation — architecture, algorithm soundness, UX coherence, and strategic fit.

---

## System Overview

The app has a **dual-formula** habit strength system:

| System | Location | Algorithm | Used For |
|--------|----------|-----------|----------|
| **Momentum v2.0** | `convex/habitStrength/momentum.ts` | Exponential gap-fill + streak shield | Real-time backend updates on toggle |
| **Snapshot/Hybrid** | `convex/habitStrength/snapshot.ts` | 30-day compliance × logistic baseline | Analytics detail views |
| **Frontend (Loop)** | `src/components/HabitStrengthHistory/strengthUtils/` | Simple exponential smoothing | Timeline/chart generation |

### Momentum v2.0 (Backend — production authority)
- **Growth**: `strength + (100 - strength) × 0.03` — fills 3% of remaining gap
- **Decay**: `strength × (1 - 0.02 × (1 - streakShield × 0.7))` — 2% base, softened by 7-day history
- **Streak Shield**: `completionsLast7Days / 7` — full week = 70% decay reduction
- **Levels**: Starting (<30%), Building (30-59%), Strong (60-84%), Automatic (85%+)

### Frontend (Loop Habit Tracker algorithm)
- **Growth**: `strength + (1 - strength) × 0.05` — 5% gap fill
- **Decay**: `strength × 0.95` — flat 5% multiplicative decay
- No streak shield

---

## Assessment

### What's Working Well

1. **The core concept is sound.** Habit strength as a single metric that reflects consistency is the right abstraction. Users need one number that answers "how am I doing?" — this provides it.

2. **Streak shield is psychologically correct.** The biggest retention killer in habit apps is "I missed one day after a 30-day streak, now I'm back to nothing." The 7-day shield directly addresses this. Missing one day after 6 completions only decays ~0.6% instead of 2%. This aligns with Andres's stated goal of biasing toward engagement over punishment.

3. **Exponential gap-filling is a good growth curve.** Early days feel fast (0→3, 3→5.9, 5.9→8.7...), later days plateau naturally. This creates the "easy early wins" psychology that keeps new users going.

4. **Test coverage is solid.** 50+ tests across backend and frontend calculations. The momentum formula, snapshot formula, compliance window, and strength levels all have dedicated tests.

5. **Clean decomposition.** The `convex/habitStrength/` module is well-organized: `momentum.ts`, `snapshot.ts`, `compliance.ts`, `logistic.ts`, `strengthLevel.ts`, `constants.ts`, `dateUtils.ts`, `types.ts`. Each file is focused and under 100 lines.

### Concerns

#### 1. Three formulas computing "strength" with different results

This is the biggest issue. The same concept ("habit strength") is calculated three different ways:

| Formula | Day 1 (100% compliance) | Day 30 (100%) | Day 90 (100%) |
|---------|------------------------|---------------|---------------|
| **Momentum** (backend) | 3% | ~60% | ~93% |
| **Snapshot** (analytics) | ~49% | ~85% | 100% |
| **Frontend/Loop** (charts) | 5% | ~78% | ~99% |

A user looking at their habit card (momentum) vs. the detail view charts (frontend/Loop) vs. analytics (snapshot) could see meaningfully different numbers for the same habit. The frontend hook (`useHabitStrength`) even has this comment:

> "Uses DB strength if provided, else calculated"

This means the app tries to use the backend momentum value but falls back to the frontend Loop algorithm. The fallback produces different numbers.

**Risk**: User confusion. "Why does my card say 60% but my chart says 78%?"

#### 2. Momentum formula is quite slow to grow

At 3% gap-fill per day, reaching 85% ("Automatic") takes ~63 consecutive days of completions. Reaching even 60% takes ~30 consecutive days. For a user who completes 5/7 days per week (a very good user!), the streak shield helps decay but growth is still slow — they may sit in "Starting" or "Building" for months.

**Implication for Andres's design intent**: The memory note says "If a growth curve feels too slow to be satisfying, consider making early progress more visible." The current 3% rate may feel slow for engaged users.

#### 3. Snapshot formula has a generous floor

The snapshot formula uses `compliance × (0.4 + 0.6 × baseline)`. Even on day 1 with 100% compliance, it returns ~49%. This is much more generous than momentum's 3%. It means analytics views could show significantly higher strength than the main habit card, which could be confusing — or it could be seen as the "encouraging" view.

#### 4. 4-level system feels thin

Starting → Building → Strong → Automatic is only 4 levels across 0-100%. The PRD/schema mentions a 5th level ("Developing") but `getStrengthLevel()` only returns 4. Each level spans a wide range (30 points), so users can grind for weeks without seeing a level change. More granular milestones (or sub-levels) would provide more frequent reward signals.

#### 5. Legacy constants still present

`constants.ts` has Klein model params, accessibility decay params, and logistic curve params alongside momentum params. The legacy formula file exists for "backwards compatibility." This isn't a bug, but it's tech debt that could confuse future contributors.

---

## Verdict: Is This a Good Direction?

**Yes, with caveats.** The direction is right. Habit strength as the core metric, streak-protected decay, and exponential gap-fill growth are all solid choices backed by behavioral psychology. The implementation is clean, well-tested, and production-ready.

The main risk is **formula divergence** — three different algorithms producing different numbers for "strength" will eventually confuse users or create bugs. The recommendation is to converge on one formula (momentum v2.0 is the strongest candidate) and use it everywhere.

---

## Recommended Next Steps (if desired)

1. **Unify to one formula.** Use momentum v2.0 everywhere. Replace the frontend Loop algorithm in `strengthUtils/calculation.ts` with a call to the same momentum logic (or port it to TypeScript for the frontend). Remove the snapshot formula unless it's needed for a distinct purpose.

2. **Consider tuning growth rate.** Run the numbers for a 5/7-days-per-week user and check if the pacing feels rewarding. Currently 3% might be tuned up to 4-5% to match Andres's "fun over accuracy" intent.

3. **Add the 5th level.** The schema has "developing" defined. Wire it into `getStrengthLevel()` to create more milestone moments (e.g., Starting < 20%, Building 20-39%, Developing 40-59%, Strong 60-84%, Automatic 85+).

4. **Clean up legacy constants.** Move Klein/accessibility params to a `legacy/` subfolder or delete if no longer referenced.

---

## Key Files

- `convex/habitStrength/momentum.ts` — production algorithm
- `convex/habitStrength/snapshot.ts` — analytics formula
- `convex/habitStrength/constants.ts` — all tuning knobs
- `convex/habitStrength/strengthLevel.ts` — level thresholds
- `src/components/HabitStrengthHistory/strengthUtils/calculation.ts` — frontend algorithm (different from backend)
- `src/components/HabitStrengthHistory/strengthUtils/constants.ts` — frontend constants (0.05 growth, 0.95 decay)
- `src/hooks/useHabitStrength.ts` — main frontend hook
