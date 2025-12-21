/**
 * HabitDetailTabs Component
 * Tab bar navigation for the Habit Detail screen
 * Uses a pill/segment control style with smooth sliding animation
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useDerivedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export type TabType = 'progress' | 'motivation' | 'manage';

interface TabConfig {
  id: TabType;
  label: string;
}

const TABS: TabConfig[] = [
  { id: 'progress', label: 'Progress' },
  { id: 'motivation', label: 'Motivation' },
  { id: 'manage', label: 'Manage' },
];

// Spring config for smooth pill animation
const PILL_SPRING_CONFIG = {
  damping: 18,
  stiffness: 180,
  mass: 0.8,
};

// Padding inside the container
const CONTAINER_PADDING = 4;
// Gap between tabs
const TAB_GAP = 4;

export interface HabitDetailTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabButton({
  isActive,
  label,
  onPress,
}: {
  isActive: boolean;
  label: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 350 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 350 });
  }, [scale]);

  return (
    <AnimatedPressable
      accessibilityLabel={`${label} tab`}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      className="flex-1 items-center justify-center py-2.5 z-10"
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <Text
        className={`text-sm font-semibold ${
          isActive ? 'text-white' : 'text-stone-500'
        }`}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export function HabitDetailTabs({ activeTab, onTabChange }: HabitDetailTabsProps) {
  const containerWidth = useSharedValue(0);
  const indicatorPosition = useSharedValue(TABS.findIndex((t) => t.id === activeTab));

  // Calculate pill dimensions based on container width
  const pillWidth = useDerivedValue(() => {
    if (containerWidth.value === 0) return 0;
    // Subtract container padding (both sides) and gaps between tabs
    const availableWidth = containerWidth.value - (CONTAINER_PADDING * 2) - (TAB_GAP * (TABS.length - 1));
    return availableWidth / TABS.length;
  });

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    containerWidth.value = event.nativeEvent.layout.width;
  }, [containerWidth]);

  React.useEffect(() => {
    const index = TABS.findIndex((t) => t.id === activeTab);
    indicatorPosition.value = withSpring(index, PILL_SPRING_CONFIG);
  }, [activeTab, indicatorPosition]);

  // Animated pill style with smooth sliding
  const pillStyle = useAnimatedStyle(() => {
    const width = pillWidth.value;
    if (width === 0) {
      return { opacity: 0 };
    }
    // Calculate left position: container padding + (tab width + gap) * index
    const leftOffset = CONTAINER_PADDING + (indicatorPosition.value * (width + TAB_GAP));
    return {
      width,
      left: leftOffset,
      opacity: 1,
    };
  });

  const handleTabPress = useCallback((tab: TabType) => {
    if (tab !== activeTab) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onTabChange(tab);
    }
  }, [activeTab, onTabChange]);

  return (
    <View
      accessibilityRole="tablist"
      className="mx-4 my-3"
      onLayout={handleLayout}
    >
      {/* Outer container with gray background */}
      <View className="relative bg-stone-100 rounded-xl p-1">
        {/* Animated pill indicator */}
        <Animated.View
          className="absolute top-1 bottom-1 bg-violet-600 rounded-lg shadow-sm"
          style={pillStyle}
        />

        {/* Tab buttons row */}
        <View className="flex-row" style={{ gap: TAB_GAP }}>
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
