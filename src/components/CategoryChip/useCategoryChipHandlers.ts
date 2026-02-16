/**
 * CategoryChip Press Handlers Hook
 */

import { withSpring, type SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { springs } from '@/theme/animations';
import {
  CARD_PRESS_SCALE,
  CARD_REST_SCALE,
} from '../../utils/animations/cardPressAnimation';

export function useCategoryChipHandlers(
  pressScale: SharedValue<number>,
  onPress: () => void
) {
  const handlePressIn = () => {
    pressScale.value = withSpring(CARD_PRESS_SCALE, springs.button);
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(CARD_REST_SCALE, springs.button);
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return { handlePress, handlePressIn, handlePressOut };
}
