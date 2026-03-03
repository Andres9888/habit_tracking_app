import { ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

/** Yellow-400 — high-contrast chevron for accessibility visibility */
const HIGH_CONTRAST_CHEVRON = '#facc15';

export function getIconContainerStyle(
  iconBg: string,
  accentColor: string,
  highContrastMode: boolean
): ViewStyle {
  return {
    backgroundColor: iconBg,
    borderColor: highContrastMode ? colors.gray[900] : 'rgba(0,0,0,0.04)',
    borderWidth: highContrastMode ? 2 : 1,
    shadowColor: accentColor,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  };
}

export const TITLE_OVERLAY_STYLE: ViewStyle = {
  bottom: 0,
  justifyContent: 'center',
  left: '20%',
  paddingLeft: spacing.sm,
  paddingRight: spacing.md,
  position: 'absolute',
  right: spacing.md,
  top: 0,
};

export function getChevronColor(highContrastMode: boolean): string {
  return highContrastMode ? HIGH_CONTRAST_CHEVRON : colors.text.tertiary;
}
