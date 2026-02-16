/**
 * Constants for CelebrationScreen animations and styling
 */

// Animation spring configs
export const SPRING_BUTTON = { damping: 15, stiffness: 300 };
export const SPRING_BOUNCY = { damping: 8, stiffness: 300 };
export const SPRING_GENTLE = { damping: 28, mass: 1, stiffness: 180 };
export const STAGGER_DELAY = 60;

// Confetti particle config (tiered based on milestone importance)
export const CONFETTI_COLORS = [
  '#10B981', // emerald-500
  '#34D399', // emerald-400
  '#FBBF24', // amber-400
  '#F59E0B', // amber-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
];

/**
 * Particle counts by celebration tier
 * Small: 3, 7, 14 days
 * Medium: 21, 30, 60 days
 * Large: 90, 100, 365 days
 */
export const PARTICLE_COUNT_SMALL = 8;
export const PARTICLE_COUNT_MEDIUM = 16;
export const PARTICLE_COUNT_LARGE = 24;
export const PARTICLE_COUNT = PARTICLE_COUNT_MEDIUM; // Default for backwards compatibility

// Initial animation values
export const INITIAL_TRANSLATE_Y = 20;
