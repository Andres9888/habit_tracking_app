/**
 * MonthlyCalendarGrid Component
 *
 * Full monthly calendar view with habit-colored completion indicators.
 * Shows filled green circles for completed days and empty circles for missed days.
 * Tapping a day shows completion notes if any exist.
 */

import React, { memo, useState, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import { addMonths, subMonths } from 'date-fns';
import type { MonthlyCalendarGridProps } from './types';
import { styles } from './styles';
import { useCalendarDays } from './useCalendarDays';
import { CalendarDay } from './CalendarDay';
import { MonthNavigation } from './MonthNavigation';

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MonthlyCalendarGrid = memo(function MonthlyCalendarGrid({
  habitId: _habitId,
  completedDates,
  habitColor,
  habitCreatedAt,
  notesByDate = {},
  onDayPress,
}: MonthlyCalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { weeks } = useCalendarDays({
    completedDates,
    currentMonth,
    habitCreatedAt,
  });

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const handleDayPress = useCallback(
    (dateString: string, isCompleted: boolean) => {
      // Check if there's a note for this day
      const note = notesByDate[dateString];
      if (note) {
        // Show note in alert
        Alert.alert(
          `Notes for ${dateString}`,
          note,
          [
            { text: 'OK', style: 'default' },
            {
              text: 'Edit Note',
              onPress: () => onDayPress?.(dateString, isCompleted),
            },
          ],
          { cancelable: true }
        );
      } else {
        // No note, just call the original handler
        onDayPress?.(dateString, isCompleted);
      }
    },
    [notesByDate, onDayPress]
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {DAY_HEADERS.map((day) => (
          <View key={day} style={styles.headerCell}>
            <Text style={styles.headerText}>{day}</Text>
          </View>
        ))}
      </View>

      {(weeks ?? []).map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.row}>
          {(week ?? []).map((day, dayIndex) => day && day.dateString ? (
            <CalendarDay
              key={day.dateString}
              day={day}
              habitColor={habitColor}
              onPress={handleDayPress}
            />
          ) : (
            <View key={`empty-${weekIndex}-${dayIndex}`} style={styles.dayWrapper} />
          ))}
        </View>
      ))}

      <MonthNavigation
        currentMonth={currentMonth}
        onNextMonth={goToNextMonth}
        onPreviousMonth={goToPreviousMonth}
      />
    </View>
  );
});

export default MonthlyCalendarGrid;
