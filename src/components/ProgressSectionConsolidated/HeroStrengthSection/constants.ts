/**
 * Constants for HeroStrengthSection
 */

export const RING_ANIMATION_DURATION = 1200;
export const EMOJI_SCALE_DELAY = 300;

/** Ring dimensions - defined at module level to avoid recreation */
export const RING_SIZE = 100;
export const STROKE_WIDTH = 10;
export const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
export const CENTER = RING_SIZE / 2;
