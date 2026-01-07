import { useState, useEffect, useCallback } from 'react';
import { Keyboard, Modal, Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

/**
 * Props for the TimePickerModal component.
 */
export interface TimePickerModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Initial time to display when the modal opens */
  initialTime: Date;
  /** Called when user confirms their selection */
  onConfirm: (time: Date) => void;
  /** Called when user cancels/dismisses the modal */
  onCancel: () => void;
  /** Optional title for the modal header (iOS only) */
  title?: string;
}

/**
 * TimePickerModal - Native time picker with consistent cross-platform behavior.
 *
 * Features:
 * - iOS: Modal with spinner wheel picker and confirm/cancel buttons
 * - Android: Native clock picker (handles its own modal)
 * - Dismisses keyboard when opened
 * - Haptic feedback on confirm
 * - Accessible labels for screen readers
 * - Resets to initial time when modal opens
 *
 * Usage:
 * ```tsx
 * <TimePickerModal
 *   visible={showTimePicker}
 *   initialTime={reminderTime}
 *   onConfirm={(time) => {
 *     setReminderTime(time);
 *     setShowTimePicker(false);
 *   }}
 *   onCancel={() => setShowTimePicker(false)}
 * />
 * ```
 */
export const TimePickerModal = ({
  visible,
  initialTime,
  onConfirm,
  onCancel,
  title = 'Set Reminder Time',
}: TimePickerModalProps) => {
  // Local state for the selected time (iOS needs this for preview before confirm)
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const { triggerSelection } = useHapticFeedback();

  // Reset to initial time when modal opens and dismiss keyboard
  useEffect(() => {
    if (visible) {
      setSelectedTime(initialTime);
      Keyboard.dismiss();
    }
  }, [visible, initialTime]);

  // Handle time change from picker
  const handleTimeChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS === 'android') {
        // Android: onChange fires on confirm AND dismiss
        // event.type is 'set' for confirm, 'dismissed' for cancel
        if (event.type === 'set' && date) {
          triggerSelection();
          onConfirm(date);
        } else {
          onCancel();
        }
      } else {
        // iOS: onChange fires as user scrolls, just update local state
        if (date) {
          setSelectedTime(date);
        }
      }
    },
    [onConfirm, onCancel, triggerSelection]
  );

  // Handle iOS confirm button
  const handleConfirm = useCallback(() => {
    triggerSelection();
    onConfirm(selectedTime);
  }, [selectedTime, onConfirm, triggerSelection]);

  // Handle iOS cancel button
  const handleCancel = useCallback(() => {
    triggerSelection();
    onCancel();
  }, [onCancel, triggerSelection]);

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
    <Modal
      transparent
      animationType='fade'
      testID='time-picker-modal'
      visible={visible}
      onRequestClose={handleCancel}
    >
      {/* Backdrop - tap to dismiss */}
      <Pressable
        accessibilityLabel='Dismiss time picker'
        accessibilityRole='button'
        className='flex-1 items-center justify-center bg-black/50'
        onPress={handleCancel}
      >
        {/* Modal content - prevent tap propagation */}
        <Pressable
          className='mx-6 w-full max-w-sm rounded-2xl bg-white p-5'
          onPress={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <Text
            accessibilityRole='header'
            className='mb-4 text-center text-lg font-semibold text-stone-900'
          >
            {title}
          </Text>

          {/* Time Picker */}
          <View
            accessibilityLabel='Time picker wheel'
            className='mb-5 items-center'
          >
            <DateTimePicker
              display='spinner'
              is24Hour={false}
              mode='time'
              testID='time-picker-ios'
              textColor='#1c1917'
              value={selectedTime}
              onChange={handleTimeChange}
            />
          </View>

          {/* Action Buttons */}
          <View className='flex-row gap-3'>
            <Pressable
              accessibilityLabel='Cancel'
              accessibilityRole='button'
              className='h-12 flex-1 items-center justify-center rounded-xl bg-stone-100 active:bg-stone-200'
              onPress={handleCancel}
            >
              <Text className='text-base font-semibold text-stone-700'>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              accessibilityLabel={`Set time to ${selectedTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
              accessibilityRole='button'
              className='h-12 flex-1 items-center justify-center rounded-xl bg-emerald-500 active:bg-emerald-600'
              onPress={handleConfirm}
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
};

export default TimePickerModal;
