/**
 * Attribute calculation functions for character stats
 */

import type { Doc, Id } from '../_generated/dataModel';

interface Attributes {
  vitality: number;
  strength: number;
  wisdom: number;
  energy: number;
}

/**
 * Calculate all character attributes
 */
export function calculateAttributes(
  habits: Doc<'habits'>[],
  allTracking: Doc<'tracking'>[],
  habitStreaks: Map<Id<'habits'>, number>
): Attributes {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Vitality: Overall consistency (average completion rate over last 30 days)
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const last30DaysTracking = allTracking.filter((t) => {
    const trackingDate = new Date(t.date);
    return trackingDate >= thirtyDaysAgo && trackingDate <= today;
  });
  const possibleCompletions = habits.length * 30;
  const actualCompletions = last30DaysTracking.filter(
    (t) => t.completed
  ).length;
  const vitality = Math.min(
    100,
    Math.round((actualCompletions / Math.max(possibleCompletions, 1)) * 100)
  );

  // Strength: Average streak strength across all habits
  const streakValues = [...habitStreaks.values()];
  const avgStreak =
    streakValues.length > 0
      ? streakValues.reduce((a, b) => a + b, 0) / streakValues.length
      : 0;
  const strength = Math.min(100, Math.round(avgStreak * 10));

  // Wisdom: Based on total unique days tracked (experience)
  const uniqueDates = new Set(
    allTracking.filter((t) => t.completed).map((t) => t.date)
  );
  const totalDaysTracked = uniqueDates.size;
  const wisdom = Math.min(100, Math.round((totalDaysTracked / 100) * 100));

  // Energy: Recent activity (last 7 days completion rate)
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const last7DaysTracking = allTracking.filter((t) => {
    const trackingDate = new Date(t.date);
    return trackingDate >= sevenDaysAgo && trackingDate <= today;
  });
  const possibleLast7Days = habits.length * 7;
  const actualLast7Days = last7DaysTracking.filter((t) => t.completed).length;
  const energy = Math.min(
    100,
    Math.round((actualLast7Days / Math.max(possibleLast7Days, 1)) * 100)
  );

  return { energy, strength, vitality, wisdom };
}
