/**
 * MonthNavigation - Top header row: plain month label + round prev/next
 * chevron buttons (minimal, borderless).
 */

import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format, isValid } from 'date-fns';
import { useThemeColors } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { navStyles } from './MonthNavigation.styles';

const TAP_SLOP = { bottom: 10, left: 10, right: 10, top: 10 };

function safeFormat(date: Date, formatStr: string, fallback: string): string {
  try {
    if (!date || !(date instanceof Date) || !isValid(date)) return fallback;
    return format(date, formatStr);
  } catch {
    return fallback;
  }
}

interface MonthNavigationProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  /** Sit above a card, matching the History mock month bar. */
  standalone?: boolean;
}

export const MonthNavigation = memo(function MonthNavigation({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  standalone = false,
}: MonthNavigationProps) {
  const { colors, isDark } = useThemeColors();
  const iconColor = colors.text.primary;
  const buttonBg = isDark ? colors.surface : colors.card;

  return (
    <View style={[navStyles.row, standalone ? navStyles.rowStandalone : null]}>
      <Text
        accessibilityLabel={`Current month: ${safeFormat(currentMonth, 'MMMM yyyy', 'Month')}`}
        accessibilityRole='header'
        style={[navStyles.monthText, { color: colors.text.primary }]}
      >
        {safeFormat(currentMonth, 'MMMM yyyy', 'Month')}
      </Text>

      <View style={navStyles.navButtons}>
        <Pressable
          accessibilityLabel='Previous month'
          accessibilityRole='button'
          style={[
            navStyles.navButton,
            { backgroundColor: buttonBg, borderColor: colors.border },
          ]}
          hitSlop={TAP_SLOP}
          onPress={onPreviousMonth}
        >
          <ChevronLeft color={iconColor} size={iconSizes.medium} />
        </Pressable>
        <Pressable
          accessibilityLabel='Next month'
          accessibilityRole='button'
          style={[
            navStyles.navButton,
            { backgroundColor: buttonBg, borderColor: colors.border },
          ]}
          hitSlop={TAP_SLOP}
          onPress={onNextMonth}
        >
          <ChevronRight color={iconColor} size={iconSizes.medium} />
        </Pressable>
      </View>
    </View>
  );
});
