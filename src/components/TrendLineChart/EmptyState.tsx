/**
 * EmptyState - Displayed when no trend data is available
 */

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No trend data available</Text>
      <Text style={styles.emptySubtext}>
        Track habits for at least 7 days to see trends
      </Text>
    </View>
  );
}
