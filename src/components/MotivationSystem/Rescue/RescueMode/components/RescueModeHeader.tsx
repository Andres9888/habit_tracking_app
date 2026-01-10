import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';

interface RescueModeHeaderProps {
  onClose: () => void;
}

/**
 * RescueModeHeader - Top header bar with emergency styling
 */
export function RescueModeHeader({ onClose }: RescueModeHeaderProps) {
  return (
    <View className='flex-row items-center justify-between px-4 py-3'>
      <View className='flex-row items-center gap-2'>
        <AlertTriangle className='text-rose-500' size={20} />
        <Text className='text-lg font-bold text-rose-700'>🆘 Rescue Mode</Text>
      </View>
      <Pressable
        accessibilityLabel='Close rescue mode'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-stone-200/50'
        onPress={onClose}
      >
        <X className='text-stone-600' size={20} />
      </Pressable>
    </View>
  );
}
