/**
 * ErrorIcon Component
 *
 * Red circle with "!" exclamation mark.
 */

import { View, Text } from 'react-native';

import { ERROR_COLORS_LIGHT, ERROR_COLORS_DARK } from './constants';

interface ErrorIconProps {
  isDark?: boolean;
}

export function ErrorIcon({ isDark = false }: ErrorIconProps) {
  const errorColors = isDark ? ERROR_COLORS_DARK : ERROR_COLORS_LIGHT;

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: errorColors.iconBackground,
        borderRadius: 12,
        height: 20,
        justifyContent: 'center',
        width: 20,
      }}
    >
      <Text
        style={{
          color: errorColors.iconText,
          fontSize: 13,
          fontWeight: '700',
          lineHeight: 18,
        }}
      >
        !
      </Text>
    </View>
  );
}
