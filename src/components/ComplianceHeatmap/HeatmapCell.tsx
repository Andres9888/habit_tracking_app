/**
 * Individual cell in the heatmap grid
 */

import React from 'react';
import { Text, Pressable } from 'react-native';
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
    <Pressable
      accessibilityLabel={
        day.date
          ? `${day.date}, ${Math.round(day.completionRate)}% completion`
          : undefined
      }
      accessibilityRole={day.date ? 'button' : 'none'}
      disabled={!day.date}
      style={({ pressed }) => [
        styles.cell,
        {
          backgroundColor: day.date ? LEVEL_COLORS[day.level] : 'transparent',
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      onPress={handlePress}
    >
      {day.completionRate > 0 ? <Text style={styles.cellText}>{Math.round(day.completionRate)}</Text> : null}
    </Pressable>
  );
}
