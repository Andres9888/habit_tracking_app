import { useState, useCallback } from 'react';
import {
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { useCardAnimatedStyles } from './useCardAnimatedStyles';
import { EXIT_ANIMATION_DURATION } from '../utils';
import type { Id } from '../../../../convex/_generated/dataModel';

interface UseAnimatedHabitCardParams {
  habitId: Id<'habits'>;
  habitName: string;
  index: number;
  reducedMotion: boolean;
  onRestore: (id: Id<'habits'>, name: string) => Promise<boolean>;
}

export const useAnimatedHabitCard = ({
  habitId,
  habitName,
  index,
  reducedMotion,
  onRestore,
}: UseAnimatedHabitCardParams) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { animatedStyle, successIconStyle, animationValues } =
    useCardAnimatedStyles({
      index,
      reducedMotion,
    });

  const { cardOpacity, cardTranslateX, cardScale, successScale } =
    animationValues;

  const handleRestorePress = useCallback(async () => {
    if (isRestoring) return;

    setIsRestoring(true);
    const success = await onRestore(habitId, habitName);

    if (success) {
      setShowSuccess(true);

      successScale.value = withSequence(
        withSpring(1.2, springs.celebration),
        withSpring(1, springs.standard)
      );

      setTimeout(() => {
        if (reducedMotion) {
          cardOpacity.value = 0;
        } else {
          const exitTiming = {
            duration: EXIT_ANIMATION_DURATION,
            easing: Easing.out(Easing.cubic),
          };
          cardTranslateX.value = withTiming(100, exitTiming);
          cardOpacity.value = withTiming(0, exitTiming);
          cardScale.value = withTiming(0.95, exitTiming);
        }
      }, 400);
    } else {
      setIsRestoring(false);
    }
  }, [
    habitId,
    habitName,
    isRestoring,
    onRestore,
    reducedMotion,
    cardOpacity,
    cardTranslateX,
    cardScale,
    successScale,
  ]);

  return {
    animatedStyle,
    handleRestorePress,
    isRestoring,
    showSuccess,
    successIconStyle,
  };
};
