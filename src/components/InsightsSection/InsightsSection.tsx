/**
 * InsightsSection Component
 * Displays habit insights: best days, streak records, and trends
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import {
  BarChart3,
  Trophy,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Percent,
} from 'lucide-react-native';
import type { HabitTrackingEntry } from '../../features/habits/types';
import type { Id } from '../../../convex/_generated/dataModel';
import {
  differenceInDays,
  getTodayString,
  formatDateString,
} from '../../utils/dateUtils';

export interface InsightsSectionProps {
  habitId: Id<'habits'>;
  tracking: HabitTrackingEntry[];
  habitCreatedAt?: number;
  totalCompletions: number;
  successRate: number;
  daysTracking: number;
}

interface DayStats {
  day: string;
  dayIndex: number;
  completed: number;
  total: number;
  rate: number;
}

interface StreakRecord {
  days: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

// Day labels
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABELS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * Calculate completion rate by day of week
 */
function calculateDayOfWeekStats(
  tracking: HabitTrackingEntry[],
  habitCreatedAt?: number
): DayStats[] {
  const dayStats: Record<number, { completed: number; total: number }> = {};

  // Initialize all days
  for (let i = 0; i < 7; i++) {
    dayStats[i] = { completed: 0, total: 0 };
  }

  // Get the start date (habit creation or first tracking entry)
  const startDate = habitCreatedAt
    ? new Date(habitCreatedAt)
    : tracking.length > 0
      ? new Date(tracking[tracking.length - 1].date)
      : new Date();

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Create a set of completed dates for quick lookup
  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  // Iterate through each day from start to today
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= today) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split('T')[0];

    dayStats[dayOfWeek].total++;
    if (completedDates.has(dateStr)) {
      dayStats[dayOfWeek].completed++;
    }

    current.setDate(current.getDate() + 1);
  }

  return DAY_LABELS.map((day, index) => ({
    day,
    dayIndex: index,
    completed: dayStats[index].completed,
    total: dayStats[index].total,
    rate: dayStats[index].total > 0
      ? Math.round((dayStats[index].completed / dayStats[index].total) * 100)
      : 0,
  }));
}

/**
 * Calculate all streak records from tracking data
 * Uses consistent date calculation with Math.floor and midnight normalization
 * to match backend (convex/streakUtils.ts) logic
 */
function calculateStreakRecords(
  tracking: HabitTrackingEntry[],
  currentStreak: number
): StreakRecord[] {
  if (tracking.length === 0) return [];

  // Get all completed dates sorted (ascending)
  const completedDates = tracking
    .filter((t) => t.completed)
    .map((t) => t.date)
    .sort();

  if (completedDates.length === 0) return [];

  const streaks: StreakRecord[] = [];
  let streakStart = completedDates[0];
  let streakDays = 1;
  let prevDateStr = completedDates[0];

  for (let i = 1; i < completedDates.length; i++) {
    const currDateStr = completedDates[i];
    // Use consistent differenceInDays utility (Math.floor + midnight normalization)
    const diffDays = differenceInDays(currDateStr, prevDateStr);

    if (diffDays === 1) {
      // Consecutive day
      streakDays++;
    } else if (diffDays > 1) {
      // Gap found, save previous streak if >= 2 days
      if (streakDays >= 2) {
        streaks.push({
          days: streakDays,
          startDate: streakStart,
          endDate: prevDateStr,
          isCurrent: false,
        });
      }
      // Start new streak
      streakStart = currDateStr;
      streakDays = 1;
    }
    // If diffDays === 0, same day entry (shouldn't happen with unique dates), skip

    prevDateStr = currDateStr;
  }

  // Don't forget the last streak
  if (streakDays >= 2) {
    const today = getTodayString();
    const lastDate = completedDates[completedDates.length - 1];
    // Check if last date is today or yesterday (streak is still active)
    const daysSinceLastCompletion = differenceInDays(today, lastDate);
    const isCurrent = daysSinceLastCompletion <= 1;

    streaks.push({
      days: streakDays,
      startDate: streakStart,
      endDate: lastDate,
      isCurrent: isCurrent && currentStreak > 0,
    });
  }

  // Sort by days descending
  streaks.sort((a, b) => b.days - a.days);

  // Mark the current streak if it exists but wasn't captured
  if (currentStreak > 0) {
    const currentIdx = streaks.findIndex((s) => s.isCurrent);
    if (currentIdx === -1 && currentStreak >= 2) {
      // Current streak not in list, add it
      const today = getTodayString();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - currentStreak + 1);
      streaks.push({
        days: currentStreak,
        startDate: formatDateString(startDate),
        endDate: today,
        isCurrent: true,
      });
      streaks.sort((a, b) => b.days - a.days);
    }
  }

  return streaks.slice(0, 5); // Top 5
}

