/**
 * HabitDetailTabs Component
 *
 * Tab bar navigation for the Habit Detail screen.
 * Uses a pill/segment control style with smooth sliding animation.
 * Theme-aware with proper dark mode support.
 */

import React, { useCallback, useEffect } from 'react';
import { View, LayoutChangeEvent } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useDerivedValue,
} from 'react-native-reanimated';

import { useThemeColors } from '../../theme/ThemeContext';
import type { TabType, HabitDetailTabsProps } from './HabitDetailTabs.types';
import {
  TABS,
  PILL_SPRING_CONFIG,
  CONTAINER_PADDING,
  TAB_GAP,
} from './HabitDetailTabs.constants';
import { TabButton } from './components/TabButton';

export function HabitDetailTabs({
  activeTab,
  onTabChange,
}: HabitDetailTabsProps) {
  const { colors, isDark } = useThemeColors();
  const containerWidth = useSharedValue(0);
  const indicatorPosition = useSharedValue(
    TABS.findIndex((t) => t.id === activeTab)
  );

  const pillWidth = useDerivedValue(() => {
    if (containerWidth.value === 0) return 0;
    const availableWidth =
      containerWidth.value -
      CONTAINER_PADDING * 2 -
      TAB_GAP * (TABS.length - 1);
    return availableWidth / TABS.length;
  });

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      containerWidth.value = event.nativeEvent.layout.width;
    },
    [containerWidth]
  );

  useEffect(() => {
    const index = TABS.findIndex((t) => t.id === activeTab);
    indicatorPosition.value = withSpring(index, PILL_SPRING_CONFIG);
  }, [activeTab, indicatorPosition]);

  const pillStyle = useAnimatedStyle(() => {
    const width = pillWidth.value;
    if (width === 0) return { opacity: 0 };
    const leftOffset =
      CONTAINER_PADDING + indicatorPosition.value * (width + TAB_GAP);
    return { left: leftOffset, opacity: 1, width };
  });

  const handleTabPress = useCallback(
    (tab: TabType) => {
      if (tab !== activeTab) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onTabChange(tab);
      }
    },
    [activeTab, onTabChange]
  );

  // Theme-aware colors
  const containerBgColor = isDark ? colors.gray[700] : colors.gray[100];
  const pillBgColor = colors.primary[500];
  const pillShadowColor = colors.primary[300];

  return (
    <View
      accessibilityRole='tablist'
      className='mx-4 my-3'
      onLayout={handleLayout}
    >
      <View
        className='relative rounded-xl p-1'
        style={{ backgroundColor: containerBgColor }}
      >
        <Animated.View
          className='absolute bottom-1 top-1 rounded-lg shadow-sm'
          style={[
            pillStyle,
            {
              backgroundColor: pillBgColor,
              shadowColor: pillShadowColor,
              shadowOffset: { height: 3, width: 0 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            },
          ]}
        />
        <View className='flex-row' style={{ gap: TAB_GAP }}>
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              isActive={activeTab === tab.id}
              label={tab.label}
              onPress={() => handleTabPress(tab.id)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export default HabitDetailTabs;
