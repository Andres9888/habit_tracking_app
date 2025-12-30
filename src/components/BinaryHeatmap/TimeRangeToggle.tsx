/**
 * TimeRangeToggle Component
 *
 * A segmented control for switching between time ranges (3m, 6m, 1y)
 * in the GitHub-style binary heatmap.
 *
 * Styling per spec:
 * - Container: bg-stone-100 rounded-lg p-0.5
 * - Button: px-2.5 py-1 text-[11px] font-medium rounded-md
 * - Active: bg-white shadow-sm text-stone-900
 * - Inactive: text-stone-500
 */

import React, { memo, useCallback } from 'react';
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { TimeRange, TimeRangeToggleProps } from './types';
import { TIME_RANGE_CONFIG, COLORS, FOCUS } from './constants';
import { useReduceMotion } from '../../hooks/useReduceMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Time range options in display order
 */
const TIME_RANGES: TimeRange[] = ['3m', '6m', '1y'];

/**
 * Get display label for a time range
 */
const getTimeRangeLabel = (range: TimeRange): string => {
  return TIME_RANGE_CONFIG[range].label;
};

/**
 * Get full accessibility label for a time range
 */
const getTimeRangeAccessibilityLabel = (range: TimeRange): string => {
  switch (range) {
    case '3m': {
      return '3 months';
    }
    case '6m': {
      return '6 months';
    }
    case '1y': {
      return '1 year';
    }
  }
};

interface TimeRangeButtonProps {
  range: TimeRange;
  isActive: boolean;
  onPress: (range: TimeRange) => void;
  reduceMotion: boolean;
}

/**
 * Individual button within the toggle
 */
const TimeRangeButton = memo(function TimeRangeButton({
  range,
  isActive,
  onPress,
  reduceMotion,
}: TimeRangeButtonProps) {
  const scale = useSharedValue(1);

  // Animated scale style for tap feedback
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!reduceMotion) {
      scale.value = withSpring(0.95, { damping: 15 });
    }
  }, [reduceMotion, scale]);

  const handlePressOut = useCallback(() => {
    if (!reduceMotion) {
      scale.value = withSpring(1, { damping: 15 });
    }
  }, [reduceMotion, scale]);

  const handlePress = useCallback(() => {
    onPress(range);
  }, [onPress, range]);

  // Dynamic style function for focus states on web
  const getButtonStyle = ({ focused }: { focused: boolean }) => [
    animatedStyle,
    styles.button,
    isActive && styles.buttonActive,
    Platform.OS === 'web' && focused && styles.webFocus,
  ];

  return (
    <AnimatedPressable
      accessible
      accessibilityLabel={getTimeRangeAccessibilityLabel(range)}
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      style={getButtonStyle}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        style={[
          styles.buttonText,
          isActive ? styles.buttonTextActive : styles.buttonTextInactive,
        ]}
      >
        {getTimeRangeLabel(range)}
      </Text>
    </AnimatedPressable>
  );
});

/**
 * TimeRangeToggle - A segmented control for time range selection
 *
 * This component provides a pill-style toggle for switching between
 * 3-month, 6-month, and 1-year views of the habit heatmap.
 */
export const TimeRangeToggle = memo(function TimeRangeToggle({
  value,
  onChange,
}: TimeRangeToggleProps) {
  const reduceMotion = useReduceMotion();

  const handleRangePress = useCallback(
    (range: TimeRange) => {
      if (range !== value) {
        onChange(range);
      }
    },
    [value, onChange]
  );

  return (
    <View
      accessibilityLabel='Time range selector'
      accessibilityRole='tablist'
      style={styles.container}
    >
      {TIME_RANGES.map((range) => (
        <TimeRangeButton
          key={range}
          isActive={value === range}
          range={range}
          reduceMotion={reduceMotion}
          onPress={handleRangePress}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 6,
    justifyContent: 'center',
    minWidth: 32,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonActive: {
    backgroundColor: '#ffffff',

    elevation: 2,
    // Shadow for active state
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 11,
    fontWeight: '500',
  },
  buttonTextActive: {
    color: COLORS.TEXT_PRIMARY, // stone-900
  },
  buttonTextInactive: {
    color: COLORS.TEXT_SECONDARY, // stone-500
  },
  container: {
    backgroundColor: '#f5f5f4',
    // stone-100
    borderRadius: 8,
    flexDirection: 'row',
    padding: 2,
  },
  // Web-specific focus styles for keyboard navigation
  webFocus: {
    outlineColor: FOCUS.RING_COLOR,
    outlineOffset: FOCUS.RING_OFFSET,
    outlineStyle: 'solid',
    outlineWidth: FOCUS.RING_WIDTH,
  },
});

export default TimeRangeToggle;
