import React from 'react';
import { View, Text } from 'react-native';
import { Clock } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

interface CueReminderProps {
  time?: string;
  location?: string;
  afterBehavior?: string;
}

/**
 * CueReminder - When/Where/After trigger reminder
 */
export function CueReminder({
  time,
  location,
  afterBehavior,
}: CueReminderProps) {
  const hasAnyCue = time || location || afterBehavior;
  if (!hasAnyCue) return null;

  return (
    <View className='rounded-2xl bg-sky-50 p-4'>
      <View className='mb-2 flex-row items-center gap-2'>
        <View className='h-8 w-8 items-center justify-center rounded-lg bg-sky-100'>
          <Clock className='text-sky-600' size={iconSizes.small} />
        </View>
        <Text className='font-semibold text-sky-800'>Your Cue</Text>
      </View>
      <View className='gap-1'>
        {time ? <Text className='text-sm text-sky-700'>
            <Text className='font-medium'>When: </Text>
            {time}
          </Text> : null}
        {location ? <Text className='text-sm text-sky-700'>
            <Text className='font-medium'>Where: </Text>
            {location}
          </Text> : null}
        {afterBehavior ? <Text className='text-sm text-sky-700'>
            <Text className='font-medium'>After: </Text>
            {afterBehavior}
          </Text> : null}
      </View>
    </View>
  );
}
