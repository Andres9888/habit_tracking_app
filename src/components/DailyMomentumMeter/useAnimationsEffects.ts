import { useEffect } from 'react';
import {
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  type Animated,
} from 'react-native-reanimated';
import { durations } from '@/theme/animations';
import { SPRING_CONFIGS } from '@/utils/animations/helpers';

export function useAnimationEffects(
  percentage: number,
  reduceMotion: boolean,
  progressAnim: Animated.SharedValue<number>,
  celebrationScale: Animated.SharedValue<number>,
  glowOpacity: Animated.SharedValue<number>,
  flameScale: Animated.SharedValue<number>
) {
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
            duration: durations.loop,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: durations.loop,
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
            duration: durations.breathing,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.5, {
            duration: durations.breathing,
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
            duration: durations.complex,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: durations.complex,
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
}
