import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface UseHabitDayToggleAnimationsParams {
  completed: boolean;
  isToday: boolean;
}

export const useHabitDayToggleAnimations = ({
  completed,
  isToday,
}: UseHabitDayToggleAnimationsParams) => {
  const completion = useRef(new Animated.Value(completed ? 1 : 0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const breathingPulse = useRef(new Animated.Value(1)).current;

  // Combine scale values using Animated.multiply
  const combinedScale = useMemo(
    () => Animated.multiply(buttonScale, breathingPulse),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    animation = completed
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
      animation?.stop();
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
