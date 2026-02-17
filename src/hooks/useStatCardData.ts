/**
 * useStatCardData — derives stat card payloads from existing Convex analytics queries
 *
 * All three card shapes are computed client-side from data that is already
 * fetched for the Analytics screen — no extra network calls needed.
 */

import { useMemo } from 'react';
import type {
  StreakCardData,
  MonthlyRecapCardData,
  YearInReviewCardData,
  TopHabitStreak,
} from '../components/StatCardGenerator/StatCardGenerator.types';

interface RankedHabit {
  id: string;
  name: string;
  emoji?: string;
  strength: number;
  currentStreak?: number;
  longestStreak?: number;
}

interface ComplianceDay {
  date: string;
  completionRate: number;
  completed?: number;
  total?: number;
}

interface OverviewStats {
  totalHabits: number;
  averageStrength: number;
  rankedHabits: RankedHabit[];
}

interface UseStatCardDataParams {
  overviewStats: OverviewStats | undefined;
  complianceData: ComplianceDay[] | undefined;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ---------------------------------------------------------------------------
// Helper: get YYYY-MM from a date string or today
// ---------------------------------------------------------------------------
function getMonthLabel(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getCurrentYear(): number {
  return new Date().getFullYear();
}

// ---------------------------------------------------------------------------
// Main hook
// ---------------------------------------------------------------------------

export function useStatCardData({
  overviewStats,
  complianceData,
}: UseStatCardDataParams): {
  streakData: StreakCardData;
  monthlyData: MonthlyRecapCardData;
  yearData: YearInReviewCardData;
} {
  // ── Streak card ────────────────────────────────────────────────────────────
  const streakData = useMemo<StreakCardData>(() => {
    const habits = overviewStats?.rankedHabits ?? [];
    const habitsWithStreak = habits
      .filter((h) => (h.currentStreak ?? 0) > 0)
      .sort((a, b) => (b.currentStreak ?? 0) - (a.currentStreak ?? 0));

    const best = habitsWithStreak[0];
    const bestStreak = best?.currentStreak ?? 0;
    const formationProgress = Math.round(Math.min((bestStreak / 66) * 100, 100));

    const topHabits: TopHabitStreak[] = habitsWithStreak.slice(0, 3).map((h) => ({
      currentStreak: h.currentStreak ?? 0,
      emoji: h.emoji ?? '🎯',
      name: h.name,
    }));

    return {
      activeStreakCount: habitsWithStreak.length,
      bestHabitEmoji: best?.emoji ?? '🎯',
      bestHabitName: best?.name ?? 'Your habit',
      bestStreak,
      formationProgress,
      topHabits,
    };
  }, [overviewStats]);

  // ── Monthly recap card ─────────────────────────────────────────────────────
  const monthlyData = useMemo<MonthlyRecapCardData>(() => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed
    const currentYear = now.getFullYear();

    // Filter compliance data to current month only
    const monthDays = (complianceData ?? []).filter((d) => {
      const date = new Date(d.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalDays = monthDays.length || 1; // avoid division by zero
    const avgRate =
      monthDays.reduce((sum, d) => sum + (d.completionRate ?? 0), 0) / totalDays;
    const completionRate = Math.round(avgRate);

    // Count perfect days (100% or close enough)
    const perfectDays = monthDays.filter((d) => (d.completionRate ?? 0) >= 99).length;

    // Estimate total completions (we don't have raw counts in compliance data,
    // so we approximate using the habit count and completion rate)
    const habitCount = overviewStats?.totalHabits ?? 0;
    const totalCompletions = Math.round(
      monthDays.reduce((sum, d) => sum + (d.completionRate / 100) * habitCount, 0)
    );
    const totalPossible = totalDays * habitCount;

    // Best day of week: find the day name with the highest average completion
    const dayTotals: Record<number, { sum: number; count: number }> = {};
    for (const d of monthDays) {
      const dow = new Date(d.date).getDay();
      if (!dayTotals[dow]) dayTotals[dow] = { count: 0, sum: 0 };
      dayTotals[dow].sum += d.completionRate;
      dayTotals[dow].count += 1;
    }
    let bestDow = 0;
    let bestAvg = -1;
    for (const [dow, { sum, count }] of Object.entries(dayTotals)) {
      const avg = sum / count;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestDow = Number(dow);
      }
    }

    return {
      bestDayOfWeek: DAY_NAMES[bestDow],
      completionRate,
      habitCount,
      monthLabel: getMonthLabel(),
      perfectDays,
      totalCompletions,
      totalPossible,
    };
  }, [complianceData, overviewStats]);

  // ── Year in review card ────────────────────────────────────────────────────
  const yearData = useMemo<YearInReviewCardData>(() => {
    const year = getCurrentYear();
    const yearStr = String(year);

    // Use all compliance data that falls in the current year
    const yearDays = (complianceData ?? []).filter((d) => d.date.startsWith(yearStr));

    const daysTracked = yearDays.filter((d) => (d.completionRate ?? 0) > 0).length;
    const habitCount = overviewStats?.totalHabits ?? 0;

    const totalCompletions = Math.round(
      yearDays.reduce((sum, d) => sum + (d.completionRate / 100) * habitCount, 0)
    );

    const avgRate =
      yearDays.length > 0
        ? Math.round(
            yearDays.reduce((sum, d) => sum + (d.completionRate ?? 0), 0) /
              yearDays.length
          )
        : 0;

    // Habits formed = habits with strength >= 60%
    const habitsFormed = (overviewStats?.rankedHabits ?? []).filter(
      (h) => h.strength >= 60
    ).length;

    // Longest streak from rankedHabits (longestStreak field)
    const habits = overviewStats?.rankedHabits ?? [];
    const sorted = [...habits].sort(
      (a, b) => (b.longestStreak ?? 0) - (a.longestStreak ?? 0)
    );
    const topStreakHabit = sorted[0];

    return {
      averageCompletionRate: avgRate,
      daysTracked,
      habitsFormed,
      longestStreak: topStreakHabit?.longestStreak ?? 0,
      longestStreakHabit: topStreakHabit?.name ?? '',
      totalCompletions,
      year,
    };
  }, [complianceData, overviewStats]);

  return { monthlyData, streakData, yearData };
}
