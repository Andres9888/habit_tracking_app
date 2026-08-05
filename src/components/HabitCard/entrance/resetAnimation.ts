/**
 * resetAnimation - Resets all animation values to initial state
 */

import { cancelAnimation } from 'react-native-reanimated';
import type { EntranceAnimationValues } from './types';

export function createResetAnimation(values: EntranceAnimationValues) {
  return () => {
    const allValues = [
      values.cardOpacity,
      values.cardTranslateY,
      values.accentScaleY,
      values.accentWidth,
      values.accentOpacity,
      values.contentOpacity,
      values.contentTranslateX,
    ];
    for (const val of allValues) cancelAnimation(val);
    values.cardOpacity.value = 0;
    values.cardTranslateY.value = 20;
    values.accentScaleY.value = 0;
    values.accentWidth.value = 0;
    values.accentOpacity.value = 0;
    values.contentOpacity.value = 0;
    values.contentTranslateX.value = -10;
    values.isAnimating.value = false;
  };
}
