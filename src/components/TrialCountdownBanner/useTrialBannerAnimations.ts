/**
 * TrialCountdownBanner Animation Hook
 * Entrance animation + urgency pulse for high-urgency states
 */

import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { springs, durations } from '../../theme/animations';
import type { UrgencyLevel } from './constants';

interface UseTrialBannerAnimationsParams {
  visible: boolean;
  urgency: UrgencyLevel;
}

export function useTrialBannerAnimations({
  visible,
  urgency,
}: UseTrialBannerAnimationsParams) {
  const translateY = useSharedValue(-60);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, springs.gentle);
      opacity.value = withTiming(1, { duration: durations.enter });
      scale.value = withSpring(1, springs.gentle);

      // Subtle pulse on icon for high urgency
      if (urgency === 'high') {
        iconScale.value = withDelay(
          600,
          withRepeat(
            withSequence(
              withTiming(1.15, { duration: 400, easing: Easing.inOut(Easing.ease) }),
              withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
            ),
            -1, // infinite
            true
          )
        );
      }
    } else {
      translateY.value = withSpring(-60, springs.exit);
      opacity.value = withTiming(0, { duration: durations.quick });
      scale.value = withSpring(0.95, springs.exit);
    }
  }, [visible, urgency, translateY, opacity, scale, iconScale]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return { containerStyle, iconStyle };
}
