import React, { memo, useCallback, useRef } from 'react';
import { View, PanResponder } from 'react-native';
import { format } from 'date-fns';

import { useCalendarTimelineLogic } from './CalendarTimeline.hooks';
import {
  CHAIN_CONNECTOR_COLOR,
  CHAIN_CONNECTOR_COLOR_DARK,
  CONTAINER_SHADOW,
  getColors,
} from './CalendarTimeline.styles';
import type {
  CalendarTimelineProps,
  CompletionStatus,
} from './CalendarTimeline.types';
import { useThemeColors } from '../../theme/ThemeContext';
import { DayCell, WeekNavigationHeader } from './components';

const SWIPE_THRESHOLD = 50;

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
  const { isDark, colors: themeColors } = useThemeColors();
  const colors = getColors(highContrastMode, isDark);

  // Swipe gesture for week navigation
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        Math.abs(gestureState.dx) > 15 && Math.abs(gestureState.dy) < 30,
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD && onPreviousWeek) {
          onPreviousWeek();
        } else if (gestureState.dx < -SWIPE_THRESHOLD && canNavigateForward && onNextWeek) {
          onNextWeek();
        }
      },
    })
  ).current;

  const getCompletionStatus = useCallback(
    (date: Date): CompletionStatus => {
      if (isFuture(date)) return 'future';
      const dateString = format(date, 'yyyy-MM-dd');
      const dayStatus = completionByDay[dateString];
      if (!dayStatus || dayStatus.total === 0) return 'none';
      if (dayStatus.completed === dayStatus.total) return 'complete';
      if (dayStatus.completed > 0) return 'partial';
      return 'none';
    },
    [completionByDay, isFuture]
  );

  if (dates.length === 0) {
    return null;
  }

  const firstDate = dates[0];
  const lastDate = dates.at(-1);
  if (!firstDate || !lastDate) {
    return null;
  }
  const dateRangeText = `${format(firstDate, 'MMM d')} - ${format(lastDate, 'MMM d')}`;
  const hasCompletionData = Object.keys(completionByDay).length > 0;

  // Augment colors with high contrast border info for DayCell
  const augmentedColors = {
    ...colors,
    borderWidth: highContrastMode ? 2 : 0,
    highContrastBorder: highContrastMode ? colors.dayBorder : undefined,
  };

  // Pre-compute completion statuses for chain connector logic
  const statuses = dates.map((date) => getCompletionStatus(date));

  // Build the chain connector row (shown between completion dots)
  const chainConnectorColor = isDark ? CHAIN_CONNECTOR_COLOR_DARK : CHAIN_CONNECTOR_COLOR;

  return (
    <View
      className='mb-4 rounded-2xl px-3 pb-3 pt-2'
      style={{
        backgroundColor: highContrastMode ? 'transparent' : themeColors.card,
        borderColor: highContrastMode ? 'transparent' : themeColors.cardBorder,
        borderWidth: highContrastMode ? 0 : 1,
        ...CONTAINER_SHADOW,
      }}
      {...panResponder.panHandlers}
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
            completionStatus={statuses[index] ?? 'none'}
            date={date}
            disableFutureDayPress={disableFutureDayPress}
            hasCompletionData={hasCompletionData}
            index={index}
            isCurrentDay={isToday(date)}
            isDark={isDark}
            isDayPressEnabled={isDayPressEnabled ?? !!onDayPress}
            isUpcoming={isFuture(date)}
            reduceMotion={reduceMotion}
            onDayPress={onDayPress}
          />
        ))}
      </View>

      {/* Chain connectors: a row of lines connecting consecutive completed days */}
      {hasCompletionData && (
        <View className='flex-row items-center' style={{ marginTop: -5, paddingHorizontal: 16 }}>
          {dates.map((_date, index) => {
            if (index === dates.length - 1) return null;
            const current = statuses[index];
            const next = statuses[index + 1];
            const isChain = current === 'complete' && next === 'complete';
            return (
              <View
                key={`chain-${index}`}
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: isChain ? chainConnectorColor : 'transparent',
                  borderRadius: 1,
                  opacity: isChain ? 0.7 : 0,
                }}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export const CalendarTimeline = memo(CalendarTimelineComponent);
