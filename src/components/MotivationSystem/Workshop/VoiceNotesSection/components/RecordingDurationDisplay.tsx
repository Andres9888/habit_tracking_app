/**
 * RecordingDurationDisplay Component
 * Shows duration with max-duration warnings
 */

import React from 'react';
import { View, Text } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { clsx } from 'clsx';

interface RecordingDurationDisplayProps {
  formattedDuration: string;
  isMaxDurationReached: boolean;
  isApproachingMaxDuration: boolean;
  secondsUntilMaxDuration: number | null;
}

export function RecordingDurationDisplay({
  formattedDuration,
  isMaxDurationReached,
  isApproachingMaxDuration,
  secondsUntilMaxDuration,
}: RecordingDurationDisplayProps) {
  return (
    <View className='items-center gap-1'>
      <View className='flex-row items-center gap-2'>
        <Text
          className={clsx(
            'text-2xl font-bold',
            isMaxDurationReached
              ? 'text-rose-500'
              : isApproachingMaxDuration
                ? 'text-amber-600'
                : 'text-stone-800'
          )}
        >
          {formattedDuration}
        </Text>
        {isMaxDurationReached ? <Text className='text-xs text-rose-500'>Max reached</Text> : null}
      </View>
      {isApproachingMaxDuration && !isMaxDurationReached ? <View className='flex-row items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1'>
          <AlertCircle className='text-amber-600' size={14} />
          <Text className='text-xs font-medium text-amber-700'>
            {secondsUntilMaxDuration !== null && secondsUntilMaxDuration > 0
              ? `${secondsUntilMaxDuration}s remaining`
              : 'Wrapping up...'}
          </Text>
        </View> : null}
    </View>
  );
}
