/**
 * HabitCard Animations Hook
 * Manages completion celebration and animated styles
 *
 * @see docs/offline-habit-sync.md T014 - Chain animation for offline completions
 */

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
  setShowFloatingXP: (show: boolean) => void;
  setXPPosition: (position: { x: number; y: number }) => void;
}

export function useHabitCardAnimations({
  translateX,
  cardScale,
  setShowFloatingXP,
  setXPPosition,
}: UseHabitCardAnimationsOptions) {
  // These values are used for both checkmark and chain link animations
  // The animation behavior is identical, only the visual differs
  const checkmarkScale = useSharedValue(0);
  const checkmarkRotate = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  const triggerCompletionCelebration = createCelebrationTrigger({
    cardScale,
    checkmarkRotate,
    checkmarkScale,
    rippleOpacity,
    rippleScale,
    setShowFloatingXP,
    setXPPosition,
  });

  const triggerUncheckAnimation = createUncheckTrigger(
    checkmarkScale,
    checkmarkRotate
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
