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
      withSpring(1, { damping: 8, stiffness: 150 })
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
