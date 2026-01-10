/**
 * setInstantVisible - Sets all animation values to their final visible state instantly
 */

import { ACCENT_TARGET_WIDTH } from './constants';
import type { EntranceAnimationValues } from './types';

export function createSetInstantVisible(values: EntranceAnimationValues) {
  return () => {
    values.cardOpacity.value = 1;
    values.cardTranslateY.value = 0;
    values.accentScaleY.value = 1;
    values.accentWidth.value = ACCENT_TARGET_WIDTH;
    values.accentOpacity.value = 1;
    values.contentOpacity.value = 1;
    values.contentTranslateX.value = 0;
  };
}
