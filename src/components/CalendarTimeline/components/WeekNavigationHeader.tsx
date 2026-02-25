import React from 'react';
import { View } from 'react-native';

import type { WeekNavigationHeaderProps } from '../CalendarTimeline.types';
import { ProgressGreeting } from './ProgressGreeting';

/** Progress header: greeting + progress text + [<] date [>] nav row */
export const WeekNavigationHeader: React.FC<WeekNavigationHeaderProps> = ({
  dateRangeText,
  currentDate,
  canNavigateForward,
  onJumpToToday,
  onDateRangePress,
  onPreviousWeek,
  onNextWeek,
  completedToday = 0,
  totalHabits = 0,
}) => {
  const isViewingPast = canNavigateForward && !!onJumpToToday;

  return (
    <View className='mb-3'>
      <ProgressGreeting
        canNavigateForward={canNavigateForward}
        completedToday={completedToday}
        currentDate={currentDate}
        dateRangeText={dateRangeText}
        isViewingPast={isViewingPast}
        totalHabits={totalHabits}
        onDateRangePress={onDateRangePress}
        onJumpToToday={onJumpToToday}
        onNextWeek={onNextWeek}
        onPreviousWeek={onPreviousWeek}
      />
    </View>
  );
};
