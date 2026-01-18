import React, { memo } from 'react';
import { View } from 'react-native';
import { format } from 'date-fns';

import { useCalendarTimelineLogic } from './CalendarTimeline.hooks';
import { CONTAINER_SHADOW, getColors } from './CalendarTimeline.styles';
import type {
  CalendarTimelineProps,
  CompletionStatus,
} from './CalendarTimeline.types';
import { DayCell, WeekNavigationHeader } from './components';

const CalendarTimelineComponent: React.FC<CalendarTimelineProps> = ({
  dates,
  onPreviousWeek,
  onNextWeek,
  canNavigateForward = true,
  highContrastMode = false,
  completionByDay = {},
  reduceMotion = false,
  onDayPress,
  isDayPressEnabled,
  disableFutureDayPress = true,
}) => {
  const { isToday, isFuture } = useCalendarTimelineLogic();
  const colors = getColors(highContrastMode);

  const getCompletionStatus = (date: Date): CompletionStatus => {
    if (isFuture(date)) return 'future';
    const dateString = format(date, 'yyyy-MM-dd');
    const dayStatus = completionByDay[dateString];
    if (!dayStatus || dayStatus.total === 0) return 'none';
    if (dayStatus.completed === dayStatus.total) return 'complete';
    if (dayStatus.completed > 0) return 'partial';
    return 'none';
  };

  if (dates.length === 0) {
    return null;
  }

  const firstDate = dates[0];
  const lastDate = dates.at(-1);
  const dateRangeText = `${format(firstDate, 'MMM d')} - ${format(lastDate, 'MMM d')}`;
  const hasCompletionData = Object.keys(completionByDay).length > 0;

  // Augment colors with high contrast border info for DayCell
  const augmentedColors = {
    ...colors,
    borderWidth: highContrastMode ? 2 : 0,
    highContrastBorder: highContrastMode ? colors.dayBorder : undefined,
  };

  return (
    <View
      className='mb-4 rounded-2xl px-3 pb-3 pt-2'
      style={{
        backgroundColor: highContrastMode ? 'transparent' : '#ffffff',
        borderColor: highContrastMode ? 'transparent' : '#f5f5f4',
        borderWidth: highContrastMode ? 0 : 1,
        ...CONTAINER_SHADOW,
      }}
    >
      <WeekNavigationHeader
        canNavigateForward={canNavigateForward}
        colors={colors}
        dateRangeText={dateRangeText}
        onNextWeek={onNextWeek}
        onPreviousWeek={onPreviousWeek}
      />

      <View className='flex-row items-start justify-between'>
        {dates.map((date, index) => (
          <DayCell
            key={`timeline-day-${index}`}
            colors={augmentedColors}
            completionStatus={getCompletionStatus(date)}
            date={date}
            disableFutureDayPress={disableFutureDayPress}
            hasCompletionData={hasCompletionData}
            index={index}
            isCurrentDay={isToday(date)}
            isDayPressEnabled={isDayPressEnabled ?? !!onDayPress}
            isUpcoming={isFuture(date)}
            reduceMotion={reduceMotion}
            onDayPress={onDayPress}
          />
        ))}
      </View>
    </View>
  );
};

export const CalendarTimeline = memo(CalendarTimelineComponent);
