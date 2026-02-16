/* eslint-disable max-lines */
/**
 * CalendarTabs Component
 * Tab switcher for Month vs Year (Heatmap) calendar views
 * 
 * UX improvements:
 * - Added dark mode support via theme colors
 * - Maintained smooth spring animations
 * - Improved visual contrast and accessibility
 */

import { useCallback, useEffect } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { TabButton } from './TabButton';
import { useThemeColors } from '../../theme/ThemeContext';

type CalendarView = 'month' | 'year';

interface CalendarTabsProps {
  activeView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const SPRING_CONFIG = { damping: 18, mass: 1, stiffness: 180 };
const PADDING = 4;

export function CalendarTabs({ activeView, onViewChange }: CalendarTabsProps) {
  const { colors, isDark } = useThemeColors();
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

  // Theme-aware colors
  const containerBg = isDark ? colors.gray[800] : colors.gray[100];
  const indicatorBg = isDark ? colors.gray[700] : colors.card;
  const shadowColor = colors.primary[300];

  return (
    <View
      accessibilityRole='tablist'
      className='mb-4 rounded-lg'
      style={{ backgroundColor: containerBg, padding: PADDING }}
      onLayout={handleLayout}
    >
      <Animated.View
        className='absolute bottom-1 top-1 rounded-md'
        style={[
          indicatorStyle,
          {
            backgroundColor: indicatorBg,
            elevation: 3,
            shadowColor,
            shadowOffset: { height: 3, width: 0 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
          },
        ]}
      />
      <View className='flex-row'>
        <TabButton
          activeView={activeView}
          label='Month'
          view='month'
          onPress={onViewChange}
        />
        <TabButton
          activeView={activeView}
          label='Year'
          view='year'
          onPress={onViewChange}
        />
      </View>
    </View>
  );
}
