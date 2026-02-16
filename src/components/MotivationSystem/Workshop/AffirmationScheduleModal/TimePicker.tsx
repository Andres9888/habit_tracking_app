/**
 * TimePicker Component
 * Time selection UI with platform-specific handling
 */

import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native';
import { clsx } from 'clsx';
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  const { colors, isDark } = useThemeColors();

  return (
    <View className='mb-6'>
      <Text className='mb-3 text-xs font-semibold uppercase tracking-wide' style={{ color: colors.text.secondary }}>
        Delivery Time
      </Text>
      {Platform.OS === 'android' && !showPicker && (
        <Pressable
          accessibilityLabel='Select time'
          className='flex-row items-center justify-between rounded-xl border-2 px-4 py-3'
          style={{
            borderColor: colors.primary[300],
            backgroundColor: colors.card,
          }}
          onPress={onShowPicker}
        >
          <View className='flex-row items-center gap-3'>
            <Clock color={colors.primary[500]} size={20} />
            <Text className='text-lg font-medium' style={{ color: colors.text.primary }}>
              {formatTimeForDisplay(formatDateToTime(time))}
            </Text>
          </View>
          <Text className='text-sm' style={{ color: colors.primary[500] }}>Change</Text>
        </Pressable>
      )}
      {showPicker && (
        <View
          className={clsx(
            'rounded-xl',
            Platform.OS === 'android' && 'items-center py-2'
          )}
          style={{
            backgroundColor: isDark ? colors.gray[800] : colors.card,
          }}
        >
          <DateTimePicker
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            mode='time'
            style={isDark ? { backgroundColor: colors.gray[800] } : undefined}
            testID='time-picker'
            textColor={isDark ? colors.text.primary : undefined}
            value={time}
            onChange={onTimeChange}
          />
        </View>
      )}
    </View>
  );
}

export default TimePicker;
