/**
 * MonthNavigation Component
 *
 * Month display and navigation controls for the calendar.
 * Theme-aware — uses semantic color tokens.
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { format, isValid } from 'date-fns';
import { useThemeColors } from '@/theme';
import { styles } from './styles';
import { iconSizes } from '@/theme/iconSizes';

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
  const { colors } = useThemeColors();
  const iconColor = colors.text.secondary;

  return (
    <View style={[styles.navigation, { borderTopColor: colors.border }]}>
      <Pressable
        accessible
        accessibilityLabel={`Current month: ${safeFormat(currentMonth, 'MMMM yyyy', 'Month')}`}
        accessibilityRole='header'
        style={[styles.monthButton, { borderColor: colors.border }]}
      >
        <Calendar color={iconColor} size={iconSizes.small} />
        <Text style={[styles.monthText, { color: colors.text.primary }]}>
          {safeFormat(currentMonth, 'MMM yyyy', 'Month')}
        </Text>
      </Pressable>
      <View style={styles.navButtons}>
        <Pressable
          accessibilityLabel='Previous month'
          accessibilityRole='button'
          style={[styles.navButton, { borderColor: colors.border }]}
          hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
          onPress={onPreviousMonth}
        >
          <ChevronLeft color={iconColor} size={iconSizes.medium} />
        </Pressable>
        <Pressable
          accessibilityLabel='Next month'
          accessibilityRole='button'
          style={[styles.navButton, { borderColor: colors.border }]}
          hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
          onPress={onNextMonth}
        >
          <ChevronRight color={iconColor} size={iconSizes.medium} />
        </Pressable>
      </View>
    </View>
  );
});
