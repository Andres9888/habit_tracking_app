/**
 * Dashboard Floating Action Button
 * Compact button showing status and FPS when dashboard is hidden.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { StatusIndicator } from './StatusIndicator';
import type { StatusLevel } from '../types';

interface DashboardFABProps {
  currentFPS: number;
  onPress: () => void;
  positionStyle: ViewStyle;
  status: StatusLevel;
}

export function DashboardFAB({
  currentFPS,
  onPress,
  positionStyle,
  status,
}: DashboardFABProps) {
  return (
    <Pressable
      accessibilityLabel={`Performance dashboard, ${currentFPS.toFixed(0)} FPS, ${status} status`}
      accessibilityRole='button'
      style={[styles.fab, positionStyle]}
      onPress={onPress}
    >
      <StatusIndicator size='small' status={status} />
      <Text style={styles.fabText}>{currentFPS.toFixed(0)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 9999,
  },
  fabText: {
    color: '#000000',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '600',
  },
});
