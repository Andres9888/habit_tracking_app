import { useCallback } from 'react';
import { Easing, type SharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { FAB, SCALE, OPACITY, RIPPLE_EFFECT } from '../../../../constants';

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

    rippleOpacity.value = RIPPLE_EFFECT.initialOpacity;
    rippleScale.value = RIPPLE_EFFECT.initialScale;

    pressScale.value = withSequence(
      withTiming(SCALE.pressSmall, {
        duration: FAB.pressScaleDuration,
        easing: Easing.out(Easing.quad),
      }),
      withTiming(SCALE.normal, {
        duration: FAB.pressReleaseDuration,
        easing: Easing.out(Easing.ease),
      })
    );
    rippleScale.value = withTiming(SCALE.large, {
      duration: FAB.rippleScaleDuration,
      easing: Easing.out(Easing.cubic),
    });
    rippleOpacity.value = withTiming(OPACITY.transparent, {
      duration: FAB.rippleOpacityDuration,
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
