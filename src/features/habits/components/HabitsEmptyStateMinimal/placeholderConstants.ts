/**
 * Animated placeholder constants for the cycling input placeholder.
 * Time-based examples that match the suggestion chip windows.
 */

export const PLACEHOLDER_EXAMPLES = {
  MORNING: [
    'Morning meditation...',
    'Drink a glass of water...',
    'Journal for 5 minutes...',
    'Go for a morning run...',
  ],
  AFTERNOON: [
    'Take a walk break...',
    'Drink water...',
    'Healthy lunch...',
    'Learn something new...',
  ],
  EVENING: [
    'Read 10 pages...',
    'Evening stretch...',
    'Wind down routine...',
    'Creative time...',
  ],
  NIGHT: [
    'Write in your journal...',
    'Gratitude practice...',
    'Phone off before bed...',
    'Breathing exercise...',
  ],
} as const;

export const PLACEHOLDER_TIMING = {
  /** How long each example is visible (ms) */
  displayDuration: 2500,
  /** Fade transition duration (ms) */
  fadeDuration: 400,
} as const;
