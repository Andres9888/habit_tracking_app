import { useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';

const INITIAL_RIPPLE_OPACITY = 0.26;
const INITIAL_RIPPLE_SCALE = 0.6;
const PRESS_IN_DURATION_MS = 110;
const PRESS_OUT_DURATION_MS = 160;
const RIPPLE_ANIMATION_DURATION_MS = 320;
const PRESSED_SCALE = 0.94;
const FINAL_SCALE = 1;
const EXPANDED_RIPPLE_SCALE = 1.8;
const HIDDEN_RIPPLE_OPACITY = 0;

interface UseFABHandlersProps {
  openCreateHabitScreen: () => void;
  celebrationsEnabled: boolean;
  reduceMotionPreference: boolean;
  pressScale: Animated.Value;
  rippleOpacity: Animated.Value;
  rippleScale: Animated.Value;
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

    rippleOpacity.setValue(INITIAL_RIPPLE_OPACITY);
    rippleScale.setValue(INITIAL_RIPPLE_SCALE);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(pressScale, {
          duration: PRESS_IN_DURATION_MS,
          easing: Easing.out(Easing.quad),
          toValue: PRESSED_SCALE,
          useNativeDriver: true,
        }),
        Animated.timing(pressScale, {
          duration: PRESS_OUT_DURATION_MS,
          easing: Easing.out(Easing.ease),
          toValue: FINAL_SCALE,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rippleScale, {
        duration: RIPPLE_ANIMATION_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        toValue: EXPANDED_RIPPLE_SCALE,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        duration: RIPPLE_ANIMATION_DURATION_MS,
        easing: Easing.out(Easing.ease),
        toValue: HIDDEN_RIPPLE_OPACITY,
        useNativeDriver: true,
      }),
    ]).start();

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
