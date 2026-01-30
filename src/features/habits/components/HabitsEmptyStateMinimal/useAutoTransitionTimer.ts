/**
 * useAutoTransitionTimer - Timer for auto-transition delay
 *
 * Triggers exit animation after celebration delay.
 */

import { useEffect, useRef, useCallback } from 'react';
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
  
  // Use refs for callbacks to avoid triggering useEffect re-runs
  const onTransitionCompleteRef = useRef(onTransitionComplete);
  onTransitionCompleteRef.current = onTransitionComplete;
  
  const triggerExitAnimationRef = useRef(triggerExitAnimation);
  triggerExitAnimationRef.current = triggerExitAnimation;

  useEffect(() => {
    if (!autoTransition || !onTransitionCompleteRef.current) return;

    autoTransitionTimeout.current = setTimeout(() => {
      triggerExitAnimationRef.current();
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
    iconTranslateY,
    iconExitScale,
    containerOpacity,
  ]);

  return { autoTransitionTimeout };
}
