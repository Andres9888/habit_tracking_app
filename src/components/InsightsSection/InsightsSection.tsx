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
  Flame,
  AlertTriangle,
} from 'lucide-react-native';
import type { HabitTrackingEntry } from '../../features/habits/types';
import type { Id } from '../../../convex/_generated/dataModel';

export interface InsightsSectionProps {
  habitId: Id<'habits'>;
  tracking: HabitTrackingEntry[];
  habitCreatedAt?: number;
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
 */
function calculateStreakRecords(
  tracking: HabitTrackingEntry[],
  currentStreak: number
): StreakRecord[] {
  if (tracking.length === 0) return [];

  // Get all completed dates sorted
  const completedDates = tracking
    .filter((t) => t.completed)
    .map((t) => t.date)
    .sort();

  if (completedDates.length === 0) return [];

  const streaks: StreakRecord[] = [];
  let streakStart = completedDates[0];
  let streakDays = 1;
  let prevDate = new Date(completedDates[0]);

  for (let i = 1; i < completedDates.length; i++) {
    const currDate = new Date(completedDates[i]);
    const diffDays = Math.round(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Consecutive day
      streakDays++;
    } else if (diffDays > 1) {
      // Gap found, save previous streak if > 1 day
      if (streakDays >= 2) {
        streaks.push({
          days: streakDays,
          startDate: streakStart,
          endDate: completedDates[i - 1],
          isCurrent: false,
        });
      }
      // Start new streak
      streakStart = completedDates[i];
      streakDays = 1;
    }
    // If diffDays === 0, same day entry, skip

    prevDate = currDate;
  }

  // Don't forget the last streak
  if (streakDays >= 2) {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = completedDates[completedDates.length - 1];
    const isCurrent = lastDate === today ||
      (new Date(today).getTime() - new Date(lastDate).getTime()) <= 24 * 60 * 60 * 1000;

    streaks.push({
      days: streakDays,
      startDate: streakStart,
      endDate: lastDate,
      isCurrent: isCurrent && currentStreak > 0,
    });
  }

  // Sort by days descending
  streaks.sort((a, b) => b.days - a.days);

  // Mark the current streak if it exists
  if (currentStreak > 0) {
    const currentIdx = streaks.findIndex((s) => s.isCurrent);
    if (currentIdx === -1 && currentStreak >= 2) {
      // Current streak not in list, add it
      const today = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - currentStreak + 1);
      streaks.push({
        days: currentStreak,
        startDate: startDate.toISOString().split('T')[0],
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
 * Format date for display
 */
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
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
 * Streak Record Row Component
 */
function StreakRecordRow({
  record,
  rank,
  index,
}: {
  record: StreakRecord;
  rank: number;
  index: number;
}) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);

  useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 200 }));
    translateX.value = withDelay(index * 80, withSpring(0, { damping: 15 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const getMedal = () => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  return (
    <Animated.View
      className={`flex-row items-center justify-between rounded-xl px-3 py-2.5 ${
        record.isCurrent
          ? 'border border-amber-200 bg-amber-50'
          : 'border border-stone-100 bg-stone-50/50'
      }`}
      style={animatedStyle}
    >
      <View className="flex-row items-center gap-2.5">
        <Text className="w-6 text-center text-base">{getMedal()}</Text>
        <View>
          <View className="flex-row items-center gap-1.5">
            <Text
              className={`text-base font-bold ${
                record.isCurrent ? 'text-amber-700' : 'text-stone-800'
              }`}
            >
              {record.days} days
            </Text>
            {record.isCurrent && (
              <Flame className="text-amber-500" fill="#f59e0b" size={14} />
            )}
          </View>
          <Text className="text-xs text-stone-400">
            {formatDateShort(record.startDate)} - {formatDateShort(record.endDate)}
          </Text>
        </View>
      </View>
      {record.isCurrent && (
        <View className="rounded-full bg-amber-100 px-2 py-0.5">
          <Text className="text-[10px] font-semibold text-amber-700">NOW</Text>
        </View>
      )}
    </Animated.View>
  );
}

/**
 * Main InsightsSection Component
 */
export function InsightsSection({
  habitId,
  tracking,
  habitCreatedAt,
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
  const currentStreak = useMemo(() => {
    const today = new Date();
    const completedDates = new Set(
      tracking.filter((t) => t.completed).map((t) => t.date)
    );

    let streak = 0;
    const current = new Date(today);

    // Check if today is completed
    const todayStr = current.toISOString().split('T')[0];
    if (!completedDates.has(todayStr)) {
      // Check yesterday
      current.setDate(current.getDate() - 1);
    }

    while (true) {
      const dateStr = current.toISOString().split('T')[0];
      if (completedDates.has(dateStr)) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
      if (streak > 400) break; // Safety limit
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
        className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50"
        entering={FadeInDown.delay(100).springify()}
      >
        <View className="flex-row items-center justify-center gap-2 mb-3">
          <BarChart3 className="text-stone-400" size={18} />
          <Text className="text-lg font-semibold text-stone-400">Insights</Text>
        </View>
        <View className="items-center rounded-xl bg-stone-50 py-6">
          <Calendar className="mb-2 text-stone-300" size={28} />
          <Text className="text-center text-sm text-stone-500">
            Keep tracking for insights
          </Text>
          <Text className="mt-1 text-center text-xs text-stone-400">
            {7 - tracking.length} more days needed
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      className="gap-4"
      entering={FadeInDown.delay(100).springify()}
    >
      {/* Best Days Section */}
      <View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">
        <View className="mb-4 flex-row items-center justify-center gap-2">
          <Calendar className="text-stone-500" size={18} />
          <Text className="text-lg font-semibold text-stone-800">Your Best Days</Text>
        </View>

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

      {/* Streak Records Section */}
      {streakRecords.length > 0 && (
        <View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">
          <View className="mb-4 flex-row items-center justify-center gap-2">
            <Trophy className="text-stone-500" size={18} />
            <Text className="text-lg font-semibold text-stone-800">Streak Records</Text>
          </View>

          <View className="gap-2">
            {streakRecords.map((record, index) => (
              <StreakRecordRow
                key={`${record.startDate}-${record.days}`}
                record={record}
                rank={index + 1}
                index={index}
              />
            ))}
          </View>

          {/* Motivation Message */}
          {streakRecords.length > 0 && currentStreak > 0 && (
            <View className="mt-3">
              {(() => {
                const currentRank = streakRecords.findIndex((r) => r.isCurrent) + 1;
                const nextRecord = streakRecords[currentRank - 2]; // Record above current
                if (nextRecord && !streakRecords[currentRank - 1]?.isCurrent) {
                  const daysNeeded = nextRecord.days - currentStreak + 1;
                  if (daysNeeded > 0 && daysNeeded <= 30) {
                    return (
                      <View className="flex-row items-center justify-center gap-1.5 rounded-lg bg-violet-50 py-2">
                        <Text className="text-xs text-violet-600">
                          <Text className="font-bold">{daysNeeded}</Text> more days to beat #{currentRank - 1}!
                        </Text>
                      </View>
                    );
                  }
                }
                return null;
              })()}
            </View>
          )}
        </View>
      )}

      {/* Trend Comparison Section */}
      <View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">
        <View className="mb-4 flex-row items-center justify-center gap-2">
          {trend.change >= 0 ? (
            <TrendingUp className="text-emerald-500" size={18} />
          ) : (
            <TrendingDown className="text-red-500" size={18} />
          )}
          <Text className="text-lg font-semibold text-stone-800">Monthly Trend</Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-xl border border-stone-100 bg-stone-50/50 p-4">
            <Text className="mb-1 text-xs text-stone-400">This Month</Text>
            <Text className="text-3xl font-bold text-stone-800">{trend.thisMonth}%</Text>
          </View>
          <View className="flex-1 rounded-xl border border-stone-100 bg-stone-50/50 p-4">
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
    </Animated.View>
  );
}

export default InsightsSection;
