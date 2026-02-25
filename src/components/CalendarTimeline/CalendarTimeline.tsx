import React, { memo, useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { format } from 'date-fns';

import {
  useCalendarTimelineLogic,
  useTimelineColors,
  useCompletionStatus,
  useWeekTransition,
} from './CalendarTimeline.hooks';
import { SHELF_STYLE, STREAK_CONNECTOR } from './CalendarTimeline.styles';
import type { CalendarTimelineProps } from './CalendarTimeline.types';
import { useTimelineSwipe } from './useTimelineSwipe';
import { useThemeColors } from '../../theme/ThemeContext';
import {
  DayStrip,
  InlineTrialBar,
  MiniCalendarPopup,
  StripNav,
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
  const { isDark } = useThemeColors();
  const { colors, augmentedColors } = useTimelineColors(
    highContrastMode,
    isDark
  );
  const getCompletionStatus = useCompletionStatus(completionByDay, isFuture);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const openCalendar = useCallback(() => setCalendarOpen(true), []);
  const closeCalendar = useCallback(() => setCalendarOpen(false), []);
  const panGesture = useTimelineSwipe({
    canNavigateForward,
    onNextWeek,
    onPreviousWeek,
  });
  const weekTransitionStyle = useWeekTransition(dates, reduceMotion);

  const completionStatuses = useMemo(
    () => dates.map((d) => getCompletionStatus(d)),
    [dates, getCompletionStatus]
  );

  const firstDate = dates[0];
  const lastDate = dates.at(-1);
  if (!firstDate || !lastDate) return null;

  const dateRangeText = `${format(firstDate, 'MMM d')} – ${format(lastDate, 'MMM d')}`;
  const currentDate = dates.find((d) => isToday(d)) ?? lastDate;
  const connectorColor = highContrastMode
    ? STREAK_CONNECTOR.highContrast
    : isDark
      ? STREAK_CONNECTOR.dark
      : STREAK_CONNECTOR.light;

  return (
    <View style={SHELF_STYLE} className='mb-4 pb-3'>
      <View className='px-4'>
        {trialDaysRemaining != null && trialDaysRemaining > 0 && onUpgrade && (
          <InlineTrialBar
            daysRemaining={trialDaysRemaining}
            onUpgrade={onUpgrade}
          />
        )}
        <WeekNavigationHeader
          canNavigateForward={canNavigateForward}
          completedToday={completedToday}
          currentDate={currentDate}
          dateRangeText={dateRangeText}
          totalHabits={totalHabits}
          onDateRangePress={openCalendar}
          onJumpToToday={onJumpToToday}
          onNextWeek={onNextWeek}
          onPreviousWeek={onPreviousWeek}
        />
        <StripNav canNavigateForward={canNavigateForward}>
          <DayStrip
            augmentedColors={augmentedColors}
            completionStatuses={completionStatuses}
            connectorColor={connectorColor}
            dates={dates}
            disableFutureDayPress={disableFutureDayPress}
            hasCompletionData={Object.keys(completionByDay).length > 0}
            isDayPressEnabled={isDayPressEnabled ?? !!onDayPress}
            isFuture={isFuture}
            isToday={isToday}
            onDayPress={onDayPress}
            panGesture={panGesture}
            reduceMotion={reduceMotion}
            weekTransitionStyle={weekTransitionStyle}
          />
        </StripNav>
        <MiniCalendarPopup
          completionByDay={completionByDay}
          visible={calendarOpen}
          onClose={closeCalendar}
          onSelectDate={onDayPress ?? closeCalendar}
        />
      </View>
    </View>
  );
};

export const CalendarTimeline = memo(CalendarTimelineComponent);
