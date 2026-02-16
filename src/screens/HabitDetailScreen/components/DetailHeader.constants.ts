// DetailHeader.constants.ts — These are legacy static constants
// Components should use useThemeColors() instead

import { colors } from '../../../theme/colors';

export const buttonShadow = {
  elevation: 4,
  shadowColor: colors.gray[800], // Static fallback - prefer theme
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

export const streakShadow = {
  backgroundColor: colors.primary[100], // Light emerald for streak badge
  shadowColor: colors.primary[600],
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
} as const;
