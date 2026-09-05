/**
 * useHabitCardEntrance Hook - Main orchestration
 * Manages habit card entrance animation state for smooth visual transitions
 */

import { useEffect, useRef } from 'react';
import { cancelAnimation, useReducedMotion } from 'react-native-reanimated';
import { useEntranceAnimationValues } from './useEntranceAnimationValues';
import { useEntranceHandlers } from './useEntranceHandlers';
import { useEntranceStyles } from './useEntranceStyles';
import type {
  UseHabitCardEntranceOptions,
  UseHabitCardEntranceReturn,
} from './types';

export function useHabitCardEntrance({
  variant = 'accentSlideDown',
  delay = 0,
  onAnimationComplete,
  autoTrigger = true,
}: UseHabitCardEntranceOptions = {}): UseHabitCardEntranceReturn {
  const reduceMotion = useReducedMotion();
  const hasTriggered = useRef(false);

  // No entrance will play (or it would be instant anyway) — mount visible
  // so the card never spends frames at opacity 0 waiting for an effect.
  const values = useEntranceAnimationValues(!autoTrigger || reduceMotion);

  const { resetAnimation, setInstantVisible, triggerEntrance } =
    useEntranceHandlers({
      delay,
      onAnimationComplete,
      reduceMotion,
      values,
      variant,
    });

  const { cardStyle, accentStyle, contentStyle } = useEntranceStyles(values);

  useEffect(() => {
    if (autoTrigger && !hasTriggered.current) {
      hasTriggered.current = true;
      triggerEntrance();
    } else if (!autoTrigger && !hasTriggered.current) {
      setInstantVisible();
    }

    return () => {
      const cleanup = [
        values.cardOpacity,
        values.cardTranslateY,
        values.accentScaleY,
        values.accentWidth,
        values.accentOpacity,
        values.contentOpacity,
        values.contentTranslateX,
      ];
      for (const val of cleanup) cancelAnimation(val);
    };
  }, [autoTrigger, triggerEntrance, setInstantVisible, values]);

  return {
    accentStyle,
    cardStyle,
    contentStyle,
    isAnimating: values.isAnimating,
    resetAnimation,
    triggerEntrance,
  };
}

export default useHabitCardEntrance;
