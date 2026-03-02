/**
 * CalendarDay Component
 *
 * Individual day cell for the monthly calendar.
 * Uses the habit's own color for completion indicators.
 * Accepts theme colors from parent to avoid 42x useThemeColors calls.
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { DayData } from './types';
import { styles } from './styles';

interface CalendarDayColors {
  muted: string;
  primary: string;
  tertiary: string;
}

interface CalendarDayProps {
  day: DayData;
  habitColor: string;
  textColors: CalendarDayColors;
  onPress: (dateString: string, isCompleted: boolean) => void;
}

function getTextColor(day: DayData, c: CalendarDayColors): string {
  if (!day?.isCurrentMonth) return c.muted;
  if (day?.isFuture) return c.tertiary;
  return c.primary;
}

export const CalendarDay = memo(function CalendarDay({
  day,
  habitColor,
  textColors,
  onPress,
}: CalendarDayProps) {
  const showCompleted = Boolean(
    day?.isCompleted && day?.isCurrentMonth && !day?.isFuture
  );
  const showMissed = Boolean(
    day?.isMissed && day?.isCurrentMonth && !day?.isFuture
  );
  const isToday = Boolean(day?.isToday);

  const dotStyle = showCompleted
    ? { backgroundColor: habitColor }
    : showMissed
      ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: habitColor }
      : undefined;

  const cellBg = showCompleted ? `${habitColor}18` : undefined;

  return (
    <Pressable
      accessibilityLabel={`Day ${day?.dayNumber ?? ''}${showCompleted ? ', completed' : showMissed ? ', missed' : ''}${isToday ? ', today' : ''}`}
      accessibilityHint={
        day?.isFuture || day?.isBeforeCreation
          ? 'Not available'
          : showCompleted
            ? 'Press to mark as incomplete'
            : 'Press to mark as complete'
      }
      accessibilityRole='button'
      accessibilityState={{
        disabled: Boolean(day?.isFuture || day?.isBeforeCreation),
        selected: showCompleted,
      }}
      disabled={Boolean(day?.isFuture || day?.isBeforeCreation)}
      style={styles.dayWrapper}
      onPress={() => onPress(day?.dateString ?? '', Boolean(day?.isCompleted))}
    >
      <View
        style={[
          styles.dayCell,
          cellBg ? { backgroundColor: cellBg } : undefined,
          isToday && {
            backgroundColor: habitColor,
            borderColor: habitColor,
            borderWidth: 2,
          },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            { color: isToday ? '#FFFFFF' : getTextColor(day, textColors) },
            isToday && styles.todayText,
            showCompleted && !isToday && { fontWeight: '600' },
          ]}
        >
          {day?.dayNumber ?? ''}
        </Text>
        {dotStyle && !isToday && (
          <View style={[styles.streakCircle, dotStyle]} />
        )}
      </View>
    </Pressable>
  );
});
