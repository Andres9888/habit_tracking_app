/**
 * Individual cell in the heatmap grid
 */

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import type { HeatmapData } from './ComplianceHeatmap.types';
import { LEVEL_COLORS } from './ComplianceHeatmap.constants';
import { styles } from './ComplianceHeatmap.styles';

interface HeatmapCellProps {
  day: HeatmapData;
  onPress?: (day: HeatmapData) => void;
}

export function HeatmapCell({ day, onPress }: HeatmapCellProps) {
  const handlePress = () => {
    if (day.date && onPress) {
      onPress(day);
    }
  };

  const completionLabel = day.completionRate > 0
    ? `${Math.round(day.completionRate)}% completion`
    : 'No completions';
  const dateLabel = day.date ? day.date : 'Empty cell';
  const accessibilityLabel = day.date
    ? `${dateLabel}, ${completionLabel}`
    : undefined;

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={day.date ? 'button' : 'none'}
      activeOpacity={0.7}
      disabled={!day.date}
      style={[
        styles.cell,
        {
          backgroundColor: day.date ? LEVEL_COLORS[day.level] : 'transparent',
        },
      ]}
      onPress={handlePress}
    >
      {day.completionRate > 0 && (
        <Text style={styles.cellText}>{Math.round(day.completionRate)}</Text>
      )}
    </TouchableOpacity>
  );
}
