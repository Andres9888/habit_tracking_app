/**
 * DismissButton Component
 *
 * "✕" button to dismiss error message.
 */

import { Pressable, Text } from 'react-native';

import { ERROR_COLORS_LIGHT, ERROR_COLORS_DARK } from './constants';

interface DismissButtonProps {
  onPress: () => void;
  isDark?: boolean;
}

export function DismissButton({ onPress, isDark = false }: DismissButtonProps) {
  const errorColors = isDark ? ERROR_COLORS_DARK : ERROR_COLORS_LIGHT;

  return (
    <Pressable
      accessibilityHint='Tap to dismiss the error message'
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
          color: errorColors.dismissText,
          fontSize: 17,
          fontWeight: '500',
          lineHeight: 22,
        }}
      >
        ✕
      </Text>
    </Pressable>
  );
}
