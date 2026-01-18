import { useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';

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

    rippleOpacity.setValue(0.26);
    rippleScale.setValue(0.6);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(pressScale, {
          duration: 110,
          easing: Easing.out(Easing.quad),
          toValue: 0.94,
          useNativeDriver: true,
        }),
        Animated.timing(pressScale, {
          duration: 160,
          easing: Easing.out(Easing.ease),
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rippleScale, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
        toValue: 1.8,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        duration: 320,
        easing: Easing.out(Easing.ease),
        toValue: 0,
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
