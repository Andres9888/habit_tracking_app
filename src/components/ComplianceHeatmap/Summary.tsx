/**
 * Summary text for the heatmap
 */

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ComplianceHeatmap.styles';

export function Summary() {
  return (
    <View style={styles.summary}>
      <Text style={styles.summaryText}>
        Last 90 days • Tap a day to see details
      </Text>
    </View>
  );
}
