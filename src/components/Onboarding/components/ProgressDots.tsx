/**
 * Progress Dots Component
 * 3-dot progress indicator at bottom of onboarding screens
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface ProgressDotsProps {
  currentScreen: number;
  totalScreens?: number;
}

const NEUTRAL_COLOR = '#8A847D';
const ACTIVE_COLOR = '#2C2825';
const DOT_SIZE = 8;
const DOT_SPACING = 12;

function Dot({ isActive }: { isActive: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isActive ? ACTIVE_COLOR : NEUTRAL_COLOR, {
      duration: 180,
      easing: Easing.out(Easing.ease),
    }),
    opacity: isActive ? 1 : 0.4,
    transform: [
      {
        scale: withTiming(isActive ? 1 : 0.8, {
          duration: 180,
          easing: Easing.out(Easing.ease),
        }),
      },
    ],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function ProgressDots({
  currentScreen,
  totalScreens = 3,
}: ProgressDotsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dotsWrapper}>
        {Array.from({ length: totalScreens }, (_, i) => (
          <Dot key={i} isActive={i === currentScreen} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  dotsWrapper: {
    flexDirection: 'row',
    gap: DOT_SPACING,
    alignItems: 'center',
  },
});

export default ProgressDots;
