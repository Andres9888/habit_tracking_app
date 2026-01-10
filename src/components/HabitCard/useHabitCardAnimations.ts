/**
 * HabitCard Animations Hook
 * Manages completion celebration and animated styles
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
    checkmarkAnimatedStyle,
    checkmarkRotate,
    checkmarkScale,
    rippleAnimatedStyle,
    triggerCompletionCelebration,
    triggerUncheckAnimation,
  };
}
