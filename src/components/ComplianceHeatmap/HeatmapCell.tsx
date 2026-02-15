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

  return (
    <TouchableOpacity
      accessibilityLabel={
        day.date
          ? `${day.date}, ${Math.round(day.completionRate)}% completion`
          : undefined
      }
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
