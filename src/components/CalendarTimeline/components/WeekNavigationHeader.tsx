import React from 'react';
import { View } from 'react-native';

import type { WeekNavigationHeaderProps } from '../CalendarTimeline.types';
import { ProgressGreeting } from './ProgressGreeting';

/** Progress header: greeting + progress text + glass chip date row */
export const WeekNavigationHeader: React.FC<WeekNavigationHeaderProps> = ({
  dateRangeText,
  currentDate,
  canNavigateForward,
  onJumpToToday,
  onDateRangePress,
  completedToday = 0,
  totalHabits = 0,
  currentStreak = 0,
}) => {
  const isViewingPast = canNavigateForward && !!onJumpToToday;

  return (
    <View className='mb-3'>
      <ProgressGreeting
        completedToday={completedToday}
        currentDate={currentDate}
        currentStreak={currentStreak}
        dateRangeText={dateRangeText}
        isViewingPast={isViewingPast}
        totalHabits={totalHabits}
        onDateRangePress={onDateRangePress}
        onJumpToToday={onJumpToToday}
      />
    </View>
  );
};
