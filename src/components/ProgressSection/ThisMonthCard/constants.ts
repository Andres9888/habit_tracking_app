/**
 * ThisMonthCard Constants
 */

import { springs } from '@/theme/animations';

// Day labels for the bar chart
export const DAY_LABELS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

// Animation configuration
export const BAR_ANIMATION = {
  // ms between each bar animation
  fadeInDuration: 200,
  springConfig: springs.gentle,
  staggerDelay: 50,
};
