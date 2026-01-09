/**
 * useHabitCardEntrance Hook - Main orchestration
 * Manages habit card entrance animation state for smooth visual transitions
 */

import { useCallback, useEffect, useRef } from 'react';
import { useSharedValue, cancelAnimation } from 'react-native-reanimated';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { ACCENT_TARGET_WIDTH } from './constants';
import { runFadeUp, runAccentSlideDown, runWidthExpansion } from './animations';
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
  const reduceMotion = useReduceMotion();
  const hasTriggered = useRef(false);

  // Animation shared values
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);
  const accentScaleY = useSharedValue(0);
  const accentWidth = useSharedValue(0);
  const accentOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateX = useSharedValue(-10);
  const isAnimating = useSharedValue(false);

  const values = {
    accentOpacity,
    accentScaleY,
    accentWidth,
    cardOpacity,
    cardTranslateY,
    contentOpacity,
    contentTranslateX,
    isAnimating,
  };

  const setInstantVisible = useCallback(() => {
    cardOpacity.value = 1;
    cardTranslateY.value = 0;
    accentScaleY.value = 1;
    accentWidth.value = ACCENT_TARGET_WIDTH;
    accentOpacity.value = 1;
    contentOpacity.value = 1;
    contentTranslateX.value = 0;
  }, []);

  const triggerEntrance = useCallback(() => {
    if (reduceMotion || variant === 'none') {
      setInstantVisible();
      isAnimating.value = false;
      onAnimationComplete?.();
      return;
    }

    isAnimating.value = true;
    const execute = () => {
      switch (variant) {
        case 'fadeUp': {
          runFadeUp(values, onAnimationComplete);
          break;
        }
        case 'accentSlideDown': {
          runAccentSlideDown(values, onAnimationComplete);
          break;
        }
        case 'widthExpansion': {
          runWidthExpansion(values, onAnimationComplete);
          break;
        }
        default: {
          runAccentSlideDown(values, onAnimationComplete);
        }
      }
    };

    if (delay > 0) {
      setTimeout(execute, delay);
    } else {
      execute();
    }
  }, [reduceMotion, variant, delay, setInstantVisible, onAnimationComplete]);

  const resetAnimation = useCallback(() => {
    const animValues = [
      cardOpacity,
      cardTranslateY,
      accentScaleY,
      accentWidth,
      accentOpacity,
      contentOpacity,
      contentTranslateX,
    ];
    for (const val of animValues) cancelAnimation(val);
    cardOpacity.value = 0;
    cardTranslateY.value = 20;
    accentScaleY.value = 0;
    accentWidth.value = 0;
    accentOpacity.value = 0;
    contentOpacity.value = 0;
    contentTranslateX.value = -10;
    isAnimating.value = false;
    hasTriggered.current = false;
  }, []);

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
        cardOpacity,
        cardTranslateY,
        accentScaleY,
        accentWidth,
        accentOpacity,
        contentOpacity,
        contentTranslateX,
      ];
      for (const val of cleanup) cancelAnimation(val);
    };
  }, [autoTrigger, triggerEntrance, setInstantVisible]);

  return {
    accentStyle,
    cardStyle,
    contentStyle,
    isAnimating,
    resetAnimation,
    triggerEntrance,
  };
}

export default useHabitCardEntrance;
