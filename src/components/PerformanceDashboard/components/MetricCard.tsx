/**
 * Metric Card Component
 * Displays a single performance metric with status indicator.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusIndicator } from './StatusIndicator';
import type { StatusLevel } from '../types';

interface MetricCardProps {
  label: string;
  status: StatusLevel;
  subtitle?: string;
  value: number | string;
}

export function MetricCard({
  label,
  status,
  subtitle,
  value,
}: MetricCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <StatusIndicator size='small' status={status} />
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    flex: 1,
    minWidth: 80,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  subtitle: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 9,
    marginTop: 2,
  },
  value: {
    color: '#000000',
    fontFamily: 'monospace',
    fontSize: 17,
    fontWeight: '700',
  },
});
