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
  // Warm amber "forge" flash that fades out on the false → true transition.
  const forgeFlash = useRef(new Animated.Value(0)).current;
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
    if (prevCompletedRef.current === null) {
      const initialValue = completed ? 1 : 0;
      completion.setValue(initialValue);
      // Force a native-side commit so the compositor reflects the value
      // even if the JS setValue didn't propagate (known native-driver desync).
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

    // On initial mount (prevCompleted is null), value already set by useLayoutEffect
    if (prevCompleted === null) {
      return;
    }

    // After mount, only animate if value actually changed
    if (prevCompleted === completed) {
      return;
    }

    const targetValue = completed ? 1 : 0;

    // Forge flash fires only on the false → true transition.
    if (completed) {
      forgeFlash.setValue(1);
      Animated.timing(forgeFlash, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }).start();
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

    let cancelled = false;

    animation.start(({ finished }) => {
      // If the animation was interrupted by something other than our
      // cleanup (e.g., a native driver issue), force the final value
      // so the icon doesn't get stuck invisible
      if (!finished && !cancelled) {
        completion.setValue(targetValue);
      }
    });

    // Safety net: if the native-driver animation silently fails or the
    // callback is lost, force the value after the animation should have
    // completed (300ms > max 220ms animation duration).
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

  return { buttonScale, combinedScale, completion, forgeFlash };
};
