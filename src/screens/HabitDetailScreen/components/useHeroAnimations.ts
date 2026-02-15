/**
 * useHeroAnimations Hook
 * Icon bounce and streak badge entrance animations for HeroSection
 */

import { useEffect, useRef } from 'react';

import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

export function useHeroAnimations(
  showStreakBadge: boolean,
  reduceMotion: boolean
) {
  const iconScale = useSharedValue(1);
  const iconTranslateY = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  const badgeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (badgeTimeoutRef.current) {
      clearTimeout(badgeTimeoutRef.current);
      badgeTimeoutRef.current = null;
    }

    if (reduceMotion) {
      iconScale.value = 1;
      iconTranslateY.value = 0;
      badgeScale.value = showStreakBadge ? 1 : 0;
      badgeOpacity.value = showStreakBadge ? 1 : 0;
      return;
    }

    iconScale.value = 0.8;
    iconTranslateY.value = -10;
    badgeScale.value = 0;
    badgeOpacity.value = 0;

    iconScale.value = withSpring(1, { damping: 8, mass: 1, stiffness: 150 });
    iconTranslateY.value = withSpring(0, {
      damping: 8,
      mass: 1,
      stiffness: 150,
    });

    if (showStreakBadge) {
      badgeTimeoutRef.current = setTimeout(() => {
        badgeOpacity.value = withTiming(1, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
        badgeScale.value = withSpring(1, {
          damping: 10,
          mass: 1,
          stiffness: 200,
        });
      }, 400);
    }

    return () => {
      if (badgeTimeoutRef.current) {
        clearTimeout(badgeTimeoutRef.current);
        badgeTimeoutRef.current = null;
      }
      cancelAnimation(iconScale);
      cancelAnimation(iconTranslateY);
      cancelAnimation(badgeScale);
      cancelAnimation(badgeOpacity);
    };
  }, [
    showStreakBadge,
    reduceMotion,
    iconScale,
    iconTranslateY,
    badgeScale,
    badgeOpacity,
  ]);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { scale: iconScale.value ?? 1 },
        { translateY: iconTranslateY.value ?? 0 },
      ],
    };
  });

  const badgeAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: badgeOpacity.value ?? 0,
      transform: [{ scale: badgeScale.value ?? 0 }],
    };
  });

  return { badgeAnimatedStyle, iconAnimatedStyle };
}
