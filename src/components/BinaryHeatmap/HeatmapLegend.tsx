/**
 * HeatmapLegend Component
 *
 * A simple binary legend for the GitHub-style heatmap.
 * Shows "Missed" (gray) and "Done" (habit color) indicators
 * with a completion percentage.
 *
 * Layout per spec:
 * [○ Missed] [● Done]          86% completion
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { typography } from '@/theme/typography';
import type { HeatmapLegendProps } from './types';
import {
  LEGEND_INDICATOR_SIZE,
  CELL_BORDER_RADIUS,
  getHeatmapColors,
} from './constants';

const formatCompletionRate = (rate: number): string => `${Math.round(rate)}%`;

export const HeatmapLegend = memo(function HeatmapLegend({
  habitColor,
  completionRate,
  isDark = false,
}: HeatmapLegendProps) {
  const hColors = getHeatmapColors(isDark);

  return (
    <View
      accessible
      accessibilityLabel={`Legend: Gray for missed days, colored for completed days. ${formatCompletionRate(completionRate)} completion rate`}
      accessibilityRole='text'
      style={styles.container}
    >
      <View style={styles.indicators}>
        <View
          accessible
          accessibilityLabel='Missed: gray'
          accessibilityRole='text'
          style={styles.indicator}
        >
          <View
            style={[
              styles.indicatorSquare,
              { backgroundColor: hColors.CELL_EMPTY },
            ]}
          />
          <Text
            style={[styles.indicatorLabel, { color: hColors.TEXT_SECONDARY }]}
          >
            Missed
          </Text>
        </View>
        <View
          accessible
          accessibilityLabel='Done: colored'
          accessibilityRole='text'
          style={styles.indicator}
        >
          <View
            style={[styles.indicatorSquare, { backgroundColor: habitColor }]}
          />
          <Text
            style={[styles.indicatorLabel, { color: hColors.TEXT_SECONDARY }]}
          >
            Done
          </Text>
        </View>
      </View>
      <Text
        accessible
        accessibilityLabel={`${formatCompletionRate(completionRate)} completion`}
        accessibilityRole='text'
        style={[styles.completionText, { color: habitColor }]}
      >
        {formatCompletionRate(completionRate)} compl
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  completionText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  indicator: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 12,
  },
  indicatorLabel: {
    fontSize: typography.tabBar.fontSize,
    marginLeft: 4,
  },
  indicators: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  indicatorSquare: {
    borderRadius: CELL_BORDER_RADIUS,
    height: LEGEND_INDICATOR_SIZE,
    width: LEGEND_INDICATOR_SIZE,
  },
});

export default HeatmapLegend;
