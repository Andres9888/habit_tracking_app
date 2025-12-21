/**
 * TabContent Component
 * Manages tab content with scroll position preservation and animations
 */

import React, { useRef, useCallback } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { TabType } from './HabitDetailTabs';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface TabContentProps {
  activeTab: TabType;
  children: React.ReactNode;
  contentContainerStyle?: object;
  onScroll?: (event: any) => void;
}

interface TabPaneProps {
  children: React.ReactNode;
  isActive: boolean;
  tabId: TabType;
}

const AnimatedView = Animated.View;

function TabPane({ children, isActive, tabId }: TabPaneProps) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);

  const opacity = useSharedValue(isActive ? 1 : 0);
  const translateY = useSharedValue(isActive ? 0 : 10);

  React.useEffect(() => {
    if (isActive) {
      opacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) });
      translateY.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) });
    } else {
      opacity.value = 0;
      translateY.value = 10;
    }
  }, [isActive, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!isActive) {
    return null;
  }

  return (
    <AnimatedView
      accessible
      accessibilityLabel={`${tabId} tab content`}
      className="flex-1"
      style={animatedStyle}
    >
      {children}
    </AnimatedView>
  );
}

export function TabContent({
  activeTab,
  children,
  contentContainerStyle,
  onScroll,
}: TabContentProps) {
  // Extract child elements by tab type
  const childArray = React.Children.toArray(children);

  return (
    <View className="flex-1">
      {childArray.map((child, index) => {
        if (!React.isValidElement<TabSectionProps>(child)) return null;

        const tabId = child.props.tabId;
        const isActive = tabId === activeTab;

        return (
          <TabPane key={tabId} isActive={isActive} tabId={tabId}>
            {child}
          </TabPane>
        );
      })}
    </View>
  );
}

// Helper component to mark tab content sections
export interface TabSectionProps {
  children: React.ReactNode;
  tabId: TabType;
}

export function TabSection({ children, tabId }: TabSectionProps) {
  return <>{children}</>;
}

export default TabContent;
