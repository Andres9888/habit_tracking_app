/**
 * Constants for TemplatePreviewModal
 */

import { FadeInUp } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';

/** Default fallback color when iconColor is missing or invalid */
export const DEFAULT_ICON_COLOR = '#78716c';

/** Available colors for icon customization */
export const ICON_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DFE6E9',
  '#A29BFE',
  '#FD79A8',
] as const;

/** Ensure color is valid, fallback to default if empty/undefined */
export const safeColor = (color: string | undefined): string => {
  return color && color.trim() !== '' ? color : DEFAULT_ICON_COLOR;
};

/** Staggered entrance animation for sheet sections */
export const entrance = (delay: number) =>
  FadeInUp.delay(delay).duration(durations.enter).easing(enterEasing);
