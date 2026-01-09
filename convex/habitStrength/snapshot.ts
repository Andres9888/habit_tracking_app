/**
 * Habit Strength Snapshot Generation
 * Generate comprehensive strength snapshot for a habit
 */
import { MS_PER_DAY } from './constants';
import { computeCompliance } from './compliance';
import { clamp, startOfDay } from './dateUtils';
import { logisticBaseline } from './logistic';
import { getStrengthLevel } from './strengthLevel';
import type { HabitStrengthSnapshot, HabitTrackingRecord } from './types';

export function generateHabitStrengthSnapshot({
  habitCreatedAt,
  tracking,
  throughDate = startOfDay(new Date()),
}: {
  habitCreatedAt: number;
  tracking: HabitTrackingRecord[];
  throughDate?: Date;
}): HabitStrengthSnapshot {
  const evaluationDate = startOfDay(throughDate);
  const creationDate = startOfDay(new Date(habitCreatedAt));
  const daysSinceCreation = Math.max(
    0,
    Math.floor((evaluationDate.getTime() - creationDate.getTime()) / MS_PER_DAY)
  );

  const trackingMap = new Map<string, boolean>();
  for (const entry of tracking) {
    trackingMap.set(entry.date, entry.completed);
  }

  const baseline = logisticBaseline(daysSinceCreation);
  const complianceStats = computeCompliance({
    evaluationDate,
    habitCreatedAt,
    trackingMap,
  });

  // Formula: compliance × (0.4 + 0.6 × baseline)
  // Day 1 with 100% compliance = ~49%
  // Day 90 with 100% compliance = 100%
  const timeBonus = 0.4 + 0.6 * baseline;
  const strength = clamp(complianceStats.compliance * timeBonus, 0, 1);

  return {
    baseline,
    compliance: complianceStats.compliance,
    complianceDaysConsidered: complianceStats.daysConsidered,
    complianceSuccesses: complianceStats.successes,
    daysSinceCreation,
    lastEvaluatedDate: evaluationDate,
    strength,
    strengthLevel: getStrengthLevel(strength),
  };
}
