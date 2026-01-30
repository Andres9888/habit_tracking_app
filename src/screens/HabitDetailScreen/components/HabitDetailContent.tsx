/**
 * HabitDetailContent - Scrollable content area for habit detail screen
 */

import React from 'react';
import { ScrollView } from 'react-native';
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
      contentContainerClassName='p-4 pb-8'
      showsVerticalScrollIndicator={false}
    >
      {habit.createdAt && (
        <ErrorBoundary>
          <HabitStrengthSection
            completedDates={completedDates}
            habitColor={habit.iconColor}
            habitCreatedAt={habit.createdAt}
            habitId={habit._id}
            habitStrength={habit.strength}
          />
        </ErrorBoundary>
      )}
      <ErrorBoundary>
        <MonthlyCalendarGrid
          completedDates={completedDates}
          habitColor={habit.iconColor ?? '#10b981'}
          habitCreatedAt={habit.createdAt}
          habitId={habit._id}
          onDayPress={onDayPress}
        />
      </ErrorBoundary>
    </ScrollView>
  );
}
