/**
 * HeatmapLegend Component
 *
 * An improved binary legend for the GitHub-style heatmap.
 * Shows "Missed" (gray) and "Done" (habit color) indicators
 * with a completion percentage and checkmark for accessibility.
 *
 * UX Improvements:
 * - Theme-aware colors for dark mode visibility
 * - Checkmark indicator on "Done" to help colorblind users
 * - Enhanced accessibility labels
 * - Clearer visual hierarchy
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { typography } from '@/theme/typography';
import type { HeatmapLegendProps } from './types';
import { LEGEND_INDICATOR_SIZE, CELL_BORDER_RADIUS } from './constants';
import { useHeatmapColors } from './themeAwareColors';

/**
 * Format completion rate as a rounded percentage string
 */
const formatCompletionRate = (rate: number): string => {
  return `${Math.round(rate)}%`;
};

/**
 * Checkmark indicator for the legend
 * Shows the checkmark that appears on completed cells
 */
const LegendCheckmark = memo(function LegendCheckmark({ color }: { color: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: LEGEND_INDICATOR_SIZE,
        height: LEGEND_INDICATOR_SIZE,
      }}
    >
      <Text style={{ color, fontSize: 8, fontWeight: '700', lineHeight: 8 }}>✓</Text>
    </View>
  );
});

/**
 * HeatmapLegend - Displays binary legend for the heatmap
 *
 * This component shows two indicators:
 * - Missed: gray square indicating days where habit was not completed
 * - Done: colored square (using habit color) with checkmark indicating completed days
 *
 * Also displays the overall completion percentage for the visible period.
 */
export const HeatmapLegend = memo(function HeatmapLegend({
  habitColor,
  completionRate,
}: HeatmapLegendProps) {
  const colors = useHeatmapColors();

  return (
    <View
      accessible
      accessibilityLabel={`Legend: Gray for missed days, colored square with checkmark for completed days. ${formatCompletionRate(completionRate)} completion`}
      accessibilityRole='text'
      style={styles.container}
    >
      {/* Left side: Legend indicators */}
      <View style={styles.indicators}>
        {/* Missed indicator */}
        <View
          accessible
          accessibilityLabel='Missed: gray square'
          accessibilityRole='text'
          style={styles.indicator}
        >
          <View
            style={[
              styles.indicatorSquare,
              { backgroundColor: colors.cellEmpty },
            ]}
          />
          <Text style={[styles.indicatorLabel, { color: colors.textSecondary }]}>Missed</Text>
        </View>

        {/* Done indicator with checkmark */}
        <View
          accessible
          accessibilityLabel='Done: colored square with checkmark'
          accessibilityRole='text'
          style={styles.indicator}
        >
          <View
            style={[styles.indicatorSquare, { backgroundColor: habitColor }]}
          >
            <LegendCheckmark color={getCheckmarkColor(habitColor)} />
          </View>
          <Text style={[styles.indicatorLabel, { color: colors.textSecondary }]}>Done</Text>
        </View>
      </View>

      {/* Right side: Completion percentage */}
      <Text
        accessible
        accessibilityLabel={`${formatCompletionRate(completionRate)} completion`}
        accessibilityRole='text'
        style={[styles.completionText, { color: colors.textPrimary }]}
      >
        {formatCompletionRate(completionRate)} compl
      </Text>
    </View>
  );
});

/**
 * Determine checkmark color based on habit color
 * Uses white for dark habit colors, black for light ones
 */
function getCheckmarkColor(habitColor: string): string {
  const hex = habitColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5 ? '#FFFFFF' : '#000000';
}

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
