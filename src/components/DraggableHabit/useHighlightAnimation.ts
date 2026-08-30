/**
 * useHighlightAnimation Hook
 * Handles the glow animation when a habit is just created.
 *
 * Glow only — no card bounce. Scale transforms blur the card's SVG icon on
 * this codebase, so the highlight is a glow-border pulse starting
 * immediately, not a scale animation.
 *
 * Under Reduce Motion the glow is still set (held, then faded once) so the
 * card stays identifiable — the "go to habit" flow scrolls to it and relies
 * on this marker.
 *
 * Both highlightGlow and cardScale use reanimated SharedValues.
 */

import { useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { withTiming } from 'react-native-reanimated';
import { runHighlightGlow } from './highlightAnimations';

/** Reduce Motion: how long the static highlight is held before fading. */
const STATIC_HOLD_MS = 1800;
const STATIC_FADE_MS = 600;

export interface HighlightAnimationOptions {
  cardScale: SharedValue<number>;
  highlightGlow: SharedValue<number>;
  /** Keep the ring lit without starting its visible fade (prearmed focus). */
  holdHighlight: boolean;
  isJustCreated: boolean;
  reduceMotionPreference: boolean;
}

export function useHighlightAnimation({
  cardScale,
  highlightGlow,
  holdHighlight,
  isJustCreated,
  reduceMotionPreference,
}: HighlightAnimationOptions) {
  useEffect(() => {
    if (!isJustCreated) {
      highlightGlow.value = 0;
      return;
    }
    if (holdHighlight) {
      highlightGlow.value = 1;
      return;
    }
    if (reduceMotionPreference) {
      // Still mark the card — "go to habit" scrolls to it, and an unmarked
      // card leaves the user hunting. Held glow, no bounce, one gentle fade.
      highlightGlow.value = 1;
      const fade = setTimeout(() => {
        highlightGlow.value = withTiming(0, { duration: STATIC_FADE_MS });
      }, STATIC_HOLD_MS);
      return () => clearTimeout(fade);
    }
    highlightGlow.value = 0;
    // Guard against a stale press scale left over from a Pressable that
    // unmounted mid-press.
    cardScale.value = 1;
    runHighlightGlow(highlightGlow);
  }, [
    cardScale,
    highlightGlow,
    holdHighlight,
    isJustCreated,
    reduceMotionPreference,
  ]);
}
