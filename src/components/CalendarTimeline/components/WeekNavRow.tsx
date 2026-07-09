import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useWeekNavRowAnimation } from './WeekNavRow.hooks';
import { s } from './WeekNavRow.styles';
import { DatePill } from './DatePill';
import { TodayPill } from './TodayPill';
import type { WeekNavRowProps } from './WeekNavRow.types';

/** Date row — centered date pill with optional "Today" pill on past weeks */
const WeekNavRowComponent: React.FC<WeekNavRowProps> = ({
  monthName,
  dateSuffix,
  isCalendarOpen,
  isViewingPast,
  todayDayNumber,
  onJumpToToday,
  onDateRangePress,
}) => {
  const showToday = isViewingPast && !!onJumpToToday;
  const { shouldRender, spacerStyle, todayEntranceStyle } =
    useWeekNavRowAnimation(showToday);

  return (
    <View style={s.row}>
      <Animated.View style={spacerStyle} />

      <DatePill
        dateSuffix={dateSuffix}
        isCalendarOpen={isCalendarOpen}
        monthName={monthName}
        todayDayNumber={todayDayNumber}
        onDateRangePress={onDateRangePress}
      />

      <View style={s.sideColumnRight}>
        {shouldRender && onJumpToToday ? (
          <TodayPill
            entranceStyle={todayEntranceStyle}
            onJumpToToday={onJumpToToday}
          />
        ) : null}
      </View>
    </View>
  );
};

export const WeekNavRow = React.memo(WeekNavRowComponent);
