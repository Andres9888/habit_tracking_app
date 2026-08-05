import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { RING_ANIMATION_DURATION } from './constants';
import { springs } from '@/theme/animations';

export function useProgressAnimations(
  clampedStrength: number,
  reduceMotion: boolean
) {
  const animatedStrength = useSharedValue(0);
  const emojiScale = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      animatedStrength.value = clampedStrength;
      emojiScale.value = 1;
      return;
    }

    // Ring fill animation - 1200ms with ease-out
    animatedStrength.value = withTiming(clampedStrength, {
      duration: RING_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    // Emoji scale animation
    emojiScale.value = withDelay(
      300,
      withSpring(1, springs.bouncy)
    );
  }, [clampedStrength, reduceMotion]);

  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  return {
    animatedStrength,
    emojiAnimatedStyle,
  };
}
