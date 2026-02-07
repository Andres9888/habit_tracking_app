/**
 * HabitDetailContent - Scrollable content area for habit detail screen
 * OPTIMIZED: Card wrappers with shadows, FadeInUp animations
 */

import React from 'react';
import { ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import type { Habit } from '../../../features/habits/types';

interface HabitDetailContentProps {
  habit: Habit;
  completedDates: Set<string>;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function HabitDetailContent({
  habit,
  completedDates,
  onDayPress,
}: HabitDetailContentProps) {
  return (
    <ScrollView
      bounces
      className='flex-1'
      contentContainerClassName='p-4 pb-8 gap-4'
      showsVerticalScrollIndicator={false}
    >
      {habit.createdAt && (
        <Animated.View
          className='rounded-2xl bg-white p-4 shadow-md'
          entering={FadeInUp.delay(0).springify().damping(18)}
        >
          <ErrorBoundary>
            <HabitStrengthSection
              completedDates={completedDates}
              habitColor={habit.iconColor}
              habitCreatedAt={habit.createdAt}
              habitId={habit._id}
              habitStrength={habit.strength}
            />
          </ErrorBoundary>
        </Animated.View>
      )}
      <Animated.View
        className='rounded-2xl bg-white p-4 shadow-md'
        entering={FadeInUp.delay(50).springify().damping(18)}
      >
        <ErrorBoundary>
          <MonthlyCalendarGrid
            completedDates={completedDates}
            habitColor={habit.iconColor ?? '#10b981'}
            habitCreatedAt={habit.createdAt}
            habitId={habit._id}
            onDayPress={onDayPress}
          />
        </ErrorBoundary>
      </Animated.View>
    </ScrollView>
  );
}
