/**
 * ModalHeader - Header section with title and close button
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { PartyPopper, X } from 'lucide-react-native';

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <View className='flex-row items-center justify-between px-4 py-3'>
      <View className='flex-row items-center gap-2'>
        <PartyPopper className='text-emerald-500' size={20} />
        <Text className='text-lg font-bold text-emerald-700'>Celebration</Text>
      </View>
      <Pressable
        accessibilityLabel='Close celebration'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-stone-200/50'
        onPress={onClose}
      >
        <X className='text-stone-600' size={24} />
      </Pressable>
    </View>
  );
}
