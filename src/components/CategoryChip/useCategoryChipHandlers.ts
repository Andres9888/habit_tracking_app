/**
 * CategoryChip Press Handlers Hook
 */

import { withSpring, type SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { springs } from '@/theme/animations';

export function useCategoryChipHandlers(
  pressScale: SharedValue<number>,
  onPress: () => void
) {
  const handlePressIn = () => {
    pressScale.value = withSpring(0.95, springs.button);
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, springs.button);
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return { handlePress, handlePressIn, handlePressOut };
}
