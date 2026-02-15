/**
 * Button animation logic for FullsizeTemplatePreview
 */

import { useCallback } from 'react';

import {
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';

import type { PressHandlers } from '../FullsizeTemplatePreview.types';
import { Springs } from '../../../constants/motion';

interface UseButtonAnimationsProps {
  reducedMotion: boolean;
}

export const useButtonAnimations = ({
  reducedMotion,
}: UseButtonAnimationsProps) => {
  const closeButtonScale = useSharedValue(1);
  const importButtonScale = useSharedValue(1);
  const customizeButtonScale = useSharedValue(1);

  const createPressHandlers = useCallback(
    (scaleValue: SharedValue<number>, scale = 0.96): PressHandlers => ({
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
    importButtonScale,
  };
};
