/**
 * Tab Bar Component
 * Navigation for dashboard sections.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { DashboardTab } from '../types';

interface TabBarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const TABS: { icon: string; key: DashboardTab; label: string }[] = [
  { icon: '📊', key: 'overview', label: 'Overview' },
  { icon: '🎬', key: 'fps', label: 'FPS' },
  { icon: '💾', key: 'memory', label: 'Memory' },
  { icon: '🌐', key: 'network', label: 'Network' },
  { icon: '⚛️', key: 'renders', label: 'Renders' },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => (
        <Pressable
          key={tab.key}
          accessibilityLabel={`${tab.label} tab`}
          accessibilityRole='tab'
          accessibilityState={{ selected: activeTab === tab.key }}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabChange(tab.key)}
        >
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text
            style={[styles.label, activeTab === tab.key && styles.activeLabel]}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  activeLabel: {
    color: '#ffffff',
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  container: {
    borderBottomColor: 'rgba(255,255,255,0.1)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 2,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  icon: {
    fontSize: 12,
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: '500',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
});
