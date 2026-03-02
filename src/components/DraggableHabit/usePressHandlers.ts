/**
 * usePressHandlers — Touch interaction handlers for a habit card.
 *
 * Returns four callbacks:
 * - `handlePressIn` / `handlePressOut` — spring scale to 0.97/1.0 for press feedback
 * - `handleLongPress` — heavy haptic + forwards to parent drag handler
 * - `handleSwipeableOpen` — success haptic + archive flash + calls onArchive
 */

import type { SharedValue } from 'react-native-reanimated';
import { withSequence, withSpring, withTiming } from 'react-native-reanimated';
import type { Id } from '../../../convex/_generated/dataModel';
import type { Habit } from './types';
import { triggerHaptic } from '@/utils/haptics';
import { CARD_PRESS_SCALE } from '@/utils/animations/cardPressAnimation';
import { springs } from '@/theme/animations';

interface PressHandlersParams {
  cardScale: SharedValue<number>;
  archiveFlash: SharedValue<number>;
  habit: Habit;
  onArchive?: (habitId: Id<'habits'>) => void;
  onLongPress?: ((habit?: Habit) => void) | (() => void);
  triggerSelection: () => void;
  triggerHeavyImpact: () => void;
}

export function usePressHandlers({
  cardScale,
  archiveFlash,
  habit,
  onArchive,
  onLongPress,
  triggerSelection,
  triggerHeavyImpact,
}: PressHandlersParams) {
  const handleLongPress = () => {
    if (!onLongPress) return;
    triggerHeavyImpact();
    onLongPress(habit);
  };

  const handlePressIn = () => {
    cardScale.value = withSpring(CARD_PRESS_SCALE, springs.button);
  };

  const handlePressOut = () => {
    cardScale.value = withSpring(1, springs.bouncy);
  };

  const handleSwipeableOpen = () => {
    triggerHaptic('success');

    archiveFlash.value = withSequence(
      withTiming(1, { duration: 120 }),
      withTiming(0, { duration: 220 })
    );

    if (onArchive) {
      onArchive(habit._id);
    }
  };

  return {
    handleLongPress,
    handlePressIn,
    handlePressOut,
    handleSwipeableOpen,
  };
}
