import type { ViewStyle } from 'react-native';

/**
 * Replacement for StyleSheet.absoluteFillObject, removed in RN 0.86.
 * Spreadable plain object — unlike StyleSheet.absoluteFill, which is a
 * registered style and cannot be spread.
 */
export const absoluteFillObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
} as const satisfies ViewStyle;
