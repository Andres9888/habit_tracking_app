import { useCallback, useRef } from 'react';
import { Animated, Easing } from 'react-native';

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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkScaleAnim = useRef(
    new Animated.Value(isCompleted ? 1 : 0)
  ).current;

  const animateCheckbox = useCallback(
    (toCompleted: boolean) => {
      if (reduceMotion) {
        checkScaleAnim.setValue(toCompleted ? 1 : 0);
        return;
      }

      Animated.spring(checkScaleAnim, {
        friction: 8,
        tension: 200,
        toValue: toCompleted ? 1 : 0,
        useNativeDriver: true,
      }).start();
    },
    [checkScaleAnim, reduceMotion]
  );

  const animatePressEffect = useCallback(() => {
    if (reduceMotion) return;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        duration: 50,
        easing: Easing.out(Easing.quad),
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        friction: 8,
        tension: 200,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, reduceMotion]);

  return {
    animateCheckbox,
    animatePressEffect,
    checkScaleAnim,
    scaleAnim,
  };
}
