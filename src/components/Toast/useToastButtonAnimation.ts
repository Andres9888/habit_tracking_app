/**
 * Toast Button Animation Hook
 * Provides scale animation for press feedback on toast action buttons
 */

import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const SPRING_CONFIG = { damping: 15, stiffness: 200 };

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
    scale.value = withSpring(pressedScale, SPRING_CONFIG);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
  };

  return { animatedStyle, handlePressIn, handlePressOut };
}
