import React from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { WEEK_STRIP_HORIZONTAL_PADDING } from '../../../constants/weekStripLayout';
import { DayStrip } from './DayStrip';
import { StripNav } from './StripNav';
import { WeekNavRow } from './WeekNavRow';
import type { CalendarTimelineProps } from '../CalendarTimeline.types';
import { useCalendarTimelineSetup } from '../CalendarTimeline.derived';

type Setup = ReturnType<typeof useCalendarTimelineSetup>;

interface CalendarTimelineWeekStripProps {
  canNavigateForward: boolean;
  compact: boolean;
  completionByDay: CalendarTimelineProps['completionByDay'];
  completionIcon: CalendarTimelineProps['completionIcon'];
  currentStreak: CalendarTimelineProps['currentStreak'];
  dateSuffix: string;
  dates: CalendarTimelineProps['dates'];
  disableFutureDayPress: boolean;
  isDayPressEnabled: boolean;
  isViewingPast: boolean;
  monthName: string;
  onDayPress: CalendarTimelineProps['onDayPress'];
  onJumpToToday: CalendarTimelineProps['onJumpToToday'];
  onNextWeek?: () => void;
  onPreviousWeek?: () => void;
  reduceMotion: boolean;
  strengthPercent: number;
  tl: Setup;
}

export function CalendarTimelineWeekStrip({
  canNavigateForward,
  compact,
  completionByDay,
  completionIcon,
  currentStreak,
  dateSuffix,
  dates,
  disableFutureDayPress,
  isDayPressEnabled,
  isViewingPast,
  monthName,
  onDayPress,
  onJumpToToday,
  onNextWeek,
  onPreviousWeek,
  reduceMotion,
  strengthPercent,
  tl,
}: CalendarTimelineWeekStripProps) {
  return (
    <>
      <GestureDetector gesture={tl.headerPanGesture}>
        <View
          className={compact ? 'mb-1' : 'mb-3'}
          collapsable={false}
          style={{ paddingHorizontal: WEEK_STRIP_HORIZONTAL_PADDING }}
        >
          <WeekNavRow
            dateSuffix={dateSuffix}
            isCalendarOpen={tl.calendarOpen}
            isViewingPast={isViewingPast}
            monthName={monthName}
            onDateRangePress={tl.openCalendar}
            onJumpToToday={onJumpToToday}
          />
        </View>
      </GestureDetector>
      <View style={{ paddingHorizontal: WEEK_STRIP_HORIZONTAL_PADDING }}>
        <StripNav
          canNavigateForward={canNavigateForward}
          onNextWeek={onNextWeek}
          onPreviousWeek={onPreviousWeek}
          reduceMotion={reduceMotion}
        >
          <DayStrip
            augmentedColors={tl.augmentedColors}
            completionCounts={tl.completionCounts}
            completionStatuses={tl.completionStatuses}
            connectorColor={tl.connectorColor}
            currentStreak={currentStreak}
            dates={dates}
            disableFutureDayPress={disableFutureDayPress}
            ghostConnectorColor={tl.ghostConnectorColor}
            hasCompletionData={Object.keys(completionByDay ?? {}).length > 0}
            isDayPressEnabled={isDayPressEnabled}
            isFuture={tl.isFuture}
            isToday={tl.isToday}
            onDayPress={onDayPress}
            panGesture={tl.panGesture}
            completionIcon={completionIcon}
            reduceMotion={reduceMotion}
            strengthPercent={strengthPercent}
            weekTransitionStyle={tl.weekTransitionStyle}
          />
        </StripNav>
      </View>
    </>
  );
}
