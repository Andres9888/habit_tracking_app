/**
 * TabContent Component
 * Manages tab content with scroll position preservation and animations
 */

import React, { useRef } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import type {
  TabType,
  TabContentProps,
  TabSectionProps,
  TabPaneProps,
} from './HabitDetailTabs.types';

const AnimatedView = Animated.View;

function TabPane({ children, isActive, tabId }: TabPaneProps) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);

  const opacity = useSharedValue(isActive ? 1 : 0);
  const translateY = useSharedValue(isActive ? 0 : 10);

  React.useEffect(() => {
    if (isActive) {
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
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
      className='flex-1'
      style={animatedStyle}
    >
      {children}
    </AnimatedView>
  );
}

export function TabContent({ activeTab, children }: TabContentProps) {
  const childArray = React.Children.toArray(children);

  return (
    <View className='flex-1'>
      {childArray.map((child) => {
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

export function TabSection({ children }: TabSectionProps) {
  return <>{children}</>;
}

export default TabContent;
