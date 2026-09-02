/** Streak reminder row hooks — Android dialog visibility + time commit. */
import { useState } from 'react';
import { Platform } from 'react-native';
import { dateToTimeString } from '../timeHelpers';

/** Curried DateTimePicker `onChange`. Android's native dialog commits as soon
 *  as the user confirms and dismisses itself, so it closes here; iOS commits
 *  from the sheet's Done button instead. */
export function handleTimeChange(
  onChangeTime: (time: string) => void | Promise<void>,
  setShowTimePicker: (v: boolean) => void
) {
  return (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selectedDate) void onChangeTime(dateToTimeString(selectedDate));
  };
}

export function useTimePickerState() {
  const [showTimePicker, setShowTimePicker] = useState(false);
  return { setShowTimePicker, showTimePicker };
}
