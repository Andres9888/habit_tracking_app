/**
 * MonthNavigation Component
 *
 * Month display and navigation controls for the calendar.
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { format, isValid } from 'date-fns';
import { getMonthlyGridColors } from './colors';
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
  isDark?: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const MonthNavigation = memo(function MonthNavigation({
  currentMonth,
  isDark = false,
  onPreviousMonth,
  onNextMonth,
}: MonthNavigationProps) {
  const gridColors = getMonthlyGridColors(isDark);

  return (
    <View style={[styles.navigation, { borderTopColor: gridColors.BORDER }]}>
      <Pressable
        style={[styles.monthButton, { borderColor: gridColors.BORDER }]}
      >
        <Calendar color={gridColors.TEXT_SECONDARY} size={16} />
        <Text style={[styles.monthText, { color: gridColors.TEXT_PRIMARY }]}>
          {safeFormat(currentMonth, 'MMM yyyy', 'Month')}
        </Text>
      </Pressable>
      <View style={styles.navButtons}>
        <Pressable
          style={[styles.navButton, { borderColor: gridColors.BORDER }]}
          onPress={onPreviousMonth}
        >
          <ChevronLeft color={gridColors.TEXT_SECONDARY} size={20} />
        </Pressable>
        <Pressable
          style={[styles.navButton, { borderColor: gridColors.BORDER }]}
          onPress={onNextMonth}
        >
          <ChevronRight color={gridColors.TEXT_SECONDARY} size={20} />
        </Pressable>
      </View>
    </View>
  );
});