/**
 * Calculate trend comparison (this month vs last month)
 */
function calculateTrendComparison(tracking: HabitTrackingEntry[]): {
  thisMonth: number;
  lastMonth: number;
  change: number;
} {
  const today = new Date();
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  let thisMonthCompleted = 0;
  let thisMonthTotal = 0;
  let lastMonthCompleted = 0;
  let lastMonthTotal = 0;

  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  // This month
  const current = new Date(thisMonthStart);
  while (current <= today) {
    thisMonthTotal++;
    if (completedDates.has(current.toISOString().split('T')[0])) {
      thisMonthCompleted++;
    }
    current.setDate(current.getDate() + 1);
  }

  // Last month
  const lastCurrent = new Date(lastMonthStart);
  while (lastCurrent <= lastMonthEnd) {
    lastMonthTotal++;
    if (completedDates.has(lastCurrent.toISOString().split('T')[0])) {
      lastMonthCompleted++;
    }
    lastCurrent.setDate(lastCurrent.getDate() + 1);
  }

  const thisMonthRate = thisMonthTotal > 0
    ? Math.round((thisMonthCompleted / thisMonthTotal) * 100)
    : 0;
  const lastMonthRate = lastMonthTotal > 0
    ? Math.round((lastMonthCompleted / lastMonthTotal) * 100)
    : 0;

  return {
    thisMonth: thisMonthRate,
    lastMonth: lastMonthRate,
    change: thisMonthRate - lastMonthRate,
  };
}


/**
 * Day Bar Component
 */
function DayBar({
  dayStats,
  isBest,
  isWorst,
  maxRate,
  index,
}: {
  dayStats: DayStats;
  isBest: boolean;
  isWorst: boolean;
  maxRate: number;
  index: number;
}) {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  const normalizedHeight = maxRate > 0 ? (dayStats.rate / maxRate) * 100 : 0;
  const minHeight = dayStats.rate > 0 ? 15 : 4;
  const finalHeight = Math.max(normalizedHeight, minHeight);

  useEffect(() => {
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 200 }));
    height.value = withDelay(index * 50 + 100, withSpring(finalHeight, { damping: 12 }));
  }, [index, finalHeight]);

  const barStyle = useAnimatedStyle(() => ({
    height: `${height.value}%`,
    opacity: opacity.value,
  }));

  const getBgColor = () => {
    if (isBest) return 'bg-emerald-500';
    if (isWorst && dayStats.rate < 70) return 'bg-amber-400';
    if (dayStats.rate >= 80) return 'bg-emerald-400';
    if (dayStats.rate >= 60) return 'bg-blue-400';
    if (dayStats.rate >= 40) return 'bg-stone-300';
    return 'bg-stone-200';
  };

  return (
    <View className="flex-1 items-center">
      <View className="h-20 w-full items-center justify-end px-0.5">
        <Animated.View
          className={`w-full rounded-t-md ${getBgColor()}`}
          style={barStyle}
        />
      </View>
      <Text
        className={`mt-1.5 text-xs font-medium ${
          isBest ? 'text-emerald-600' : isWorst ? 'text-amber-600' : 'text-stone-500'
        }`}
      >
        {DAY_LABELS_SHORT[dayStats.dayIndex]}
      </Text>
      <Text
        className={`text-[10px] ${
          isBest ? 'font-bold text-emerald-700' : isWorst ? 'font-medium text-amber-700' : 'text-stone-400'
        }`}
      >
        {dayStats.rate}%
      </Text>
    </View>
  );
}


/**
 * Main InsightsSection Component
 */
