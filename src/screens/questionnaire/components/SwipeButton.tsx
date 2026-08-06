/**
 * SwipeButton - Circular accept/reject button for the swipe card screen.
 */

import { Pressable, Text } from 'react-native';
import { borderRadius } from '@/theme/spacing';

interface SwipeButtonProps {
  label: string;
  color: string;
  onPress: () => void;
}

export function SwipeButton({ label, color, onPress }: SwipeButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label === '\u2713' ? 'Accept' : 'Reject'}
      onPress={onPress}
      style={{
        width: 64,
        height: 64,
        borderRadius: borderRadius.full,
        borderWidth: 2,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 28, color }}>{label}</Text>
    </Pressable>
  );
}
