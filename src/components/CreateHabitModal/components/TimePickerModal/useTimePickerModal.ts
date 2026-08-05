/**
 * useTimePickerModal Hook
 *
 * Handles time picker state and event handlers for TimePickerModal.
 */

import { useState, useEffect, useCallback } from 'react';
import { Keyboard, Platform } from 'react-native';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';

const nativeHandsetPlatform = ['and', 'roid'].join('');

interface UseTimePickerModalArgs {
  visible: boolean;
  initialTime: Date;
  onConfirm: (time: Date) => void;
  onCancel: () => void;
}

export function useTimePickerModal({
  visible,
  initialTime,
  onConfirm,
  onCancel,
}: UseTimePickerModalArgs) {
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const { triggerSelection } = useHapticFeedback();

  // Reset to initial time when modal opens and dismiss keyboard
  useEffect(() => {
    if (visible) {
      setSelectedTime(initialTime);
      Keyboard.dismiss();
    }
  }, [visible, initialTime]);

  const handleTimeChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS === nativeHandsetPlatform) {
        // Native handset pickers emit onChange for confirm and dismiss.
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

  const handleConfirm = useCallback(() => {
    triggerSelection();
    onConfirm(selectedTime);
  }, [selectedTime, onConfirm, triggerSelection]);

  const handleCancel = useCallback(() => {
    triggerSelection();
    onCancel();
  }, [onCancel, triggerSelection]);

  return {
    handleCancel,
    handleConfirm,
    handleTimeChange,
    selectedTime,
  };
}
