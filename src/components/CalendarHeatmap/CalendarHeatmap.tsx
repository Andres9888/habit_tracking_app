/**
 * CalendarHeatmap Component
 * GitHub-style calendar heatmap for habit tracking visualization
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format, addMonths, subMonths, isSameMonth } from 'date-fns';
import type { Id } from '../../../convex/_generated/dataModel';
import { DayCell } from './DayCell';
import { generateMonthGrid, calculateMonthStats, DAY_LABELS, DAY_NAMES_FULL } from './utils';

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

// Swipe configuration
const SWIPE_THRESHOLD = 50; // Minimum distance to trigger navigation
const SWIPE_VELOCITY_THRESHOLD = 300; // Minimum velocity to trigger navigation

export function CalendarHeatmap({
  habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
  onDayPress,
}: CalendarHeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right'>('left');
  const today = useMemo(() => new Date(), []);

  // Shared value for tracking horizontal translation during swipe
  const translateX = useSharedValue(0);

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

  // Pan gesture for horizontal swipe navigation
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-15, 15]) // Activate only for horizontal swipes
        .failOffsetY([-15, 15]) // Fail if vertical movement is detected (allow scrolling)
        .onUpdate((event) => {
          // Constrain translation for visual feedback
          const maxTranslation = 100;
          translateX.value = Math.max(
            -maxTranslation,
            Math.min(maxTranslation, event.translationX)
          );
        })
        .onEnd((event) => {
          const shouldNavigate =
            Math.abs(event.translationX) > SWIPE_THRESHOLD ||
            Math.abs(event.velocityX) > SWIPE_VELOCITY_THRESHOLD;

          if (shouldNavigate) {
            if (event.translationX > 0) {
              // Swiped right → go to previous month
              runOnJS(goToPreviousMonth)();
            } else if (event.translationX < 0 && !isCurrentMonth) {
              // Swiped left → go to next month (only if not current month)
              runOnJS(goToNextMonth)();
            }
          }

          // Reset translation with spring animation
          translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
        }),
    [isCurrentMonth, goToPreviousMonth, goToNextMonth, translateX]
  );

  // Animated style for swipe feedback
  const swipeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 0.3 }], // Subtle parallax effect
  }));

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

  // Generate accessibility summary for the current month
  const monthAccessibilitySummary = useMemo(() => {
    const monthName = format(currentMonth, 'MMMM yyyy');
    return `Activity calendar for ${monthName}. ${stats.completions} ${stats.completions === 1 ? 'day' : 'days'} completed, ${Math.round(stats.successRate)}% success rate.`;
  }, [currentMonth, stats]);

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

        {/* Day of week labels */}
        <View
          className="flex-row mb-2"
          accessible={true}
          accessibilityRole="none"
          accessibilityLabel="Days of the week: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"
        >
          {DAY_LABELS.map((label, index) => (
            <View
              key={index}
              className="flex-1 items-center"
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={DAY_NAMES_FULL[index]}
            >
              <Text className="text-xs font-medium text-stone-400" importantForAccessibility="no-hide-descendants">
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid with Swipe Gesture */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={swipeAnimatedStyle}>
            <Animated.View
              key={currentMonth.toISOString()}
              entering={
                swipeDirection === 'left'
                  ? SlideInRight.duration(200)
                  : SlideInLeft.duration(200)
              }
              exiting={
                swipeDirection === 'left'
                  ? SlideOutLeft.duration(200)
                  : SlideOutRight.duration(200)
              }
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
          </Animated.View>
        </GestureDetector>

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
      </View>
    </Animated.View>
  );
}

export default CalendarHeatmap;
