import { Animated, Easing } from 'react-native';

export function createCompletionAnimation(
  completed: boolean,
  buttonScale: Animated.Value,
  completion: Animated.Value
) {
  return completed
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
}

export function createBreathingAnimation(breathingPulse: Animated.Value) {
  return Animated.loop(
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
}
