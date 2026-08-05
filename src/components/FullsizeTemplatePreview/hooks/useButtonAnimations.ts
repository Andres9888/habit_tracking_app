/**
 * Button animation logic for FullsizeTemplatePreview
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { Springs } from '../../../constants/motion';
import { CARD_PRESS_SCALE } from '@/utils/animations/cardPressAnimation';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

interface UseButtonAnimationsProps {
  reducedMotion: boolean;
}

export const useButtonAnimations = ({
  reducedMotion,
}: UseButtonAnimationsProps) => {
  const closeButtonScale = useSharedValue(1);
  const customizeButtonScale = useSharedValue(1);

  const createPressHandlers = useCallback(
    (scaleValue: SharedValue<number>, scale = CARD_PRESS_SCALE): PressHandlers => ({
      onPressIn: () => {
        scaleValue.value = reducedMotion
          ? scale
          : withSpring(scale, Springs.button);
      },
      onPressOut: () => {
        scaleValue.value = reducedMotion ? 1 : withSpring(1, Springs.button);
      },
    }),
    [reducedMotion]
  );

  return {
    closeButtonScale,
    createPressHandlers,
    customizeButtonScale,
  };
};
