/**
 * Legend for the heatmap showing level colors
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LEVEL_COLORS } from './ComplianceHeatmap.constants';
import { styles } from './ComplianceHeatmap.styles';

export function Legend() {
  return (
    <View style={styles.legend}>
      <Text style={styles.legendLabel}>Less</Text>
      {Object.entries(LEVEL_COLORS).map(([level, color]) => (
        <View
          key={level}
          style={[styles.legendCell, { backgroundColor: color }]}
        />
      ))}
      <Text style={styles.legendLabel}>More</Text>
    </View>
  );
}
