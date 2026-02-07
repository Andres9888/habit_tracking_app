/**
 * Toast Button Animation Hook
 * Provides scale animation for press feedback on toast action buttons
 */

import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';

interface UseToastButtonAnimationOptions {
  /** Scale factor when pressed (default: 0.92) */
  pressedScale?: number;
}

export function useToastButtonAnimation({
  pressedScale = 0.92,
}: UseToastButtonAnimationOptions = {}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(pressedScale, springs.button);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springs.button);
  };

  return { animatedStyle, handlePressIn, handlePressOut };
}
