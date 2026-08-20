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
import { useSettingsQuery } from '../../lib/settings/useSettingsQuery';

const FIRST_HABIT_CREATED_KEY = '@chain_day:first_habit_created_at';
const PERMISSION_REQUESTED_KEY = '@chain_day:notif_permission_requested';

/**
 * Checks if we should request notification permissions based on:
 * 1. First habit creation (request immediately)
 * 2. 3rd day of use (fallback)
 */
async function shouldRequestPermission(): Promise<boolean> {
  const alreadyRequested = await AsyncStorage.getItem(PERMISSION_REQUESTED_KEY);
  if (alreadyRequested === 'true') return true; // Already asked, just proceed

  const firstHabitDate = await AsyncStorage.getItem(FIRST_HABIT_CREATED_KEY);
  if (!firstHabitDate) return false;

  const daysSinceFirstHabit = Math.floor(
    (Date.now() - Number.parseInt(firstHabitDate, 10)) / (1000 * 60 * 60 * 24)
  );

  return daysSinceFirstHabit >= 3;
}

/**
 * Mark that the first habit was created (for deferred permission request)
 */
export async function markFirstHabitCreated(): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(FIRST_HABIT_CREATED_KEY);
    if (!existing) {
      await AsyncStorage.setItem(FIRST_HABIT_CREATED_KEY, String(Date.now()));
    }
  } catch (error) {
    if (__DEV__) console.error('Failed to mark first habit created:', error);
  }
}

export function useStreakReminderSettings() {
  const settings = useSettingsQuery();
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
