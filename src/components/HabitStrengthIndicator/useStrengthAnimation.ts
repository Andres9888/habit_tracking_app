/**
 * useStrengthAnimation Hook
 *
 * Handles progress bar and emoji animations for strength level changes.
 * Animation: Progress bar fills with spring physics, emoji changes with scale bounce
 */

import { useEffect, useRef } from 'react';
import { AccessibilityInfo } from 'react-native';
import type { StrengthLevel, StrengthLevelConfig } from './types';

function clampStrength(value: number): number {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

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
  const previousStrengthRef = useRef<number>(strength);

  const levelChanged = previousLevelRef.current !== level;
  const strengthChanged = previousStrengthRef.current !== strength;
  const normalizedStrength = clampStrength(strength);

  useEffect(() => {
    previousLevelRef.current = level;
    previousStrengthRef.current = strength;
  }, [level, strength]);

  useEffect(() => {
    const message = habitName
      ? `${habitName}, ${Math.round(strength)}% strength, ${config.label} level`
      : `${Math.round(strength)}% strength, ${config.label} level`;

    AccessibilityInfo?.announceForAccessibility?.(message);
  }, [strength, level, habitName, config.label]);

  const progressBarStyle = {
    width: `${normalizedStrength}%`,
  };

  const emojiScale = levelChanged ? 1.12 : strengthChanged ? 1.05 : 1;
  const emojiStyle = {
    opacity: 1,
    transform: [{ scale: emojiScale }],
  };

  return { emojiStyle, progressBarStyle };
}
