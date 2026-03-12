import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { CARD_PRESS_SCALE } from '@/utils/animations/cardPressAnimation';
import { triggerHaptic } from '@/utils/haptics';

/**
 * Custom hook for button press animation
 * Scale down to 0.97 on press (matches design system CARD_PRESS_SCALE) + light haptic
 */
export function useButtonAnimation() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(CARD_PRESS_SCALE, springs.button);
    void triggerHaptic('tap');
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springs.button);
  };

  return { animatedStyle, handlePressIn, handlePressOut };
}
