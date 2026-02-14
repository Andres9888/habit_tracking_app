/**
 * StreakDay Component
 *
 * Individual day cell for the streak calendar.
 * Shows filled green circles for completed days and empty circles for missed days.
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { DayData } from './types';
import { styles } from './styles';

interface StreakDayProps {
  day: DayData;
  habitColor: string;
  onPress: (dateString: string) => void;
}

function getTextColor(day: DayData): string {
  if (!day?.isCurrentMonth) return '#d6d3d1'; // TEXT_MUTED
  if (day?.isFuture) return '#a8a29e'; // TEXT_TERTIARY
  return '#1c1917'; // TEXT_PRIMARY
}

export const StreakDay = memo(function StreakDay({
  day,
  habitColor,
  onPress,
}: StreakDayProps) {
  // Guard against undefined day properties
  const isCompletedDay =
    Boolean(day?.isCompleted) &&
    Boolean(day?.isCurrentMonth) &&
    !Boolean(day?.isFuture);
  const isToday = Boolean(day?.isToday);
  const isMissedDay =
    Boolean(day?.isCurrentMonth) &&
    !Boolean(day?.isCompleted) &&
    !Boolean(day?.isFuture);
  const isDisabled = Boolean(
    day?.isFuture || day?.isBeforeCreation || !day?.isCurrentMonth
  );

  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <Pressable
        disabled={isDisabled}
        style={styles.dayWrapper}
        onPress={() => onPress(day?.dateString ?? '')}
      >
        <View
          style={[
            styles.dayCell,
            // Completed day: filled green circle
            isCompletedDay && {
              backgroundColor: habitColor,
              borderColor: habitColor,
              borderWidth: 1.5,
            },
            // Missed day: empty circle with border
            isMissedDay && {
              borderColor: '#d6d3d1',
              borderWidth: 1.5,
              backgroundColor: '#ffffff',
            },
            // Today: highlight with border
            isToday && {
              borderColor: habitColor,
              borderWidth: 2,
            },
          ]}
        >
          <Text
            style={[
              styles.dayText,
              {
                color: isCompletedDay ? '#ffffff' : getTextColor(day),
              },
              isToday && styles.todayText,
            ]}
          >
            {day?.dayNumber ?? ''}
          </Text>
          {/* Green dot indicator for completed days - GitHub style */}
          {isCompletedDay && (
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: habitColor,
                  opacity: 0.8,
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                },
              ]}
            />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
});
