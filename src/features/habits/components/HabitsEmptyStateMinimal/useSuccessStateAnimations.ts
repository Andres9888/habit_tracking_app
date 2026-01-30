/**
 * useSuccessStateAnimations - Composition hook for SuccessState animations
 *
 * Combines entrance, exit, and tap hint animations into a single API.
 */

import { useSuccessEntranceAnimation } from './useSuccessEntranceAnimation';
import { useSuccessExitAnimation } from './useSuccessExitAnimation';
import { useTapHintAnimation } from './useTapHintAnimation';

interface UseSuccessStateAnimationsParams {
  shouldReduceMotion: boolean | null;
  autoTransition: boolean;
  onTransitionComplete?: () => void;
}

export function useSuccessStateAnimations({
  shouldReduceMotion,
  autoTransition,
  onTransitionComplete,
}: UseSuccessStateAnimationsParams) {
  const { iconScale, contentOpacity, contentStyle } =
    useSuccessEntranceAnimation({
      shouldReduceMotion,
    });

  const {
    iconStyle,
    containerStyle,
    ringStyle,
    burstStyle,
    triggerExitAnimation,
  } = useSuccessExitAnimation({
    autoTransition,
    contentOpacity,
    iconScale,
    onTransitionComplete,
    shouldReduceMotion,
  });

  const { tapHintStyle } = useTapHintAnimation({
    autoTransition,
    shouldReduceMotion,
  });

  return {
    burstStyle,
    containerStyle,
    contentStyle,
    iconStyle,
    ringStyle,
    tapHintStyle,
    triggerExitAnimation,
  };
}
