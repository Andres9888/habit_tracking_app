/**
 * useEntranceHandlers Hook
 * Provides handlers for entrance animation control
 */

import { useCallback, useMemo, useRef } from 'react';
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
  // Use ref for callback to prevent it from triggering useCallback re-runs
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  onAnimationCompleteRef.current = onAnimationComplete;

  const setInstantVisible = useMemo(
    () => createSetInstantVisible(values),
    [values]
  );

  const resetAnimation = useMemo(() => createResetAnimation(values), [values]);

  const triggerEntrance = useCallback(() => {
    if (reduceMotion || variant === 'none') {
      setInstantVisible();
      values.isAnimating.value = false;
      onAnimationCompleteRef.current?.();
      return;
    }
    values.isAnimating.value = true;
    const execute = () => {
      switch (variant) {
        case 'fadeUp': {
          runFadeUp(values, onAnimationCompleteRef.current);
          break;
        }
        case 'accentSlideDown': {
          runAccentSlideDown(values, onAnimationCompleteRef.current);
          break;
        }
        case 'widthExpansion': {
          runWidthExpansion(values, onAnimationCompleteRef.current);
          break;
        }
        default: {
          runAccentSlideDown(values, onAnimationCompleteRef.current);
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
    values,
  ]);

  return { resetAnimation, setInstantVisible, triggerEntrance };
}
