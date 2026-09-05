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
import { durations } from '@/theme/animations';
import {
  Easing,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/**
 * Plays a highlight pulse (thin accent ring) on a newly-created habit
 * card: on instantly, hold (1400ms), then fade to 0 (500ms).
 * The focus flow pre-paints this glow while the library still covers the
 * list, so the first revealed frame is already highlighted.
 */
export function runHighlightGlow(highlightGlow: SharedValue<number>) {
  // Instant on: the ring must be there the frame the card is revealed.
  highlightGlow.value = 1;
  highlightGlow.value = withSequence(
    withTiming(1, { duration: durations.breathing }),
    withTiming(0, {
      duration: durations.complex,
      easing: Easing.in(Easing.ease),
    })
  );
}

/** Infinite gentle scale loop (1 ↔ 1.05) for the icon when the week is complete. */
export function runIconPulseLoop(iconPulse: SharedValue<number>) {
  iconPulse.value = withRepeat(
    withSequence(
      withTiming(1.05, {
        duration: durations.loop,
        easing: Easing.inOut(Easing.ease),
      }),
      withTiming(1, {
        duration: durations.loop,
        easing: Easing.inOut(Easing.ease),
      })
    ),
    -1
  );
}
