import { useCallback } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import {
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';

interface UseFABHandlersProps {
  openCreateHabitScreen: () => void;
  celebrationsEnabled: boolean;
  reduceMotionPreference: boolean;
  pressScale: SharedValue<number>;
  rippleOpacity: SharedValue<number>;
  rippleScale: SharedValue<number>;
}

export function useFABHandlers({
  openCreateHabitScreen,
  celebrationsEnabled,
  reduceMotionPreference,
  pressScale,
  rippleOpacity,
  rippleScale,
}: UseFABHandlersProps) {
  const { triggerMediumImpact, triggerSelection } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  const handlePress = useCallback(() => {
    if (reduceMotionPreference) {
      openCreateHabitScreen();
      return;
    }

    if (celebrationsEnabled) {
      triggerMediumImpact();
    } else {
      triggerSelection();
    }

    // Spring press animation — feels more physical than timing
    pressScale.value = withSequence(
      withSpring(0.88, { damping: 18, stiffness: 400 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    // Ripple expand and fade
    rippleOpacity.value = 0.22;
    rippleScale.value = 0.6;
    rippleScale.value = withSpring(2.0, { damping: 20, stiffness: 150 });
    rippleOpacity.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });

    openCreateHabitScreen();
  }, [
    celebrationsEnabled,
    openCreateHabitScreen,
    pressScale,
    rippleOpacity,
    rippleScale,
    reduceMotionPreference,
    triggerMediumImpact,
    triggerSelection,
  ]);

  return { handlePress };
}
