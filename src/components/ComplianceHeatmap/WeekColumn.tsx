/**
 * Single week column in the heatmap grid
 */

import React, { memo } from 'react';
import { View } from 'react-native';
import type { HeatmapData } from './ComplianceHeatmap.types';
import { styles } from './ComplianceHeatmap.styles';
import { HeatmapCell } from './HeatmapCell';

interface WeekColumnProps {
  week: HeatmapData[];
  onDayPress?: (day: HeatmapData) => void;
}

// memo: a year-long heatmap is ~52 columns x 7 cells in a plain (non-virtualized)
// ScrollView. `weeks` is memoized upstream in useComplianceHeatmap, so these
// boundaries actually hold and the grid stops rebuilding on every parent render.
export const WeekColumn = memo(function WeekColumn({
  week,
  onDayPress,
}: WeekColumnProps) {
  return (
    <View style={styles.weekColumn}>
      {week.map((day, dayIndex) => (
        <HeatmapCell key={dayIndex} day={day} onPress={onDayPress} />
      ))}
    </View>
  );
});
