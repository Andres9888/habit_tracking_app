/**
 * HabitDetailContent - Scrollable content area for habit detail screen
 */

import React from 'react';
import { ScrollView } from 'react-native';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import type { Habit } from '../../../features/habits/types';

interface HabitDetailContentProps {
  habit: Habit;
  completedDates: string[];
  onDayPress: (dateString: string) => void;
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
        <HabitStrengthSection
          completedDates={completedDates}
          habitColor={habit.iconColor}
          habitCreatedAt={habit.createdAt}
          habitId={habit._id}
          habitStrength={habit.strength}
        />
      )}
      <MonthlyCalendarGrid
        completedDates={completedDates}
        habitColor={habit.iconColor ?? '#10b981'}
        habitCreatedAt={habit.createdAt}
        habitId={habit._id}
        onDayPress={onDayPress}
      />
    </ScrollView>
  );
}
