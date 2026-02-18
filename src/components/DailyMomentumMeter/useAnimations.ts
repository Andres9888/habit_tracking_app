import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { SPRING_CONFIGS } from '@/utils/animations/helpers';

interface AnimationValues {
  progressAnim: number;
  celebrationScale: number;
  glowOpacity: number;
  flameScale: number;
  progressAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  celebrationAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  glowAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  flameAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
}

export function useAnimations(
  percentage: number,
  reduceMotion: boolean
): AnimationValues {
  const progressAnim = useSharedValue(0);
  const celebrationScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const flameScale = useSharedValue(1);

  // Animate progress on change
  useEffect(() => {
    if (reduceMotion) {
      progressAnim.value = percentage;
      return;
    }

    progressAnim.value = withSpring(percentage, SPRING_CONFIGS.smooth);
  }, [percentage, reduceMotion, progressAnim]);

  // Celebration animation at 100%
  useEffect(() => {
    if (percentage === 100 && !reduceMotion) {
      // Pulse celebration
      celebrationScale.value = withRepeat(
        withSequence(
          withTiming(1.03, {
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      );

      // Glow animation
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.5, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      );

      // Flame bounce
      flameScale.value = withRepeat(
        withSequence(
          withTiming(1.15, {
            duration: 600,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: 600,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      );
    } else {
      celebrationScale.value = 1;
      glowOpacity.value = 0;
      flameScale.value = 1;
    }
  }, [percentage, reduceMotion, celebrationScale, glowOpacity, flameScale]);

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
    celebrationAnimatedStyle,
    celebrationScale: celebrationScale.value,
    flameAnimatedStyle,
    flameScale: flameScale.value,
    glowAnimatedStyle,
    glowOpacity: glowOpacity.value,
    progressAnim: progressAnim.value,
    progressAnimatedStyle,
  };
}
