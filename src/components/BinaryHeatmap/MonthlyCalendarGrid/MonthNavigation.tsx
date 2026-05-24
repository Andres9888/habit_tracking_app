/**
 * MonthNavigation - Top header row: month name + prev/next chevrons.
 */

import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Link2,
} from 'lucide-react-native';
import { format, isValid } from 'date-fns';
import { useThemeColors } from '@/theme';
import { styles } from './styles';
import { iconSizes } from '@/theme/iconSizes';

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
  habitColor: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToggleChain: () => void;
  showChain: boolean;
}

export const MonthNavigation = memo(function MonthNavigation({
  currentMonth,
  habitColor,
  onPreviousMonth,
  onNextMonth,
  onToggleChain,
  showChain,
}: MonthNavigationProps) {
  const { colors } = useThemeColors();
  const iconColor = colors.text.secondary;

  return (
    <View style={headerStyles.row}>
      <View style={headerStyles.leftGroup}>
        <Pressable
          accessibilityLabel={`Current month: ${safeFormat(currentMonth, 'MMMM yyyy', 'Month')}`}
          accessibilityRole='header'
          style={[styles.monthButton, { borderColor: colors.border }]}
        >
          <Calendar color={iconColor} size={iconSizes.small} />
          <Text style={[styles.monthText, { color: colors.text.primary }]}>
            {safeFormat(currentMonth, 'MMM yyyy', 'Month')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel={`Toggle chain connectors. Currently ${showChain ? 'on' : 'off'}.`}
          accessibilityRole='button'
          hitSlop={TAP_SLOP}
          style={[
            styles.navButton,
            { borderColor: showChain ? habitColor : colors.border },
          ]}
          onPress={onToggleChain}
        >
          <Link2
            color={showChain ? habitColor : iconColor}
            size={iconSizes.small}
          />
        </Pressable>
      </View>

      <View style={styles.navButtons}>
        <Pressable
          accessibilityLabel='Previous month'
          accessibilityRole='button'
          style={[styles.navButton, { borderColor: colors.border }]}
          hitSlop={TAP_SLOP}
          onPress={onPreviousMonth}
        >
          <ChevronLeft color={iconColor} size={iconSizes.medium} />
        </Pressable>
        <Pressable
          accessibilityLabel='Next month'
          accessibilityRole='button'
          style={[styles.navButton, { borderColor: colors.border }]}
          hitSlop={TAP_SLOP}
          onPress={onNextMonth}
        >
          <ChevronRight color={iconColor} size={iconSizes.medium} />
        </Pressable>
      </View>
    </View>
  );
});

const headerStyles = StyleSheet.create({
  leftGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
