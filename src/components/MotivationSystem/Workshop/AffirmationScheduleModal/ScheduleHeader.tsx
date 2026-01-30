/**
 * ScheduleHeader Component
 * Modal header with title and close button
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Bell, X } from 'lucide-react-native';

interface ScheduleHeaderProps {
  onClose: () => void;
}

export function ScheduleHeader({ onClose }: ScheduleHeaderProps) {
  return (
    <View className='flex-row items-center justify-between border-b border-stone-100 px-4 pb-4 pt-6'>
      <View className='flex-row items-center gap-3'>
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-amber-100'>
          <Bell className='text-amber-600' size={20} />
        </View>
        <View>
          <Text className='text-lg font-bold text-stone-800'>
            Schedule Delivery
          </Text>
          <Text className='text-xs text-stone-500'>
            Get reminders with your affirmation
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel='Close'
        className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
        onPress={onClose}
      >
        <X className='text-stone-500' size={20} />
      </Pressable>
    </View>
  );
}

export default ScheduleHeader;
