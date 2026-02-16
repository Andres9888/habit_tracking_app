import { colors } from '../../../theme/colors';

export const buttonShadow = {
  elevation: 4,
  shadowColor: '#1c1917',
  shadowOffset: { height: 4, width: 0 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
} as const;

export const iconShadow = {
  elevation: 6,
  shadowOffset: { height: 6, width: 0 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
} as const;

export const streakShadowLight = {
  backgroundColor: '#ecfdf5',
  shadowColor: colors.primary[600],
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
} as const;

export const streakShadowDark = {
  backgroundColor: 'rgba(5, 150, 105, 0.15)',
  shadowColor: colors.primary[600],
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
} as const;
