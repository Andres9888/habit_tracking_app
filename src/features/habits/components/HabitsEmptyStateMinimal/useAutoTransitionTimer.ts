/**
 * useAutoTransitionTimer - Timer for auto-transition delay
 *
 * Triggers exit animation after celebration delay.
 */

import { useEffect, useRef } from 'react';
import { SharedValue, cancelAnimation } from 'react-native-reanimated';

interface UseAutoTransitionTimerParams {
  autoTransition: boolean;
  onTransitionComplete?: () => void;
  triggerExitAnimation: () => void;
  iconTranslateY: SharedValue<number>;
  iconExitScale: SharedValue<number>;
  containerOpacity: SharedValue<number>;
}

const CELEBRATION_DELAY = 1800;

export function useAutoTransitionTimer({
  autoTransition,
  onTransitionComplete,
  triggerExitAnimation,
  iconTranslateY,
  iconExitScale,
  containerOpacity,
}: UseAutoTransitionTimerParams) {
  const autoTransitionTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!autoTransition || !onTransitionComplete) return;

    autoTransitionTimeout.current = setTimeout(() => {
      triggerExitAnimation();
    }, CELEBRATION_DELAY);

    return () => {
      if (autoTransitionTimeout.current) {
        clearTimeout(autoTransitionTimeout.current);
      }
      cancelAnimation(iconTranslateY);
      cancelAnimation(iconExitScale);
      cancelAnimation(containerOpacity);
    };
  }, [
    autoTransition,
    onTransitionComplete,
    triggerExitAnimation,
    iconTranslateY,
    iconExitScale,
    containerOpacity,
  ]);

  return { autoTransitionTimeout };
}
