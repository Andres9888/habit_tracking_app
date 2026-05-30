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

import { typography, fontWeights, fontFamilies } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/theme/ThemeContext';
import type { HeatmapLegendProps } from './types';
import { LEGEND_INDICATOR_SIZE, COLORS, CELL_BORDER_RADIUS } from './constants';
import { hexToRgba } from './MonthlyCalendarGrid/colors';

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
  showCompletionRate = true,
}: HeatmapLegendProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const missedTint = hexToRgba(habitColor, isDark ? 0.25 : 0.15);
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
            style={[styles.indicatorSquare, { backgroundColor: missedTint }]}
          />
          <Text style={[styles.indicatorLabel, { color: themeColors.text.secondary }]}>Missed</Text>
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
          <Text style={[styles.indicatorLabel, { color: themeColors.text.secondary }]}>Done</Text>
        </View>
      </View>

      {showCompletionRate ? (
        <Text
          accessible
          accessibilityLabel={`${formatCompletionRate(completionRate)} completion`}
          accessibilityRole='text'
          style={[styles.completionText, { color: habitColor }]}
        >
          {formatCompletionRate(completionRate)} completion
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  completionText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  indicator: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 12,
  },
  indicatorLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: fontFamilies.primary.text,
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
