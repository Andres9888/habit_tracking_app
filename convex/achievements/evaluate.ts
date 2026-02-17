/**
 * Badge Evaluation Engine
 *
 * Computes user metrics from habit + tracking data,
 * then checks each badge definition against thresholds.
 */

import type { Doc, Id } from '../_generated/dataModel';
import { BADGE_DEFINITIONS } from './badges';
import type { BadgeDefinition } from './badges';

export interface BadgeMetrics {
  maxStreak: number;
  totalCompletions: number;
  activeHabits: number;
  earlyCompletions: number;
  lateCompletions: number;
  perfectWeeks: number;
  uniqueCategories: number;
  level: number;
  totalPower: number;
}

export interface EvaluatedBadge {
  badge: BadgeDefinition;
  unlocked: boolean;
  progress: number; // 0–1
  current: number;
}

/**
 * Calculate all metrics from raw data
 */
export function calculateMetrics(
  habits: Doc<'habits'>[],
  tracking: Doc<'tracking'>[],
  level: number,
  totalPower: number,
  maxStreak: number
): BadgeMetrics {
  const completedTracking = tracking.filter((t) => t.completed);
  const totalCompletions = completedTracking.length;

  // Early/late completions (based on tracking creation time)
  let earlyCompletions = 0;
  let lateCompletions = 0;
  for (const t of completedTracking) {
    const hour = new Date(t._creationTime).getHours();
    if (hour < 7) earlyCompletions++;
    if (hour >= 22) lateCompletions++;
  }

  // Perfect weeks: count weeks where all habits completed every day
  const perfectWeeks = calculatePerfectWeeks(habits, tracking);

  // Unique categories
  const categories = new Set(
    habits.map((h) => h.category).filter(Boolean)
  );

  return {
    maxStreak,
    totalCompletions,
    activeHabits: habits.length,
    earlyCompletions,
    lateCompletions,
    perfectWeeks,
    uniqueCategories: categories.size,
    level,
    totalPower,
  };
}

function calculatePerfectWeeks(
  habits: Doc<'habits'>[],
  tracking: Doc<'tracking'>[]
): number {
  if (habits.length === 0) return 0;

  // Build a set of "habitId:date" for completed tracking
  const completedSet = new Set<string>();
  for (const t of tracking) {
    if (t.completed) {
      completedSet.add(`${t.habitId}:${t.date}`);
    }
  }

  // Get all unique dates, sorted
  const allDates = [...new Set(tracking.map((t) => t.date))].sort();
  if (allDates.length < 7) return 0;

  let perfectWeeks = 0;
  let consecutivePerfect = 0;

  for (const date of allDates) {
    const allCompleted = habits.every((h) =>
      completedSet.has(`${h._id}:${date}`)
    );
    if (allCompleted) {
      consecutivePerfect++;
      if (consecutivePerfect >= 7) {
        perfectWeeks++;
        consecutivePerfect = 0;
      }
    } else {
      consecutivePerfect = 0;
    }
  }

  return perfectWeeks;
}

/**
 * Evaluate all badges against computed metrics
 */
export function evaluateBadges(metrics: BadgeMetrics): EvaluatedBadge[] {
  return BADGE_DEFINITIONS.map((badge) => {
    const current = metrics[badge.criteriaKey as keyof BadgeMetrics] as number;
    const unlocked = current >= badge.threshold;
    const progress = Math.min(current / badge.threshold, 1);

    return { badge, unlocked, progress, current };
  });
}
