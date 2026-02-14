/**
 * useScheduleHandlers Hook
 * Event handlers for schedule form interactions
 */

import { triggerHaptic } from '@/utils/haptics';
import { useCallback, Dispatch, SetStateAction } from 'react';
import { Platform } from 'react-native';

export function useScheduleHandlers(
  setDaysOfWeek: Dispatch<SetStateAction<number[]>>,
  setShowTimePicker: Dispatch<SetStateAction<boolean>>,
  setTime: Dispatch<SetStateAction<Date>>,
  setIsEnabled: Dispatch<SetStateAction<boolean>>
) {
  const handleToggleDay = useCallback(
    (day: number) => {
      setDaysOfWeek((prev) => {
        if (prev.includes(day)) {
          if (prev.length === 1) return prev;
          return prev.filter((d) => d !== day);
        }
        return [...prev, day].sort((a, b) => a - b);
      });
    },
    [setDaysOfWeek]
  );

  const handleTimeChange = useCallback(
    (_: unknown, selectedTime?: Date) => {
      if (Platform.OS === 'android') {
        setShowTimePicker(false);
      }
      if (selectedTime) {
        setTime(selectedTime);
      }
    },
    [setShowTimePicker, setTime]
  );

  const handleToggleEnabled = useCallback(
    (value: boolean) => {
      triggerHaptic('tap');
      setIsEnabled(value);
    },
    [setIsEnabled]
  );

  return {
    handleTimeChange,
    handleToggleDay,
    handleToggleEnabled,
  };
}
