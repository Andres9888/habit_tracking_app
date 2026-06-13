/**
 * Shared animation helpers for MainBrowseView and BrowseSections.
 */

import { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import {
  durations,
  enterEasing,
  exitEasing,
} from '../../../theme/animations';

export function stagger(index: number) {
  return FadeInDown.delay(index * durations.stagger)
    .duration(durations.enter)
    .easing(enterEasing);
}

export const bodyEnter = FadeInDown.duration(durations.enter).easing(enterEasing);
export const bodyExit = FadeOutUp.duration(durations.quick).easing(exitEasing);
