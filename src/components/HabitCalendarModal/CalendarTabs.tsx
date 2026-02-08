/**
 * CalendarTabs Component
 * Tab switcher for Month vs Year (Heatmap) calendar views
 * Animated sliding indicator with haptic feedback
 */

import { useCallback, useEffect } from 'react';
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type CalendarView = 'month' | 'year';

interface CalendarTabsProps {
  activeView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const SPRING_CONFIG = { damping: 18, mass: 1, stiffness: 180 };
const PADDING = 4;

export function CalendarTabs({ activeView, onViewChange }: CalendarTabsProps) {
  const containerWidth = useSharedValue(0);
  const indicatorX = useSharedValue(activeView === 'month' ? 0 : 1);

  useEffect(() => {
    indicatorX.value = withSpring(
      activeView === 'month' ? 0 : 1,
      SPRING_CONFIG
    );
  }, [activeView, indicatorX]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      containerWidth.value = event.nativeEvent.layout.width;
    },
    [containerWidth]
  );

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = (containerWidth.value - PADDING * 2) / 2;
    if (tabWidth <= 0) return { opacity: 0 };
    return {
      left: PADDING + indicatorX.value * tabWidth,
      opacity: 1,
      width: tabWidth,
    };
  });

  const handlePress = useCallback(
    (view: CalendarView) => {
      if (view !== activeView) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onViewChange(view);
      }
    },
    [activeView, onViewChange]
  );

  return (
    <View
      accessibilityRole='tablist'
      className='mb-4 rounded-lg bg-stone-100'
      style={{ padding: PADDING }}
      onLayout={handleLayout}
    >
      <Animated.View
        className='absolute bottom-1 top-1 rounded-md bg-white'
        style={[
          indicatorStyle,
          {
            elevation: 3,
            shadowColor: '#059669',
            shadowOffset: { height: 3, width: 0 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
          },
        ]}
      />
      <View className='flex-row'>
        <Pressable
          accessibilityLabel='Month view'
          accessibilityRole='tab'
          accessibilityState={{ selected: activeView === 'month' }}
          className='z-10 flex-1 items-center py-2'
          onPress={() => handlePress('month')}
        >
          <Text
            style={{
              color: activeView === 'month' ? '#059669' : '#78716c',
              fontSize: 13,
              fontWeight: '600',
            }}
          >
            Month
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel='Year view'
          accessibilityRole='tab'
          accessibilityState={{ selected: activeView === 'year' }}
          className='z-10 flex-1 items-center py-2'
          onPress={() => handlePress('year')}
        >
          <Text
            style={{
              color: activeView === 'year' ? '#059669' : '#78716c',
              fontSize: 13,
              fontWeight: '600',
            }}
          >
            Year
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
