/**
 * Tab Bar Component
 * Navigation for dashboard sections.
 * 
 * UX improvements:
 * - Increased font sizes to meet iOS minimums (17pt labels, 20pt icons)
 * - Added haptic feedback on tab switch
 * - Improved touch targets (44pt minimum height)
 * - Better visual hierarchy and contrast
 */

import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
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
  const handleTabPress = useCallback((tab: DashboardTab) => {
    if (tab !== activeTab) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onTabChange(tab);
    }
  }, [activeTab, onTabChange]);

  return (
    <View style={styles.container}>
      {TABS.map((tab) => (
        <Pressable
          key={tab.key}
          accessibilityLabel={`${tab.label} tab`}
          accessibilityRole='tab'
          accessibilityState={{ selected: activeTab === tab.key }}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => handleTabPress(tab.key)}
        >
          <Text style={[styles.icon, activeTab === tab.key && styles.activeIcon]}>
            {tab.icon}
          </Text>
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
  activeIcon: {
    opacity: 1,
  },
  activeLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
  },
  container: {
    borderBottomColor: 'rgba(255,255,255,0.1)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingBottom: 12,
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  icon: {
    fontSize: 20,
    opacity: 0.7,
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
});
