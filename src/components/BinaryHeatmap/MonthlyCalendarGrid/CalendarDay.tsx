/**
 * CalendarDay Component
 *
 * Individual day cell for the monthly calendar.
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { DayData } from './types';
import { getMonthlyGridColors, hexToRgba } from './colors';
import type { MonthlyGridColors } from './colors';
import { styles } from './styles';

interface CalendarDayProps {
  day: DayData;
  habitColor: string;
  isDark?: boolean;
  onPress: (dateString: string, isCompleted: boolean) => void;
}

function getTextColor(day: DayData, colors: MonthlyGridColors): string {
  if (!day?.isCurrentMonth) return colors.TEXT_MUTED;
  if (day?.isFuture) return colors.TEXT_TERTIARY;
  return colors.TEXT_PRIMARY;
}

export const CalendarDay = memo(function CalendarDay({
  day,
  habitColor,
  isDark = false,
  onPress,
}: CalendarDayProps) {
  const gridColors = getMonthlyGridColors(isDark);
  const showCompleted = Boolean(
    day?.isCompleted && day?.isCurrentMonth && !day?.isFuture
  );
  const isToday = Boolean(day?.isToday);

  return (
    <Pressable
      disabled={Boolean(day?.isFuture || day?.isBeforeCreation)}
      style={styles.dayWrapper}
      onPress={() => onPress(day?.dateString ?? '', Boolean(day?.isCompleted))}
    >
      <View
        style={[
          styles.dayCell,
          showCompleted && { backgroundColor: hexToRgba(habitColor, 0.15) },
          isToday && { borderColor: habitColor, borderWidth: 2 },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            { color: getTextColor(day, gridColors) },
            isToday && styles.todayText,
          ]}
        >
          {day?.dayNumber ?? ''}
        </Text>
        {showCompleted && (
          <View style={[styles.dot, { backgroundColor: habitColor }]} />
        )}
      </View>
    </Pressable>
  );
});
