/**
 * DayCell Component
 *
 * Individual day cell in the weekly summary strip.
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import type { WeekDayData, DayVisualState } from '../WeeklySummaryStripTypes';
import {
  DAY_ABBREVIATIONS,
  DAY_NAMES,
  getDayStateConfigs,
} from '../WeeklySummaryStripTypes';
import { styles } from './WeeklySummaryStripStyles';
import { usePulseAnimation } from './usePulseAnimation';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

interface DayCellProps {
  day: WeekDayData;
  dayIndex: number;
  visualState: DayVisualState;
  onPress?: () => void;
  reduceMotion: boolean;
}

export const DayCell = React.memo(function DayCell({
  day: _day,
  dayIndex,
  visualState,
  onPress,
  reduceMotion,
}: DayCellProps) {
  const { colors } = useThemeColors();
  const dayStateConfigs = useMemo(
    () => getDayStateConfigs({ success: colors.status.success, successText: colors.status.successText }),
    [colors.status.success, colors.status.successText]
  );
  const config = dayStateConfigs[visualState];
  const { pulseAnimatedStyle } = usePulseAnimation({
    reduceMotion,
    visualState,
  });

  // Accessibility label for the day
  const dayName = DAY_NAMES[dayIndex];
  const statusText =
    visualState === 'complete' || visualState === 'todayComplete'
      ? 'completed'
      : visualState === 'missed'
        ? 'missed'
        : visualState === 'todayIncomplete'
          ? 'today, not yet completed'
          : 'upcoming';
  const accessibilityLabel = `${dayName}, ${statusText}`;

  const shouldPulse = visualState === 'todayIncomplete' && !reduceMotion;

  const cellContent = (
    <View style={styles.dayCellContainer}>
      <Text style={styles.dayLabel}>{DAY_ABBREVIATIONS[dayIndex]}</Text>
      <Animated.View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={onPress ? 'button' : 'text'}
        style={[
          styles.dayCircle,
          {
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
            borderStyle: config.borderStyle,
            borderWidth: config.borderWidth,
          },
          config.hasRing && styles.dayCircleRing,
          config.hasRing && { shadowColor: config.ringColor },
          shouldPulse ? pulseAnimatedStyle : undefined,
        ]}
      >
        {config.icon ? (
          <config.icon color={config.iconColor} size={iconSizes.small} />
        ) : null}
        {config.text ? (
          <Text style={[styles.todayText, { color: config.textColor }]}>
            {config.text}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );

  return onPress ? (
    <Pressable style={styles.dayPressable} onPress={onPress}>
      {cellContent}
    </Pressable>
  ) : (
    cellContent
  );
});
