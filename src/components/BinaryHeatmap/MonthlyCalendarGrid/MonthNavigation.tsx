/**
 * MonthNavigation - Top header row: month name + inline stats + prev/next chevrons.
 * Replaces the previous bottom-row CalendarSummary + MonthNavigation split.
 */

import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { format, isValid } from 'date-fns';
import { useThemeColors } from '@/theme';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { styles } from './styles';
import { iconSizes } from '@/theme/iconSizes';

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
  completed: number;
  missed: number;
  habitColor: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const MonthNavigation = memo(function MonthNavigation({
  currentMonth,
  completed,
  missed,
  habitColor,
  onPreviousMonth,
  onNextMonth,
}: MonthNavigationProps) {
  const { colors } = useThemeColors();
  const iconColor = colors.text.secondary;
  const total = completed + missed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={headerStyles.row}>
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

      <View style={headerStyles.stats}>
        <View style={headerStyles.stat}>
          <View style={[headerStyles.dot, { backgroundColor: habitColor }]} />
          <Text style={[headerStyles.statText, { color: colors.text.secondary }]}>{completed}</Text>
        </View>
        <View style={headerStyles.stat}>
          <View style={[headerStyles.dot, { backgroundColor: 'transparent', borderColor: habitColor, borderWidth: 1.5 }]} />
          <Text style={[headerStyles.statText, { color: colors.text.secondary }]}>{missed}</Text>
        </View>
        <Text style={[headerStyles.rate, { color: habitColor }]}>{rate}%</Text>
      </View>

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

const headerStyles = StyleSheet.create({
  dot: { borderRadius: 4, height: 7, width: 7 },
  rate: { fontFamily: fontFamilies.primary.text, fontSize: 13, fontWeight: fontWeights.bold },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stat: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  stats: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: 10, justifyContent: 'center' },
  statText: { fontFamily: fontFamilies.primary.text, fontSize: 13, fontWeight: fontWeights.medium },
});
