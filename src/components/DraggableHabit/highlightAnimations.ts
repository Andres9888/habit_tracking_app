/**
 * @module highlightAnimations
 *
 * Reanimated-based animations for newly-created habit cards:
 *
 * - {@link runHighlightGlow} — pulsing glow border to draw attention
 *   to a just-created card. Used by {@link useHighlightAnimation}.
 * - {@link runIconPulseLoop} — infinite gentle scale loop on the icon when
 *   the week is fully complete. Used by {@link useIconPulse}.
 */

import type { SharedValue } from 'react-native-reanimated';
import { Easing, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

/**
 * Plays a glow border pulse on a newly-created habit card:
 * opacity ramps to 1, dips to 0.5, pulses to 1 again, then fades to 0.
 */
export function runHighlightGlow(highlightGlow: SharedValue<number>) {
  highlightGlow.value = withSequence(
    withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
    withTiming(0.5, { duration: 400, easing: Easing.inOut(Easing.ease) }),
    withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
    withTiming(0, { duration: 500, easing: Easing.in(Easing.ease) }),
  );
}

/** Infinite gentle scale loop (1 ↔ 1.05) for the icon when the week is complete. */
export function runIconPulseLoop(iconPulse: SharedValue<number>) {
  iconPulse.value = withRepeat(
    withSequence(
      withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
    ),
    -1,
  );
}
