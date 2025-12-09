# Habit Strength Rework PRD

**Author:** Jane
**Date:** 2025-12-09
**Project Level:** Level 1 (Bug Fix + Tuning)
**Status:** Ready for Implementation

---

## Problem Statement

The habit strength system has two critical issues:

### Issue 1: Two Competing Formulas (Bug)
| Mutation | Formula | Used By |
|----------|---------|---------|
| `habits.toggleHabit` | v1 (logistic × compliance) | Most UI paths |
| `tracking.toggleCompletion` | v2 (momentum-based) | HabitCard, QuickCompleteButton |

**Result:** Different UI paths produce inconsistent strength calculations.

### Issue 2: Strength Increases Too Fast
The v1 formula starts at ~49% on Day 1, which feels meaningless and unmotivating.

---

## Solution

Unify all habit toggle paths on the **v2 momentum-based formula** with tuned constants.

### Formula Constants

| Parameter | Current | New | Purpose |
|-----------|---------|-----|---------|
| `GROWTH_RATE` | 0.05 (5%) | **0.03 (3%)** | Slower, more meaningful growth |
| `BASE_DECAY` | 0.025 (2.5%) | **0.02 (2%)** | Slightly more forgiving |
| `SHIELD_EFFECTIVENESS` | 0.6 (60%) | **0.7 (70%)** | Better reward for consistency |

### Formula Behavior

**On Completion:**
```
newStrength = currentStrength + (100 - currentStrength) × GROWTH_RATE
```

**On Miss:**
```
streakShield = completionsLast7Days / 7
protectedDecay = BASE_DECAY × (1 - streakShield × SHIELD_EFFECTIVENESS)
newStrength = currentStrength × (1 - protectedDecay)
```

### Streak Shield Explained

The **Streak Shield** protects users from harsh decay based on recent consistency:

| Last 7 Days | Shield | Effective Decay |
|-------------|--------|-----------------|
| 7/7 (100%) | 70% protection | 0.6% decay |
| 5/7 (71%) | 50% protection | 1.0% decay |
| 3/7 (43%) | 30% protection | 1.4% decay |
| 0/7 (0%) | 0% protection | 2.0% decay (full) |

---

## Day-by-Day Breakdown (Perfect Compliance)

| Day | Strength | Level | Notes |
|-----|----------|-------|-------|
| 1 | 3.0% | 🌱 Starting | First completion |
| 7 | 19.2% | 🌱 Starting | One week |
| 14 | 34.7% | 🌿 Building | Two weeks |
| 21 | 47.3% | 🌿 Building | Three weeks |
| 30 | 59.9% | 🌿 Building | One month |
| 45 | 74.6% | 💪 Strong | Six weeks |
| 60 | 83.9% | 💪 Strong | Two months |
| **66** | **86.6%** | ⚡ Automatic | **"66-day" habit milestone** |
| 90 | 93.6% | ⚡ Automatic | Three months |
| 120 | 97.4% | ⚡ Automatic | Four months |

### Strength Levels

| Level | Range | Emoji | Color |
|-------|-------|-------|-------|
| Starting | 0-29% | 🌱 | `#86efac` (green-300) |
| Building | 30-59% | 🌿 | `#4ade80` (green-400) |
| Strong | 60-84% | 💪 | `#22c55e` (green-500) |
| Automatic | 85-100% | ⚡ | `#15803d` (green-700) |

---

## Miss Scenarios

### Scenario A: Miss 1 day after 14-day streak

| Day | Action | Shield | Strength | Change |
|-----|--------|--------|----------|--------|
| 14 | ✅ Complete | - | 34.7% | - |
| 15 | ❌ Miss | 7/7 (100%) | 34.5% | **-0.2%** |
| 16 | ✅ Complete | - | 36.5% | +2.0% |

**Very forgiving!** One miss = tiny drop, recovered in 1 day.

### Scenario B: Miss 3 days after 30-day streak

| Day | Action | Shield | Strength | Change |
|-----|--------|--------|----------|--------|
| 30 | ✅ Complete | - | 59.9% | - |
| 31 | ❌ Miss | 7/7 (100%) | 59.5% | -0.4% |
| 32 | ❌ Miss | 6/7 (86%) | 59.1% | -0.5% |
| 33 | ❌ Miss | 5/7 (71%) | 58.5% | -0.6% |

**Total drop from 3 misses: ~1.5%** — Life happens, and that's okay.

### Scenario C: Miss with NO recent streak

| Situation | Shield | Strength | Change |
|-----------|--------|----------|--------|
| Starting at 30% | 0/7 (0%) | 29.4% | **-0.6%** |

Without streak protection, full 2% decay applies.

---

## Acceptance Criteria

### AC1: Formula Unification
- [ ] `habits.toggleHabit` uses `calculateNewStrength()` (not `generateHabitStrengthSnapshot()`)
- [ ] All UI paths produce identical strength results

### AC2: Formula Constants Updated
- [ ] `GROWTH_RATE = 0.03`
- [ ] `BASE_DECAY = 0.02`
- [ ] `SHIELD_EFFECTIVENESS = 0.7`

### AC3: Day 1 Behavior
- [ ] New habit with first completion = **3%** strength (not 49%)

### AC4: Day 66 Milestone
- [ ] Perfect compliance for 66 days = **~87%** (Automatic level)

### AC5: Miss Protection
- [ ] Miss 1 day with 7/7 streak = **<0.5%** drop
- [ ] Miss 3 days with good streak = **<2%** total drop

### AC6: Existing Habits Recalculated
- [ ] Migration runs `recalculateHabitStrength` for all habits
- [ ] Uses new formula constants

### AC7: Strength Persists
- [ ] Strength values saved to database after each toggle
- [ ] Values persist across app reload

---

## Implementation Tasks

| # | Task | File(s) | Estimate |
|---|------|---------|----------|
| 1 | Update formula constants | `convex/habitStrength.ts` | 5 min |
| 2 | Update `toggleHabit` to use v2 formula | `convex/habits.ts` | 30 min |
| 3 | Update `recalculateHabitStrength` constants | `convex/habitStrength.ts` | 10 min |
| 4 | Run migration for existing habits | Script/manual | 15 min |
| 5 | Test all scenarios | Manual | 30 min |
| **Total** | | | **~90 min** |

---

## Out of Scope

- Custom growth rates per habit type
- S-curve formula (slow→fast→slow)
- Context-awareness (time of day, location)
- Multiple frequency habits (3x per week)
- Historical strength graphs

---

## Files to Modify

| File | Changes |
|------|---------|
| `convex/habitStrength.ts` | Update GROWTH_RATE, BASE_DECAY, SHIELD_EFFECTIVENESS |
| `convex/habits.ts` | Replace `generateHabitStrengthSnapshot()` with `calculateNewStrength()` in `toggleHabit` |

---

## Approval

- [ ] PM (John): Approved
- [ ] User (Jane): Approved
- [ ] Ready for implementation

---

_This PRD documents a Level 1 bug fix + tuning. No architecture review needed._
