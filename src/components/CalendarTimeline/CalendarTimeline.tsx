import React, { memo } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import { useCalendarTimelineSetup } from './CalendarTimeline.derived';
import { getShelfStyle } from './CalendarTimeline.styles';
import type { CalendarTimelineProps } from './CalendarTimeline.types';
import {
  DayStrip,
  InlineTrialBar,
  MiniCalendarPopup,
  StripNav,
  WeekNavRow,
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
  onJumpToToday,
  trialDaysRemaining,
  onUpgrade,
  completionIcon,
  compact = false,
  currentStreak,
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

  const isViewingPast = canNavigateForward && !!onJumpToToday;
  if (!tl.firstDate || !tl.lastDate || !tl.currentDate) return null;

  const monthFormat = isViewingPast ? 'MMM' : 'MMMM';
  const monthName = format(
    isViewingPast ? tl.firstDate : tl.currentDate,
    monthFormat
  );
  let dateSuffix: string;
  if (isViewingPast && tl.lastDate) {
    const sameMonth = tl.firstDate.getMonth() === tl.lastDate.getMonth();
    dateSuffix = sameMonth
      ? `${format(tl.firstDate, 'd')} – ${format(tl.lastDate, 'd')}`
      : `${format(tl.firstDate, 'd')} – ${format(tl.lastDate, 'MMM d')}`;
  } else {
    dateSuffix = format(tl.currentDate, 'd');
  }

  return (
    <View style={getShelfStyle(tl.isDark)} className={compact ? 'pb-2 pt-1' : 'pb-4 pt-2'}>
      <View>
        {trialDaysRemaining != null && trialDaysRemaining > 0 && onUpgrade ? <View className='px-6'>
            <InlineTrialBar
              daysRemaining={trialDaysRemaining}
              onUpgrade={onUpgrade}
            />
          </View> : null}
        <GestureDetector gesture={tl.headerPanGesture}>
          <View
            className={compact ? 'mb-1' : 'mb-3'}
            collapsable={false}
            style={{ paddingHorizontal: 40 }}
          >
            <WeekNavRow
              dateSuffix={dateSuffix}
              isViewingPast={isViewingPast}
              monthName={monthName}
              onDateRangePress={tl.openCalendar}
              onJumpToToday={onJumpToToday}
            />
          </View>
        </GestureDetector>
        <View style={{ paddingHorizontal: 40 }}>
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
              hasCompletionData={Object.keys(completionByDay).length > 0}
              isDayPressEnabled={isDayPressEnabled ?? !!onDayPress}
              isFuture={tl.isFuture}
              isToday={tl.isToday}
              onDayPress={onDayPress}
              panGesture={tl.panGesture}
              completionIcon={completionIcon}
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
