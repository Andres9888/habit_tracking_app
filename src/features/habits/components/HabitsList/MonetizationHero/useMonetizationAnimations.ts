/**
 * useMonetizationAnimations — animation lifecycle for {@link MonetizationHero}.
 *
 * Manages a single `Animated.Value` track:
 * - **progress** — fills the slot-usage bar to `usageRatio × trackWidth`
 *   (`durations.emphasis` ease-out).
 *
 * Short-circuits to a static value when `reduceMotion` is true. `trackWidth`
 * is measured via `onLayout` so the progress bar works at any width.
 *
 * Attention is handled by a one-shot entrance on the hero container (see
 * {@link MonetizationHero}), not by idle loops. Per the motion spec
 * (`theme/animations.ts`): no decorative loops on resting surfaces — a calm,
 * still CTA reads premium; a pulsing one reads desperate.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { durations } from '../../../../../theme/animations';

interface UseMonetizationAnimationsOptions {
  freeHabitLimit: number;
  habitSlotsUsed: number;
  reduceMotion: boolean;
}

export function useMonetizationAnimations({
  freeHabitLimit,
  habitSlotsUsed,
  reduceMotion,
}: UseMonetizationAnimationsOptions) {
  const progress = useSharedValue(0);
  const [trackWidth, setTrackWidth] = useState(0);

  const usageRatio = useMemo(
    () =>
      freeHabitLimit === 0 ? 0 : Math.min(habitSlotsUsed / freeHabitLimit, 1),
    [freeHabitLimit, habitSlotsUsed]
  );

  // Progress bar animation
  useEffect(() => {
    const targetWidth = trackWidth * usageRatio;
    if (reduceMotion) {
      progress.value = targetWidth;
      return;
    }
    progress.value = withTiming(targetWidth, {
      duration: durations.emphasis,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, trackWidth, usageRatio, reduceMotion]);

  const handleTrackLayout = useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      setTrackWidth(event.nativeEvent.layout.width);
    },
    []
  );

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value,
  }));

  return {
    handleTrackLayout,
    progressStyle,
    trackWidth,
  };
}
