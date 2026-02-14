import { shadows } from '../../../theme/spacing';

export const buttonShadow = {
  elevation: 4,
  ...shadows.floatingActionButton,
} as const;

export const iconShadow = {
  elevation: 6,
  shadowOffset: { height: 6, width: 0 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
} as const;

export const streakShadow = {
  backgroundColor: '#ecfdf5',
  shadowColor: '#059669',
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
} as const;
