import React, { memo } from 'react';
import { View, Pressable } from 'react-native';
import { format } from 'date-fns';

import type { DayCellProps } from '../CalendarTimeline.types';

import { useHaptics } from '@/utils/haptics';

import {
  buildAccessibilityLabel,
  getAccessibilityHint,
  getStatusText,
} from './DayCell.helpers';
import { ConnectorArms } from './ConnectorArms';
import { DayCellContent } from './DayCellContent';

/** Renders a single day cell in the timeline */
const DayCellComponent: React.FC<DayCellProps> = ({
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
  connectLeft,
  connectRight,
  streakConnectorColor,
}) => {
  const weekday = format(date, 'EEE');
  const dayNumber = format(date, 'd');
  const baseLabel = `${weekday}, ${format(date, 'MMM')} ${dayNumber}`;

  const isDayDisabled = Boolean(isUpcoming && disableFutureDayPress);
  const canPressDay = Boolean(
    isDayPressEnabled && onDayPress && !isDayDisabled
  );

  const statusText = getStatusText(completionStatus);
  const accessibilityLabel = buildAccessibilityLabel(
    isCurrentDay,
    baseLabel,
    statusText
  );
  const accessibilityHint = getAccessibilityHint(canPressDay, isDayDisabled);
  const { trigger } = useHaptics({ preference: reduceMotion });

  const handlePress = () => {
    trigger('tap');
    onDayPress(date);
  };

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

  const arms =
    (connectLeft || connectRight) && streakConnectorColor ? (
      <ConnectorArms
        connectLeft={Boolean(connectLeft)}
        connectRight={Boolean(connectRight)}
        streakConnectorColor={streakConnectorColor}
      />
    ) : null;

  if (onDayPress) {
    return (
      <Pressable
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        accessibilityState={{ disabled: isDayDisabled }}
        className='flex-1 items-center gap-0.5'
        disabled={isDayDisabled}
        style={{ opacity: isDayDisabled ? 0.5 : 1 }}
        onPress={handlePress}
      >
        {({ pressed }) => (
          <>
            {arms}
            <DayCellContent {...contentProps} pressed={pressed} />
          </>
        )}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      className='flex-1 items-center gap-0.5'
    >
      {arms}
      <DayCellContent {...contentProps} />
    </View>
  );
};

export const DayCell = memo(DayCellComponent);
