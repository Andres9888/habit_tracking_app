# Habit Strength Progression with Klein et al. Parameters

This table shows the habit-strength value when a habit is completed every single day using the
logistic baseline adopted in `convex/habitStrength.ts` (`baseline(d) = 1 / (1 + exp(-0.0706 × (d - 24.9)))`).
It assumes perfect compliance, so the compliance multiplier equals 1.0. Strength starts at day 0.

| Day | Strength (%) |
| --: | -----------: |
|   0 |        14.83 |
|   1 |        15.74 |
|   2 |        16.71 |
|   3 |        17.71 |
|   4 |        18.77 |
|   5 |        19.87 |
|   6 |        21.02 |
|   7 |        22.22 |
|  14 |        31.94 |
|  21 |        43.55 |
|  28 |        55.97 |
|  35 |        67.75 |
|  42 |        77.73 |
|  49 |        85.41 |
|  56 |        90.88 |
|  63 |        94.58 |
|  70 |        96.99 |
|  77 |        98.52 |
|  84 |        99.48 |
|  90 |       100.00 |
| 100 |       100.00 |
| 120 |       100.00 |

Because compliance is multiplied with this baseline, the real-world strength will only stay high if
recent executions remain consistent. Skipping several days will drag the compliance factor toward 0,
even if the baseline has reached the 90-day plateau.
