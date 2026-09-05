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
import { springs } from '@/theme/animations';

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
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
      emojiScale.value = withTiming(0.6, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      });
      emojiRotation.value = withSequence(
        withTiming(-8, { duration: 80, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 80, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 60, easing: Easing.out(Easing.ease) })
      );
      // Phase 2: Fade in + grow new emoji
      emojiOpacity.value = withDelay(
        150,
        withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
      );
      emojiScale.value = withDelay(
        150,
        withSequence(
          withSpring(1.4, springs.celebration),
          withSpring(1, springs.celebration)
        )
      );
    } else {
      // Regular strength update: subtle pulse
      emojiScale.value = withSequence(
        withTiming(1.08, { duration: 100, easing: Easing.out(Easing.ease) }),
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
