import { ViewStyle } from 'react-native';
import type { SemanticColors } from '../../theme/darkColors';

export function getIconContainerStyle(
  iconBg: string,
  accentColor: string,
  highContrastMode: boolean,
  themeColors?: SemanticColors
): ViewStyle {
  const hcBorder = themeColors?.borders.highContrast ?? '#facc15';
  return {
    backgroundColor: iconBg,
    borderColor: highContrastMode ? hcBorder : 'rgba(0,0,0,0.04)',
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
  paddingLeft: 8,
  paddingRight: 12,
  position: 'absolute',
  right: 12,
  top: 0,
};

export function getChevronColor(
  highContrastMode: boolean,
  themeColors?: SemanticColors
): string {
  return highContrastMode
    ? (themeColors?.borders.highContrast ?? '#facc15')
    : (themeColors?.borders.medium ?? '#a8a29e');
}
