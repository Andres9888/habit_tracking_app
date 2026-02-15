/**
 * Scroll-based animation hook for TemplateScienceModal
 */

import { useEffect } from 'react';

import {
  useSharedValue,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import type { Doc } from '../../../../convex/_generated/dataModel';

interface UseScrollAnimationsProps {
  visible: boolean;
  template: Doc<'templates'> | null;
}

export const useScrollAnimations = ({
  visible,
  template,
}: UseScrollAnimationsProps) => {
  const scrollY = useSharedValue(0);
  const headerTitleOpacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const dismissProgress = useSharedValue(0);

  useEffect(() => {
    if (visible && template) {
      translateY.value = 0;
      dismissProgress.value = 0;
      scrollY.value = 0;
      headerTitleOpacity.value = 0;
    }
  }, [
    visible,
    template,
    translateY,
    dismissProgress,
    scrollY,
    headerTitleOpacity,
  ]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      headerTitleOpacity.value = interpolate(
        event.contentOffset.y,
        [80, 150],
        [0, 1],
        Extrapolation.CLAMP
      );
    },
  });

  return {
    dismissProgress,
    headerTitleOpacity,
    scrollHandler,
    scrollY,
    translateY,
  };
};
