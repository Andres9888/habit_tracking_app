/**
 * CalendarDay Component
 *
 * Individual day cell for the monthly calendar.
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { DayData } from './types';
import { COLORS, hexToRgba } from './colors';
import { styles } from './styles';

interface CalendarDayProps {
  day: DayData;
  habitColor: string;
  onPress: (dateString: string, isCompleted: boolean) => void;
}

function getTextColor(day: DayData): string {
  if (!day.isCurrentMonth) return COLORS.TEXT_MUTED;
  if (day.isFuture) return COLORS.TEXT_TERTIARY;
  return COLORS.TEXT_PRIMARY;
}

export const CalendarDay = memo(function CalendarDay({
  day,
  habitColor,
  onPress,
}: CalendarDayProps) {
  const showCompleted = day.isCompleted && day.isCurrentMonth && !day.isFuture;
  const isToday = day.isToday;

  return (
    <Pressable
      disabled={day.isFuture || day.isBeforeCreation}
      style={styles.dayWrapper}
      onPress={() => onPress(day.dateString, day.isCompleted)}
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
            { color: getTextColor(day) },
            isToday && styles.todayText,
          ]}
        >
          {day.dayNumber}
        </Text>
        {showCompleted && (
          <View style={[styles.dot, { backgroundColor: habitColor }]} />
        )}
      </View>
    </Pressable>
  );
});
