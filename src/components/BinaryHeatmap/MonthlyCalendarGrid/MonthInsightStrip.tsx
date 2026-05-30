/**
 * MonthInsightStrip
 *
 * Compact summary below the calendar: current streak, strongest weekday,
 * completion rate this month, and all-time best run. Adds the motivation /
 * insight layer the bare calendar can't convey at a glance.
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { useThemeColors } from '@/theme';
import { colors as palette } from '@/theme/colors';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import { iconSizes } from '@/theme/iconSizes';
import type { MonthInsights } from './useMonthInsights';

interface StatProps {
  value: string;
  label: string;
  color: string;
  labelColor: string;
  icon?: React.ReactNode;
}

function Stat({ value, label, color, labelColor, icon }: StatProps) {
  return (
    <View style={styles.stat}>
      <View style={styles.valueRow}>
        {icon}
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </View>
  );
}

export const MonthInsightStrip = memo(function MonthInsightStrip({
  currentStreak,
  bestRun,
  strongestDay,
  monthRate,
}: MonthInsights) {
  const { colors, isDark } = useThemeColors();
  const gold = isDark ? palette.streak[300] : palette.streak[700];
  const divider = colors.border;
  const primary = colors.text.primary;
  const muted = colors.text.tertiary;

  const items: StatProps[] = [
    {
      value: String(currentStreak),
      label: 'Streak',
      color: gold,
      labelColor: muted,
      icon: <Flame color={gold} size={iconSizes.small} fill={gold} />,
    },
    { value: strongestDay, label: 'Strongest', color: primary, labelColor: muted },
    { value: `${monthRate}%`, label: 'This month', color: primary, labelColor: muted },
    { value: String(bestRun), label: 'Best run', color: primary, labelColor: muted },
  ];

  return (
    <View style={[styles.row, { borderTopColor: divider }]}>
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          <Stat {...item} />
          {i < items.length - 1 ? (
            <View style={[styles.divider, { backgroundColor: divider }]} />
          ) : null}
        </React.Fragment>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    alignItems: 'stretch',
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 14,
  },
  stat: { alignItems: 'center', flex: 1, gap: 3 },
  valueRow: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  value: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.bold,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  divider: { marginVertical: 2, width: 1 },
});
