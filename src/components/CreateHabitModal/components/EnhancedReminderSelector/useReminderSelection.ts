/**
 * useReminderSelection — derives which preset (if any) matches the current
 * reminder time, and the custom-time button label.
 */

import { useMemo } from 'react';
import { formatReminderTime } from '../../../../utils/notifications';
import type { ReminderPreset } from './types';

export function useReminderSelection(
  reminderTime: Date,
  presets: ReminderPreset[]
) {
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

  return { customTimeLabel, isCustomTime, selectedPreset };
}
