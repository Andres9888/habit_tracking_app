/**
 * MonthNavigation Component
 *
 * Month display and navigation controls for the calendar.
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { format, isValid } from 'date-fns';
import { COLORS } from './colors';
import { styles } from './styles';

/** Safely format a date, returning fallback on error */
function safeFormat(date: Date, formatStr: string, fallback: string): string {
  try {
    if (!date || !(date instanceof Date) || !isValid(date)) {
      return fallback;
    }
    return format(date, formatStr);
  } catch {
    return fallback;
  }
}

interface MonthNavigationProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const MonthNavigation = memo(function MonthNavigation({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}: MonthNavigationProps) {
  const monthLabel = safeFormat(currentMonth, 'MMMM yyyy', 'Month');

  return (
    <View style={styles.navigation}>
      <Pressable
        accessibilityLabel={`Current month: ${monthLabel}`}
        accessibilityRole='text'
        style={styles.monthButton}
      >
        <Calendar color={COLORS.TEXT_SECONDARY} size={16} />
        <Text style={styles.monthText}>{safeFormat(currentMonth, 'MMM yyyy', 'Month')}</Text>
      </Pressable>
      <View style={styles.navButtons}>
        <Pressable
          accessibilityLabel='Previous month'
          accessibilityRole='button'
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.navButton}
          onPress={onPreviousMonth}
        >
          <ChevronLeft color={COLORS.TEXT_SECONDARY} size={20} />
        </Pressable>
        <Pressable
          accessibilityLabel='Next month'
          accessibilityRole='button'
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.navButton}
          onPress={onNextMonth}
        >
          <ChevronRight color={COLORS.TEXT_SECONDARY} size={20} />
        </Pressable>
      </View>
    </View>
  );
});
