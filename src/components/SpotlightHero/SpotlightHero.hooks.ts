/**
 * SpotlightHero Hooks
 * Animation logic for the spotlight hero component
 */

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

export function useSpotlightAnimations(animationDelay: number) {
  const cardScale = useSharedValue(0.95);
  const cardOpacity = useSharedValue(0);
  const shimmerPosition = useSharedValue(-1);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    cardOpacity.value = withDelay(
      animationDelay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );
    cardScale.value = withDelay(
      animationDelay,
      withSpring(1, { damping: 15, stiffness: 100 })
    );

    shimmerPosition.value = withDelay(
      animationDelay + 600,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withDelay(4000, withTiming(-1, { duration: 0 }))
        ),
        -1,
        false
      )
    );
  }, [animationDelay]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value * pressScale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      shimmerPosition.value,
      [-1, -0.5, 0, 0.5, 1],
      [0, 0.3, 0.5, 0.3, 0]
    ),
    transform: [
      {
        translateX: interpolate(shimmerPosition.value, [-1, 1], [-300, 300]),
      },
    ],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return {
    containerStyle,
    handlePressIn,
    handlePressOut,
    shimmerStyle,
  };
}

export function getGradientColors(baseColor: string) {
  return [
    `${baseColor}35`, // 20% opacity
    `${baseColor}18`, // 10% opacity
    `${baseColor}08`, // 5% opacity
  ] as const;
}
