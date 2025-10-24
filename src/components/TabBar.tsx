/**
 * TabBar Component
 * Based on UX Specification Section 2.2 (Navigation Structure)
 *
 * Purpose: Primary navigation tabs
 * Tabs: Home (habits), Templates, Settings
 * States: Active tab (brand color, bold), Inactive (gray, regular)
 * Usage: Bottom tab bar navigation
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '../theme';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type TabId = 'home' | 'analytics' | 'settings';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const handleTabPress = (tabId: TabId) => {
    if (tabId !== activeTab) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onTabChange(tabId);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.custom.colors.light.background,
          borderTopColor: theme.custom.colors.gray[200],
          paddingBottom: insets.bottom,
          ...theme.custom.shadows.card,
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <Pressable
            key={tab.id}
            style={styles.tab}
            onPress={() => handleTabPress(tab.id)}
            accessible={true}
            accessibilityLabel={`${tab.label} tab`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            {/* Icon */}
            <Text
              style={[
                styles.icon,
                {
                  opacity: isActive ? 1 : 0.6,
                  transform: [{ scale: isActive ? 1.1 : 1 }],
                },
              ]}
            >
              {tab.icon}
            </Text>

            {/* Label */}
            <Text
              style={[
                theme.custom.typography.caption,
                styles.label,
                {
                  color: isActive
                    ? theme.custom.colors.primary[500]
                    : theme.custom.colors.gray[500],
                  fontWeight: isActive ? '600' : '400',
                },
              ]}
            >
              {tab.label}
            </Text>

            {/* Active Indicator */}
            {isActive && (
              <View
                style={[
                  styles.activeIndicator,
                  {
                    backgroundColor: theme.custom.colors.primary[500],
                  },
                ]}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    shadowOpacity: 0.1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    position: 'relative',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 1.5,
  },
});

export default TabBar;
