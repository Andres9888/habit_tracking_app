/**
 * Success state animation logic for FullsizeTemplatePreview
 *
 * Calm checkmark morph: the "Add" button crossfades to the post-add panel
 * with a gentle bounce on the checkmark. No full-screen glow, no confetti.
 *
 * The panel itself deliberately does NOT animate scale. iOS rasterizes a
 * layer's text at its layout size and then applies the transform, so scaling
 * a text-bearing container resamples every glyph — the panel's copy and its
 * primary button read as blurry for the whole entrance. Fade + rise is also
 * the canonical entry motion in theme/animations.
 */

import { useEffect, useCallback, useRef } from 'react';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { triggerHaptic } from '@/utils/haptics';
import { durations, enterEasing, springs } from '@/theme/animations';

interface UseSuccessAnimationsProps {
  isImported: boolean;
  reducedMotion: boolean;
}

export const useSuccessAnimations = ({
  isImported,
  reducedMotion,
}: UseSuccessAnimationsProps) => {
  const checkmarkScale = useSharedValue(0);
  const successPanelProgress = useSharedValue(0);
  const wasImportedRef = useRef(isImported);

  const triggerSuccessHaptic = useCallback(() => {
    triggerHaptic('success');
  }, []);

  useEffect(() => {
    if (isImported) {
      if (reducedMotion) {
        checkmarkScale.value = 1;
        successPanelProgress.value = 1;
      } else {
        if (!wasImportedRef.current) triggerSuccessHaptic();
        successPanelProgress.value = withTiming(1, {
          duration: durations.enter,
          easing: enterEasing,
        });
        checkmarkScale.value = withSpring(1, springs.bouncy);
      }
    } else {
      checkmarkScale.value = 0;
      successPanelProgress.value = 0;
    }
    wasImportedRef.current = isImported;
  }, [isImported, reducedMotion, triggerSuccessHaptic]);

  return {
    checkmarkScale,
    successPanelProgress,
  };
};
