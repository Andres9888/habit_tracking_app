/**
 * ActionButton - Styled button for the StreakRecoveryModal
 */

import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

interface ActionButtonProps {
  label: string;
  color: string;
  onPress: () => void;
  variant?: 'filled' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export function ActionButton({
  label,
  color,
  onPress,
  variant = 'filled',
  loading = false,
  disabled = false,
}: ActionButtonProps) {
  const isFilled = variant === 'filled';

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: isFilled ? color : 'transparent',
        borderColor: color,
        borderRadius: 12,
        borderWidth: isFilled ? 0 : 1.5,
        opacity: pressed ? 0.85 : disabled ? 0.5 : 1,
        paddingHorizontal: 20,
        paddingVertical: 12,
      })}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? '#fff' : color} size="small" />
      ) : (
        <Text
          style={{
            color: isFilled ? '#fff' : color,
            fontSize: 15,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
