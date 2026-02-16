/**
 * DismissButton Component
 *
 * "✕" button to dismiss error message.
 */

import { Pressable, Text } from 'react-native';

interface DismissButtonProps {
  onPress: () => void;
  dismissColor?: string;
}

export function DismissButton({
  onPress,
  dismissColor = '#DC2626',
}: DismissButtonProps) {
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
          color: dismissColor,
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
