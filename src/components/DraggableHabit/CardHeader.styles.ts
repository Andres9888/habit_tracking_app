/** Style helpers for CardHeader — icon container, title overlay, and chevron color. */

import { ViewStyle } from 'react-native';
import { colors } from '@/theme';

/** Build the icon container style with accent-tinted shadow and high-contrast border. */
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
  paddingLeft: 8,
  paddingRight: 12,
  position: 'absolute',
  right: 12,
  top: 0,
};

/**
 * Quiet disclosure chevron color.
 *
 * Normal mode uses a soft warm gray (the standard "row opens" cue, kept
 * deliberately low-emphasis). High-contrast mode bumps to a visible streak tone.
 */
export function getChevronColor(
  highContrastMode: boolean,
  _accentColor?: string
): string {
  if (highContrastMode) return colors.streak[300];
  return colors.gray[300];
}
