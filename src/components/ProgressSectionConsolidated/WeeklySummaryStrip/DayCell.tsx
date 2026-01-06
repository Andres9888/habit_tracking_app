/**
 * DayCell Component
 *
 * Individual day cell in the weekly summary strip.
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import type { WeekDayData, DayVisualState } from '../WeeklySummaryStripTypes';
import {
  DAY_ABBREVIATIONS,
  DAY_NAMES,
  DAY_STATE_CONFIGS,
} from '../WeeklySummaryStripTypes';
import { styles } from './WeeklySummaryStripStyles';

/** Animation timing constants */
const PULSE_DURATION = 1500;

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
  const config = DAY_STATE_CONFIGS[visualState];
  const pulseValue = useSharedValue(0);

  // Pulsing animation for today incomplete state
  useEffect(() => {
    pulseValue.value =
      visualState === 'todayIncomplete' && !reduceMotion
        ? withRepeat(
            withSequence(
              withTiming(1, {
                duration: PULSE_DURATION / 2,
                easing: Easing.inOut(Easing.ease),
              }),
              withTiming(0, {
                duration: PULSE_DURATION / 2,
                easing: Easing.inOut(Easing.ease),
              })
            ),
            -1,
            false
          )
        : 0;
  }, [visualState, reduceMotion, pulseValue]);

  // Pulse animated style
  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseValue.value, [0, 1], [1, 0.85]),
    transform: [{ scale: interpolate(pulseValue.value, [0, 1], [1, 1.05]) }],
  }));

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
          visualState === 'todayIncomplete' && !reduceMotion
            ? pulseAnimatedStyle
            : undefined,
        ]}
      >
        {config.icon ? (
          <Ionicons
            color={config.iconColor}
            name={config.icon as any}
            size={16}
          />
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
