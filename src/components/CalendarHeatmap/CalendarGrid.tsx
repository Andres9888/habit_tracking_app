/**
 * CalendarGrid Component
 * Displays the calendar grid with day cells in horizontal GitHub-style layout
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { DayCell } from './DayCell';
import { DAY_LABELS, DAY_NAMES_FULL } from './utils';
import type { CalendarDay, MonthLabel } from './types';
import { useReduceMotion } from '../../hooks/useReduceMotion';

export interface CalendarGridProps {
  /** 2D array of calendar days organized as weeks (columns) */
  weeks: CalendarDay[][];

  /** Month labels with their week indices */
  monthLabels: MonthLabel[];

  /** Custom habit color (hex) */
  habitColor?: string;

  /** Callback when a day cell is pressed */
  onDayPress?: (date: string, completed: boolean) => void;

  /** Set of completed dates for streak calculation */
  completedDates: Set<string>;

  /** Habit creation timestamp for streak calculation */
  habitCreatedAt?: number;
}

export function CalendarGrid({
  weeks,
  monthLabels,
  habitColor,
  onDayPress,
  completedDates,
  habitCreatedAt,
}: CalendarGridProps) {
  const reduceMotion = useReduceMotion();
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Auto-scroll to show recent weeks on mount
  React.useEffect(() => {
    // Delay scroll to ensure layout is complete
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: !reduceMotion });
    }, 100);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <View>
      {/* Month Labels Row */}
      <View className="flex-row mb-2">
        {/* Empty space above day labels */}
        <View className="w-5 mr-2" />

        {/* Month labels above week columns */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          className="flex-row"
          contentContainerStyle={{ paddingRight: 8 }}
        >
          <View className="flex-row">
            {monthLabels.map((monthLabel, idx) => {
              // Calculate width based on weeks until next month or end
              const nextMonthIndex = monthLabels[idx + 1]?.weekIndex || weeks.length;
              const weeksInMonth = nextMonthIndex - monthLabel.weekIndex;
              const width = weeksInMonth * 23; // 20px cell + 3px gap

              return (
                <View
                  key={`${monthLabel.label}-${monthLabel.weekIndex}`}
                  style={{ width }}
                  className="items-start"
                >
                  <Text className="text-[10px] font-medium text-stone-400">
                    {monthLabel.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Horizontal Layout: Day labels on left, week columns scrollable */}
      <View className="flex-row">
        {/* Day of week labels column (sticky left) */}
        <View
          className="mr-2"
          accessible={true}
          accessibilityRole="none"
          accessibilityLabel="Days of the week: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"
        >
          {DAY_LABELS.map((label, index) => (
            <View
              key={index}
              className="h-5 w-5 items-center justify-center mb-[3px]"
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

        {/* Scrollable week columns with edge fade gradients */}
        <View className="flex-1 relative">
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            contentContainerStyle={{ paddingRight: 8 }}
          >
            {weeks.map((week, weekIndex) => (
              <Animated.View
                key={weekIndex}
                className="flex-col gap-[3px] mr-[3px]"
                entering={
                  reduceMotion
                    ? undefined
                    : FadeIn.delay((weeks.length - weekIndex) * 15).duration(200)
                }
              >
                {week.map((day, dayIndex) => (
                  <DayCell
                    key={day.date || `empty-${weekIndex}-${dayIndex}`}
                    day={day}
                    index={weekIndex * 7 + dayIndex}
                    habitColor={habitColor}
                    onPress={onDayPress}
                    completedDates={completedDates}
                    habitCreatedAt={habitCreatedAt}
                  />
                ))}
              </Animated.View>
            ))}
          </ScrollView>

          {/* Left edge fade */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            pointerEvents="none"
            className="absolute left-0 top-0 bottom-0 w-4"
          />

          {/* Right edge fade */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            pointerEvents="none"
            className="absolute right-0 top-0 bottom-0 w-4"
          />
        </View>
      </View>
    </View>
  );
}

export default CalendarGrid;
