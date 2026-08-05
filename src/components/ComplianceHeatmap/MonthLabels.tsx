/**
 * Month labels row for the heatmap
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { MonthLabel } from './ComplianceHeatmap.types';
import { CELL_SIZE } from './ComplianceHeatmap.constants';
import { spacing } from '../../theme/spacing';
import { styles } from './ComplianceHeatmap.styles';

interface MonthLabelsProps {
  labels: MonthLabel[];
}

export function MonthLabels({ labels }: MonthLabelsProps) {
  return (
    <View style={styles.monthLabelsContainer}>
      {labels.map((label, index) => (
        <View
          key={index}
          style={[
            styles.monthLabel,
            { left: label.weekIndex * (CELL_SIZE + spacing.xs) },
          ]}
        >
          <Text style={styles.monthLabelText}>{label.month}</Text>
        </View>
      ))}
    </View>
  );
}
