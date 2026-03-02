/**
 * Button animation hook for TemplateScienceModal
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import type { PressHandlers } from '../TemplateScienceModal.types';
import { springs } from '@/theme/animations';

export const useButtonAnimations = () => {
  const closeButtonScale = useSharedValue(1);
  const linkButtonScale = useSharedValue(1);
  const youtubeButtonScale = useSharedValue(1);
  const shareButtonScale = useSharedValue(1);
  const backButtonScale = useSharedValue(1);

  const createPressHandlers = useCallback(
    (scaleValue: SharedValue<number>, scale = 0.95): PressHandlers => ({
      onPressIn: () => {
        scaleValue.value = withSpring(scale, springs.button);
      },
      onPressOut: () => {
        scaleValue.value = withSpring(1, springs.button);
      },
    }),
    []
  );

  return {
    createPressHandlers,
    scaleValues: {
      backButton: backButtonScale,
      closeButton: closeButtonScale,
      linkButton: linkButtonScale,
      shareButton: shareButtonScale,
      youtubeButton: youtubeButtonScale,
    },
  };
};
