/**
 * CategoryChip Press Handlers Hook
 */

import * as Haptics from 'expo-haptics';
import { withSpring, type SharedValue } from 'react-native-reanimated';

import {
  CARD_PRESS_SCALE,
  CARD_REST_SCALE,
} from '../../utils/animations/cardPressAnimation';
import { springs } from '@/theme/animations';

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
