/**
 * MonthInsightStrip
 *
 * One insight sentence below the calendar: "Strongest on Wednesdays · 84% in
 * July". The strongest-weekday stat is the only number that needs the full
 * day grid to exist, and the rate is pinned to the visible month's name so it
 * can't be misread while browsing history. (Streak and best run live in the
 * hero — repeating them here was filler.)
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '@/theme';
import { durations, enterEasing } from '@/theme/animations';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';
import { useReduceMotion } from '@/hooks/useReduceMotion';

const WEEKDAY_PLURALS: Record<string, string> = {
  Sun: 'Sundays',
  Mon: 'Mondays',
  Tue: 'Tuesdays',
  Wed: 'Wednesdays',
  Thu: 'Thursdays',
  Fri: 'Fridays',
  Sat: 'Saturdays',
};

interface MonthInsightStripProps {
  habitColor: string;
  monthKey: string;
  monthLabel: string;
  monthRate: number;
  strongestDay: string;
}

export const MonthInsightStrip = memo(function MonthInsightStrip({
  habitColor,
  monthKey,
  monthLabel,
  monthRate,
  strongestDay,
}: MonthInsightStripProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const weekday = WEEKDAY_PLURALS[strongestDay];

  const entering = reduceMotion
    ? undefined
    : FadeInDown.withInitialValues({ transform: [{ translateY: 4 }] })
        .duration(durations.reveal)
        .easing(enterEasing);

  return (
    <View style={[styles.row, { borderTopColor: colors.border }]}>
      <Animated.View key={monthKey} entering={entering} style={styles.line}>
        <Text style={[styles.text, { color: colors.text.secondary }]}>
          {weekday ? (
            <>
              Strongest on{' '}
              <Text
                style={{
                  color: colors.text.primary,
                  fontWeight: fontWeights.semibold,
                }}
              >
                {weekday}
              </Text>
              {'  ·  '}
            </>
          ) : null}
          <Text style={[styles.rate, { color: habitColor }]}>
            {monthRate}%
          </Text>{' '}
          in {monthLabel}
        </Text>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  line: {
    alignItems: 'center',
  },
  row: {
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 14,
  },
  rate: {
    fontFamily: fontFamilies.monospace,
    fontWeight: fontWeights.bold,
  },
  text: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    textAlign: 'center',
  },
});
