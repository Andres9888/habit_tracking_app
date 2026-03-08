/**
 * MonthlyCalendarGrid Component
 *
 * Full monthly calendar view with habit-colored completion indicators.
 * Theme-aware (dark mode), uses habit color for personalized indicators.
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { addMonths, subMonths } from 'date-fns';
import { useThemeColors } from '@/theme';
import type { MonthlyCalendarGridProps } from './types';
import { styles } from './styles';
import { useCalendarDays } from './useCalendarDays';
import { CalendarDay } from './CalendarDay';
import { CalendarSummary } from './CalendarSummary';
import { MonthNavigation } from './MonthNavigation';

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MonthlyCalendarGrid = memo(function MonthlyCalendarGrid({
  habitId: _habitId,
  completedDates,
  habitColor,
  habitCreatedAt,
  onDayPress,
}: MonthlyCalendarGridProps) {
  const { colors, isDark } = useThemeColors();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { days, weeks } = useCalendarDays({
    completedDates,
    currentMonth,
    habitCreatedAt,
  });

  // Pre-compute text colors once for all 42 CalendarDay cells
  const textColors = useMemo(
    () => ({
      muted: isDark ? colors.gray[300] : colors.gray[300],
      primary: colors.text.primary,
      tertiary: colors.text.tertiary,
    }),
    [isDark, colors]
  );

  // Compute summary stats from current month days
  const { completed, missed } = useMemo(() => {
    let c = 0;
    let m = 0;
    for (const day of days) {
      if (!day.isCurrentMonth) continue;
      if (day.isCompleted) c++;
      else if (day.isMissed) m++;
    }
    return { completed: c, missed: m };
  }, [days]);

  const goToPreviousMonth = useCallback(
    () => setCurrentMonth((p) => subMonths(p, 1)),
    []
  );
  const goToNextMonth = useCallback(
    () => setCurrentMonth((p) => addMonths(p, 1)),
    []
  );

  const handleDayPress = useCallback(
    (dateString: string, isCompleted: boolean) => {
      onDayPress?.(dateString, isCompleted);
    },
    [onDayPress]
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.card : '#FFFFFF',
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.row}>
        {DAY_HEADERS.map((day) => (
          <View key={day} style={styles.headerCell}>
            <Text style={[styles.headerText, { color: colors.text.tertiary }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {(weeks ?? []).map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.row}>
          {(week ?? []).map((day, dayIndex) =>
            day?.dateString ? (
              <CalendarDay
                key={day.dateString}
                day={day}
                habitColor={habitColor}
                textColors={textColors}
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

      <CalendarSummary
        borderColor={colors.border}
        completed={completed}
        habitColor={habitColor}
        missed={missed}
        textColor={colors.text.secondary}
      />

      <MonthNavigation
        currentMonth={currentMonth}
        onNextMonth={goToNextMonth}
        onPreviousMonth={goToPreviousMonth}
      />
    </View>
  );
});

export default MonthlyCalendarGrid;
