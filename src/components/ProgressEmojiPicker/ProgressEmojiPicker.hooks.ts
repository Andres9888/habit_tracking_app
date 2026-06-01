/**
 * Expand/collapse animation for the ProgressEmojiPicker panel.
 *
 * The panel is rendered (clipped to height 0) from mount so its natural height
 * is measured before the first open — this avoids the first-open height jump.
 * Open and close share the house `springs.gentle` curve — critically damped, so
 * it settles naturally with no overshoot, matching every accordion/disclosure in
 * the app (see useExpandAnimation). Height and opacity are interpolated from a
 * single `progress` value and cannot overshoot, and Reduce Motion collapses both
 * to an instant transition.
 */
import { useEffect, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { springs } from '@/theme/animations';

export function useProgressPickerAnimation(
  expanded: boolean,
  reduceMotion: boolean
) {
  const [naturalHeight, setNaturalHeight] = useState(0);
  const progress = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = expanded ? 1 : 0;
      return;
    }
    progress.value = withSpring(expanded ? 1 : 0, springs.gentle);
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
