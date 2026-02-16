/**
 * @module highlightAnimations
 *
 * RN Animated sequences for newly-created habit cards:
 *
 * - {@link runHighlightAnimation} — scale bounce + pulsing glow border to
 *   draw attention to a just-created card. Used by {@link useHighlightAnimation}.
 * - {@link runIconPulseLoop} — infinite gentle scale loop on the icon when
 *   the week is fully complete. Used by {@link useIconPulse}.
 */

import { Animated, Easing } from 'react-native';

/**
 * Plays a one-shot attention animation on a newly-created habit card:
 * card scales up to 1.04 then settles, while a glow border pulses twice then fades.
 */
export function runHighlightAnimation(
  cardScale: Animated.Value,
  highlightGlow: Animated.Value
) {
  Animated.parallel([
    Animated.sequence([
      Animated.spring(cardScale, {
        damping: 12,
        stiffness: 200,
        toValue: 1.04,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        damping: 15,
        stiffness: 250,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]),
    Animated.sequence([
      Animated.timing(highlightGlow, {
        duration: 300,
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(highlightGlow, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        toValue: 0.5,
        useNativeDriver: true,
      }),
      Animated.timing(highlightGlow, {
        duration: 300,
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(highlightGlow, {
        duration: 500,
        easing: Easing.in(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]),
  ]).start();
}

/** Infinite gentle scale loop (1 ↔ 1.05) for the icon when the week is complete. */
export function runIconPulseLoop(iconPulse: Animated.Value) {
  Animated.loop(
    Animated.sequence([
      Animated.timing(iconPulse, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        toValue: 1.05,
        useNativeDriver: true,
      }),
      Animated.timing(iconPulse, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }),
    ])
  ).start();
}
