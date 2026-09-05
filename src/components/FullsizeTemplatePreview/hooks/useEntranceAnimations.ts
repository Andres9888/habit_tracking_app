/**
 * Entrance animation logic for FullsizeTemplatePreview
 */

import { useEffect } from 'react';
import {
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Springs } from '../../../constants/motion';
import { durations, enterEasing } from '../../../theme/animations';
import type { Doc } from '../../../../convex/_generated/dataModel';

interface UseEntranceAnimationsProps {
  visible: boolean;
  template: Doc<'templates'> | null;
  reducedMotion: boolean;
}

export const useEntranceAnimations = ({
  visible,
  template,
  reducedMotion,
}: UseEntranceAnimationsProps) => {
  const backdropOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(100);
  const contentOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.8);
  const iconGlowScale = useSharedValue(1);
  const iconGlowOpacity = useSharedValue(0.25);
  const closeButtonOpacity = useSharedValue(1);

  useEffect(() => {
    if (visible && template) {
      backdropOpacity.value = 0;
      contentTranslateY.value = 100;
      contentOpacity.value = 0;
      iconScale.value = 0.8;
      closeButtonOpacity.value = 0;

      if (reducedMotion) {
        backdropOpacity.value = 0.5;
        contentTranslateY.value = 0;
        contentOpacity.value = 1;
        iconScale.value = 1;
        closeButtonOpacity.value = 1;
      } else {
        // Entrance uses the shared sheet cadence so the slide-up matches the
        // Add-button modal open and every other sheet surface in the app.
        backdropOpacity.value = withTiming(0.5, {
          duration: durations.sheet,
          easing: enterEasing,
        });
        contentTranslateY.value = withTiming(0, {
          duration: durations.sheet,
          easing: enterEasing,
        });
        contentOpacity.value = withTiming(1, {
          duration: durations.sheet,
          easing: enterEasing,
        });
        closeButtonOpacity.value = withDelay(
          80,
          withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) })
        );
        iconScale.value = withDelay(80, withSpring(1, Springs.standard));
        iconGlowScale.value = withDelay(180, withSpring(1.12, Springs.celebration));
      }
    }
  }, [visible, template, reducedMotion]);

  return {
    backdropOpacity,
    closeButtonOpacity,
    contentOpacity,
    contentTranslateY,
    iconGlowOpacity,
    iconGlowScale,
    iconScale,
  };
};
