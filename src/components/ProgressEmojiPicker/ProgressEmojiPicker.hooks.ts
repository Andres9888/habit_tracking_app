/**
 * Expand/collapse animation for the ProgressEmojiPicker panel.
 *
 * The panel is rendered (clipped to height 0) from mount so its natural height
 * is measured before the first open — this avoids the first-open height jump.
 * Opening uses an ease-in-out curve (zero velocity at both ends — no jerk away
 * from rest, no abrupt stop) for a smooth, even expand; closing uses a quicker
 * ease-in so dismissal stays responsive. Height and opacity are interpolated
 * from a single `progress` value and cannot overshoot, and Reduce Motion
 * collapses both to an instant transition.
 */
import { useEffect, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { durations } from '@/theme/animations';

export function useProgressPickerAnimation(
  expanded: boolean,
  reduceMotion: boolean
) {
  const [naturalHeight, setNaturalHeight] = useState(0);
  const progress = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, {
      duration: reduceMotion
        ? 0
        : expanded
          ? durations.moderate
          : durations.transition,
      easing: expanded ? Easing.inOut(Easing.cubic) : Easing.in(Easing.cubic),
    });
  }, [expanded, reduceMotion, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    // Clamp height to [0, naturalHeight] so the panel can never reveal empty
    // space below the content (no visual overshoot).
    height: interpolate(
      progress.value,
      [0, 1],
      [0, naturalHeight],
      Extrapolation.CLAMP
    ),
    opacity: interpolate(
      progress.value,
      [0, 0.85],
      [0, 1],
      Extrapolation.CLAMP
    ),
    overflow: 'hidden' as const,
  }));

  // Re-measure when content height changes (e.g. the "Reset to default" row
  // appears after a customization), so a taller panel never clips.
  const handleLayout = (event: LayoutChangeEvent) => {
    const h = event.nativeEvent.layout.height;
    if (h > 0 && h !== naturalHeight) setNaturalHeight(h);
  };

  return { animatedStyle, handleLayout };
}
