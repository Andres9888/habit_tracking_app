import React from 'react';
import { View, Pressable } from 'react-native';
import { format } from 'date-fns';

import type { DayCellProps } from '../CalendarTimeline.types';

import {
  buildAccessibilityLabel,
  getAccessibilityHint,
  getStatusText,
} from './DayCell.helpers';
import { DayCellContent } from './DayCellContent';

/** Renders a single day cell in the timeline */
export const DayCell: React.FC<DayCellProps> = ({
  date,
  index,
  isCurrentDay,
  isUpcoming,
  completionStatus,
  hasCompletionData,
  colors,
  reduceMotion,
  onDayPress,
  isDayPressEnabled,
  disableFutureDayPress,
}) => {
  const weekday = format(date, 'EEE');
  const dayNumber = format(date, 'd');
  const baseLabel = `${weekday}, ${format(date, 'MMM')} ${dayNumber}`;

  const isDayDisabled = Boolean(isUpcoming && disableFutureDayPress);
  const canPressDay = Boolean(isDayPressEnabled && onDayPress && !isDayDisabled);

  const statusText = getStatusText(completionStatus);
  const accessibilityLabel = buildAccessibilityLabel(
    isCurrentDay,
    baseLabel,
    statusText
  );
  const accessibilityHint = getAccessibilityHint(canPressDay, isDayDisabled);

  const { focusStyle, focusHandlers } = useFocusRing({ disabled: isDayDisabled, compact: true });

  const contentProps = {
    colors,
    completionStatus,
    dayNumber,
    hasCompletionData,
    isCurrentDay,
    isUpcoming,
    reduceMotion,
    weekday,
  };

  if (onDayPress) {
    return (
      <Pressable
        key={`timeline-day-${index}`}
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        accessibilityState={{ disabled: isDayDisabled }}
        className='flex-1 items-center gap-0.5 rounded-lg'
        disabled={isDayDisabled}
        style={{ opacity: isDayDisabled ? 0.5 : 1, ...focusStyle }}
        {...focusHandlers}
        onPress={() => onDayPress(date)}
      >
        {({ pressed }) => (
          <DayCellContent {...contentProps} pressed={pressed} />
        )}
      </Pressable>
    );
  }

  return (
    <View
      key={`timeline-day-${index}`}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      className='flex-1 items-center gap-0.5'
    >
      <DayCellContent {...contentProps} />
    </View>
  );
};
