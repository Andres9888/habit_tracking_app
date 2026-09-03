/** Style helpers for CardHeader — icon container, title column, and chevron color. */

import { Platform, TextStyle, ViewStyle } from 'react-native';
import { colors } from '@/theme';
import { getCardIconSize } from './cardLayout.constants';

/** Build the icon container style with accent-tinted shadow. */
export function getIconContainerStyle(
  iconBg: string,
  accentColor: string
): ViewStyle {
  return {
    backgroundColor: iconBg,
    borderColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
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

export function getChevronColor(): string {
  return colors.gray[400]; // AA contrast; gray[300] is the disabled token
}
