import React, { memo } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import { useCalendarTimelineSetup } from './CalendarTimeline.derived';
import { getShelfStyle } from './CalendarTimeline.styles';
import type { CalendarTimelineProps } from './CalendarTimeline.types';
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
  const tl = useCalendarTimelineSetup(
    dates,
    completionByDay,
    highContrastMode,
    reduceMotion,
    canNavigateForward,
    onPreviousWeek,
    onNextWeek
  );

  if (!tl.firstDate || !tl.lastDate || !tl.currentDate) return null;

  return (
    <View
      style={getShelfStyle(tl.isDark)}
      className='pb-4 pt-2'
    >
      <View>
        <View className='px-4'>
          {trialDaysRemaining != null && trialDaysRemaining > 0 && onUpgrade && (
            <InlineTrialBar
              daysRemaining={trialDaysRemaining}
              onUpgrade={onUpgrade}
            />
          )}
          <GestureDetector gesture={tl.headerPanGesture}>
            <View collapsable={false}>
              <WeekNavigationHeader
                canNavigateForward={canNavigateForward}
                completedToday={completedToday}
                currentDate={tl.currentDate}
                currentStreak={currentStreak}
                dateRangeText={tl.dateRangeText}
                totalHabits={totalHabits}
                onDateRangePress={tl.openCalendar}
                onJumpToToday={onJumpToToday}
              />
            </View>
          </GestureDetector>
        </View>
        <View className='pl-10 pr-9'>
          <StripNav canNavigateForward={canNavigateForward}>
            <DayStrip
              augmentedColors={tl.augmentedColors}
              completionCounts={tl.completionCounts}
              completionStatuses={tl.completionStatuses}
              connectorColor={tl.connectorColor}
              dates={dates}
              disableFutureDayPress={disableFutureDayPress}
              hasCompletionData={Object.keys(completionByDay).length > 0}
              isDayPressEnabled={isDayPressEnabled ?? !!onDayPress}
              isFuture={tl.isFuture}
              isToday={tl.isToday}
              onDayPress={onDayPress}
              panGesture={tl.panGesture}
              reduceMotion={reduceMotion}
              weekTransitionStyle={tl.weekTransitionStyle}
            />
          </StripNav>
        </View>
        <MiniCalendarPopup
          completionByDay={completionByDay}
          visible={tl.calendarOpen}
          onClose={tl.closeCalendar}
          onSelectDate={onDayPress ?? tl.closeCalendar}
        />
      </View>
    </View>
  );
};

export const CalendarTimeline = memo(CalendarTimelineComponent);
