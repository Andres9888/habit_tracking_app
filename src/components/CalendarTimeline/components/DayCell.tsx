/* eslint-disable max-lines */
import React, { memo, useMemo } from 'react';
import { View, Pressable } from 'react-native';

import type { DayCellProps } from '../CalendarTimeline.types';
import { useHaptics } from '@/utils/haptics';
import {
  buildAccessibilityLabel,
  formatDayLabels,
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
  ghostConnectorColor,
  currentStreak,
  strengthPercent,
  completionIcon,
}) => {
  const { weekday, dayNumber, monthPrefix, baseLabel } = useMemo(
    () => formatDayLabels(date),
    [date]
  );
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
    strengthPercent,
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
      currentStreak={currentStreak}
      ghostConnectorColor={ghostConnectorColor}
      ghostLeft={Boolean(ghostLeft)}
      ghostRight={Boolean(ghostRight)}
      reduceMotion={reduceMotion}
      streakConnectorColor={streakConnectorColor}
      strengthPercent={strengthPercent}
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
