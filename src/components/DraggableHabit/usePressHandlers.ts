/**
 * usePressHandlers — Touch interaction handlers for a habit card.
 *
 * Returns three callbacks:
 * - `handlePressIn` / `handlePressOut` — spring scale to 0.97/1.0 for press feedback
 * - `handleLongPress` — heavy haptic + forwards to parent drag handler
 */

import type { SharedValue } from 'react-native-reanimated';
import { withSpring } from 'react-native-reanimated';
import type { Habit } from './types';
import { CARD_PRESS_SCALE } from '@/utils/animations/cardPressAnimation';
import { springs } from '@/theme/animations';

interface PressHandlersParams {
  cardScale: SharedValue<number>;
  habit: Habit;
  onLongPress?: ((habit?: Habit) => void) | (() => void);
  triggerSelection: () => void;
  triggerHeavyImpact: () => void;
}

export function usePressHandlers({
  cardScale,
  habit,
  onLongPress,
  triggerSelection,
  triggerHeavyImpact,
}: PressHandlersParams) {
  const handleLongPress = () => {
    if (!onLongPress) return;
    triggerHeavyImpact();
    // Reset scale so the card isn't stuck at CARD_PRESS_SCALE during drag
    cardScale.value = withSpring(1, springs.bouncy);
    onLongPress(habit);
  };

  const handlePressIn = () => {
    cardScale.value = withSpring(CARD_PRESS_SCALE, springs.button);
  };

  const handlePressOut = () => {
    cardScale.value = withSpring(1, springs.bouncy);
  };

  return {
    handleLongPress,
    handlePressIn,
    handlePressOut,
  };
}
