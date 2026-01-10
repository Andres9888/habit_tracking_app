import { Animated, Easing } from 'react-native';

export function createCelebrationAnimations(
  celebrationScale: Animated.Value,
  starRotation: Animated.Value
) {
  const celebrationAnim = Animated.loop(
    Animated.sequence([
      Animated.timing(celebrationScale, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        toValue: 1.02,
        useNativeDriver: true,
      }),
      Animated.timing(celebrationScale, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }),
    ])
  );

  const rotationAnim = Animated.loop(
    Animated.timing(starRotation, {
      duration: 3000,
      easing: Easing.linear,
      toValue: 1,
      useNativeDriver: true,
    })
  );

  return { celebrationAnim, rotationAnim };
}
