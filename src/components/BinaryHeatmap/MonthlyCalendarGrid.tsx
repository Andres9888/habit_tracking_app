/**
 * MonthlyCalendarGrid Component
 *
 * Full monthly calendar view with habit-colored completion indicators.
 * Uses inline styles for dynamic habit colors to avoid NativeWind conflicts.
 */

import React, { memo, useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfToday,
  addMonths,
  subMonths,
  isBefore,
  isAfter,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import type { Id } from '../../../convex/_generated/dataModel';

// Stone color palette
const COLORS = {
  TEXT_PRIMARY: '#1c1917',
  TEXT_SECONDARY: '#78716c',
  TEXT_TERTIARY: '#a8a29e',
  TEXT_MUTED: '#d6d3d1',
  BORDER: '#e7e5e4',
  CARD_BG: '#ffffff',
};

/**
 * Converts hex color to rgba with alpha
 */
function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(16, 185, 129, ${alpha})`; // fallback emerald
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface DayData {
  date: Date;
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  isBeforeCreation: boolean;
  isCompleted: boolean;
}

interface MonthlyCalendarGridProps {
  habitId: Id<'habits'>;
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
  onDayPress?: (date: string, completed: boolean) => void;
}

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MonthlyCalendarGrid = memo(function MonthlyCalendarGrid({
  habitId: _habitId,
  completedDates,
  habitColor,
  habitCreatedAt,
  onDayPress,
}: MonthlyCalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  // Generate calendar days for the current month
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map((date): DayData => {
      const dateString = format(date, 'yyyy-MM-dd');
      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
      const isToday = isSameDay(date, today);
      const isFuture = isAfter(date, today);
      const isCompleted = completedDates.has(dateString);
      const isBeforeCreation = habitCreatedAt
        ? isBefore(date, new Date(habitCreatedAt)) && !isCompleted
        : false;

      return {
        date,
        dateString,
        dayNumber: date.getDate(),
        isCurrentMonth,
        isToday,
        isFuture,
        isBeforeCreation,
        isCompleted,
      };
    });
  }, [currentMonth, today, completedDates, habitCreatedAt]);

  // Chunk days into weeks for row-based rendering
  const weeks = useMemo(() => {
    const result: DayData[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

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

  // Get text color based on day state
  const getTextColor = (day: DayData): string => {
    if (!day.isCurrentMonth) return COLORS.TEXT_MUTED;
    if (day.isFuture) return COLORS.TEXT_TERTIARY;
    return COLORS.TEXT_PRIMARY;
  };

  return (
    <View style={styles.container}>
      {/* Day Headers */}
      <View style={styles.row}>
        {DAY_HEADERS.map((day) => (
          <View key={day} style={styles.headerCell}>
            <Text style={styles.headerText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid - row by row */}
      {weeks.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.row}>
          {week.map((day) => {
            const showCompleted = day.isCompleted && day.isCurrentMonth && !day.isFuture;
            const isToday = day.isToday;

            return (
              <Pressable
                key={day.dateString}
                style={styles.dayWrapper}
                onPress={() => handleDayPress(day.dateString, day.isCompleted)}
                disabled={day.isFuture || day.isBeforeCreation}
              >
                <View
                  style={[
                    styles.dayCell,
                    showCompleted && { backgroundColor: hexToRgba(habitColor, 0.15) },
                    isToday && { borderWidth: 2, borderColor: habitColor },
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

                  {/* Completion dot */}
                  {showCompleted && (
                    <View style={[styles.dot, { backgroundColor: habitColor }]} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}

      {/* Month Navigation */}
      <View style={styles.navigation}>
        <Pressable style={styles.monthButton}>
          <Calendar size={16} color={COLORS.TEXT_SECONDARY} />
          <Text style={styles.monthText}>{format(currentMonth, 'MMM yyyy')}</Text>
        </Pressable>

        <View style={styles.navButtons}>
          <Pressable style={styles.navButton} onPress={goToPreviousMonth}>
            <ChevronLeft size={20} color={COLORS.TEXT_SECONDARY} />
          </Pressable>
          <Pressable style={styles.navButton} onPress={goToNextMonth}>
            <ChevronRight size={20} color={COLORS.TEXT_SECONDARY} />
          </Pressable>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 12,
    marginTop: 12,
    padding: 16,
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '500',
  },
  dayWrapper: {
    alignItems: 'center',
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 3,
    bottom: 4,
    height: 6,
    position: 'absolute',
    width: 6,
  },
  headerCell: {
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: '500',
  },
  monthButton: {
    alignItems: 'center',
    borderColor: COLORS.BORDER,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  monthText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  navButton: {
    alignItems: 'center',
    borderColor: COLORS.BORDER,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navigation: {
    alignItems: 'center',
    borderTopColor: COLORS.BORDER,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  todayText: {
    fontWeight: '700',
  },
});

export default MonthlyCalendarGrid;
