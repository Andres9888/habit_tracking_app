/**
 * Progress Photos Constants
 */

export const FREE_TIER_PHOTO_LIMIT = 5;
export const PREMIUM_PHOTO_LIMIT = 999;

// Grid layout
export const PHOTOS_PER_ROW = 3;
export const PHOTO_GAP = 8;
export const PHOTO_ASPECT_RATIO = 1; // Square photos

// Animation config (matches design system: springify().damping(18))
export const PHOTO_ANIMATION_CONFIG = {
  damping: 18,
  mass: 1,
  stiffness: 180,
};

// Animation durations (matches design system: 280ms, 60ms stagger)
export const ENTER_DURATION = 280;
export const STAGGER_DELAY = 60;
