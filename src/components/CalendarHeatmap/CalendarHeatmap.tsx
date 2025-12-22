/**
 * CalendarHeatmap Component
 * GitHub-style horizontal calendar heatmap showing 3 months of habit tracking history
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react-native';
import type { CalendarHeatmapProps } from './types';
import { CalendarGrid } from './CalendarGrid';
import { InsightCard } from './InsightCard';
import { DayDetailTooltip } from './DayDetailTooltip';
import {
  generateHorizontalGrid,
  calculate3MonthStats,
  calculate3MonthTrend,
  calculateDayOfWeekStats,
  detectWeakDay,
  calculateStreakPosition,
} from './utils';
import {
  isInsightDismissed,
  dismissInsight,
} from '../../utils/insightCardPreferences';

export function CalendarHeatmap({
  habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
  onDayPress,
}: CalendarHeatmapProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [insightCardDismissed, setInsightCardDismissed] = useState(false);
  const today = useMemo(() => new Date(), []);

  // Generate horizontal grid for 3 months
  const { weeks, monthLabels } = useMemo(() => {
    return generateHorizontalGrid(today, completedDates, habitCreatedAt);
  }, [today, completedDates, habitCreatedAt]);

  // Calculate stats for 3-month period
  const stats = useMemo(() => {
    return calculate3MonthStats(weeks);
  }, [weeks]);

  // Calculate trend vs previous 3 months
  const trend = useMemo(() => {
    return calculate3MonthTrend(completedDates, habitCreatedAt);
  }, [completedDates, habitCreatedAt]);

  // Calculate day-of-week statistics for insights
  const dayOfWeekStats = useMemo(() => {
    return calculateDayOfWeekStats(completedDates, habitCreatedAt);
  }, [completedDates, habitCreatedAt]);

  // Detect weakest day pattern
  const weakestDay = useMemo(() => {
    return detectWeakDay(dayOfWeekStats);
  }, [dayOfWeekStats]);

  // Generate accessibility summary for 3-month period
  const activityAccessibilitySummary = useMemo(() => {
    return `Activity calendar showing 3 months of history. ${stats.completions} ${stats.completions === 1 ? 'day' : 'days'} completed, ${Math.round(stats.successRate)}% success rate.`;
  }, [stats]);

  // Handle day press - show tooltip with details
  const handleDayPress = useCallback((date: string, completed: boolean) => {
    setSelectedDate(date);
    setShowTooltip(true);

    // Also call parent handler if provided
    onDayPress?.(date, completed);
  }, [onDayPress]);

  // Calculate streak position for selected date
  const streakPosition = useMemo(() => {
    if (!selectedDate) return 0;
    return calculateStreakPosition(selectedDate, completedDates, habitCreatedAt);
  }, [selectedDate, completedDates, habitCreatedAt]);

  // Check if insight card has been dismissed on mount
  useEffect(() => {
    const checkDismissed = async () => {
      if (weakestDay) {
        const dismissed = await isInsightDismissed(habitId, weakestDay.day);
        setInsightCardDismissed(dismissed);
      }
    };
    checkDismissed();
  }, [habitId, weakestDay]);

  // Handler for dismissing insight card
  const handleDismissInsight = useCallback(async () => {
    if (weakestDay) {
      await dismissInsight(habitId, weakestDay.day);
      setInsightCardDismissed(true);
    }
  }, [habitId, weakestDay]);

  // Handler for setting reminder
  const handleSetReminder = useCallback((day: string) => {
    Alert.alert(
      `Set Reminder for ${day}s`,
      'Reminder functionality coming soon! This feature will let you set a custom notification for your weakest day to help build consistency.',
      [{ text: 'Got it', style: 'default' }]
    );
  }, []);

  // Handler for showing tips
  const handleSeeTips = useCallback((day: string) => {
    const tips = `Tips to boost your ${day} consistency:\n\n` +
      `⏰ Set a reminder for ${day} evening\n\n` +
      `📍 Stack it after an existing ${day} routine\n\n` +
      `🎯 Plan it in advance on the weekend\n\n` +
      `🤝 Find an accountability partner for ${day}s\n\n` +
      `💪 Start with a smaller version on ${day}s\n\n` +
      `📅 Mark it on your calendar as non-negotiable`;

    Alert.alert(
      `Improve Your ${day}s`,
      tips,
      [{ text: 'Got it', style: 'default' }]
    );
  }, []);

  return (
    <Animated.View
      className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50"
      entering={FadeInDown.delay(200).springify()}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="Habit activity calendar"
    >
      {/* Gradient Background */}
      <View className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30" />

      <View className="p-5">
        {/* Header (no month navigation for GitHub-style) */}
        <View
          className="flex-row items-center justify-between mb-4"
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Activity calendar showing 3 months of history"
        >
          <View className="flex-row items-center gap-2" importantForAccessibility="no-hide-descendants">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Calendar className="text-emerald-500" size={16} />
            </View>
            <Text className="text-lg font-bold text-stone-800">Activity</Text>
          </View>

          {/* Trend badge - only show if we have trend data */}
          {trend !== null && (
            <View
              className={`flex-row items-center gap-1 px-2.5 py-1 rounded-full ${
                trend >= 0 ? 'bg-emerald-100' : 'bg-amber-100'
              }`}
              accessible={true}
              accessibilityLabel={`Trend: ${trend >= 0 ? 'up' : 'down'} ${Math.abs(trend)} percent compared to previous 3 months`}
            >
              {trend >= 0 ? (
                <TrendingUp className="text-emerald-600" size={14} />
              ) : (
                <TrendingDown className="text-amber-600" size={14} />
              )}
              <Text className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </Text>
            </View>
          )}
        </View>

        {/* Calendar Grid */}
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          habitColor={habitColor}
          onDayPress={handleDayPress}
          completedDates={completedDates}
          habitCreatedAt={habitCreatedAt}
        />

        {/* Summary Stats Footer */}
        <View
          className="mt-4 flex-row items-center justify-center gap-4"
          accessible={true}
          accessibilityRole="summary"
          accessibilityLabel={activityAccessibilitySummary}
        >
          <View className="flex-row items-center gap-1.5" importantForAccessibility="no-hide-descendants">
            <View
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: habitColor || '#10b981' }}
            />
            <Text className="text-xs text-stone-600">
              {stats.completions} {stats.completions === 1 ? 'day' : 'days'}
            </Text>
          </View>

          <Text className="text-stone-300" importantForAccessibility="no-hide-descendants">•</Text>

          <Text className="text-xs font-medium text-emerald-600" importantForAccessibility="no-hide-descendants">
            {Math.round(stats.successRate)}% success rate
          </Text>
        </View>

        {/* Insight Card - Pattern Detection */}
        {!insightCardDismissed && (
          <InsightCard
            dayOfWeekStats={dayOfWeekStats}
            weakestDay={weakestDay}
            onSetReminder={handleSetReminder}
            onSeeTips={handleSeeTips}
            onDismiss={handleDismissInsight}
          />
        )}
      </View>

      {/* Day Detail Tooltip */}
      <DayDetailTooltip
        visible={showTooltip}
        date={selectedDate}
        completed={selectedDate ? completedDates.has(selectedDate) : false}
        streakPosition={streakPosition}
        onClose={() => setShowTooltip(false)}
        habitColor={habitColor}
      />
    </Animated.View>
  );
}

export default CalendarHeatmap;
