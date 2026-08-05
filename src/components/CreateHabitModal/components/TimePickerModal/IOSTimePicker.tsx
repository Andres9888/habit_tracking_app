/**
 * IOSTimePicker Component
 *
 * iOS-specific modal wrapper with spinner picker.
 */

import { Modal, Pressable, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface IOSTimePickerProps {
  visible: boolean;
  selectedTime: Date;
  title: string;
  onTimeChange: (event: DateTimePickerEvent, date?: Date) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function IOSTimePicker({
  visible,
  selectedTime,
  title,
  onTimeChange,
  onConfirm,
  onCancel,
}: IOSTimePickerProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='fade'
      testID='time-picker-modal'
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable
        accessibilityLabel='Dismiss time picker'
        accessibilityRole='button'
        className='flex-1 items-center justify-center bg-black/50'
        onPress={onCancel}
      >
        <Pressable
          className='mx-6 w-full max-w-sm rounded-2xl p-5'
          style={{ backgroundColor: colors.surface }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text
            accessibilityRole='header'
            className='mb-4 text-center text-lg font-semibold'
            style={{ color: colors.text.primary }}
          >
            {title}
          </Text>

          <View
            accessibilityLabel='Time picker wheel'
            className='mb-5 items-center'
          >
            <DateTimePicker
              display='spinner'
              is24Hour={false}
              mode='time'
              testID='time-picker-ios'
              textColor={colors.text.primary}
              value={selectedTime}
              onChange={onTimeChange}
            />
          </View>

          <View className='flex-row gap-3'>
            <Pressable
              accessibilityLabel='Cancel'
              accessibilityRole='button'
              className='h-12 flex-1 items-center justify-center rounded-xl'
              style={{ backgroundColor: colors.gray[200] }}
              onPress={onCancel}
            >
              <Text className='text-base font-semibold' style={{ color: colors.text.primary }}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              accessibilityLabel={`Set time to ${selectedTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
              accessibilityRole='button'
              className='h-12 flex-1 items-center justify-center rounded-xl active:opacity-90'
              style={{ backgroundColor: colors.status.success }}
              onPress={onConfirm}
            >
              <Text className='text-base font-semibold text-white'>
                Set Time
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
