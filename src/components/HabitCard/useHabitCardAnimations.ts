/**
 * useHabitCardAnimations — Manages completion celebration and animated styles.
 *
 * **Lifecycle:**
 * 1. Creates shared values for checkmark scale/rotate, ripple scale/opacity
 * 2. Builds trigger functions via {@link createCelebrationTrigger} and {@link createUncheckTrigger}
 * 3. Builds animated style hooks for card, actions, checkmark, and ripple
 * 4. Returns triggers + animated styles + raw shared values (for chain reuse)
 *
 * The checkmark and chain-link animations share the same shared values
 * (`checkmarkScale`/`checkmarkRotate`); only the rendered icon differs (T014).
 *
 * @see docs/offline-habit-sync.md T014 — Chain animation for offline completions
 */

import { useEffect, useRef } from 'react';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';
import {
  createCelebrationTrigger,
  createUncheckTrigger,
} from './animations/celebrationAnimation';
import {
  useCardAnimatedStyle,
  useActionsAnimatedStyle,
  useCheckmarkAnimatedStyle,
  useRippleAnimatedStyle,
} from './animations/animatedStyles';

interface UseHabitCardAnimationsOptions {
  translateX: SharedValue<number>;
  cardScale: SharedValue<number>;
  reduceMotion: boolean;
  setShowFloatingXP: (show: boolean) => void;
  setXPPosition: (position: { x: number; y: number }) => void;
  setShowConfetti: (show: boolean) => void;
}

export function useHabitCardAnimations({
  translateX,
  cardScale,
  reduceMotion,
  setShowFloatingXP,
  setXPPosition,
  setShowConfetti,
}: UseHabitCardAnimationsOptions) {
  // These values are used for both checkmark and chain link animations
  // The animation behavior is identical, only the visual differs
  const checkmarkScale = useSharedValue(0);
  const checkmarkRotate = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const triggerCompletionCelebration = createCelebrationTrigger({
    cardScale,
    checkmarkRotate,
    checkmarkScale,
    reduceMotion,
    rippleOpacity,
    rippleScale,
    setShowConfetti,
    setShowFloatingXP,
    setXPPosition,
    timeoutRef,
  });

  const triggerUncheckAnimation = createUncheckTrigger(
    checkmarkScale,
    checkmarkRotate,
    reduceMotion
  );

  const cardAnimatedStyle = useCardAnimatedStyle(translateX, cardScale);
  const actionsAnimatedStyle = useActionsAnimatedStyle(translateX);
  const checkmarkAnimatedStyle = useCheckmarkAnimatedStyle(
    checkmarkScale,
    checkmarkRotate
  );
  const rippleAnimatedStyle = useRippleAnimatedStyle(
    rippleScale,
    rippleOpacity
  );

  return {
    actionsAnimatedStyle,
    cardAnimatedStyle,
    // Chain link animation uses same values as checkmark (T014)
    chainRotate: checkmarkRotate,
    chainScale: checkmarkScale,
    checkmarkAnimatedStyle,
    checkmarkRotate,
    checkmarkScale,
    rippleAnimatedStyle,
    triggerCompletionCelebration,
    triggerUncheckAnimation,
  };
}
