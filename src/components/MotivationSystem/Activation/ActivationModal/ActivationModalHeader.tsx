
import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { Zap, X } from 'lucide-react-native';

interface ActivationModalHeaderProps {
  onClose: () => void;
}

/**
 * ActivationModalHeader - Header with title and close button
 */
export function ActivationModalHeader({ onClose }: ActivationModalHeaderProps) {
  return (
    <View className='flex-row items-center justify-between px-4 py-3'>
      <View className='flex-row items-center gap-2'>
        <Zap className='text-amber-500' size={20} />
        <Text className='text-lg font-bold text-stone-800'>Time to Build</Text>
      </View>
      <Pressable
        accessibilityLabel='Close activation modal'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-stone-200/50'
        onPress={onClose}
      >
        <X className='text-stone-600' size={24} />
      </Pressable>
    </View>
  );
}
