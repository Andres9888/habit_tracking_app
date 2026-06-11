/**
 * MonthInsightStrip
 *
 * Compact summary below the calendar: current streak, strongest weekday,
 * completion rate this month, and all-time best run. Uses the shared
 * detail-page stat idiom (mono number over lowercase label).
 */

import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatColumn, StatHairline } from '@/components/ui';
import { useThemeColors } from '@/theme';
import type { MonthInsights } from './useMonthInsights';

export const MonthInsightStrip = memo(function MonthInsightStrip({
  currentStreak,
  bestRun,
  strongestDay,
  monthRate,
  showStreak = true,
}: MonthInsights & { showStreak?: boolean }) {
  const { colors } = useThemeColors();

  const items = [
    ...(showStreak ? [{ label: 'streak', value: String(currentStreak) }] : []),
    { label: 'strongest', value: strongestDay },
    { label: 'this month', value: `${monthRate}%` },
    { label: 'best run', value: String(bestRun) },
  ];

  return (
    <View style={[styles.row, { borderTopColor: colors.border }]}>
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          <StatColumn label={item.label} size='compact' value={item.value} />
          {i < items.length - 1 ? <StatHairline /> : null}
        </React.Fragment>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 14,
  },
});
