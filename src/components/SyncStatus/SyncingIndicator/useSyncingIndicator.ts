/**
 * useSyncingIndicator Hook
 *
 * Handles animation logic for the SyncingIndicator component.
 * Provides smooth fade-in/fade-out transitions and continuous spin animation.
 */

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

const ANIMATION_DURATION = 200;
const SPIN_DURATION = 1000;

export interface UseSyncingIndicatorOptions {
  visible: boolean;
}

export interface UseSyncingIndicatorResult {
  animatedContainerStyle: ReturnType<typeof useAnimatedStyle>;
  animatedSpinnerStyle: ReturnType<typeof useAnimatedStyle>;
  shouldRender: boolean;
}

export function useSyncingIndicator({
  visible,
}: UseSyncingIndicatorOptions): UseSyncingIndicatorResult {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-8);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      // Start continuous rotation
      rotation.value = withRepeat(
        withTiming(360, {
          duration: SPIN_DURATION,
          easing: Easing.linear,
        }),
        -1, // Infinite repeats
        false // Don't reverse
      );
    } else {
      opacity.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.cubic),
      });
      translateY.value = withTiming(-8, {
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.cubic),
      });
      // Stop rotation
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [visible, opacity, translateY, rotation]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const animatedSpinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return {
    animatedContainerStyle,
    animatedSpinnerStyle,
    shouldRender: visible,
  };
}
