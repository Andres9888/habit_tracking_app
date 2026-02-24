import React, { memo, useState, useCallback } from 'react';
import { View } from 'react-native';
import { format } from 'date-fns';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import {
  useCalendarTimelineLogic,
  useCardStyle,
  useCompletionStatus,
  useWeekTransition,
} from './CalendarTimeline.hooks';
import type { CalendarTimelineProps } from './CalendarTimeline.types';
import { useTimelineSwipe } from './useTimelineSwipe';
import { useThemeColors } from '../../theme/ThemeContext';
import {
  DayCell,
  InlineTrialBar,
  MiniCalendarPopup,
  WeekNavigationHeader,
} from './components';

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
  completedToday = 0,
  totalHabits = 0,
  onJumpToToday,
  trialDaysRemaining,
  onUpgrade,
}) => {
  const { isToday, isFuture } = useCalendarTimelineLogic();
  const { isDark, colors: themeColors } = useThemeColors();
  const { colors, augmentedColors, cardStyle } = useCardStyle(highContrastMode, isDark, themeColors);
  const getCompletionStatus = useCompletionStatus(completionByDay, isFuture);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const openCalendar = useCallback(() => setCalendarOpen(true), []);
  const closeCalendar = useCallback(() => setCalendarOpen(false), []);
  const timelinePanGesture = useTimelineSwipe({ canNavigateForward, onNextWeek, onPreviousWeek });
  const weekTransitionStyle = useWeekTransition(dates, reduceMotion);

  const firstDate = dates[0];
  const lastDate = dates.at(-1);
  if (!firstDate || !lastDate) return null;
  const dateRangeText = `${format(firstDate, 'MMM d')} - ${format(lastDate, 'MMM d')}`;
  const hasCompletionData = Object.keys(completionByDay).length > 0;

  return (
    <View className='mb-4 rounded-2xl px-3 pb-3 pt-2' style={cardStyle}>
      {trialDaysRemaining != null && trialDaysRemaining > 0 && onUpgrade && (
        <InlineTrialBar daysRemaining={trialDaysRemaining} onUpgrade={onUpgrade} />
      )}
      <WeekNavigationHeader
        canNavigateForward={canNavigateForward}
        colors={colors}
        completedToday={completedToday}
        dateRangeText={dateRangeText}
        reduceMotion={reduceMotion}
        totalHabits={totalHabits}
        onDateRangePress={openCalendar}
        onJumpToToday={onJumpToToday}
        onNextWeek={onNextWeek}
        onPreviousWeek={onPreviousWeek}
      />
      <GestureDetector gesture={timelinePanGesture}>
        <Animated.View className='flex-row items-start justify-between pl-1' style={weekTransitionStyle}>
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
        </Animated.View>
      </GestureDetector>
      <MiniCalendarPopup
        completionByDay={completionByDay}
        visible={calendarOpen}
        onClose={closeCalendar}
        onSelectDate={onDayPress ?? closeCalendar}
      />
    </View>
  );
};

export const CalendarTimeline = memo(CalendarTimelineComponent);
