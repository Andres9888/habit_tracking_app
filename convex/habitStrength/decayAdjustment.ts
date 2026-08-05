/**
 * Decay Adjustment
 * Closed-form decay applied to a stored habit strength so reads reflect
 * elapsed missed days since the last server-side recalculation. Mirrors the
 * day-by-day decay in calculateNewStrength: strength * (1 - baseDecay)^days.
 */
import { resolveAlgorithmMode, getAlgorithmConfig } from './algorithmConfig';
import { MS_PER_DAY } from './constants';
import { getStrengthLevel } from './strengthLevel';

type HabitStrengthFields = {
  strength?: number;
  strengthAlgorithm?: string | null;
  strengthLevel?: string;
  strengthUpdatedAt?: number;
};

const MAX_DECAY_DAYS = 3650;

export function withDecayedStrength<T extends HabitStrengthFields>(
  habit: T,
  now: number = Date.now()
): T {
  const stored = habit.strength;
  const lastUpdated = habit.strengthUpdatedAt;
  if (stored === undefined || stored <= 0) return habit;
  if (lastUpdated === undefined) return habit;

  const elapsedMs = now - lastUpdated;
  if (elapsedMs <= 0) return habit;

  const daysSinceUpdate = Math.min(
    MAX_DECAY_DAYS,
    Math.floor(elapsedMs / MS_PER_DAY)
  );
  if (daysSinceUpdate <= 0) return habit;

  const { baseDecay } = getAlgorithmConfig(
    resolveAlgorithmMode(habit.strengthAlgorithm)
  );
  const multiplier = (1 - baseDecay) ** daysSinceUpdate;
  const adjusted = Math.max(0, stored * multiplier);
  if (adjusted === stored) return habit;

  return {
    ...habit,
    strength: adjusted,
    strengthLevel: getStrengthLevel(adjusted),
  };
}
