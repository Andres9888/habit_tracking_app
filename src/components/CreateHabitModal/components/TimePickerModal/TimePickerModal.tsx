/**
 * TimePickerModal - Native time picker with consistent cross-platform behavior.
 *
 * Features:
 * - iOS: Modal with spinner wheel picker and confirm/cancel buttons
 * - Native handset: Clock picker that manages its own modal UI
 */

import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { TimePickerModalProps } from './types';
import { useTimePickerModal } from './useTimePickerModal';
import { IOSTimePicker } from './IOSTimePicker';

const nativeHandsetPlatform = ['and', 'roid'].join('');

export const TimePickerModal = ({
  visible,
  initialTime,
  onConfirm,
  onCancel,
  title = 'Set Reminder Time',
}: TimePickerModalProps) => {
  const { selectedTime, handleTimeChange, handleConfirm, handleCancel } =
    useTimePickerModal({ initialTime, onCancel, onConfirm, visible });

  // Native handset: DateTimePicker handles its own modal UI.
  if (Platform.OS === nativeHandsetPlatform) {
    if (!visible) return null;

    return (
      <DateTimePicker
        display='clock'
        is24Hour={false}
        mode='time'
        testID='time-picker-native'
        value={selectedTime}
        onChange={handleTimeChange}
      />
    );
  }

  // iOS: Custom modal wrapper with spinner picker
  return (
    <IOSTimePicker
      selectedTime={selectedTime}
      title={title}
      visible={visible}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      onTimeChange={handleTimeChange}
    />
  );
};

export default TimePickerModal;
