/**
 * Day labels column for ComplianceHeatmap
 */

import React from 'react';
import { View, Text } from 'react-native';
import { DAY_NAMES } from './ComplianceHeatmap.constants';
import { styles } from './ComplianceHeatmap.styles';

export function DayLabels() {
  return (
    <View style={styles.dayLabelsContainer}>
      {DAY_NAMES.map((day, index) => (
        <View key={index} style={styles.dayLabelCell}>
          <Text style={styles.dayLabel}>{day}</Text>
        </View>
      ))}
    </View>
  );
}
