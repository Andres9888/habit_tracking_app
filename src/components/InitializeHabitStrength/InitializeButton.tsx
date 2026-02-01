/**
 * InitializeButton - Button to trigger habit strength initialization
 */

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';

interface InitializeButtonProps {
  habitCount: number;
  isInitializing: boolean;
  onPress: () => void;
}

export function InitializeButton({
  habitCount,
  isInitializing,
  onPress,
}: InitializeButtonProps) {
  return (
    <Pressable
      accessibilityLabel='Initialize habit strength'
      accessibilityRole='button'
      accessibilityState={{ disabled: isInitializing }}
      className={`rounded-lg px-4 py-3 ${
        isInitializing ? 'bg-blue-300' : 'bg-blue-500'
      }`}
      disabled={isInitializing}
      style={({ pressed }) => ({ opacity: pressed && !isInitializing ? 0.8 : 1 })}
      onPress={onPress}
    >
      {isInitializing ? (
        <View className='flex-row items-center justify-center gap-2'>
          <ActivityIndicator color='white' />
          <Text className='font-semibold text-white'>
            Initializing... ({habitCount} habits)
          </Text>
        </View>
      ) : (
        <Text className='text-center font-semibold text-white'>
          Initialize Now
        </Text>
      )}
    </Pressable>
  );
}
