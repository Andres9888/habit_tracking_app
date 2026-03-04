import {
  useAnimatedStyle,
  interpolate,
  type Animated,
} from 'react-native-reanimated';

export function useAnimationStyles(
  progressAnim: Animated.SharedValue<number>,
  celebrationScale: Animated.SharedValue<number>,
  glowOpacity: Animated.SharedValue<number>,
  flameScale: Animated.SharedValue<number>
) {
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progressAnim.value, [0, 100], [0, 100])}%`,
  }));

  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const flameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  return {
    progressAnimatedStyle,
    celebrationAnimatedStyle,
    glowAnimatedStyle,
    flameAnimatedStyle,
  };
}
