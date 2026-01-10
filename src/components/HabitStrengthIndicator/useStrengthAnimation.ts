/**
 * useStrengthAnimation Hook
 *
 * Handles progress bar and emoji animations for strength level changes.
 * Animation: Progress bar fills with spring physics, emoji changes with scale bounce
 */

import { useEffect, useRef } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { StrengthLevel, StrengthLevelConfig } from './types';
import { animateLevelUp, animatePulse } from './animations';

interface UseStrengthAnimationOptions {
  strength: number;
  level: StrengthLevel;
  config: StrengthLevelConfig;
  habitName?: string;
}

export function useStrengthAnimation({
  strength,
  level,
  config,
  habitName,
}: UseStrengthAnimationOptions) {
  const previousLevelRef = useRef<StrengthLevel>(level);

  const progressWidth = useSharedValue(0);
  const emojiScale = useSharedValue(1);
  const emojiOpacity = useSharedValue(1);
  const emojiRotation = useSharedValue(0);

  // Animate progress bar and emoji when strength/level changes
  // Note: Shared values from Reanimated are stable and intentionally omitted from deps
  useEffect(() => {
    progressWidth.value = withSpring(strength, { damping: 15, stiffness: 150 });

    const levelChanged = previousLevelRef.current !== level;
    previousLevelRef.current = level;

    if (levelChanged) {
      animateLevelUp(emojiOpacity, emojiScale, emojiRotation);
    } else {
      animatePulse(emojiScale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength, level]);

  // Accessibility announcement
  useEffect(() => {
    const message = habitName
      ? `${habitName}, ${Math.round(strength)}% strength, ${config.label} level`
      : `${Math.round(strength)}% strength, ${config.label} level`;

    AccessibilityInfo?.announceForAccessibility?.(message);
  }, [strength, level, habitName, config.label]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    opacity: emojiOpacity.value,
    transform: [
      { scale: emojiScale.value },
      { rotate: `${Math.round(emojiRotation.value)}deg` },
    ],
  }));

  return { emojiStyle, progressBarStyle };
}
