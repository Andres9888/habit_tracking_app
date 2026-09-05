/**
 * State for the Daily reminder panel row.
 *
 * Wraps the existing `useReminderSelector` (permission check, snap-to-preset on
 * enable, haptics, a11y announcements) and adds the two things the panel row
 * needs on top: opening/closing the row from the Switch, and the iOS inline
 * time wheel. Android keeps the existing `TimePickerModal`.
 */
import { useCallback, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { DEFAULT_PRESETS } from '@/components/CreateHabitModal/components/EnhancedReminderSelector/constants';
import type { ReminderPreset } from '@/components/CreateHabitModal/components/EnhancedReminderSelector/types';
import { useReminderSelector } from '@/components/CreateHabitModal/components/EnhancedReminderSelector/useReminderSelector';
import { triggerHaptic } from '@/utils/haptics';
import type { ReminderRowLayoutProps } from './ReminderRow.types';

const NATIVE_HANDSET = ['and', 'roid'].join('');

export function useReminderRow({
  reminder,
  open,
  onToggleOpen,
}: ReminderRowLayoutProps) {
  const [wheelOpen, setWheelOpen] = useState(false);
  const selector = useReminderSelector({
    onTimeChange: reminder.onTimeChange,
    onToggle: reminder.onToggle,
    presets: DEFAULT_PRESETS,
    reminderTime: reminder.reminderTime,
    snapDefaultToPresetOnEnable: reminder.snapDefaultToPresetOnEnable ?? false,
  });
  const { handleCustomTimePress, handlePresetSelect, handleToggle } = selector;

  // Switch ON also opens the row; OFF closes it and keeps the chosen time.
  const handleSwitch = useCallback(
    (value: boolean) => {
      void handleToggle(value);
      if (value) {
        if (!open) onToggleOpen();
        return;
      }
      setWheelOpen(false);
      if (open) onToggleOpen();
    },
    [handleToggle, onToggleOpen, open]
  );

  const handlePreset = useCallback(
    (preset: ReminderPreset) => {
      setWheelOpen(false);
      handlePresetSelect(preset);
    },
    [handlePresetSelect]
  );

  const handleCustom = useCallback(() => {
    if (Platform.OS === NATIVE_HANDSET) {
      handleCustomTimePress();
      return;
    }
    Keyboard.dismiss();
    void triggerHaptic('selection');
    setWheelOpen(true);
  }, [handleCustomTimePress]);

  return {
    customLabel: selector.isCustomTime ? selector.customTimeLabel : 'PICK',
    customSelected: selector.isCustomTime || wheelOpen,
    handleCustom,
    handleCustomTimeConfirm: selector.handleCustomTimeConfirm,
    handlePreset,
    handleSwitch,
    handleWheelChange: reminder.onTimeChange,
    permissionDenied: reminder.enabled && selector.permissionDenied,
    selectedPreset: selector.selectedPreset,
    setShowTimePicker: selector.setShowTimePicker,
    showTimePicker: selector.showTimePicker,
    wheelOpen: wheelOpen && Platform.OS !== NATIVE_HANDSET,
  };
}
