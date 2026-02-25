/**
 * Animation configs for CollapsibleCategorySection
 * Uses the app's spring-based design system (theme/animations.ts)
 * with unique diagonal spatial movement for template card reveals
 */

import {
  FadeIn,
  FadeOut,
  LinearTransition,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import type { EntryAnimationsValues } from 'react-native-reanimated';

import { springs } from '../../theme/animations';
import { STAGGER_DELAYS } from '../../constants/animations';

/** Layout transition uses sheet spring for smooth sibling push-down */
export const LAYOUT_SPRING = LinearTransition.springify()
  .damping(springs.sheet.damping)
  .stiffness(springs.sheet.stiffness);

/** Base delay before first card (let container open first) */
const CARD_BASE_DELAY = 80;
/** Max total stagger delay */
const MAX_STAGGER_DELAY = 500;

/** Worklet: content fade + slide down with gentle spring */
const contentEnteringWorklet = (_targetValues: EntryAnimationsValues) => {
  'worklet';
  return {
    initialValues: { opacity: 0, transform: [{ translateY: -8 }] },
    animations: {
      opacity: withSpring(1, springs.gentle),
      transform: [{ translateY: withSpring(0, springs.gentle) }],
    },
  };
};

/** Content entering: gentle spring reveal */
export function contentEntering(reducedMotion: boolean) {
  return reducedMotion ? FadeIn.duration(1) : contentEnteringWorklet;
}

/** Content exiting: instant removal, layout spring handles the collapse */
export function contentExiting(reducedMotion: boolean) {
  return FadeOut.duration(reducedMotion ? 1 : 50);
}

/** Compute stagger delay for a card at the given index */
function cardStaggerDelay(index: number) {
  return Math.min(
    CARD_BASE_DELAY + index * STAGGER_DELAYS.STANDARD,
    MAX_STAGGER_DELAY
  );
}

/** Card entering: diagonal slide (right+down) + scale with standard spring */
export function cardEntering(index: number, reducedMotion: boolean) {
  if (reducedMotion) return FadeIn.duration(1);

  const delay = cardStaggerDelay(index);
  return (_targetValues: EntryAnimationsValues) => {
    'worklet';
    return {
      initialValues: {
        opacity: 0,
        transform: [{ translateX: 20 }, { translateY: 6 }, { scale: 0.96 }],
      },
      animations: {
        opacity: withDelay(delay, withSpring(1, springs.standard)),
        transform: [
          { translateX: withDelay(delay, withSpring(0, springs.standard)) },
          { translateY: withDelay(delay, withSpring(0, springs.standard)) },
          { scale: withDelay(delay, withSpring(1, springs.standard)) },
        ],
      },
    };
  };
}

/** Card exiting: quick fade */
export const CARD_EXITING = FadeOut.duration(120);
