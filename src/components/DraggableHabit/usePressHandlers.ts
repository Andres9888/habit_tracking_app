import { triggerHaptic } from '@/utils/haptics';
import { Animated, Easing } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import type { Habit } from './types';

interface PressHandlersParams {
  cardScale: Animated.Value;
  archiveFlash: Animated.Value;
  habit: Habit;
  onArchive?: (habitId: Id<'habits'>) => void;
  onLongPress?: ((habit?: Habit) => void) | (() => void);
  triggerSelection: () => void;
}

export function usePressHandlers({
  cardScale,
  archiveFlash,
  habit,
  onArchive,
  onLongPress,
  triggerSelection,
}: PressHandlersParams) {
  const handleLongPress = () => {
    if (!onLongPress) return;
    triggerSelection();
    onLongPress(habit);
  };

  const handlePressIn = () => {
    Animated.spring(cardScale, {
      damping: 12,
      stiffness: 200,
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(cardScale, {
      damping: 10,
      stiffness: 180,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleSwipeableOpen = () => {
    triggerHaptic('success');

    Animated.sequence([
      Animated.timing(archiveFlash, {
        duration: 120,
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(archiveFlash, {
        duration: 220,
        easing: Easing.out(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();

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
