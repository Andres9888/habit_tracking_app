import { shadows } from '../../../theme/spacing';

export const buttonShadow = {
  ...shadows.floatingActionButton,
} as const;

/** Decorative shadow for hero icon — intentionally stronger than card shadow */
export const iconShadow = {
  ...shadows.floatingActionButton,
  shadowOpacity: 0.12,
} as const;
