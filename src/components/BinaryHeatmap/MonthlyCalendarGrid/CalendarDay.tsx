/**
 * CalendarDay — individual day cell for the monthly calendar grid.
 * Completed days use either a soft tint (default) or solid habit-color fill (detail).
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { DayData } from './types';
import { styles } from './styles';
import { fontWeights } from '@/theme/typography';

interface CalendarDayColors {
  inverse: string;
  muted: string;
  primary: string;
  tertiary: string;
}

interface CalendarDayProps {
  day: DayData;
  habitColor: string;
  completedBg: string;
  textColors: CalendarDayColors;
  useSolidCompletedFill?: boolean;
  isToggling?: boolean;
  onPress: (dateString: string, isCompleted: boolean) => void;
}

function getTextColor(
  day: DayData,
  c: CalendarDayColors,
  showCompleted: boolean,
  useSolid: boolean
): string {
  if (showCompleted && useSolid) return c.inverse;
  if (!day?.isCurrentMonth) return c.muted;
  if (day?.isFuture) return c.tertiary;
  return c.primary;
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
      accessibilityState={{ disabled: isDisabled, selected: showCompleted }}
      disabled={isDisabled}
      style={styles.dayWrapper}
      onPress={() => onPress(day?.dateString ?? '', Boolean(day?.isCompleted))}
    >
      <View
        style={[
          styles.dayCell,
          cellBg ? { backgroundColor: cellBg } : undefined,
          todayPending && {
            backgroundColor: `${habitColor}1A`,
            borderColor: habitColor,
            borderWidth: 2,
          },
          isToday &&
            showCompleted && { borderColor: habitColor, borderWidth: 2 },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: getTextColor(
                day,
                textColors,
                showCompleted,
                useSolidCompletedFill
              ),
            },
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
