/**
 * ChartTooltip - Displays selected data point details
 */

import React from 'react';
import { View, Text } from 'react-native';
import { formatDateKeyLabel } from '../../utils/getLocalDateString';
import { styles } from './styles';
import type { TrendData } from './types';

interface ChartTooltipProps {
  selectedPoint: TrendData | null;
}

export function ChartTooltip({ selectedPoint }: ChartTooltipProps) {
  if (!selectedPoint) {
    return null;
  }

  return (
    <View style={styles.tooltip}>
      <Text style={styles.tooltipDate}>
        {formatDateKeyLabel(selectedPoint.date)}
      </Text>
      <Text style={styles.tooltipValue}>
        {Math.round(selectedPoint.averageStrength)}% Average Strength
      </Text>
    </View>
  );
}
