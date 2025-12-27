/**
 * HeroIcon - Breathing seedling icon for the minimal empty state
 *
 * Features:
 * - Gentle breathing scale animation (1.0 → 1.08 → 1.0)
 * - Emerald gradient container
 * - Respects reduce motion preference
 */

import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { BREATHING_ANIMATION } from './animations';
import { BORDER_RADIUS, COLORS } from './constants';
import type { HeroIconProps } from './types';

/**
 * Hero icon with breathing animation
 *
 * @param animate - Whether to animate the breathing effect (default: true)
 */
export function HeroIcon({ animate = true }: HeroIconProps) {
  const shouldReduceMotion = useReducedMotion();
  const scale = useSharedValue(BREATHING_ANIMATION.minScale);

  useEffect(() => {
    if (!animate || shouldReduceMotion) {
      scale.value = BREATHING_ANIMATION.minScale;
      return;
    }

    // Breathing animation: 1.0 → 1.08 → 1.0 (3s ease-in-out, infinite)
    scale.value = withRepeat(
      withTiming(BREATHING_ANIMATION.maxScale, {
        duration: BREATHING_ANIMATION.duration / 2,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite
      true // Reverse
    );

    return () => {
      cancelAnimation(scale);
    };
  }, [animate, scale, shouldReduceMotion]);

  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        breathingStyle,
        {
          width: 80,
          height: 80,
          borderRadius: BORDER_RADIUS.heroIcon,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.emerald100,
          // Emerald tinted shadow (subtle per mockup)
          shadowColor: COLORS.emerald500,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
          elevation: 4,
        },
      ]}
    >
      {/* Inner gradient effect using overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: BORDER_RADIUS.heroIcon,
          backgroundColor: COLORS.green50,
          opacity: 0.5,
        }}
      />
      <Text style={{ fontSize: 36 }}>🌱</Text>
    </Animated.View>
  );
}
