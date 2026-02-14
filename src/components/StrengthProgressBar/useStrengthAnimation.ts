/**
 * useStrengthAnimation Hook
 * Handles progress bar and emoji animations
 */

import { useEffect, useRef } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useReduceMotion } from '../../hooks/useReduceMotion';

export function useStrengthAnimation(
  clampedStrength: number,
  currentLevelLabel: string
) {
  const reduceMotion = useReduceMotion();
  const previousLevelRef = useRef<string>(currentLevelLabel);
  const previousStrengthRef = useRef<number>(clampedStrength);
  const isFirstRenderRef = useRef(true);

  const progressWidth = useSharedValue(clampedStrength);
  const emojiScale = useSharedValue(1);
  const emojiOpacity = useSharedValue(1);
  const emojiRotation = useSharedValue(0);

  useEffect(() => {
    const previousStrength = previousStrengthRef.current;
    previousStrengthRef.current = clampedStrength;

    // Skip if no change
    if (previousStrength === clampedStrength && !isFirstRenderRef.current) {
      return;
    }

    const isEmptyingTransition =
      clampedStrength <= 5 && previousStrength > clampedStrength;
    const isIncreasing = clampedStrength > previousStrength;

    if (reduceMotion) {
      progressWidth.value = clampedStrength;
    } else if (isFirstRenderRef.current) {
      // Animate from 0 on first render for dramatic reveal
      isFirstRenderRef.current = false;
      progressWidth.value = 0;
      progressWidth.value = withDelay(
        200,
        withTiming(clampedStrength, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        })
      );
    } else if (isEmptyingTransition) {
      progressWidth.value = withTiming(clampedStrength, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    } else if (isIncreasing) {
      // Satisfying spring animation when strength increases
      progressWidth.value = withSpring(clampedStrength, {
        damping: 12,
        mass: 0.8,
        stiffness: 80,
      });
    } else {
      // Decreasing - quick ease out
      progressWidth.value = withTiming(clampedStrength, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
    }

    const levelChanged = previousLevelRef.current !== currentLevelLabel;
    previousLevelRef.current = currentLevelLabel;

    if (reduceMotion) return;

    if (levelChanged) {
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

      emojiOpacity.value = withDelay(
        150,
        withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
      );
      emojiScale.value = withDelay(
        150,
        withSequence(
          withSpring(1.4, { damping: 6, stiffness: 120 }),
          withSpring(1, { damping: 10, stiffness: 180 })
        )
      );
    } else {
      emojiScale.value = withSequence(
        withTiming(1.08, { duration: 100, easing: Easing.out(Easing.ease) }),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
    }
  }, [clampedStrength, currentLevelLabel, reduceMotion]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: emojiOpacity.value,
    transform: [
      { scale: emojiScale.value },
      { rotate: `${Math.round(emojiRotation.value)}deg` },
    ],
  }));

  return { emojiAnimatedStyle, progressAnimatedStyle };
}
