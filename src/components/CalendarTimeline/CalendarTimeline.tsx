import React, { memo } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import {
  useCalendarTimelineLogic,
  useTimelineColors,
  useWeekTransition,
} from './CalendarTimeline.hooks';
import { useDerivedState } from './CalendarTimeline.derived';
import { getShelfStyle } from './CalendarTimeline.styles';
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
  currentStreak = 0,
  onJumpToToday,
  trialDaysRemaining,
  onUpgrade,
}) => {
  const { isToday, isFuture } = useCalendarTimelineLogic();
  const { isDark } = useThemeColors();
  const { augmentedColors } = useTimelineColors(highContrastMode, isDark);
  const swipeOpts = { canNavigateForward, onNextWeek, onPreviousWeek };
  const panGesture = useTimelineSwipe(swipeOpts);
  const headerPanGesture = useTimelineSwipe(swipeOpts);
  const weekTransitionStyle = useWeekTransition(dates, reduceMotion);
  const {
    calendarOpen,
    openCalendar,
    closeCalendar,
    completionStatuses,
    firstDate,
    lastDate,
    dateRangeText,
    currentDate,
    connectorColor,
  } = useDerivedState(
    dates,
    completionByDay,
    isFuture,
    isToday,
    highContrastMode,
    isDark
  );

  if (!firstDate || !lastDate || !currentDate) return null;

  return (
    <View style={getShelfStyle(isDark)} className='mb-4 pb-3 pt-2'>
      <View className='px-4'>
        {trialDaysRemaining != null && trialDaysRemaining > 0 && onUpgrade && (
          <InlineTrialBar
            daysRemaining={trialDaysRemaining}
            onUpgrade={onUpgrade}
          />
        )}
        <GestureDetector gesture={headerPanGesture}>
          <View collapsable={false}>
            <WeekNavigationHeader
              canNavigateForward={canNavigateForward}
              completedToday={completedToday}
              currentDate={currentDate}
              currentStreak={currentStreak}
              dateRangeText={dateRangeText}
              totalHabits={totalHabits}
              onDateRangePress={openCalendar}
              onJumpToToday={onJumpToToday}
            />
          </View>
        </GestureDetector>
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
