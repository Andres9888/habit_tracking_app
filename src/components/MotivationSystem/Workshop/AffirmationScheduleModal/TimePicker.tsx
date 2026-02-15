/**
 * TimePicker Component
 * Time selection UI with platform-specific handling
 */

import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native';
import { clsx } from 'clsx';

import { formatDateToTime, formatTimeForDisplay } from './timeUtils';

interface TimePickerProps {
  time: Date;
  showPicker: boolean;
  onShowPicker: () => void;
  onTimeChange: (event: unknown, date?: Date) => void;
}

export function TimePicker({
  time,
  showPicker,
  onShowPicker,
  onTimeChange,
}: TimePickerProps) {
  return (
    <View className='mb-6'>
      <Text className='mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400'>
        Delivery Time
      </Text>
      {Platform.OS === 'android' && !showPicker && (
        <Pressable
          accessibilityLabel='Select time'
          className='flex-row items-center justify-between rounded-xl border-2 border-amber-200 bg-white px-4 py-3'
          onPress={onShowPicker}
        >
          <View className='flex-row items-center gap-3'>
            <Clock className='text-amber-500' size={20} />
            <Text className='text-lg font-medium text-stone-800'>
              {formatTimeForDisplay(formatDateToTime(time))}
            </Text>
          </View>
          <Text className='text-sm text-amber-600'>Change</Text>
        </Pressable>
      )}
      {showPicker && (
        <View
          className={clsx(
            'rounded-xl bg-white',
            Platform.OS === 'android' && 'items-center py-2'
          )}
        >
          <DateTimePicker
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            mode='time'
            testID='time-picker'
            value={time}
            onChange={onTimeChange}
          />
        </View>
      )}
    </View>
  );
}

export default TimePicker;
