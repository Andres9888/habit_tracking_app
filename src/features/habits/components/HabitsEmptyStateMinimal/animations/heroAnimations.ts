/**
 * Hero Section Animation Configurations
 *
 * Animations for the hero icon, glow effects, and breathing animation.
 */

/**
 * Hero icon breathing animation
 * Gentle scale: 1.0 → 1.08 → 1.0 (3s ease-in-out, infinite)
 */
export const BREATHING_ANIMATION = {
  duration: 3000,
  maxScale: 1.08,
  minScale: 1,
} as const;

/**
 * Hero glow pulse animation (synced with breathing)
 * Shadow opacity and radius pulse with the 3s breathing cycle
 */
export const HERO_GLOW = {
  maxShadowOpacity: 0.35,
  maxShadowRadius: 32,
  minShadowOpacity: 0.15,
  minShadowRadius: 24,
  outerGlowOpacity: 0.15,
  outerGlowRadius: 60,
} as const;
