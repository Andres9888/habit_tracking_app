/**
 * CalendarDay Component
 *
 * Individual day cell for the monthly calendar.
 * Shows filled green circles for completed days and empty circles for missed days.
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';

import type { DayData } from './types';
import { COLORS } from './colors';
import { styles } from './styles';

interface CalendarDayProps {
  day: DayData;
  habitColor: string;
  onPress: (dateString: string, isCompleted: boolean) => void;
}

function getTextColor(day: DayData): string {
  if (!day?.isCurrentMonth) return COLORS.TEXT_MUTED;
  if (day?.isFuture) return COLORS.TEXT_TERTIARY;
  return COLORS.TEXT_PRIMARY;
}

export const CalendarDay = memo(function CalendarDay({
  day,
  habitColor,
  onPress,
}: CalendarDayProps) {
  // Guard against undefined day properties
  const showCompleted = Boolean(
    day?.isCompleted && day?.isCurrentMonth && !day?.isFuture
  );
  const showMissed = Boolean(
    day?.isMissed && day?.isCurrentMonth && !day?.isFuture
  );
  const isToday = Boolean(day?.isToday);

  // Determine circle style based on completion status
  const getCircleStyle = () => {
    if (showCompleted) {
      // Filled green circle for completed days
      return {
        backgroundColor: COLORS.GREEN_COMPLETED,
      };
    }
    if (showMissed) {
      // Empty circle with green border for missed days
      return {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.GREEN_COMPLETED,
      };
    }
    return {};
  };

  return (
    <Pressable
      accessibilityLabel={`Day ${day?.dayNumber ?? ''}${showCompleted ? ', completed' : ''}${isToday ? ', today' : ''}`}
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
          showCompleted && { backgroundColor: `${COLORS.GREEN_COMPLETED}26` },
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
          {day?.dayNumber ?? ''}
        </Text>
        {(showCompleted || showMissed) && (
          <View style={[styles.streakCircle, getCircleStyle()]} />
        )}
      </View>
    </Pressable>
  );
});
