import { shadows } from '../../../theme/spacing';

export const buttonShadow = {
  ...shadows.floatingActionButton,
} as const;

export const iconShadow = {
  elevation: 6,
  shadowColor: '#2D2A26',
  shadowOffset: { height: 6, width: 0 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
} as const;
