import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface UseHabitDayToggleAnimationsParams {
  completed: boolean;
  isToday: boolean;
}

export const useHabitDayToggleAnimations = ({
  completed,
  isToday,
}: UseHabitDayToggleAnimationsParams) => {
  // Initialize animated values. We use refs to persist across renders.
  // The completion value controls icon opacity and scale.
  const completion = useRef(new Animated.Value(completed ? 1 : 0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const breathingPulse = useRef(new Animated.Value(1)).current;
  const prevCompletedRef = useRef<boolean | null>(null);

  // Combine scale values using Animated.multiply
  const combinedScale = useMemo(
    () => Animated.multiply(buttonScale, breathingPulse),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Sync animated value immediately before paint to prevent flicker.
  // This handles cases where the component renders with a completed state
  // but the animated value was initialized before the final props arrived.
  useLayoutEffect(() => {
    const targetValue = completed ? 1 : 0;
    // Only set on initial mount or if somehow out of sync
    if (prevCompletedRef.current === null) {
      completion.setValue(targetValue);
    }
  }, [completed, completion]);

  useEffect(() => {
    const prevCompleted = prevCompletedRef.current;
    prevCompletedRef.current = completed;

    // On initial mount (prevCompleted is null), value already set by useLayoutEffect
    if (prevCompleted === null) {
      return;
    }

    // After mount, only animate if value actually changed
    if (prevCompleted === completed) {
      return;
    }

    // Value changed - animate the transition
    const animation = completed
      ? Animated.parallel([
          Animated.spring(buttonScale, {
            friction: 6,
            tension: 300,
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(completion, {
            duration: 220,
            easing: Easing.out(Easing.cubic),
            toValue: 1,
            useNativeDriver: true,
          }),
        ])
      : Animated.timing(completion, {
          duration: 150,
          easing: Easing.in(Easing.ease),
          toValue: 0,
          useNativeDriver: true,
        });

    animation.start();

    return () => {
      animation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  useEffect(() => {
    if (!completed && isToday) {
      const breathingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(breathingPulse, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            toValue: 1.03,
            useNativeDriver: true,
          }),
          Animated.timing(breathingPulse, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
        ])
      );
      breathingAnimation.start();

      return () => {
        breathingAnimation.stop();
      };
    } else {
      breathingPulse.setValue(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, isToday]);

  return { buttonScale, combinedScale, completion };
};
