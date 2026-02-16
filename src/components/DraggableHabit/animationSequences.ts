/**
 * @module animationSequences — Barrel export for RN Animated-based sequences.
 *
 * Animation files in this directory use two different animation systems:
 *
 * - **RN Animated** (highlightAnimations, recordAnimations) — imperative
 *   `Animated.Value` sequences for card-level effects (glow, badge, scale).
 *   Re-exported here for convenient import.
 *
 * - **Reanimated** (animationHelpers) — worklet-based shared-value animations
 *   for the strength emoji. Imported directly by useStrengthAnimation.
 */

export { runHighlightAnimation, runIconPulseLoop } from './highlightAnimations';

export { runNewRecordAnimation, hideNewRecordBadge } from './recordAnimations';
