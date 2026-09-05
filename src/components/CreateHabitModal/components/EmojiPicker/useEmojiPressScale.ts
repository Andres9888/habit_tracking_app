/**
 * Shared press animation for emoji chips/tiles.
 * scale 1.0 → 0.97 → 1.0 (scale-down-only; upscaling rasterized views blurs them).
 * Respects reduced motion.
 */
import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';

export function useEmojiPressScale(reduceMotion: boolean) {
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    'worklet';
    if (reduceMotion) return;
    scale.value = withTiming(0.97, { duration: 50 });
  }, [scale, reduceMotion]);

  const onPressOut = useCallback(() => {
    'worklet';
    if (reduceMotion) {
      scale.value = 1;
      return;
    }
    scale.value = withSpring(1, springs.standard);
  }, [scale, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, onPressIn, onPressOut };
}
