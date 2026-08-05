/**
 * HeatmapHeader Component
 *
 * Title row for the heatmap with an optional inline completion stat
 * (percentage + "done/eligible days") shown on the right.
 */

import React, { memo } from 'react';
import { View, Text } from 'react-native';

import type { BinaryGridStats } from './types';
import { styles } from './BinaryHeatmapNew.styles';
import { useThemeColors } from '@/theme/ThemeContext';

export interface HeatmapHeaderProps {
  title: string;
  habitColor: string;
  stats: BinaryGridStats;
  showStat: boolean;
}

export const HeatmapHeader = memo(function HeatmapHeader({
  title,
  habitColor,
  stats,
  showStat,
}: HeatmapHeaderProps) {
  const { colors } = useThemeColors();
  const { completions, eligibleDays, completionRate } = stats;

  return (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
        {title}
      </Text>
      {showStat && eligibleDays > 0 ? (
        <View style={styles.headerStat}>
          <Text style={[styles.headerStatPct, { color: habitColor }]}>
            {completions} days
          </Text>
          <Text style={[styles.headerStatCount, { color: colors.text.tertiary }]}>
            {completionRate}% complete
          </Text>
        </View>
      ) : null}
    </View>
  );
});
