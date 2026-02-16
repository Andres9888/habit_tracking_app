/**
 * ErrorIcon Component
 *
 * Red circle with "!" exclamation mark.
 */

import { View, Text } from 'react-native';

interface ErrorIconProps {
  iconColor?: string;
}

export function ErrorIcon({ iconColor = '#EF4444' }: ErrorIconProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: iconColor,
        borderRadius: 12,
        height: 20,
        justifyContent: 'center',
        width: 20,
      }}
    >
      <Text
        style={{
          color: '#FFFFFF',
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
