/**
 * useEntranceHandlers Hook
 * Provides handlers for entrance animation control
 */

import { useCallback } from 'react';
import { cancelAnimation } from 'react-native-reanimated';
import { ACCENT_TARGET_WIDTH } from './constants';
import { runFadeUp, runAccentSlideDown, runWidthExpansion } from './animations';
import type {
  UseEntranceHandlersOptions,
  UseEntranceHandlersReturn,
} from './types';

export function useEntranceHandlers({
  values,
  variant,
  delay,
  reduceMotion,
  onAnimationComplete,
}: UseEntranceHandlersOptions): UseEntranceHandlersReturn {
  const {
    accentOpacity,
    accentScaleY,
    accentWidth,
    cardOpacity,
    cardTranslateY,
    contentOpacity,
    contentTranslateX,
    isAnimating,
  } = values;

  const setInstantVisible = useCallback(() => {
    cardOpacity.value = 1;
    cardTranslateY.value = 0;
    accentScaleY.value = 1;
    accentWidth.value = ACCENT_TARGET_WIDTH;
    accentOpacity.value = 1;
    contentOpacity.value = 1;
    contentTranslateX.value = 0;
  }, [
    accentOpacity,
    accentScaleY,
    accentWidth,
    cardOpacity,
    cardTranslateY,
    contentOpacity,
    contentTranslateX,
  ]);

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
  }, [
    reduceMotion,
    variant,
    delay,
    setInstantVisible,
    onAnimationComplete,
    values,
    isAnimating,
  ]);

  const resetAnimation = useCallback(() => {
    const allValues = [
      cardOpacity,
      cardTranslateY,
      accentScaleY,
      accentWidth,
      accentOpacity,
      contentOpacity,
      contentTranslateX,
    ];
    for (const val of allValues) cancelAnimation(val);
    cardOpacity.value = 0;
    cardTranslateY.value = 20;
    accentScaleY.value = 0;
    accentWidth.value = 0;
    accentOpacity.value = 0;
    contentOpacity.value = 0;
    contentTranslateX.value = -10;
    isAnimating.value = false;
  }, [
    accentOpacity,
    accentScaleY,
    accentWidth,
    cardOpacity,
    cardTranslateY,
    contentOpacity,
    contentTranslateX,
    isAnimating,
  ]);

  return { resetAnimation, setInstantVisible, triggerEntrance };
}
