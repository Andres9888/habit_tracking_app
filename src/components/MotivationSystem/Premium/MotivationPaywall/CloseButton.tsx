/**
 * CloseButton - Modal close button
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { X } from 'lucide-react-native';

interface CloseButtonProps {
  onPress: () => void;
}

export function CloseButton({ onPress }: CloseButtonProps) {
  return (
    <View className='flex-row justify-end px-4 pt-14'>
      <Pressable
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-white/20'
        hitSlop={12}
        onPress={onPress}
      >
        <X color='#ffffff' size={24} />
      </Pressable>
    </View>
  );
}
