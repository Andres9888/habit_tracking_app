/**
 * Empty state view for ComplianceHeatmap
 */

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ComplianceHeatmap.styles';

export function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No compliance data available</Text>
      <Text style={styles.emptySubtext}>
        Complete habits daily to see your compliance heatmap
      </Text>
    </View>
  );
}
