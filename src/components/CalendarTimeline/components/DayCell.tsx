/* eslint-disable max-lines */
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

const DayCellComponent: React.FC<DayCellProps> = ({
  date,
  index,
  isCurrentDay,
  isUpcoming,
  completed,
  completionStatus,
  total,
  hasCompletionData,
  colors,
  reduceMotion,
  onDayPress,
  isDayPressEnabled,
  disableFutureDayPress,
  connectLeft,
  connectRight,
  streakConnectorColor,
  ghostLeft,
  ghostRight,
  completionIcon,
}) => {
  const weekday = format(date, 'EEE');
  const dayNumber = format(date, 'd');
  const monthPrefix =
    date.getDate() === 1 ? format(date, 'MMM').toUpperCase() : undefined;
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
    onDayPress?.(date);
  };

  const cp = {
    colors,
    completed,
    completionIcon,
    completionStatus,
    dayNumber,
    hasCompletionData,
    index,
    isCurrentDay,
    isUpcoming,
    monthPrefix,
    reduceMotion,
    total,
    weekday,
  };

  const showArms =
    (connectLeft || connectRight || ghostLeft || ghostRight) &&
    streakConnectorColor;
  const arms = showArms ? (
    <ConnectorArms
      connectLeft={Boolean(connectLeft)}
      connectRight={Boolean(connectRight)}
      ghostLeft={Boolean(ghostLeft)}
      ghostRight={Boolean(ghostRight)}
      streakConnectorColor={streakConnectorColor}
    />
  ) : null;

  if (!onDayPress) {
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='text'
        className='flex-1 items-center gap-0.5'
      >
        {arms}
        <DayCellContent {...cp} />
      </View>
    );
  }

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
          <DayCellContent {...cp} pressed={pressed} />
        </>
      )}
    </Pressable>
  );
};

export const DayCell = memo(DayCellComponent);
