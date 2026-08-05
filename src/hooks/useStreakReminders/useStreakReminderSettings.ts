/**
 * useStreakReminderSettings — Settings toggle + time picker state for streak reminders.
 *
 * Manages the streakRemindersEnabled and streakReminderTime settings via Convex.
 */

import { useCallback, useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ensureNotificationPermissions } from '../../utils/notifications/permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SETTINGS } from '../../../convex/settings/types';
import { updateSettingsWithFallback } from '../../lib/settings/updateSettingsWithFallback';
import { useCachedQuery } from '../../lib/queryCache';
import {
  PERMISSION_REQUESTED_KEY,
  shouldRequestPermission,
} from './streakReminderPermission';
export { markFirstHabitCreated } from './streakReminderPermission';

export function useStreakReminderSettings() {
  const settings = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );
  const updateSettings = useMutation(api.settings.update);

  const [enabled, setEnabledLocal] = useState(false);
  const [reminderTime, setReminderTimeLocal] = useState('20:00');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (settings) {
      setEnabledLocal(settings.streakRemindersEnabled);
      setReminderTimeLocal(settings.streakReminderTime);
    }
  }, [settings]);

  const setEnabled = useCallback(
    async (value: boolean) => {
      setEnabledLocal(value);

      try {
        if (value) {
          // Request permission if needed
          const canRequest = await shouldRequestPermission();
          if (canRequest) {
            const granted = await ensureNotificationPermissions();
            setPermissionGranted(granted);
            await AsyncStorage.setItem(PERMISSION_REQUESTED_KEY, 'true');
            if (!granted) {
              setEnabledLocal(false);
              return;
            }
          }
        }
        await updateSettingsWithFallback(updateSettings, {
          ...(settings ?? DEFAULT_SETTINGS),
          streakRemindersEnabled: value,
        });
      } catch (error) {
        if (__DEV__)
          console.error('Failed to update streak reminder setting:', error);
        setEnabledLocal(!value); // Revert on failure
      }
    },
    [settings, updateSettings]
  );

  const setReminderTime = useCallback(
    async (time: string) => {
      const previousTime = reminderTime;
      setReminderTimeLocal(time);
      try {
        await updateSettingsWithFallback(updateSettings, {
          ...(settings ?? DEFAULT_SETTINGS),
          streakReminderTime: time,
        });
      } catch (error) {
        if (__DEV__) console.error('Failed to update reminder time:', error);
        setReminderTimeLocal(previousTime); // Revert on failure
      }
    },
    [settings, updateSettings, reminderTime]
  );

  return {
    enabled,
    permissionGranted,
    reminderTime,
    setEnabled,
    setReminderTime,
  };
}
