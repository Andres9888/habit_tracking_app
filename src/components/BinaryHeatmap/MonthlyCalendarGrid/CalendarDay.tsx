/**
 * CalendarDay — individual day cell for the monthly calendar grid.
 * Completed days use either a soft tint (default) or solid habit-color fill
 * (detail). Today-pending is a bare 2px habit-color ring with accent text.
 */

import React, { memo, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { DayData } from './types';
import { styles } from './styles';
import { fontWeights } from '@/theme/typography';
import { springs } from '@/theme/animations';
import { borderRadius } from '@/theme/spacing';
import { useDetailPressAnimation } from '@/hooks/useDetailPressAnimation';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import {
  getDayAccessibility,
  getTextColor,
  type CalendarDayColors,
} from './CalendarDay.helpers';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CalendarDayProps {
  day: DayData;
  habitColor: string;
  completedBg: string;
  textColors: CalendarDayColors;
  useSolidCompletedFill?: boolean;
  isToggling?: boolean;
  onPress: (dateString: string, isCompleted: boolean) => void;
}

export const CalendarDay = memo(function CalendarDay({
  day,
  habitColor,
  completedBg,
  textColors,
  useSolidCompletedFill = false,
  isToggling = false,
  onPress,
}: CalendarDayProps) {
  const reduceMotion = useReduceMotion();
  const { animatedStyle: pressStyle, pressHandlers } = useDetailPressAnimation();
  const fillScale = useSharedValue(1);
  const showCompleted = Boolean(
    day?.isCompleted && day?.isCurrentMonth && !day?.isFuture
  );
  const prevCompletedRef = useRef(showCompleted);
  const showMissed = Boolean(
    day?.isMissed && day?.isCurrentMonth && !day?.isFuture
  );
  const isToday = Boolean(day?.isToday);
  const isDisabled = Boolean(
    day?.isFuture || !day?.isCurrentMonth || isToggling
  );
  const cellBg = showCompleted ? completedBg : undefined;
  const todayPending = isToday && !showCompleted;
  const a11y = getDayAccessibility(day, showCompleted, showMissed, isToday);
  const textColor = getTextColor(day, textColors, {
    habitColor,
    showCompleted,
    todayPending,
    useSolid: useSolidCompletedFill,
  });

  useEffect(() => {
    const wasCompleted = prevCompletedRef.current;
    if (
      showCompleted &&
      !wasCompleted &&
      useSolidCompletedFill &&
      !reduceMotion
    ) {
      fillScale.value = 0;
      fillScale.value = withSpring(1, springs.celebration);
    }
    prevCompletedRef.current = showCompleted;
  }, [showCompleted, useSolidCompletedFill, reduceMotion, fillScale]);

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fillScale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityHint={a11y.hint}
      accessibilityLabel={a11y.label}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled, selected: showCompleted }}
      disabled={isDisabled}
      style={[styles.dayWrapper, pressStyle]}
      onPress={() => onPress(day?.dateString ?? '', Boolean(day?.isCompleted))}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <View
        style={[
          styles.dayCell,
          isToday && { borderColor: habitColor, borderWidth: 2 },
        ]}
      >
        {cellBg ? (
          <Animated.View
            style={[
              fillStyle,
              StyleSheet.absoluteFill,
              {
                backgroundColor: cellBg,
                borderRadius: borderRadius.small,
              },
            ]}
          />
        ) : null}
        <Text
          style={[
            styles.dayText,
            { color: textColor },
            isToday && styles.todayText,
            showCompleted && { fontWeight: fontWeights.semibold },
          ]}
        >
          {day?.dayNumber ?? ''}
        </Text>
        {showCompleted && !useSolidCompletedFill ? (
          <View style={[styles.dot, { backgroundColor: habitColor }]} />
        ) : null}
      </View>
    </AnimatedPressable>
  );
});
