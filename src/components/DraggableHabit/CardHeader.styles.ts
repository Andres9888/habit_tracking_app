/** Style helpers for CardHeader — icon container, title overlay, and chevron color. */

import { ViewStyle } from 'react-native';

/** Build the icon container style with accent-tinted shadow and high-contrast border. */
export function getIconContainerStyle(
  iconBg: string,
  accentColor: string,
  highContrastMode: boolean
): ViewStyle {
  return {
    backgroundColor: iconBg,
    borderColor: highContrastMode ? '#111111' : 'rgba(0,0,0,0.04)',
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

export function getChevronColor(highContrastMode: boolean): string {
  return highContrastMode ? '#facc15' : '#a8a29e';
}
