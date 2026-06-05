import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import {
  createBreathingAnimation,
  createCompletionAnimation,
} from './habitDayToggleAnimationHelpers';

type UseHabitDayToggleAnimationsParams = {
  completed: boolean;
  isToday: boolean;
};

export function useHabitDayToggleAnimations({
  completed,
  isToday,
}: UseHabitDayToggleAnimationsParams) {
  const completion = useRef(new Animated.Value(completed ? 1 : 0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const breathingPulse = useRef(new Animated.Value(1)).current;
  const prevCompletedRef = useRef<boolean | null>(null);

  const combinedScale = useMemo(
    () => Animated.multiply(buttonScale, breathingPulse),
    [buttonScale, breathingPulse]
  );

  useLayoutEffect(() => {
    if (prevCompletedRef.current === null) {
      const initialValue = completed ? 1 : 0;
      completion.setValue(initialValue);
      Animated.timing(completion, {
        duration: 0,
        toValue: initialValue,
        useNativeDriver: true,
      }).start();
    }
  }, [completed, completion]);

  useEffect(() => {
    const prevCompleted = prevCompletedRef.current;
    prevCompletedRef.current = completed;

    if (prevCompleted === null) {
      return;
    }

    if (prevCompleted === completed) {
      return;
    }

    const targetValue = completed ? 1 : 0;

    let cancelled = false;
    const animation = createCompletionAnimation(
      completed,
      buttonScale,
      completion
    );

    animation.start(({ finished }) => {
      if (!finished && !cancelled) {
        completion.setValue(targetValue);
      }
    });

    const safetyTimer = setTimeout(() => {
      if (!cancelled) {
        completion.setValue(targetValue);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
      animation.stop();
    };
  }, [buttonScale, completed, completion]);

  useEffect(() => {
    if (!completed && isToday) {
      const breathingAnimation = createBreathingAnimation(breathingPulse);
      breathingAnimation.start();

      return () => {
        breathingAnimation.stop();
      };
    } else {
      breathingPulse.setValue(1);
    }
  }, [breathingPulse, completed, isToday]);

  return { buttonScale, combinedScale, completion };
}
