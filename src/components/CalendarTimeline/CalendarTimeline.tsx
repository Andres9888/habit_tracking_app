import React, { memo } from 'react';
import { View } from 'react-native';
import { format } from 'date-fns';
import { useCalendarTimelineSetup } from './CalendarTimeline.derived';
import { getShelfStyle } from './CalendarTimeline.styles';
import type { CalendarTimelineProps } from './CalendarTimeline.types';
import { CalendarTimelineWeekStrip } from './components/CalendarTimelineWeekStrip';
import { InlineTrialBar, MiniCalendarPopup } from './components';

const CalendarTimelineComponent: React.FC<CalendarTimelineProps> = ({
  dates,
  onPreviousWeek,
  onNextWeek,
  canNavigateForward = true,
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
  strengthPercent = 0,
}) => {
  const tl = useCalendarTimelineSetup(
    dates,
    completionByDay,
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
    // Current week: "July 2026" — today's day number lives inside the pill's
    // calendar glyph instead (it duplicated the highlighted today cell).
    dateSuffix = format(tl.currentDate, 'yyyy');
  }

  return (
    <View
      style={getShelfStyle(tl.isDark)}
      className={compact ? 'pb-2 pt-1' : 'pb-4 pt-2'}
    >
      <View>
        {trialDaysRemaining != null && trialDaysRemaining > 0 && onUpgrade ? (
          <View className='px-6'>
            <InlineTrialBar
              daysRemaining={trialDaysRemaining}
              onUpgrade={onUpgrade}
            />
          </View>
        ) : null}
        <CalendarTimelineWeekStrip
          canNavigateForward={canNavigateForward}
          compact={compact}
          completionByDay={completionByDay}
          completionIcon={completionIcon}
          currentStreak={currentStreak}
          dateSuffix={dateSuffix}
          dates={dates}
          disableFutureDayPress={disableFutureDayPress}
          isDayPressEnabled={isDayPressEnabled ?? !!onDayPress}
          isViewingPast={isViewingPast}
          monthName={monthName}
          onDayPress={onDayPress}
          onJumpToToday={onJumpToToday}
          onNextWeek={onNextWeek}
          onPreviousWeek={onPreviousWeek}
          reduceMotion={reduceMotion}
          strengthPercent={strengthPercent}
          tl={tl}
        />
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
