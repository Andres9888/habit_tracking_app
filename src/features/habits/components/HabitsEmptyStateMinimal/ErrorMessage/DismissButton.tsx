/**
 * DismissButton Component
 *
 * "✕" button to dismiss error message.
 */

import { Pressable, Text } from 'react-native';

import { ERROR_COLORS } from './constants';

interface DismissButtonProps {
  onPress: () => void;
}

export function DismissButton({ onPress }: DismissButtonProps) {
  return (
    <Pressable
      accessibilityLabel='Dismiss error message'
      accessibilityRole='button'
      hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        padding: 4,
      })}
      onPress={onPress}
    >
      <Text
        style={{
          color: ERROR_COLORS.dismissText,
          fontSize: 18,
          fontWeight: '500',
          lineHeight: 20,
        }}
      >
        ✕
      </Text>
    </Pressable>
  );
}
