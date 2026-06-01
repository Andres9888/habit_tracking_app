/**
 * CalendarDay Component
 *
 * Individual day cell for the monthly calendar (HabitKit-inspired, calm).
 * Only *completed* days are marked — a soft habit-color tint plus a small dot.
 * Missed days are left as a plain number, today gets a ring. This keeps the
 * grid uncluttered: we mark what was done, not what wasn't.
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { DayData } from './types';
import { styles } from './styles';
import { fontWeights } from '@/theme/typography';

interface CalendarDayColors {
  muted: string;
  primary: string;
  tertiary: string;
}

interface CalendarDayProps {
  day: DayData;
  habitColor: string;
  /** Pre-blended solid tint shared with the ribbon connectors. */
  completedBg: string;
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
  completedBg,
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

  // Solid tint shared with the ribbon connectors so runs merge seamlessly.
  const cellBg = showCompleted ? completedBg : undefined;

  return (
    <Pressable
      accessibilityLabel={`Day ${day?.dayNumber ?? ''}${showCompleted ? ', completed' : showMissed ? ', missed' : ''}${isToday ? ', today' : ''}`}
      accessibilityHint={
        day?.isFuture
          ? 'Not available'
          : showCompleted
            ? 'Press to mark as incomplete'
            : 'Press to mark as complete'
      }
      accessibilityRole='button'
      accessibilityState={{
        disabled: Boolean(day?.isFuture || !day?.isCurrentMonth),
        selected: showCompleted,
      }}
      disabled={Boolean(day?.isFuture || !day?.isCurrentMonth)}
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
            { color: getTextColor(day, textColors) },
            isToday && styles.todayText,
            showCompleted && { fontWeight: fontWeights.semibold },
          ]}
        >
          {day?.dayNumber ?? ''}
        </Text>
        {showCompleted ? (
          <View style={[styles.dot, { backgroundColor: habitColor }]} />
        ) : null}
      </View>
    </Pressable>
  );
});
