/**
 * Hook for EnhancedReminderSelector logic
 */

import { useCallback, useRef, useState } from 'react';
import { AccessibilityInfo, Keyboard, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { formatReminderTime } from '../../../../utils/notifications';
import { getNearestPresetTime, isUntouchedDefaultTime } from './reminderDefaults';
import { useReminderSelection } from './useReminderSelection';
import type { ReminderPreset } from './types';

interface UseReminderSelectorParams {
  reminderTime: Date;
  presets: ReminderPreset[];
  onTimeChange: (time: Date) => void;
  onToggle: (enabled: boolean) => void;
  snapDefaultToPresetOnEnable?: boolean;
}

export function useReminderSelector({
  reminderTime,
  presets,
  onTimeChange,
  onToggle,
  snapDefaultToPresetOnEnable = false,
}: UseReminderSelectorParams) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const { triggerSelection } = useHapticFeedback();
  // Guards the snap-to-preset on enable: an explicit pick must never be overridden.
  const hasUserSetTime = useRef(false);

  const { customTimeLabel, isCustomTime, selectedPreset } =
    useReminderSelection(reminderTime, presets);

  const handlePresetSelect = useCallback(
    (preset: ReminderPreset) => {
      Keyboard.dismiss();
      triggerSelection();
      hasUserSetTime.current = true;
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
      hasUserSetTime.current = true;
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

      // Create flow, first enable with the seeded fallback time: snap to the
      // nearest preset so the shown time has a visible origin in the presets.
      if (
        value &&
        snapDefaultToPresetOnEnable &&
        !hasUserSetTime.current &&
        isUntouchedDefaultTime(reminderTime)
      ) {
        onTimeChange(getNearestPresetTime(presets));
      }

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
    [onToggle, onTimeChange, presets, reminderTime, snapDefaultToPresetOnEnable, triggerSelection]
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
