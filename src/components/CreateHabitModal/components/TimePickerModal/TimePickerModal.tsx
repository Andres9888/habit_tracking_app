/**
 * TimePickerModal - Native time picker with consistent cross-platform behavior.
 *
 * Features:
 * - iOS: Modal with spinner wheel picker and confirm/cancel buttons
 * - Android: Native clock picker (handles its own modal)
 */

import { Platform } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import type { TimePickerModalProps } from './types';
import { IOSTimePicker } from './IOSTimePicker';
import { useTimePickerModal } from './useTimePickerModal';

export const TimePickerModal = ({
  visible,
  initialTime,
  onConfirm,
  onCancel,
  title = 'Set Reminder Time',
}: TimePickerModalProps) => {
  const { selectedTime, handleTimeChange, handleConfirm, handleCancel } =
    useTimePickerModal({ initialTime, onCancel, onConfirm, visible });

  // Android: DateTimePicker handles its own modal UI
  if (Platform.OS === 'android') {
    if (!visible) return null;

    return (
      <DateTimePicker
        display='clock'
        is24Hour={false}
        mode='time'
        testID='time-picker-android'
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
