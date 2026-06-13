/**
 * LibraryHero animation tokens — enter/exit/layout props gated on reduce motion.
 */

import { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import {
  durations,
  enterEasing,
  exitEasing,
  springs,
} from '../../../../theme/animations';

const heroLayout = LinearTransition.springify()
  .damping(springs.gentle.damping)
  .stiffness(springs.gentle.stiffness);

export function useLibraryHeroAnimations() {
  const reduceMotion = useReduceMotion();

  return {
    chipsEnter: reduceMotion
      ? undefined
      : FadeInDown.delay(160).duration(durations.enter).easing(enterEasing),
    layout: reduceMotion ? undefined : heroLayout,
    searchEnter: reduceMotion
      ? undefined
      : FadeInDown.delay(240).duration(durations.enter).easing(enterEasing),
    searchExit: reduceMotion
      ? undefined
      : FadeOutUp.duration(durations.quick).easing(exitEasing),
    subtitleEnter: reduceMotion
      ? undefined
      : FadeInDown.duration(durations.enter).easing(enterEasing),
    subtitleExit: reduceMotion
      ? undefined
      : FadeOutUp.duration(durations.quick).easing(exitEasing),
    titleEnter: reduceMotion
      ? undefined
      : FadeInDown.delay(80).duration(durations.enter).easing(enterEasing),
  };
}
