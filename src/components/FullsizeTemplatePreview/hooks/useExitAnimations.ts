/**
 * Exit animation logic for FullsizeTemplatePreview.
 * Mirrors useEntranceAnimations in reverse, slightly faster,
 * when `visible` transitions from true → false.
 */

import { useEffect, useRef } from 'react';
import { Easing, withTiming } from 'react-native-reanimated';
import type { EntranceAnimationValues } from '../FullsizeTemplatePreview.types';

interface UseExitAnimationsProps extends EntranceAnimationValues {
  visible: boolean;
  reducedMotion: boolean;
}

const EXIT_TRANSLATE_Y = 60;

export const useExitAnimations = ({
  visible,
  reducedMotion,
  backdropOpacity,
  contentOpacity,
  contentTranslateY,
  closeButtonOpacity,
}: UseExitAnimationsProps) => {
  const wasVisibleRef = useRef(visible);

  useEffect(() => {
    const wasVisible = wasVisibleRef.current;
    wasVisibleRef.current = visible;

    if (visible || !wasVisible) return;

    if (reducedMotion) {
      backdropOpacity.value = 0;
      contentOpacity.value = 0;
      contentTranslateY.value = EXIT_TRANSLATE_Y;
      closeButtonOpacity.value = 0;
      return;
    }

    backdropOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.in(Easing.cubic),
    });
    contentOpacity.value = withTiming(0, {
      duration: 200,
      easing: Easing.in(Easing.cubic),
    });
    contentTranslateY.value = withTiming(EXIT_TRANSLATE_Y, {
      duration: 260,
      easing: Easing.in(Easing.cubic),
    });
    closeButtonOpacity.value = withTiming(0, {
      duration: 120,
      easing: Easing.in(Easing.cubic),
    });
  }, [visible, reducedMotion]);
};
