/**
 * useQuickCompleteAnimations Hook
 * Manages animated styles for QuickCompleteButton
 */

import { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface UseQuickCompleteAnimationsParams {
  buttonScale: SharedValue<number>;
  checkScale: SharedValue<number>;
  checkRotation: SharedValue<number>;
}

export function useQuickCompleteAnimations({
  buttonScale,
  checkScale,
  checkRotation,
}: UseQuickCompleteAnimationsParams) {
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkScale.value,
    transform: [
      { scale: checkScale.value },
      // Round to avoid "Loss of precision during arithmetic conversion" error
      { rotate: `${Math.round(checkRotation.value)}deg` },
    ],
  }));

  return { buttonAnimatedStyle, checkAnimatedStyle };
}
