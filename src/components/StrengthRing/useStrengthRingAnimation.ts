/**
 * useStrengthRingAnimation - Animation logic for the strength ring
 */
import { useEffect, useRef } from 'react';

import {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';

interface UseStrengthRingAnimationOptions {
  strength: number;
  levelLabel: string;
  circumference: number;
}

export function useStrengthRingAnimation({
  strength,
  levelLabel,
  circumference,
}: UseStrengthRingAnimationOptions) {
  const previousLevelRef = useRef<string>(levelLabel);
  const animatedStrength = useSharedValue(strength);
  const emojiScale = useSharedValue(1);
  const emojiOpacity = useSharedValue(1);
  const emojiRotation = useSharedValue(0);

  useEffect(() => {
    animatedStrength.value = withSpring(strength, {
      ...springs.gentle,
      overshootClamping: false,
    });

    const levelChanged = previousLevelRef.current !== levelLabel;
    previousLevelRef.current = levelLabel;

    if (levelChanged) {
      // Phase 1: Fade out + shrink old emoji
      emojiOpacity.value = withTiming(0.3, {
        duration: durations.quick,
        easing: Easing.out(Easing.ease),
      });
      emojiScale.value = withTiming(0.6, {
        duration: durations.quick,
        easing: Easing.out(Easing.ease),
      });
      emojiRotation.value = withSequence(
        withTiming(-8, {
          duration: durations.tick,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(8, {
          duration: durations.tick,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: durations.tick,
          easing: Easing.out(Easing.ease),
        })
      );
      // Phase 2: Fade in + grow new emoji
      emojiOpacity.value = withDelay(
        durations.quick,
        withTiming(1, {
          duration: durations.standard,
          easing: Easing.out(Easing.ease),
        })
      );
      emojiScale.value = withDelay(
        durations.quick,
        withSequence(
          withSpring(1.4, springs.celebration),
          withSpring(1, springs.celebration)
        )
      );
    } else {
      // Regular strength update: subtle pulse
      emojiScale.value = withSequence(
        withTiming(1.08, {
          duration: durations.instant,
          easing: Easing.out(Easing.ease),
        }),
        withSpring(1, springs.standard)
      );
    }
  }, [
    strength,
    levelLabel,
    animatedStrength,
    emojiScale,
    emojiOpacity,
    emojiRotation,
  ]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedStrength.value / 100),
  }));

  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: emojiOpacity.value,
    transform: [
      { scale: emojiScale.value },
      { rotate: `${Math.round(emojiRotation.value)}deg` },
    ],
  }));

  return { animatedProps, emojiAnimatedStyle };
}
