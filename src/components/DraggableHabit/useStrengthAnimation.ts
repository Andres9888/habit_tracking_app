/**
 * useStrengthAnimation — Reanimated animations for the strength progress bar and emoji.
 *
 * Manages two animated styles:
 * - `progressAnimatedStyle` — width percentage of the progress bar fill
 * - `strengthEmojiAnimatedStyle` — scale/rotate/opacity of the tier emoji
 *
 * On first render, the bar animates from 0% with a delayed ease-in.
 * On increases, a spring is used; on decreases, a quick ease-out.
 * When the strength tier changes (e.g. 🌿→🌳), {@link runLevelUpAnimation}
 * fires a dramatic shake + scale burst on the emoji.
 */

import { useRef, useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing as ReanimatedEasing,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';

import { getStrengthLabel } from './strengthUtils';
import { runLevelUpAnimation, runSubtlePulse } from './animationHelpers';
import type {
  ProgressAnimatedStyle,
  StrengthEmojiAnimatedStyle,
} from './DraggableHabitCard.types';

export function useStrengthAnimation(
  strengthPercent: number,
  reduceMotionPreference: boolean
) {
  const strengthEmojiScale = useSharedValue(1);
  const strengthEmojiOpacity = useSharedValue(1);
  const strengthEmojiRotation = useSharedValue(0);
  const progressWidth = useSharedValue(strengthPercent);
  const previousStrengthLevelRef = useRef(getStrengthLabel(strengthPercent));
  const previousStrengthRef = useRef(strengthPercent);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    const previousStrength = previousStrengthRef.current;
    previousStrengthRef.current = strengthPercent;
    const currentLabel = getStrengthLabel(strengthPercent);
    const levelChanged = previousStrengthLevelRef.current !== currentLabel;
    previousStrengthLevelRef.current = currentLabel;

    // Animate the progress bar width
    const isIncreasing = strengthPercent > previousStrength;
    if (reduceMotionPreference || isFirstRenderRef.current) {
      // First render paints the final value instantly — animating from 0
      // reads as a second style pass on cold start. Later changes animate.
      isFirstRenderRef.current = false;
      progressWidth.value = strengthPercent;
    } else if (isIncreasing) {
      // Satisfying spring animation when strength increases
      progressWidth.value = withSpring(strengthPercent, {
        ...springs.gentle,
        mass: 0.8,
      });
    } else {
      // Decreasing - quick ease out
      progressWidth.value = withTiming(strengthPercent, {
        duration: 300,
        easing: ReanimatedEasing.out(ReanimatedEasing.quad),
      });
    }

    if (reduceMotionPreference) return;

    if (levelChanged) {
      runLevelUpAnimation(
        strengthEmojiOpacity,
        strengthEmojiScale,
        strengthEmojiRotation
      );
    } else if (isIncreasing) {
      runSubtlePulse(strengthEmojiScale);
    }
  }, [
    strengthPercent,
    reduceMotionPreference,
    progressWidth,
    strengthEmojiOpacity,
    strengthEmojiRotation,
    strengthEmojiScale,
  ]);

  const strengthEmojiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: strengthEmojiOpacity.value,
    transform: [
      { scale: strengthEmojiScale.value },
      { rotate: `${Math.round(strengthEmojiRotation.value)}deg` },
    ],
  })) as unknown as StrengthEmojiAnimatedStyle;

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  })) as ProgressAnimatedStyle;

  return { progressAnimatedStyle, strengthEmojiAnimatedStyle };
}
