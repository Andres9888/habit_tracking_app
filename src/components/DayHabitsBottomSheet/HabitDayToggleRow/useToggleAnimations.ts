import { useCallback } from 'react';
import { Easing, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { springs } from '@/theme/animations';

interface UseToggleAnimationsOptions {
  isCompleted: boolean;
  reduceMotion: boolean;
}

/**
 * Custom hook for HabitDayToggleRow animations
 * Manages scale and checkbox animations
 */
export function useToggleAnimations({
  isCompleted,
  reduceMotion,
}: UseToggleAnimationsOptions) {
  const scaleAnim = useSharedValue(1);
  const checkScaleAnim = useSharedValue(isCompleted ? 1 : 0);

  const animateCheckbox = useCallback(
    (toCompleted: boolean) => {
      const target = toCompleted ? 1 : 0;
      checkScaleAnim.value = reduceMotion
        ? target
        : withSpring(target, springs.pop);
    },
    [checkScaleAnim, reduceMotion]
  );

  const animatePressEffect = useCallback(() => {
    if (reduceMotion) return;

    scaleAnim.value = withSequence(
      withTiming(0.95, { duration: 50, easing: Easing.out(Easing.quad) }),
      withSpring(1, springs.pop)
    );
  }, [scaleAnim, reduceMotion]);

  return {
    animateCheckbox,
    animatePressEffect,
    checkScaleAnim,
    scaleAnim,
  };
}
