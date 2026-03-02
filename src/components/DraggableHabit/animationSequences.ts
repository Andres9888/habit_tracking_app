/**
 * @module animationSequences — Barrel export for animation sequences.
 *
 * Animation files in this directory use two different animation systems:
 *
 * - **Reanimated** (highlightAnimations, animationHelpers) — worklet-based
 *   shared-value animations for glow/pulse effects and strength emoji.
 *
 * - **RN Animated** (recordAnimations) — imperative `Animated.Value` sequences
 *   for card-level badge effects (pending migration).
 */

export { runHighlightGlow, runIconPulseLoop } from './highlightAnimations';

export { runNewRecordAnimation, hideNewRecordBadge } from './recordAnimations';
