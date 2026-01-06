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

import type { HeatmapLegendProps } from './types';
import { LEGEND_INDICATOR_SIZE, COLORS, CELL_BORDER_RADIUS } from './constants';

/**
 * Format completion rate as a rounded percentage string
 */
const formatCompletionRate = (rate: number): string => {
  return `${Math.round(rate)}%`;
};

/**
 * HeatmapLegend - Displays the binary legend for the heatmap
 *
 * This component shows two indicators:
 * - Missed: gray square indicating days the habit was not completed
 * - Done: colored square (using habit color) indicating completed days
 *
 * Also displays the overall completion percentage for the visible period.
 */
export const HeatmapLegend = memo(function HeatmapLegend({
  habitColor,
  completionRate,
}: HeatmapLegendProps) {
  return (
    <View
      accessible
      accessibilityLabel={`Legend: Gray for missed days, colored for completed days. ${formatCompletionRate(completionRate)} completion rate`}
      accessibilityRole='text'
      style={styles.container}
    >
      {/* Left side: Legend indicators */}
      <View style={styles.indicators}>
        {/* Missed indicator */}
        <View
          accessible
          accessibilityLabel='Missed: gray'
          accessibilityRole='text'
          style={styles.indicator}
        >
          <View
            style={[
              styles.indicatorSquare,
              { backgroundColor: COLORS.CELL_EMPTY },
            ]}
          />
          <Text style={styles.indicatorLabel}>Missed</Text>
        </View>

        {/* Done indicator */}
        <View
          accessible
          accessibilityLabel='Done: colored'
          accessibilityRole='text'
          style={styles.indicator}
        >
          <View
            style={[styles.indicatorSquare, { backgroundColor: habitColor }]}
          />
          <Text style={styles.indicatorLabel}>Done</Text>
        </View>
      </View>

      {/* Right side: Completion percentage */}
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
    fontSize: 12,
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
    color: COLORS.TEXT_SECONDARY,
    fontSize: 11,
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
