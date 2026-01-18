import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';

interface SheetHeaderProps {
  habitName: string;
  habitIcon?: string;
  onClose: () => void;
}

export const SheetHeader = ({
  habitName,
  habitIcon,
  onClose,
}: SheetHeaderProps) => {
  return (
    <View className='flex-row items-center justify-between border-b border-stone-100 px-5 py-4'>
      <View className='flex-row items-center gap-3'>
        {habitIcon && <Text className='text-2xl'>{habitIcon}</Text>}
        <View>
          <Text className='text-lg font-bold text-stone-900'>
            Quick Actions
          </Text>
          <Text className='text-xs text-stone-500'>{habitName}</Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel='Close'
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200'
        onPress={onClose}
      >
        <X className='text-stone-600' size={20} />
      </Pressable>
    </View>
  );
};
