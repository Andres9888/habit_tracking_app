/**
 * Icon Size System - Habit Tracking App
 *
 * Standard icon sizes aligned with typography scale.
 * Use these tokens for all icon `size` props.
 *
 * Micro (10): Badge-inline icons paired with 10px text (trend arrows, badge icons)
 * Small (16): Inline with caption text, metadata indicators, chevrons
 * Medium (20): Standard inline icons, list items, action buttons
 * Large (24): Primary action icons, navigation, close/dismiss buttons
 * XL (32): Feature icons, hero illustrations, step indicators
 * XXL (48): Empty state illustrations, large feature icons
 */

export const iconSizes = {
  /** Primary action icons, navigation, close/dismiss */
  large: 24,

  /** Standard inline icons, list items, action buttons */
  medium: 20,

  /** Badge-inline: trend arrows, premium badges, micro indicators */
  micro: 10,

  /** Inline with caption text, metadata indicators, chevrons */
  small: 16,
  /** Feature icons, hero illustrations */
  xl: 32,
  /** Empty state illustrations */
  xxl: 48,
} as const;

export type IconSize = keyof typeof iconSizes;
