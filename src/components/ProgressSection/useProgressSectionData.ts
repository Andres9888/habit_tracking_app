import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * useProgressSectionData Hook
 *
 * Calculates all derived statistics for the ProgressSection component.
 */

import { useMemo } from 'react';
import type { HabitTrackingEntry as Tracking } from '../../features/habits/types';
import {
  calculateDayOfWeekStats,
  calculateStreakRecords,
  calculateTrendComparison,
  calculateCurrentStreak,
  generateActionableTip,
} from './utils';

interface UseProgressSectionDataArgs {
  tracking: Tracking[];
  habitCreatedAt: string | Date | number | undefined;
}

export function useProgressSectionData({
  tracking,
  habitCreatedAt,
}: UseProgressSectionDataArgs) {
  const createdAtNumber = typeof habitCreatedAt === 'number'
    ? habitCreatedAt
    : habitCreatedAt === null || habitCreatedAt === undefined
      ? undefined
      : new Date(habitCreatedAt).getTime();

  const dayStats = useMemo(
    () => calculateDayOfWeekStats(tracking, createdAtNumber),
    [tracking, createdAtNumber]
  );

  const currentStreak = useMemo(
    () => calculateCurrentStreak(tracking),
    [tracking]
  );

  const streakRecords = useMemo(
    () => calculateStreakRecords(tracking, currentStreak),
    [tracking, currentStreak]
  );

  const trend = useMemo(() => calculateTrendComparison(tracking), [tracking]);

  const bestDay = useMemo(() => {
    const withData = dayStats.filter((d) => d.total > 0);
    if (withData.length === 0) return null;
    let best = withData[0];
    for (const day of withData) {
      if (day.rate > best.rate) best = day;
    }
    return best;
  }, [dayStats]);

  const worstDay = useMemo(() => {
    const withData = dayStats.filter((d) => d.total > 0);
    if (withData.length === 0) return null;
    let worst = withData[0];
    for (const day of withData) {
      if (day.rate < worst.rate) worst = day;
    }
    return worst;
  }, [dayStats]);

  const actionableTip = useMemo(
    () => generateActionableTip(dayStats, currentStreak),
    [dayStats, currentStreak]
  );

  const thisMonthStats = useMemo(() => {
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const completedDates = new Set(
      tracking.filter((t) => t.completed).map((t) => t.date)
    );

    let completedDays = 0;
    let totalDays = 0;

    const current = new Date(thisMonthStart);
    while (current <= today) {
      totalDays++;
      if (completedDates.has(getLocalDateString(current))) {
        completedDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return { completedDays, totalDays };
  }, [tracking]);

  const hasEnoughData = tracking.length >= 7;

  return {
    actionableTip,
    bestDay,
    currentStreak,
    dayStats,
    hasEnoughData,
    streakRecords,
    thisMonthStats,
    trend,
    worstDay,
  };
}
