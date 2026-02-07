import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';

/**
 * Custom hook for button press animation
 * Scale down to 0.96 on press (matches AnimatedPressable)
 */
export function useButtonAnimation() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, springs.button);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springs.button);
  };

  return { animatedStyle, handlePressIn, handlePressOut };
}
