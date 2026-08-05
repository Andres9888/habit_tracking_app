/**
 * useDetailPressAnimation — Detail page press-scale convention.
 * 80ms timing press-in, springs.button release. Used across habit detail tappables.
 */
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';

export const DETAIL_PRESS_SCALE = 0.98;
const PRESS_IN_MS = 80;

export function useDetailPressAnimation() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pressHandlers = {
    onPressIn: () => {
      scale.value = withTiming(DETAIL_PRESS_SCALE, { duration: PRESS_IN_MS });
    },
    onPressOut: () => {
      scale.value = withSpring(1, springs.button);
    },
  };

  return { animatedStyle, pressHandlers, scale };
}
