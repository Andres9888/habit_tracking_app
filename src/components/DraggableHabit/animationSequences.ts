/**
 * @module animationSequences — Barrel export for animation sequences.
 *
 * All animation files use Reanimated SharedValue-based animations:
 *
 * - **highlightAnimations** — glow/pulse effects for just-created cards
 * - **recordAnimations** — new personal record badge + card bounce
 */

export { runHighlightGlow, runIconPulseLoop } from './highlightAnimations';

export { runNewRecordAnimation, hideNewRecordBadge } from './recordAnimations';
