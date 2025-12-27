/**
 * HeroIcon - Breathing seedling icon for the minimal empty state
 *
 * Features:
 * - Gentle breathing scale animation (1.0 → 1.08 → 1.0)
 * - Emerald gradient container
 * - Shadow glow pulse synced with breathing animation
 * - Respects reduce motion preference
 */

import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { BREATHING_ANIMATION, HERO_GLOW } from './animations';
import { BORDER_RADIUS, COLORS } from './constants';
import type { HeroIconProps } from './types';

/** Default icon container size */
const DEFAULT_SIZE = 80;
/** Default emoji font size */
const DEFAULT_EMOJI_SIZE = 36;

/**
 * Hero icon with breathing animation
 *
 * @param animate - Whether to animate the breathing effect (default: true)
 * @param size - Icon container size in pixels (default: 80)
 * @param emojiSize - Emoji font size in pixels (default: 36)
 */
export function HeroIcon({
  animate = true,
  size = DEFAULT_SIZE,
  emojiSize = DEFAULT_EMOJI_SIZE,
}: HeroIconProps) {
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

  const breathingStyle = useAnimatedStyle(() => {
    // Interpolate shadow values based on scale
    // Scale goes 1.0 → 1.08, map to shadow opacity/radius ranges
    const shadowOpacity = interpolate(
      scale.value,
      [BREATHING_ANIMATION.minScale, BREATHING_ANIMATION.maxScale],
      [HERO_GLOW.minShadowOpacity, HERO_GLOW.maxShadowOpacity]
    );

    const shadowRadius = interpolate(
      scale.value,
      [BREATHING_ANIMATION.minScale, BREATHING_ANIMATION.maxScale],
      [HERO_GLOW.minShadowRadius, HERO_GLOW.maxShadowRadius]
    );

    return {
      shadowOpacity,
      shadowRadius,
      transform: [{ scale: scale.value }],
    };
  });

  // Calculate dynamic border radius based on size ratio
  const dynamicBorderRadius = (size / DEFAULT_SIZE) * BORDER_RADIUS.heroIcon;

  return (
    <Animated.View
      style={[
        breathingStyle,
        {
          alignItems: 'center',
          backgroundColor: COLORS.emerald100,
          borderRadius: dynamicBorderRadius,
          elevation: 4,
          height: size,
          justifyContent: 'center',

          // Emerald tinted shadow (opacity/radius animated via breathingStyle)
          shadowColor: COLORS.emerald500,

          shadowOffset: { height: 8, width: 0 },
          width: size,
        },
      ]}
    >
      {/* Inner gradient effect using overlay */}
      <View
        style={{
          backgroundColor: COLORS.green50,
          borderRadius: dynamicBorderRadius,
          bottom: 0,
          left: 0,
          opacity: 0.5,
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      />
      <Text style={{ fontSize: emojiSize }}>🌱</Text>
    </Animated.View>
  );
}
