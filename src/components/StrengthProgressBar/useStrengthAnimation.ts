/**
 * useStrengthAnimation Hook
 * Handles progress bar and emoji animations
 */

import { useEffect, useRef } from 'react';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { animateProgressWidth, animateEmoji } from './strengthAnimationHelpers';

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
    if (previousStrength === clampedStrength && !isFirstRenderRef.current)
      return;

    const isFirst = isFirstRenderRef.current;
    if (isFirst) isFirstRenderRef.current = false;

    animateProgressWidth(
      progressWidth,
      clampedStrength,
      previousStrength,
      isFirst,
      reduceMotion
    );

    const levelChanged = previousLevelRef.current !== currentLevelLabel;
    previousLevelRef.current = currentLevelLabel;
    if (reduceMotion) return;
    animateEmoji(emojiScale, emojiOpacity, emojiRotation, levelChanged);
  }, [clampedStrength, currentLevelLabel, reduceMotion]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));
  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: emojiOpacity.value,
    transform: [
      { scale: emojiScale.value },
      { rotate: `${emojiRotation.value}deg` },
    ],
  }));

  return { emojiAnimatedStyle, progressAnimatedStyle };
}
