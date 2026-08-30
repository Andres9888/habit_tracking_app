/**
 * Button animation logic for FullsizeTemplatePreview
 */

import { useCallback, useEffect } from 'react';
import {
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { Springs } from '../../../constants/motion';
import { CARD_PRESS_SCALE } from '@/utils/animations/cardPressAnimation';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';

interface UseButtonAnimationsProps {
  isImported: boolean;
  reducedMotion: boolean;
  visible: boolean;
}

export const useButtonAnimations = ({
  isImported,
  reducedMotion,
  visible,
}: UseButtonAnimationsProps) => {
  const closeButtonScale = useSharedValue(1);
  const importButtonScale = useSharedValue(1);
  const customizeButtonScale = useSharedValue(1);

  // Every button here unmounts on the same press that activates it: adding
  // swaps the Add/Customize pair for the post-add panel, and the panel's own
  // actions dismiss the preview. onPressOut never lands, so the shared value
  // is stranded at CARD_PRESS_SCALE. Because the panel reuses these same
  // values, a stranded 0.97 leaves its primary button permanently undersized
  // with a label rasterized at full size and then transform-scaled down —
  // which reads as blurry, wrong-sized text. Snap back to rest on every
  // footer swap and every reopen so each surface starts at scale 1.
  useEffect(() => {
    closeButtonScale.value = 1;
    importButtonScale.value = 1;
    customizeButtonScale.value = 1;
  }, [
    isImported,
    visible,
    closeButtonScale,
    importButtonScale,
    customizeButtonScale,
  ]);

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
    importButtonScale,
  };
};
