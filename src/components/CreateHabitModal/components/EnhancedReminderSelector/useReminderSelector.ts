/**
 * Hook for EnhancedReminderSelector logic
 */

import { useCallback, useMemo, useState } from 'react';
import { AccessibilityInfo, Keyboard, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { formatReminderTime } from '../../../../utils/notifications';
import type { ReminderPreset } from './types';

interface UseReminderSelectorParams {
  reminderTime: Date;
  presets: ReminderPreset[];
  onTimeChange: (time: Date) => void;
  onToggle: (enabled: boolean) => void;
}

export function useReminderSelector({
  reminderTime,
  presets,
  onTimeChange,
  onToggle,
}: UseReminderSelectorParams) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const { triggerSelection } = useHapticFeedback();

  const selectedPreset = useMemo(() => {
    const hour = reminderTime.getHours();
    const minute = reminderTime.getMinutes();
    return (
      presets.find((p) => p.hour === hour && p.minute === minute)?.id || null
    );
  }, [reminderTime, presets]);

  const isCustomTime = selectedPreset === null;

  const customTimeLabel = useMemo(() => {
    if (!isCustomTime) return 'Custom time...';
    return formatReminderTime(reminderTime);
  }, [isCustomTime, reminderTime]);

  const handlePresetSelect = useCallback(
    (preset: ReminderPreset) => {
      Keyboard.dismiss();
      triggerSelection();
      const newTime = new Date();
      newTime.setHours(preset.hour, preset.minute, 0, 0);
      onTimeChange(newTime);
      AccessibilityInfo.announceForAccessibility(
        `Reminder set for ${preset.label}`
      );
    },
    [onTimeChange, triggerSelection]
  );

  const handleCustomTimePress = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    setShowTimePicker(true);
  }, [triggerSelection]);

  const handleCustomTimeConfirm = useCallback(
    (time: Date) => {
      triggerSelection();
      onTimeChange(time);
      setShowTimePicker(false);
      const formattedTime = formatReminderTime(time);
      AccessibilityInfo.announceForAccessibility(
        `Custom reminder set for ${formattedTime}`
      );
    },
    [onTimeChange, triggerSelection]
  );

  const handleToggle = useCallback(
    async (value: boolean) => {
      Keyboard.dismiss();
      triggerSelection();
      onToggle(value);

      if (value && Platform.OS !== 'web') {
        const { status } = await Notifications.getPermissionsAsync();
        setPermissionDenied(status !== 'granted');
      } else {
        setPermissionDenied(false);
      }

      AccessibilityInfo.announceForAccessibility(
        value ? 'Reminders enabled' : 'Reminders disabled'
      );
    },
    [onToggle, triggerSelection]
  );

  return {
    customTimeLabel,
    handleCustomTimeConfirm,
    handleCustomTimePress,
    handlePresetSelect,
    handleToggle,
    isCustomTime,
    permissionDenied,
    selectedPreset,
    setShowTimePicker,
    showTimePicker,
  };
}
