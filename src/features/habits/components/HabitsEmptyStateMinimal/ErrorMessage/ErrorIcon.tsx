/**
 * ErrorIcon Component
 *
 * Red circle with "!" exclamation mark.
 */

import { View, Text } from 'react-native';
import { fontFamilies } from '@/theme/typography';

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
          fontFamily: fontFamilies.primary.text,
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
