/**
 * ComplianceHeatmap Component
 *
 * Displays a heatmap visualization of habit completion rates over time
 */

import React from 'react';
import { View } from 'react-native';
import type { ComplianceHeatmapProps } from './ComplianceHeatmap.types';
import { useComplianceHeatmap } from './useComplianceHeatmap';
import { styles } from './ComplianceHeatmap.styles';
import { EmptyState } from './EmptyState';
import { DayLabels } from './DayLabels';
import { HeatmapGrid } from './HeatmapGrid';
import { Legend } from './Legend';
import { Summary } from './Summary';

export type {
  ComplianceHeatmapProps,
  HeatmapData,
} from './ComplianceHeatmap.types';

export function ComplianceHeatmap({
  data,
  onDayPress,
}: ComplianceHeatmapProps) {
  const { weeks, monthLabels } = useComplianceHeatmap(data);

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <View style={styles.container}>
      <DayLabels />
      <HeatmapGrid
        monthLabels={monthLabels}
        weeks={weeks}
        onDayPress={onDayPress}
      />
      <Legend />
      <Summary />
    </View>
  );
}

export default ComplianceHeatmap;
