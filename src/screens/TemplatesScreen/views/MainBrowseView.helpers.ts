/**
 * Shared animation helpers for MainBrowseView and BrowseSections.
 */

import { Easing, FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { durations } from '../../../theme/animations';

export function stagger(index: number) {
  return FadeInDown.delay(index * durations.stagger)
    .duration(durations.enter)
    .easing(Easing.out(Easing.cubic));
}

export const bodyEnter = FadeInDown.duration(180);
export const bodyExit = FadeOutUp.duration(120);
