/**
 * CalendarDay — individual day cell for the monthly calendar grid.
 * Completed days use either a soft tint (default) or solid habit-color fill
 * (detail). Today-pending is a bare 2px habit-color ring with accent text.
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { DayData } from './types';
import { styles } from './styles';
import { fontWeights } from '@/theme/typography';
import {
  getDayAccessibility,
  getTextColor,
  type CalendarDayColors,
} from './CalendarDay.helpers';

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
  const showCompleted = Boolean(
    day?.isCompleted && day?.isCurrentMonth && !day?.isFuture
  );
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

  return (
    <Pressable
      accessibilityHint={a11y.hint}
      accessibilityLabel={a11y.label}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled, selected: showCompleted }}
      disabled={isDisabled}
      style={styles.dayWrapper}
      onPress={() => onPress(day?.dateString ?? '', Boolean(day?.isCompleted))}
    >
      <View
        style={[
          styles.dayCell,
          cellBg ? { backgroundColor: cellBg } : undefined,
          isToday && { borderColor: habitColor, borderWidth: 2 },
        ]}
      >
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
    </Pressable>
  );
});
