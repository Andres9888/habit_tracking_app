# Habit Strength System Documentation

## Overview

This habit tracking app now computes habit strength using a hybrid model: a calibrated logistic curve that represents how automaticity grows with habit age, combined with a Beta-smoothed compliance score over the last 30 days. The result is a 0–1 strength value that climbs toward 100 % around the 90‑day mark when the user is consistent, and collapses quickly when recent executions are missed.

## Theoretical Foundation

### What is Habit Strength?

Habit strength represents the **cognitive association** between a behavior and its triggering context. Unlike simple streak counting, habit strength:

- Increases with consistent repetitions (but with diminishing returns)
- Decreases gradually when behaviors are skipped
- Reflects automaticity - how likely you are to perform the behavior without conscious thought
- Predicts future behavior completion with 65-77% accuracy

### Key Research Papers

1. **Lally et al. (2010)** – "How are habits formed: Modelling habit formation in the real world"
   - Observed that habit automaticity follows an asymptotic curve, often reaching high automaticity after ~90 days.
   - Provides the empirical grounding for the logistic baseline used in the app.

2. **Zhang et al. (2021)** – "Theory-based habit modeling for enhancing behavior prediction"
   - Demonstrated that computed habit strength is a strong predictor of future behaviour, motivating the use of quantitative models.

3. **Klein et al. (2011)** – "A computational model of habit learning to enable ambient support for lifestyle change"
   - Earlier equation-based approach; elements of their contextual reasoning remain informative for reminders and memory accessibility features.

## The Mathematics

### Core Equations

1. **Baseline automaticity (logistic growth)**

```
Baseline(days) = 1 / (1 + exp(-k × (days - m)))

k = 0.07061188221043205
m = 24.924269028255548
Baseline is normalised by dividing through the value at day 90 and clamped to 1 for days ≥ 90.
```

This normalised curve hits ~22 % on day 7 and reaches 100 % by day 90, reflecting popular 90-day habit guidelines while remaining grounded in Lally et al.’s empirical findings.

2. **Compliance (Beta-smoothed success rate over the last 30 days)**

```
Compliance = (successes + α) / (daysConsidered + α + β)

α = β = 1   // Laplace smoothing to avoid 0 or 1 extremes
daysConsidered = min(30, days since creation)
```

Every calendar day in the window counts as an opportunity. Missing data is treated as `completed = false`, so skipping days rapidly reduces compliance.
When every day in the window is completed, compliance is explicitly set to 100 %.

3. **Habit strength**

```
Strength = clamp(Baseline × Compliance, 0, 1)
```

This ensures:
- Consistent execution drives strength toward 100 % in ~90 days.
- A few missed days collapse the score because compliance falls.
- Very young habits start low and must earn their way up.

## Implementation Architecture

### Database Schema

```typescript
habits: defineTable({
  // ... existing fields
  strength: v.optional(v.number()),           // 0-1 scale
  strengthLevel: v.optional(v.string()),      // "starting" | "building" | ...
  strengthUpdatedAt: v.optional(v.number()),  // Timestamp
  habitDecayParam: v.optional(v.number()),    // Legacy: retained for migrations (not used)
  habitGainParam: v.optional(v.number()),     // Legacy: retained for migrations (not used)
})
```

### Core Functions

#### `convex/habitStrength.ts`

**Main Functions:**
- `generateHabitStrengthSnapshot()` – Produces baseline, compliance, and total strength for a habit.
- `getStrengthLevel()` – Maps 0–1 strength to categorical levels.
- `predictCompletionProbability()` – Predicts future behaviour from the combined score.

**Mutations:**
- `updateHabitStrength` – Upsert the day’s completion state and recompute strength.
- `recalculateHabitStrength` – Re-run the snapshot for existing historical data (useful after imports).
- `updateHabitParameters` – Legacy mutation retained for backwards compatibility.

**Queries:**
- `getHabitStrengthInfo` – Returns strength plus baseline/compliance diagnostics.
- `getAllHabitsStrengthStats` – Dashboard statistics.

### Automatic Updates

Habit strength is automatically recomputed when you toggle a habit. The mutation:
- Saves the day’s completion state.
- Reads the last 30 days of tracking data.
- Runs `generateHabitStrengthSnapshot` to obtain baseline, compliance, and final strength.

## Strength Levels

Habit strength is categorized into 5 levels:

| Level | Range | Emoji | Description | Color |
|-------|-------|-------|-------------|-------|
| **Starting** | 0.0-0.2 | 🌱 | Just beginning - stay focused! | Light Green |
| **Building** | 0.2-0.4 | 🌿 | Making progress - keep it up! | Green |
| **Developing** | 0.4-0.6 | 🌳 | Getting stronger each day! | Medium Green |
| **Strong** | 0.6-0.8 | 💪 | Habit is well-established! | Dark Green |
| **Automatic** | 0.8-1.0 | ⚡ | Fully automatic - amazing! | Deep Green |

## UI Components

### `HabitStrengthIndicator`

A reusable React Native component that visualizes habit strength:

```tsx
<HabitStrengthIndicator
  strength={0.75}                    // 0-1 scale
  strengthLevel="strong"             // Optional override
  compact={false}                    // Compact vs full view
  showLabel={true}                   // Show level name
/>
```

**Views:**
- **Full View**: Progress bar, emoji, level name, percentage, description
- **Compact View**: Small emoji, mini progress bar, percentage only

### Integration in `DraggableHabit`

Habit strength appears below the weekly progress bar:

```tsx
{habit.strength !== undefined && habit.strength > 0 && (
  <HabitStrengthIndicator
    strength={habit.strength}
    strengthLevel={habit.strengthLevel}
    compact={true}
  />
)}
```

