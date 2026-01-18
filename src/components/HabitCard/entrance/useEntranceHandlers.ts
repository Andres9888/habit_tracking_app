/**
 * useEntranceHandlers Hook
 * Provides handlers for entrance animation control
 */

import { useCallback, useMemo } from 'react';
import { runFadeUp, runAccentSlideDown, runWidthExpansion } from './animations';
import { createSetInstantVisible } from './setInstantVisible';
import { createResetAnimation } from './resetAnimation';
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
  const setInstantVisible = useMemo(
    () => createSetInstantVisible(values),
    [values]
  );

  const resetAnimation = useMemo(() => createResetAnimation(values), [values]);

  const triggerEntrance = useCallback(() => {
    if (reduceMotion || variant === 'none') {
      setInstantVisible();
      values.isAnimating.value = false;
      onAnimationComplete?.();
      return;
    }
    values.isAnimating.value = true;
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
    if (delay > 0) setTimeout(execute, delay);
    else execute();
  }, [
    reduceMotion,
    variant,
    delay,
    setInstantVisible,
    onAnimationComplete,
    values,
  ]);

  return { resetAnimation, setInstantVisible, triggerEntrance };
}
