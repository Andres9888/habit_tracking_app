/**
 * Status Indicator Component
 * Visual indicator showing good/warning/critical status.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { StatusLevel } from '../types';

interface StatusIndicatorProps {
  size?: 'large' | 'medium' | 'small';
  status: StatusLevel;
}

const STATUS_COLORS: Record<StatusLevel, string> = {
  critical: '#ef4444',
  good: '#22c55e',
  warning: '#f59e0b',
};

export function StatusIndicator({
  size = 'medium',
  status,
}: StatusIndicatorProps) {
  const sizeValue = size === 'small' ? 8 : size === 'medium' ? 12 : 16;

  return (
    <View
      style={[
        styles.indicator,
        {
          backgroundColor: STATUS_COLORS[status],
          borderRadius: sizeValue / 2,
          height: sizeValue,
          width: sizeValue,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  indicator: {
    shadowColor: '#1c1917',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
