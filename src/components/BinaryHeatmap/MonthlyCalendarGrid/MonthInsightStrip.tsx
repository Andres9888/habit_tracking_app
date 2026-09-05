/**
 * MonthInsightStrip
 *
 * Compact summary below the calendar: current streak, strongest weekday,
 * completion rate this month, and all-time best run. Uses the shared
 * detail-page stat idiom (mono number over lowercase label).
 */

import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { StatColumn, StatHairline } from '@/components/ui';
import { useThemeColors } from '@/theme';
import { durations, enterEasing } from '@/theme/animations';
import type { MonthInsights } from './useMonthInsights';

export const MonthInsightStrip = memo(function MonthInsightStrip({
  currentStreak,
  bestRun,
  monthKey,
  strongestDay,
  monthRate,
  showStreak = true,
}: MonthInsights & { monthKey: string; showStreak?: boolean }) {
  const { colors } = useThemeColors();
  const reduceMotion = useReducedMotion();

  const items = [
    ...(showStreak ? [{ label: 'streak', value: String(currentStreak) }] : []),
    { label: 'strongest', value: strongestDay },
    { label: 'this month', value: `${monthRate}%` },
    { label: 'best run', value: String(bestRun) },
  ];

  const entering = reduceMotion
    ? undefined
    : FadeInDown.withInitialValues({ transform: [{ translateY: 4 }] })
        .duration(durations.reveal)
        .easing(enterEasing);

  return (
    <View style={[styles.row, { borderTopColor: colors.border }]}>
      <Animated.View key={monthKey} entering={entering} style={styles.statsRow}>
        {items.map((item, i) => (
          <React.Fragment key={item.label}>
            <StatColumn label={item.label} size='compact' value={item.value} />
            {i < items.length - 1 ? <StatHairline /> : null}
          </React.Fragment>
        ))}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 14,
  },
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
