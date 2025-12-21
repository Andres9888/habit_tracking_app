/**
 * HabitDetailTabs Component
 * Tab bar navigation for the Habit Detail screen
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
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

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      accessibilityLabel={`${label} tab`}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      className="flex-1 items-center py-3"
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <Text
        className={`text-sm font-medium ${
          isActive ? 'text-violet-600' : 'text-stone-500'
        }`}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export function HabitDetailTabs({ activeTab, onTabChange }: HabitDetailTabsProps) {
  const indicatorPosition = useSharedValue(TABS.findIndex((t) => t.id === activeTab));

  React.useEffect(() => {
    const index = TABS.findIndex((t) => t.id === activeTab);
    indicatorPosition.value = withSpring(index, { damping: 15, stiffness: 200 });
  }, [activeTab, indicatorPosition]);

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = 100 / TABS.length;
    return {
      width: `${tabWidth}%`,
      left: `${indicatorPosition.value * tabWidth}%`,
    };
  });

  const handleTabPress = (tab: TabType) => {
    if (tab !== activeTab) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onTabChange(tab);
    }
  };

  return (
    <View
      accessibilityRole="tablist"
      className="relative border-b border-stone-200 bg-white/95"
    >
      {/* Tab buttons */}
      <View className="flex-row">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            isActive={activeTab === tab.id}
            label={tab.label}
            onPress={() => handleTabPress(tab.id)}
          />
        ))}
      </View>

      {/* Animated indicator */}
      <Animated.View
        className="absolute bottom-0 h-0.5 bg-violet-600"
        style={indicatorStyle}
      />
    </View>
  );
}

export default HabitDetailTabs;
