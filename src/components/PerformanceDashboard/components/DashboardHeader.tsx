/**
 * Dashboard Header Component
 * Title bar with status indicator and expand/close controls.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusIndicator } from './StatusIndicator';
import type { StatusLevel } from '../types';

interface DashboardHeaderProps {
  isExpanded: boolean;
  onClose: () => void;
  onToggleExpand: () => void;
  status: StatusLevel;
}

export function DashboardHeader({
  isExpanded,
  onClose,
  onToggleExpand,
  status,
}: DashboardHeaderProps) {
  return (
    <Pressable
      accessibilityLabel='Close performance dashboard'
      accessibilityRole='button'
      style={styles.header}
      onPress={onClose}
    >
      <View style={styles.headerLeft}>
        <StatusIndicator size='medium' status={status} />
        <Text style={styles.headerTitle}>Performance</Text>
      </View>
      <View style={styles.headerRight}>
        <Pressable
          accessibilityLabel={
            isExpanded ? 'Collapse dashboard' : 'Expand dashboard'
          }
          accessibilityRole='button'
          style={styles.expandButton}
          onPress={onToggleExpand}
        >
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▲'}</Text>
        </Pressable>
        <Text style={styles.closeButton}>×</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 20,
    fontWeight: '300',
    marginLeft: 8,
  },
  expandButton: {
    padding: 4,
  },
  expandIcon: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 10,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
});
