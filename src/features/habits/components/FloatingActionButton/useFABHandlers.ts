import { useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { FAB, SCALE, OPACITY, RIPPLE_EFFECT } from '../../../../constants';

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

    rippleOpacity.setValue(RIPPLE_EFFECT.initialOpacity);
    rippleScale.setValue(RIPPLE_EFFECT.initialScale);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(pressScale, {
          duration: FAB.pressScaleDuration,
          easing: Easing.out(Easing.quad),
          toValue: SCALE.pressSmall,
          useNativeDriver: true,
        }),
        Animated.timing(pressScale, {
          duration: FAB.pressReleaseDuration,
          easing: Easing.out(Easing.ease),
          toValue: SCALE.normal,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rippleScale, {
        duration: FAB.rippleScaleDuration,
        easing: Easing.out(Easing.cubic),
        toValue: SCALE.large,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        duration: FAB.rippleOpacityDuration,
        easing: Easing.out(Easing.ease),
        toValue: OPACITY.transparent,
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
