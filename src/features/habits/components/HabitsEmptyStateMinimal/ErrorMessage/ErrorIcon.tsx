/**
 * ErrorIcon Component
 *
 * Red circle with "!" exclamation mark.
 */

import { View, Text } from 'react-native';

import { ERROR_COLORS } from './constants';

export function ErrorIcon() {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: ERROR_COLORS.iconBackground,
        borderRadius: 12,
        height: 20,
        justifyContent: 'center',
        width: 20,
      }}
    >
      <Text
        style={{
          color: ERROR_COLORS.iconText,
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
