/**
 * CalendarHeatmap Component
 * GitHub-style calendar heatmap for habit tracking visualization
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format, addMonths, subMonths, isSameMonth } from 'date-fns';
import type { Id } from '../../../convex/_generated/dataModel';
import { DayCell } from './DayCell';
import { generateMonthGrid, calculateMonthStats, DAY_LABELS } from './utils';

export interface CalendarHeatmapProps {
  /** Habit ID for context */
  habitId: Id<'habits'>;

  /** Set of completed dates in YYYY-MM-DD format */
  completedDates: Set<string>;

  /** Date habit was created (to show tracking start) */
  habitCreatedAt?: number;

  /** Habit's accent color (hex) for theming cells */
  habitColor?: string;

  /** Callback when a day cell is tapped */
  onDayPress?: (date: string, completed: boolean) => void;
}

export function CalendarHeatmap({
  habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
  onDayPress,
}: CalendarHeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const today = useMemo(() => new Date(), []);

  const isCurrentMonth = useMemo(
    () => isSameMonth(currentMonth, today),
    [currentMonth, today]
  );

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    if (!isCurrentMonth) {
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

  return (
    <Animated.View
      className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50"
      entering={FadeInDown.delay(200).springify()}
    >
      {/* Gradient Background */}
      <View className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30" />

      <View className="p-5">
        {/* Header with month navigation */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Calendar className="text-emerald-500" size={16} />
            </View>
            <Text className="text-lg font-bold text-stone-800">Activity</Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={goToPreviousMonth}
              className="p-1.5 rounded-lg active:bg-stone-100"
              accessibilityLabel="Previous month"
              accessibilityRole="button"
            >
              <ChevronLeft className="text-stone-400" size={20} />
            </Pressable>
            <Text className="text-sm font-medium text-stone-600 min-w-[80px] text-center">
              {format(currentMonth, 'MMM yyyy')}
            </Text>
            <Pressable
              onPress={goToNextMonth}
              disabled={isCurrentMonth}
              className="p-1.5 rounded-lg active:bg-stone-100"
              accessibilityLabel="Next month"
              accessibilityRole="button"
              accessibilityState={{ disabled: isCurrentMonth }}
            >
              <ChevronRight
                className={isCurrentMonth ? 'text-stone-200' : 'text-stone-400'}
                size={20}
              />
            </Pressable>
          </View>
        </View>

        {/* Day of week labels */}
        <View className="flex-row mb-2">
          {DAY_LABELS.map((label, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-xs font-medium text-stone-400">{label}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <Animated.View
          key={currentMonth.toISOString()}
          entering={SlideInRight.duration(200)}
          exiting={SlideOutLeft.duration(200)}
        >
          {grid.map((week, weekIndex) => (
            <View key={weekIndex} className="flex-row gap-1 mb-1">
              {week.map((day, dayIndex) => (
                <DayCell
                  key={day.date || `empty-${weekIndex}-${dayIndex}`}
                  day={day}
                  index={weekIndex * 7 + dayIndex}
                  habitColor={habitColor}
                  onPress={onDayPress}
                />
              ))}
            </View>
          ))}
        </Animated.View>

        {/* Summary Stats Footer */}
        <View className="mt-4 flex-row items-center justify-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <View
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: habitColor || '#10b981' }}
            />
            <Text className="text-xs text-stone-600">
              {stats.completions} {stats.completions === 1 ? 'day' : 'days'}
            </Text>
          </View>

          <Text className="text-stone-300">•</Text>

          <Text className="text-xs font-medium text-emerald-600">
            {Math.round(stats.successRate)}% this month
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default CalendarHeatmap;
