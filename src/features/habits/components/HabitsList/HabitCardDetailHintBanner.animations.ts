import {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';

export const HINT_LAYOUT = LinearTransition.duration(durations.enter).easing(
  enterEasing
);

export function hintEntering(reduceMotion: boolean) {
  if (reduceMotion) return FadeIn.duration(1);
  return FadeInDown.duration(durations.enter).easing(enterEasing);
}

export function hintExiting(reduceMotion: boolean) {
  if (reduceMotion) return FadeOut.duration(1);
  return FadeOutUp.duration(durations.reveal).easing(enterEasing);
}