export function InsightsSection({
  habitId,
  tracking,
  habitCreatedAt,
  totalCompletions,
  successRate,
  daysTracking,
}: InsightsSectionProps) {
  // Calculate insights
  const dayStats = useMemo(
    () => calculateDayOfWeekStats(tracking, habitCreatedAt),
    [tracking, habitCreatedAt]
  );

  const bestDay = useMemo(() => {
    const withData = dayStats.filter((d) => d.total > 0);
    if (withData.length === 0) return null;
    return withData.reduce((best, curr) => (curr.rate > best.rate ? curr : best));
  }, [dayStats]);

  const worstDay = useMemo(() => {
    const withData = dayStats.filter((d) => d.total > 0);
    if (withData.length === 0) return null;
    return withData.reduce((worst, curr) => (curr.rate < worst.rate ? curr : worst));
  }, [dayStats]);

  const maxRate = useMemo(
    () => Math.max(...dayStats.map((d) => d.rate), 1),
    [dayStats]
  );

  // Get current streak from tracking for streak records
  // Uses UTC-normalized date utilities to match calculateStreakRecords
  const currentStreak = useMemo(() => {
    const completedDates = new Set(
      tracking.filter((t) => t.completed).map((t) => t.date)
    );

    if (completedDates.size === 0) return 0;

    let streak = 0;
    const todayStr = getTodayString();

    // Start from today or yesterday if today not completed
    let checkDate = todayStr;
    if (!completedDates.has(todayStr)) {
      // Get yesterday using proper date math
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      checkDate = formatDateString(yesterday);
    }

    // Count consecutive days backwards
    while (streak < 400) {
      if (completedDates.has(checkDate)) {
        streak++;
        // Go to previous day
        const [year, month, day] = checkDate.split('-').map(Number);
        const prevDate = new Date(year, month - 1, day);
        prevDate.setDate(prevDate.getDate() - 1);
        checkDate = formatDateString(prevDate);
      } else {
        break;
      }
    }

    return streak;
  }, [tracking]);

  const streakRecords = useMemo(
    () => calculateStreakRecords(tracking, currentStreak),
    [tracking, currentStreak]
  );

  const trend = useMemo(() => calculateTrendComparison(tracking), [tracking]);

  const hasEnoughData = tracking.length >= 7;

  if (!hasEnoughData) {
    return (
      <Animated.View
        className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50"
        entering={FadeInDown.delay(100).springify()}
      >
        <View className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-blue-50/30" />
        <View className="p-5">
          <View className="mb-3 flex-row items-center justify-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
              <BarChart3 className="text-violet-400" size={16} />
            </View>
            <Text className="text-lg font-bold text-stone-400">Insights</Text>
          </View>
          <View className="items-center rounded-xl bg-white/60 py-6">
            <Calendar className="mb-2 text-stone-300" size={28} />
            <Text className="text-center text-sm text-stone-500">
              Keep tracking for insights
            </Text>
            <Text className="mt-1 text-center text-xs text-stone-400">
              {7 - tracking.length} more days needed
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      className="gap-4"
      entering={FadeInDown.delay(100).springify()}
    >
      {/* Journey Stats Section */}
      <View className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50">
        <View className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-blue-50/30" />
        <View className="p-5">
          <View className="mb-4 flex-row items-center justify-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
              <BarChart3 className="text-violet-500" size={16} />
            </View>
            <Text className="text-lg font-bold text-stone-800">Your Journey</Text>
          </View>
          <Text className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-violet-500">
            Overall Progress
          </Text>

        <View className="flex-row gap-3">
          <View className="flex-1 items-center rounded-xl border border-emerald-100 bg-white/60 p-3">
            <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="text-emerald-600" size={16} />
            </View>
            <Text className="text-2xl font-bold text-emerald-700">{totalCompletions}</Text>
            <Text className="text-[10px] text-stone-500">completed</Text>
          </View>
          <View className="flex-1 items-center rounded-xl border border-blue-100 bg-white/60 p-3">
            <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Percent className="text-blue-600" size={16} />
            </View>
            <Text className="text-2xl font-bold text-blue-700">{Math.round(successRate)}%</Text>
            <Text className="text-[10px] text-stone-500">success rate</Text>
          </View>
          <View className="flex-1 items-center rounded-xl border border-violet-100 bg-white/60 p-3">
            <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-violet-100">
              <Calendar className="text-violet-600" size={16} />
            </View>
            <Text className="text-2xl font-bold text-violet-700">{daysTracking}</Text>
            <Text className="text-[10px] text-stone-500">days tracking</Text>
          </View>
        </View>
        </View>
      </View>

      {/* Best Days Section */}
      <View className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50">
        <View className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-blue-50/30" />
        <View className="p-5">
          <View className="mb-4 flex-row items-center justify-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
              <Calendar className="text-violet-500" size={16} />
            </View>
            <Text className="text-lg font-bold text-stone-800">Best Days</Text>
          </View>
          <Text className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-violet-500">
            Performance by Day
          </Text>

        {/* Bar Chart */}
        <View className="mb-4 flex-row items-end justify-between px-1">
          {dayStats.map((day, index) => (
            <DayBar
              key={day.dayIndex}
              dayStats={day}
              isBest={bestDay?.dayIndex === day.dayIndex}
              isWorst={worstDay?.dayIndex === day.dayIndex && day.rate < bestDay!.rate}
              maxRate={maxRate}
              index={index}
            />
          ))}
        </View>

        {/* Best/Worst Cards */}
        <View className="flex-row gap-3">
          {bestDay && (
            <View className="flex-1 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Trophy className="text-emerald-500" size={14} />
                <Text className="text-xs font-medium text-emerald-600">Best Day</Text>
              </View>
              <Text className="text-lg font-bold text-emerald-700">{bestDay.day}</Text>
              <Text className="text-xs text-emerald-600">{bestDay.rate}% success</Text>
            </View>
          )}
          {worstDay && worstDay.rate < (bestDay?.rate || 100) && (
            <View className="flex-1 rounded-xl border border-amber-100 bg-amber-50 p-3">
              <View className="flex-row items-center gap-1.5 mb-1">
                <AlertTriangle className="text-amber-500" size={14} />
                <Text className="text-xs font-medium text-amber-600">Needs Work</Text>
              </View>
              <Text className="text-lg font-bold text-amber-700">{worstDay.day}</Text>
              <Text className="text-xs text-amber-600">{worstDay.rate}% success</Text>
            </View>
          )}
        </View>
        </View>
      </View>

      {/* Streak Records Section */}
      {streakRecords.length > 0 && (
        <View className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50">
          <View className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-blue-50/30" />
          <View className="p-5">
            <View className="mb-4 flex-row items-center justify-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                <Trophy className="text-violet-500" size={16} />
              </View>
              <Text className="text-lg font-bold text-stone-800">Streak Records</Text>
            </View>
            <Text className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-violet-500">
              Top Performances
            </Text>

            {/* Compact Top 3 Medals */}
            <View className="flex-row gap-2">
              {streakRecords.slice(0, 3).map((record, i) => (
                <View
                  key={`${record.startDate}-${record.days}`}
                  className={`flex-1 items-center rounded-xl p-2.5 ${
                    i === 0 ? 'border border-amber-200 bg-amber-50' :
                    i === 1 ? 'border border-stone-200 bg-stone-50' :
                    'border border-orange-200 bg-orange-50'
                  }`}
                >
                  <Text className="mb-0.5 text-base">{['🥇', '🥈', '🥉'][i]}</Text>
                  <Text className={`text-lg font-bold ${
                    i === 0 ? 'text-amber-700' :
                    i === 1 ? 'text-stone-700' :
                    'text-orange-700'
                  }`}>{record.days}</Text>
                  <Text className={`text-[9px] ${
                    i === 0 ? 'text-amber-500' :
                    i === 1 ? 'text-stone-500' :
                    'text-orange-500'
                  }`}>days</Text>
                  {record.isCurrent && (
                    <View className="mt-1 rounded-full bg-amber-100 px-1.5 py-0.5">
                      <Text className="text-[8px] font-semibold text-amber-700">NOW</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Trend Comparison Section */}
      <View className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50">
        <View className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-blue-50/30" />
        <View className="p-5">
          <View className="mb-4 flex-row items-center justify-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
              {trend.change >= 0 ? (
                <TrendingUp className="text-violet-500" size={16} />
              ) : (
                <TrendingDown className="text-violet-500" size={16} />
              )}
            </View>
            <Text className="text-lg font-bold text-stone-800">Monthly Trend</Text>
          </View>
          <Text className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-violet-500">
            Month Comparison
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-xl border border-stone-100 bg-white/60 p-4">
              <Text className="mb-1 text-xs text-stone-400">This Month</Text>
              <Text className="text-3xl font-bold text-stone-800">{trend.thisMonth}%</Text>
            </View>
            <View className="flex-1 rounded-xl border border-stone-100 bg-white/60 p-4">
              <Text className="mb-1 text-xs text-stone-400">Last Month</Text>
              <Text className="text-3xl font-bold text-stone-500">{trend.lastMonth}%</Text>
            </View>
          </View>

          {/* Change Badge */}
          <View
            className={`mt-3 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 ${
              trend.change > 0
                ? 'bg-emerald-50'
                : trend.change < 0
                  ? 'bg-red-50'
                  : 'bg-stone-50'
            }`}
          >
            {trend.change > 0 ? (
              <>
                <TrendingUp className="text-emerald-500" size={16} />
                <Text className="text-sm font-semibold text-emerald-600">
                  +{trend.change}% improvement
                </Text>
              </>
            ) : trend.change < 0 ? (
              <>
                <TrendingDown className="text-red-500" size={16} />
                <Text className="text-sm font-semibold text-red-600">
                  {trend.change}% from last month
                </Text>
              </>
            ) : (
              <Text className="text-sm font-medium text-stone-500">Same as last month</Text>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default InsightsSection;
