# Zhang et al. (2021) Implementation Guide

## Theory-Based Habit Modeling for Enhancing Behavior Prediction

This document describes how our habit tracking app implements the empirically-validated computational models from Zhang et al. (2021).

## Overview

The Zhang et al. (2021) paper validates that **computed habit strength outperforms self-reported measures** for predicting future behavior, achieving **65-77% prediction accuracy** in real-world field studies.

## Key Research Findings

### 1. Optimal Parameter Ranges (Empirically Validated)

Through nested cross-validation on two intervention studies with toothbrushing behavior:

- **Habit Decay Parameter (HDP)**: 0.15 - 0.2 (optimal: **0.175**)
- **Habit Gain Parameter (HGP)**: 0.1 - 0.2 (optimal: **0.15**)

These parameters remained consistent across different studies, suggesting they generalize well for habit formation in daily behaviors.

### 2. Theory-Based Models Outperformed Baselines

- **Better than self-report** (SRHI/SRBAI) in both studies
- **Better than past behavior frequency** in larger study (n=79)
- **Combined model** (habit strength + accessibility) performed best

### 3. Two Cognitive Systems

The paper validates two computational models:

#### A. Habit Strength (Klein et al., 2011)
```
HS(t+1) = HS(t) - HS(t) × HDP + (1 - HS(t)) × Beh(t) × Cue(t) × HGP
```

- **Primary predictor** of future behavior
- Represents learned cognitive association between behavior and context
- Asymptotic growth toward 1.0
- Proportional decay when behavior not performed

#### B. Memory Accessibility (Tobias, 2009)
```
Acc(t+1) = Acc(t) - Acc(t) × ADP + (1 - Acc(t)) × (Beh(t) × AGP_beh + Rem(t) × AGP_rem)
```

- **Secondary predictor** of behavior recall
- Represents how easily the behavior comes to mind
- Decays naturally over time (memory fading)
- Restored by behavior execution or reminders

## Our Implementation

### Schema Updates

```typescript
habits: {
  // Habit Strength System (Klein et al., 2011; Zhang et al., 2021)
  strength: number,                    // 0-1 scale
  strengthLevel: string,               // "starting" | "building" | "developing" | "strong" | "automatic"
  strengthUpdatedAt: number,
  habitDecayParam: number,             // HDP: default 0.175
  habitGainParam: number,              // HGP: default 0.15

  // Memory Accessibility System (Tobias, 2009; Zhang et al., 2021)
  accessibility: number,               // 0-1 scale, starts at 1.0
  accessibilityUpdatedAt: number,
  accessibilityDecayParam: number,     // ADP: default 0.3
  accessibilityGainBehavior: number,   // AGP_beh: default 0.5
  accessibilityGainReminder: number,   // AGP_rem: default 0.7

  // Behavior Prediction
  predictedCompletionProb: number,     // 0-1 probability
  lastPredictionAt: number,
}
```

### Core Functions

#### 1. Habit Strength Calculation
```typescript
calculateHabitStrength(
  currentStrength: number,
  behaviorPerformed: boolean,
  HDP: number = 0.175,
  HGP: number = 0.15
): number
```

**Key Properties:**
- Diminishing returns: `(1 - HS)` means early repetitions matter more
- Proportional decay: `HS × HDP` means stronger habits decay slower
- Asymptotic growth: Approaches but never exceeds 1.0

#### 2. Memory Accessibility Calculation
```typescript
calculateMemoryAccessibility(
  currentAccessibility: number,
  behaviorPerformed: boolean,
  reminderReceived: boolean,
  ADP: number = 0.3,
  AGP_beh: number = 0.5,
  AGP_rem: number = 0.7
): number
```

**Key Properties:**
- Natural decay represents memory fading
- Restored by behavior execution (AGP_beh)
- Boosted by external reminders (AGP_rem)

#### 3. Combined Behavior Prediction
```typescript
predictCompletionProbability(
  habitStrength: number,
  accessibility: number = 1.0
): number
```

**Returns:** Probability (0-1) that the behavior will be performed tomorrow

**Accuracy:** 65-77% based on Zhang et al. (2021) validation studies

## Practical Applications

### 1. Adaptive Reminders

```typescript
// Example: Send reminder only when needed
if (predictedProb < 0.4) {
  sendReminder(habit);
} else if (predictedProb < 0.6) {
  sendGentleNudge(habit);
}
// No reminder if predictedProb >= 0.6
```

### 2. Intervention Timing

```typescript
// Withdraw interventions when habit is strong
if (habit.strength > 0.8 && habit.accessibility > 0.7) {
  stopReminders(habit);
  // Behavior maintained by strong habit alone
}
```

### 3. Progress Tracking

```typescript
// Real-time habit formation progress
const progressPercentage = habit.strength * 100;
const stage = habit.strengthLevel; // "starting", "building", etc.
```

## Why This Matters

### 1. **No User Burden**
- No need for weekly surveys (SRHI/SRBAI)
- System computes habit strength automatically from behavior
- Less intrusive than self-report measures

### 2. **More Accurate Than Simple Metrics**
- Better than counting past behavior frequency
- Better than self-reported automaticity
- Accounts for temporal dynamics (decay/growth)

### 3. **Theory-Based = Generalizable**
- Parameters validated across two studies
- Based on psychological theories of habit formation
- Likely to work for other daily behaviors

### 4. **Real-Time Adaptation**
- Update after every habit toggle
- Predict tomorrow's behavior today
- Deliver just-in-time interventions

## Limitations & Future Work

### From Zhang et al. (2021)

1. **Parameter Generalization**
   - Optimal parameters may vary across:
     - Different behavioral domains
     - Different user populations
     - Different contexts
   - Solution: Allow per-habit parameter tuning

2. **Accessibility Contribution**
   - Zhang et al. found accessibility had limited predictive power
   - Possible reasons:
     - Weekly measurements too infrequent
     - Need to track reminders more systematically
   - Our approach: Track reminders at event level

3. **Context Factors**
   - Original study simplified context (Cue = 1.0)
   - Future: Track context variables:
     - Time of day
     - Location
     - Emotional state
     - Social context

### Our Roadmap

- [ ] Add reminder tracking system
- [ ] Implement context-aware strength calculation
- [ ] Create prediction-based notification system
- [ ] A/B test reminder strategies based on predictions
- [ ] Export habit strength data for user insights

## References

**Primary Paper:**
Zhang, C., Vanschoren, J., van Wissen, A., Lakens, D., de Ruyter, B., & IJsselsteijn, W. A. (2021). Theory-based Habit Modeling for Enhancing Behavior Prediction. arXiv preprint arXiv:2101.01637.

**Computational Model:**
Klein, M. C., Mogles, N., Treur, J., & Van Wissen, A. (2011). A computational model of habit learning to enable ambient support for lifestyle change. In International Conference on Industrial, Engineering and Other Applications of Applied Intelligent Systems (pp. 130-142). Springer.

**Memory Accessibility:**
Tobias, R. (2009). Changing behavior by memory aids: A social psychological model of prospective memory and habit development tested with dynamic field data. Psychological Review, 116(2), 408.

**Habit Measurement:**
Gardner, B., Abraham, C., Lally, P., & de Bruijn, G. J. (2012). Towards parsimony in habit measurement: Testing the convergent and predictive validity of an automaticity subscale of the self-report habit index. International Journal of Behavioral Nutrition and Physical Activity, 9(1), 102.

---

*Implementation Status: ✅ Core system complete | 🔄 Advanced features in progress*
