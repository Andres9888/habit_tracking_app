import { Animated, Easing } from 'react-native';
import { durations } from '@/theme/animations';

export function createCelebrationAnimations(
  celebrationScale: Animated.Value,
  starRotation: Animated.Value
) {
  const celebrationAnim = Animated.loop(
    Animated.sequence([
      Animated.timing(celebrationScale, {
        duration: durations.breathing,
        easing: Easing.inOut(Easing.ease),
        toValue: 1.02,
        useNativeDriver: true,
      }),
      Animated.timing(celebrationScale, {
        duration: durations.breathing,
        easing: Easing.inOut(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }),
    ])
  );

  const rotationAnim = Animated.loop(
    Animated.timing(starRotation, {
      duration: durations.celebration,
      easing: Easing.linear,
      toValue: 1,
      useNativeDriver: true,
    })
  );

  return { celebrationAnim, rotationAnim };
}
