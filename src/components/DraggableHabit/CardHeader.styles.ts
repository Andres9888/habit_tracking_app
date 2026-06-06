/** Style helpers for CardHeader — icon container, title column, and chevron color. */

import { Platform, TextStyle, ViewStyle } from 'react-native';
import { colors } from '@/theme';
import { getCardIconSize } from './cardLayout.constants';

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

export function getTitleColumnStyle(isCompactMode?: boolean): ViewStyle {
  const iconSize = getCardIconSize(isCompactMode);
  return {
    justifyContent: 'center',
    minHeight: iconSize,
  };
}

export function getEmojiTextStyle(isCompactMode?: boolean): TextStyle {
  const iconSize = getCardIconSize(isCompactMode);
  return {
    fontSize: isCompactMode ? 18 : 24,
    includeFontPadding: false,
    lineHeight: iconSize,
    textAlign: 'center',
    ...(Platform.OS === 'android'
      ? { textAlignVertical: 'center' as const }
      : {}),
  };
}

export function getTitleTextStyle(isCompactMode?: boolean): TextStyle {
  return {
    fontSize: 16,
    fontWeight: isCompactMode ? '600' : '700',
    includeFontPadding: false,
    letterSpacing: -0.3,
    lineHeight: isCompactMode ? 20 : 22,
    ...(Platform.OS === 'android'
      ? { textAlignVertical: 'center' as const }
      : {}),
  };
}

export function getChevronColor(highContrastMode: boolean): string {
  return highContrastMode ? colors.streak[300] : colors.gray[300];
}
