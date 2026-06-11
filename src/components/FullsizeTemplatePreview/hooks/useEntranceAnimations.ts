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
        // Fast entrance: the page should feel instant — long staggers read
        // as the app being slow, especially from the View details link.
        backdropOpacity.value = withTiming(0.5, {
          duration: 180,
          easing: Easing.out(Easing.cubic),
        });
        contentTranslateY.value = withTiming(0, {
          duration: 220,
          easing: Easing.out(Easing.cubic),
        });
        contentOpacity.value = withTiming(1, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
        closeButtonOpacity.value = withDelay(
          80,
          withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) })
        );
        iconScale.value = withDelay(80, withSpring(1, Springs.micro));
        iconGlowScale.value = withDelay(180, withSpring(1.12, Springs.pulse));
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
