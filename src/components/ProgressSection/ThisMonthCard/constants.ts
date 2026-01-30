/**
 * ThisMonthCard Constants
 */

// Day labels for the bar chart
export const DAY_LABELS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

// Animation configuration
export const BAR_ANIMATION = {
  // ms between each bar animation
  fadeInDuration: 200,
  springConfig: { damping: 12, stiffness: 100 },
  staggerDelay: 50,
} as const;
