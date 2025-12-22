/**
 * CalendarHeatmap Component
 * Monthly calendar heatmap for habit tracking visualization with insights
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format, addMonths, subMonths, isSameMonth } from 'date-fns';
import type { CalendarHeatmapProps } from './types';
import { CalendarGrid } from './CalendarGrid';
import { InsightCard } from './InsightCard';
import { DayDetailTooltip } from './DayDetailTooltip';
import {
  generateMonthGrid,
  calculateMonthStats,
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
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right'>('left');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [insightCardDismissed, setInsightCardDismissed] = useState(false);
  const today = useMemo(() => new Date(), []);

  const isCurrentMonth = useMemo(
    () => isSameMonth(currentMonth, today),
    [currentMonth, today]
  );

  const goToPreviousMonth = useCallback(() => {
    setSwipeDirection('right');
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    if (!isCurrentMonth) {
      setSwipeDirection('left');
      setCurrentMonth((prev) => addMonths(prev, 1));
    }
  }, [isCurrentMonth]);

  // Generate grid for current month view
  const grid = useMemo(() => {
    return generateMonthGrid(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      completedDates,
      habitCreatedAt
    );
  }, [currentMonth, completedDates, habitCreatedAt]);

  // Calculate stats for current month
  const stats = useMemo(() => {
    return calculateMonthStats(
      grid,
      currentMonth.getMonth(),
      currentMonth.getFullYear()
    );
  }, [grid, currentMonth]);

  // Calculate day-of-week statistics for insights
  const dayOfWeekStats = useMemo(() => {
    return calculateDayOfWeekStats(completedDates, habitCreatedAt);
  }, [completedDates, habitCreatedAt]);

  // Detect weakest day pattern
  const weakestDay = useMemo(() => {
    return detectWeakDay(dayOfWeekStats);
  }, [dayOfWeekStats]);

  // Generate accessibility summary for the current month
  const monthAccessibilitySummary = useMemo(() => {
    const monthName = format(currentMonth, 'MMMM yyyy');
    return `Activity calendar for ${monthName}. ${stats.completions} ${stats.completions === 1 ? 'day' : 'days'} completed, ${Math.round(stats.successRate)}% success rate.`;
  }, [currentMonth, stats]);

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
        {/* Header with month navigation */}
        <View
          className="flex-row items-center justify-between mb-4"
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel={`Activity for ${format(currentMonth, 'MMMM yyyy')}`}
        >
          <View className="flex-row items-center gap-2" importantForAccessibility="no-hide-descendants">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Calendar className="text-emerald-500" size={16} />
            </View>
            <Text className="text-lg font-bold text-stone-800">Activity</Text>
          </View>

          <View className="flex-row items-center gap-2" accessibilityRole="toolbar" accessibilityLabel="Month navigation">
            <Pressable
              onPress={goToPreviousMonth}
              className="p-1.5 rounded-lg active:bg-stone-100"
              accessible={true}
              accessibilityLabel={`Go to ${format(subMonths(currentMonth, 1), 'MMMM yyyy')}`}
              accessibilityRole="button"
              accessibilityHint="Navigate to previous month"
            >
              <ChevronLeft className="text-stone-400" size={20} />
            </Pressable>
            <Text
              className="text-sm font-medium text-stone-600 min-w-[80px] text-center"
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={format(currentMonth, 'MMMM yyyy')}
            >
              {format(currentMonth, 'MMM yyyy')}
            </Text>
            <Pressable
              onPress={goToNextMonth}
              disabled={isCurrentMonth}
              className="p-1.5 rounded-lg active:bg-stone-100"
              accessible={true}
              accessibilityLabel={
                isCurrentMonth
                  ? 'Cannot go to future months'
                  : `Go to ${format(addMonths(currentMonth, 1), 'MMMM yyyy')}`
              }
              accessibilityRole="button"
              accessibilityHint={isCurrentMonth ? undefined : 'Navigate to next month'}
              accessibilityState={{ disabled: isCurrentMonth }}
            >
              <ChevronRight
                className={isCurrentMonth ? 'text-stone-200' : 'text-stone-400'}
                size={20}
              />
            </Pressable>
          </View>
        </View>

        {/* Calendar Grid */}
        <CalendarGrid
          grid={grid}
          currentMonth={currentMonth}
          swipeDirection={swipeDirection}
          habitColor={habitColor}
          onDayPress={handleDayPress}
          onSwipeRight={goToPreviousMonth}
          onSwipeLeft={goToNextMonth}
          isCurrentMonth={isCurrentMonth}
          completedDates={completedDates}
          habitCreatedAt={habitCreatedAt}
        />

        {/* Summary Stats Footer */}
        <View
          className="mt-4 flex-row items-center justify-center gap-4"
          accessible={true}
          accessibilityRole="summary"
          accessibilityLabel={monthAccessibilitySummary}
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
            {Math.round(stats.successRate)}% this month
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
