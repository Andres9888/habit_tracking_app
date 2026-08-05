/**
 * Single week column in the heatmap grid
 */

import React from 'react';
import { View } from 'react-native';
import type { HeatmapData } from './ComplianceHeatmap.types';
import { styles } from './ComplianceHeatmap.styles';
import { HeatmapCell } from './HeatmapCell';

interface WeekColumnProps {
  week: HeatmapData[];
  onDayPress?: (day: HeatmapData) => void;
}

export function WeekColumn({ week, onDayPress }: WeekColumnProps) {
  return (
    <View style={styles.weekColumn}>
      {week.map((day, dayIndex) => (
        <HeatmapCell key={dayIndex} day={day} onPress={onDayPress} />
      ))}
    </View>
  );
}
