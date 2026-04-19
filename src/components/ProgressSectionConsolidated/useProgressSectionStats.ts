/* eslint-disable max-lines */
import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * useProgressSectionStats Hook
 *
 * Computes all derived statistics for the ProgressSectionConsolidated component.
 */

import { useMemo } from 'react';

// Tracking data passed in - may be Convex docs or minimal records
 
import type { Id } from '../../../convex/_generated/dataModel';

type TrackingRecord = {
  _id: Id<'tracking'>;
  _creationTime: number;
  userId?: string;
  habitId: Id<'habits'>;
  date: string;
  completed: boolean;
};
import {
  calculateCurrentStreak,
  calculateDayOfWeekStats,
  calculateStreakRecords,
  generateActionableTip,
  getBestAndWorstDays,
} from '../ProgressSection/utils';
import { calculateMonthlyChangeForStatsGrid } from '../../utils/trendCalculations';

interface UseProgressSectionStatsProps {
  tracking: TrackingRecord[];
  habitCreatedAt?: string;
}

/**
 * Computes all statistics needed for the progress section.
 */
export function useProgressSectionStats({
  tracking,
  habitCreatedAt,
}: UseProgressSectionStatsProps) {
  // Convert habitCreatedAt string to timestamp
  const habitCreatedTimestamp = useMemo(() => {
    if (!habitCreatedAt) return;
    try {
      return new Date(habitCreatedAt).getTime();
    } catch {
      return;
    }
  }, [habitCreatedAt]);

  // Calculate day of week statistics
  const dayStats = useMemo(
    () => calculateDayOfWeekStats(tracking, habitCreatedTimestamp),
    [tracking, habitCreatedTimestamp]
  );

  // Calculate current streak
  const currentStreak = useMemo(
    () => calculateCurrentStreak(tracking),
    [tracking]
  );

  // Calculate streak records for accordion
  const streakRecords = useMemo(
    () => calculateStreakRecords(tracking, currentStreak),
    [tracking, currentStreak]
  );

  // Best streak ever — top of streakRecords (sorted desc) or current streak
  const bestStreak = useMemo(
    () => Math.max(currentStreak, streakRecords[0]?.days ?? 0),
    [streakRecords, currentStreak]
  );

  // Lifetime completion rate as 0-100 percent
  const completionRate = useMemo(() => {
    if (!habitCreatedTimestamp) return 0;
    const completedCount = tracking.filter((t) => t.completed).length;
    const daysSince = Math.max(
      1,
      Math.ceil((Date.now() - habitCreatedTimestamp) / 86_400_000)
    );
    return Math.round((completedCount / daysSince) * 100);
  }, [tracking, habitCreatedTimestamp]);

  // Calculate monthly change for trend indicator
  const monthlyChange = useMemo(
    () => calculateMonthlyChangeForStatsGrid(tracking),
    [tracking]
  );

  // Get best and worst performing days
  const { bestDay, worstDay } = useMemo(
    () => getBestAndWorstDays(dayStats),
    [dayStats]
  );

  // Generate actionable tip based on patterns
  const actionableTip = useMemo(
    () => generateActionableTip(dayStats, currentStreak),
    [dayStats, currentStreak]
  );

  // Calculate this month's completed/total days
  const { monthlyCompleted, monthlyTotal } = useMemo(() => {
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const completedDates = new Set(
      tracking.filter((t) => t.completed).map((t) => t.date)
    );

    let completed = 0;
    let total = 0;

    const current = new Date(thisMonthStart);
    while (current <= today) {
      total++;
      if (completedDates.has(getLocalDateString(current))) {
        completed++;
      }
      current.setDate(current.getDate() + 1);
    }

    return { monthlyCompleted: completed, monthlyTotal: total };
  }, [tracking]);

  // Determine if we have enough data to show detailed sections
  const hasEnoughData = tracking.length >= 7;

  // Format best/worst days for InsightChips
  const bestDayData = useMemo(() => {
    if (!bestDay) return null;
    return { name: bestDay.day, rate: bestDay.rate };
  }, [bestDay]);

  const focusDayData = useMemo(() => {
    if (!worstDay) return null;
    // Only show focus day if it's different from best day and below 70%
    if (bestDay && worstDay.dayIndex === bestDay.dayIndex) return null;
    if (worstDay.rate >= 70) return null;
    return { name: worstDay.day, rate: worstDay.rate };
  }, [worstDay, bestDay]);

  return {
    actionableTip,
    bestDayData,
    bestStreak,
    completionRate,
    currentStreak,
    dayStats,
    focusDayData,
    hasEnoughData,
    monthlyChange,
    monthlyCompleted,
    monthlyTotal,
    streakRecords,
  };
}
