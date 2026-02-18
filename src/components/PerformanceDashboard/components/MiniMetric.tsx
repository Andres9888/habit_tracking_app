/**
 * Mini Metric Component
 * Compact metric display for collapsed dashboard view.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MiniMetricProps {
  label: string;
  value: string;
}

export function MiniMetric({ label, value }: MiniMetricProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 9,
    fontWeight: '500',
  },
  value: {
    color: '#000000',
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '600',
  },
});
