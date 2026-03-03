/**
 * MonthlyCalendarGrid Component
 *
 * Full monthly calendar view with habit-colored completion indicators.
 */

import React, { memo, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { addMonths, subMonths } from 'date-fns';
import { useThemeColors } from '@/theme/ThemeContext';
import type { MonthlyCalendarGridProps } from './types';
import { getMonthlyGridColors } from './colors';
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
  onDayPress,
}: MonthlyCalendarGridProps) {
  const { isDark } = useThemeColors();
  const gridColors = getMonthlyGridColors(isDark);
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
      onDayPress?.(dateString, isCompleted);
    },
    [onDayPress]
  );

  return (
    <View style={[styles.container, { backgroundColor: gridColors.CARD_BG }]}>
      <View style={styles.row}>
        {DAY_HEADERS.map((day) => (
          <View key={day} style={styles.headerCell}>
            <Text
              style={[styles.headerText, { color: gridColors.TEXT_SECONDARY }]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {(weeks ?? []).map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.row}>
          {(week ?? []).map((day, dayIndex) =>
            day && day.dateString ? (
              <CalendarDay
                key={day.dateString}
                day={day}
                habitColor={habitColor}
                isDark={isDark}
                onPress={handleDayPress}
              />
            ) : (
              <View
                key={`empty-${weekIndex}-${dayIndex}`}
                style={styles.dayWrapper}
              />
            )
          )}
        </View>
      ))}

      <MonthNavigation
        currentMonth={currentMonth}
        isDark={isDark}
        onNextMonth={goToNextMonth}
        onPreviousMonth={goToPreviousMonth}
      />
    </View>
  );
});

export default MonthlyCalendarGrid;
