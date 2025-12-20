# Project Workflow Analysis

**Date:** 2025-12-09
**Project:** Habit Strength Rework
**Analyst:** Jane

## Assessment Results

### Project Classification

- **Project Type:** Mobile application (existing)
- **Project Level:** Level 1 (Coherent Feature)
- **Instruction Set:** instructions-med.md

### Scope Summary

- **Brief Description:** Fix and improve the habit strength calculation system - currently broken due to two competing formulas, and when working, strength increases too quickly
- **Estimated Stories:** 3-5
- **Estimated Epics:** 1
- **Timeline:** 1-3 days

### Context

- **Greenfield/Brownfield:** Brownfield (adding to existing clean codebase)
- **Existing Documentation:**
  - HABIT_STRENGTH_SYSTEM.md (v1 documentation)
  - habit-strength-rework-v2.md (v2 spec, partially implemented)
- **Team Size:** Individual developer
- **Deployment Intent:** Production app fix

## Identified Problems

### Problem 1: Two Competing Formulas
- `habits.toggleHabit` uses v1 formula (logistic × compliance)
- `tracking.toggleCompletion` uses v2 formula (momentum-based)
- Different UI paths produce inconsistent results

### Problem 2: v1 Formula Starts Too High
- Day 1 with single completion = 49% strength
- Not realistic or motivating

### Problem 3: v2 Formula Grows Too Fast
- Current GROWTH_RATE = 5%
- Day 7 = 30%, Day 14 = 51%
- Users reported it feels too quick

## Recommended Solution

### Formula Constants (v2 tuned)
- GROWTH_RATE: 5% → **3%**
- BASE_DECAY: 2.5% → **2%**
- SHIELD_EFFECTIVENESS: 60% → **70%**

### Expected Behavior
- Day 7: ~19% (Starting)
- Day 21: ~47% (Building)
- Day 66: ~87% (Automatic) ← Aligns with "66 day" habit belief
- Day 90: ~94% (Automatic)

## Recommended Workflow Path

### Primary Outputs

- **PRD** - Document requirements and acceptance criteria
- **Tech Spec** - Implementation details (can be minimal, straightforward fix)

### Workflow Sequence

1. Create PRD documenting the fix
2. Unify mutations to use v2 formula
3. Tune formula constants
4. Recalculate existing habit strengths
5. Test and validate

## Technical Preferences Captured

- Use v2 momentum-based formula (not v1 logistic)
- Streak shield concept approved
- Target "Automatic" level around 66 days
- Forgiving on misses

---

_This analysis serves as the routing decision for the adaptive PRD workflow._
