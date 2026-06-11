/** PremiumStatus.hooks — shimmer sweep + PRO badge pulse for the upsell card */
import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { durations } from '@/theme/animations';

const SHIMMER_DURATION = durations.celebration;

export function usePremiumUpsellAnimations(enabled: boolean) {
  const shimmerPos = useSharedValue(0);
  const proBadgeScale = useSharedValue(1);

  useEffect(() => {
    if (!enabled) return;
    shimmerPos.value = withRepeat(
      withTiming(1, {
        duration: SHIMMER_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );
    proBadgeScale.value = withRepeat(
      withSequence(
        withTiming(1.06, {
          duration: durations.loop,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: durations.loop,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [enabled, shimmerPos, proBadgeScale]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(shimmerPos.value, [0, 1], [-200, 400]) },
    ],
    opacity: 0.12,
  }));

  const badgePulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: proBadgeScale.value }],
  }));

  return { shimmerStyle, badgePulseStyle };
}
