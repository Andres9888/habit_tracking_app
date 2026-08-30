import type { SharedValue } from 'react-native-reanimated';
import { withSpring, withTiming } from 'react-native-reanimated';
import { exitEasing } from '@/theme/animations';
import {
  EXIT_FADE_DURATION,
  EXIT_OFFSET_Y,
  EXIT_SCALE,
  SPRING_EXIT,
} from './constants';

export interface ToastMotionValues {
  iconOpacity: SharedValue<number>;
  iconScale: SharedValue<number>;
  opacity: SharedValue<number>;
  scale: SharedValue<number>;
  translateY: SharedValue<number>;
}

/**
 * Shared exit: fade out, and (unless Reduce Motion) drop + shrink slightly.
 * Used by both the visibility effect and user-initiated dismissals so the
 * toast always leaves the same way.
 */
export function runToastExit(
  v: ToastMotionValues,
  reduceMotion: boolean
): void {
  const fadeOut = { duration: EXIT_FADE_DURATION, easing: exitEasing };
  v.opacity.value = withTiming(0, fadeOut);
  v.iconOpacity.value = withTiming(0, fadeOut);
  if (reduceMotion) return;
  v.translateY.value = withSpring(EXIT_OFFSET_Y, SPRING_EXIT);
  v.scale.value = withTiming(EXIT_SCALE, fadeOut);
}
