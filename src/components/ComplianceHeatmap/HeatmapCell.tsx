/**
 * Individual cell in the heatmap grid
 */

import React from 'react';
import { Text } from 'react-native';
import { AnimatedPressable } from '../ui/AnimatedPressable';
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
    <AnimatedPressable
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
    </AnimatedPressable>
  );
}
