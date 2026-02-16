/**
 * HeroIcon - Breathing seedling icon for the minimal empty state
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

import { useThemeColors } from '@/theme/ThemeContext';
import { BREATHING_ANIMATION, HERO_GLOW } from './animations';
import { BORDER_RADIUS } from './constants';
import type { HeroIconProps } from './types';

const DEFAULT_SIZE = 80;
const DEFAULT_EMOJI_SIZE = 36;

export function HeroIcon({
  animate = true,
  size = DEFAULT_SIZE,
  emojiSize = DEFAULT_EMOJI_SIZE,
}: HeroIconProps) {
  const shouldReduceMotion = useReducedMotion();
  const scale = useSharedValue<number>(BREATHING_ANIMATION.minScale);
  const { colors, isDark } = useThemeColors();

  useEffect(() => {
    if (!animate || shouldReduceMotion) {
      scale.value = BREATHING_ANIMATION.minScale;
      return;
    }

    scale.value = withRepeat(
      withTiming(BREATHING_ANIMATION.maxScale, {
        duration: BREATHING_ANIMATION.duration / 2,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    return () => {
      cancelAnimation(scale);
    };
  }, [animate, scale, shouldReduceMotion]);

  const breathingStyle = useAnimatedStyle(() => {
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

  const dynamicBorderRadius = (size / DEFAULT_SIZE) * BORDER_RADIUS.heroIcon;

  // Theme-aware colors
  const iconBg = isDark ? colors.primary[100] : '#D1FAE5';
  const overlayBg = isDark ? colors.card : '#F0FDF4';
  const shadowColor = colors.primary[500];

  return (
    <Animated.View
      style={[
        breathingStyle,
        {
          alignItems: 'center',
          backgroundColor: iconBg,
          borderRadius: dynamicBorderRadius,
          elevation: 4,
          height: size,
          justifyContent: 'center',
          shadowColor,
          shadowOffset: { height: 8, width: 0 },
          width: size,
        },
      ]}
    >
      <View
        style={{
          backgroundColor: overlayBg,
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