## Usage Examples

### Initialize Strength for Existing Habits

```typescript
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

const recalculate = useMutation(api.habitStrength.recalculateHabitStrength);

// Recalculate strength from all historical tracking data
await recalculate({ habitId: habit._id });
```

### Get Habit Strength Info

```typescript
const strengthInfo = useQuery(api.habitStrength.getHabitStrengthInfo, {
  habitId: habit._id
});

// Returns:
// {
//   strength: 0.65,
//   level: "strong",
//   levelInfo: { emoji, label, color, description },
//   baseline: 0.82,
//   compliance: 0.79,
//   complianceWindowDays: 30,
//   complianceSuccesses: 23,
//   predictionProbability: 0.72,
//   model: {
//     logisticSlope: 0.0706,
//     logisticMidpoint: 24.92,
//     complianceWindowDays: 30,
//     compliancePriorAlpha: 1,
//     compliancePriorBeta: 1,
//   }
// }
```

### View All Habits Statistics

```typescript
const stats = useQuery(api.habitStrength.getAllHabitsStrengthStats);

// Returns:
// {
//   totalHabits: 5,
//   averageStrength: 0.54,
//   strongestHabit: { name: "Morning Meditation", strength: 0.82 },
//   weakestHabit: { name: "Read Before Bed", strength: 0.15 },
//   levelDistribution: {
//     starting: 1,
//     building: 1,
//     developing: 2,
//     strong: 1,
//     automatic: 0
//   }
// }
```

## Advanced Features

### Custom Parameters

The new logistic + compliance model currently uses shared parameters for all habits:

- `logisticSlope = 0.0706118822`
- `logisticMidpoint = 24.9242690`
- `complianceWindowDays = 30`
- `α = β = 1`

The legacy `updateHabitParameters` mutation is still available but no longer affects the calculation (it only persisted the previous HDP/HGP values for migration purposes). To experiment with per-habit tuning you can extend `generateHabitStrengthSnapshot` to accept overrides for these new parameters.

### Prediction Feature

Use habit strength to predict future completions:

```typescript
import { predictCompletionProbability } from "@/convex/habitStrength";

const probability = predictCompletionProbability(habit.strength);
// If strength = 0.7, probability ≈ 0.72 (72% chance of completion)
```

This can be used for:
- Adaptive reminders (send when probability is low)
- Progress forecasting
- Intervention timing

## Future Enhancements

### Potential Features

1. **Context Awareness**
   - Track time-of-day patterns
   - Location consistency (GPS)
   - Day-of-week variations
   - Set `Cuet` dynamically instead of 1.0

2. **Adaptive Interventions**
   - Daily reminders when strength < 0.3
   - Weekly check-ins when 0.3-0.6
   - Minimal intervention when > 0.6
   - Celebrate milestones at key thresholds

3. **Strength Decay During Breaks**
   - Pause/snooze should freeze strength
   - Resume with same strength
   - Or allow configurable decay during breaks

4. **Multi-Frequency Habits**
   - Currently assumes daily habits
   - Adjust time scale for weekly/monthly habits
   - Partial credit for multi-per-day habits

5. **Visualization Enhancements**
   - Strength trend graph over time
   - Comparison across habits
   - Strength heatmap calendar view

## Performance Considerations

### Optimization

- Strength calculation is O(1) - constant time
- Recalculation from history is O(n) where n = number of tracking days
- Consider debouncing real-time updates in UI
- Cache strength values in habit document

### Data Migration

For existing users:
```sql
-- All habits start with strength = 0
-- Run recalculateHabitStrength for each habit
-- This processes historical tracking data
```

## Scientific Context

- **Automaticity growth**: Lally et al. (2010) observed that habit automaticity follows an asymmetric growth curve that typically levels off between 60 and 90 days. The logistic baseline is tuned to mirror that empirical progression while still letting the score hit 100 % (with perfect compliance) from day 90 onward.
- **Behaviour prediction**: Zhang et al. (2021) showed that computed habit strength can outperform self-reports when predicting future behaviour. Our compliance multiplier maintains that predictive quality by rewarding recent follow-through.
- **Bayesian smoothing**: The Beta prior (α = β = 1) is the standard Laplace correction for rate estimates. It keeps the strength stable during the first few days and prevents 0/1 extremes after a single success or failure.

## References

1. Klein, M. C. A., Mogles, N., Treur, J., & Van Wissen, A. (2011). A computational model of habit learning to enable ambient support for lifestyle change. In International Conference on Industrial, Engineering and Other Applications of Applied Intelligent Systems (pp. 130-142). Springer.

2. Zhang, C., Vanschoren, J., van Wissen, A., Lakens, D., de Ruyter, B., & IJsselsteijn, W. A. (2021). Theory-based habit modeling for enhancing behavior prediction in behavior change support systems. arXiv preprint arXiv:2101.01637.

3. Lally, P., Van Jaarsveld, C. H., Potts, H. W., & Wardle, J. (2010). How are habits formed: Modelling habit formation in the real world. European journal of social psychology, 40(6), 998-1009.

4. Gardner, B., Abraham, C., Lally, P., & de Bruijn, G. J. (2012). Towards parsimony in habit measurement: Testing the convergent and predictive validity of an automaticity subscale of the Self-Report Habit Index. International Journal of Behavioral Nutrition and Physical Activity, 9(1), 102.

## Support & Questions

For questions about the habit strength system:
- Review this documentation
- Check the inline code comments in `convex/habitStrength.ts`
- Reference the original research papers
- Open an issue for bugs or feature requests

---

**Version**: 1.0.0
**Last Updated**: 2025-01-16
**Author**: Logistic + compliance hybrid inspired by Lally et al. (2010) & Zhang et al. (2021)
