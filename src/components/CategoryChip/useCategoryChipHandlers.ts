/**
 * CategoryChip Press Handlers Hook
 */

import { withSpring, type SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export function useCategoryChipHandlers(
  pressScale: SharedValue<number>,
  onPress: () => void
) {
  const handlePressIn = () => {
    pressScale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return { handlePress, handlePressIn, handlePressOut };
}
