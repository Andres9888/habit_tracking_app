/**
 * Per-Habit Notification Configuration
 *
 * Allows users to customize notification behaviour per habit:
 * - Enable/disable notifications per habit
 * - Choose notification type (fixed time, smart timing, or streak-only)
 * - Set custom reminder time
 * - Toggle milestone celebrations
 *
 * Stored in AsyncStorage so it persists locally without backend changes.
 *
 * Built by Opus.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'per-habit-notification-config';

export type NotificationMode =
  | 'fixed'       // Fire at a fixed time every day
  | 'smart'       // Use smart timing based on completion history
  | 'streak-only' // Only notify when streak is at risk
  | 'off';        // No notifications for this habit

export interface HabitNotificationConfig {
  /** Notification mode */
  mode: NotificationMode;
  /** Fixed reminder time in "HH:mm" format (used when mode is 'fixed') */
  fixedTime?: string;
  /** Whether to show milestone celebration notifications */
  milestonesEnabled: boolean;
  /** Whether to show streak-at-risk notifications */
  streakAtRiskEnabled: boolean;
}

const DEFAULT_CONFIG: HabitNotificationConfig = {
  mode: 'fixed',
  milestonesEnabled: true,
  streakAtRiskEnabled: true,
};

type ConfigMap = Record<string, HabitNotificationConfig>;

let _cache: ConfigMap | null = null;

async function loadAll(): Promise<ConfigMap> {
  if (_cache) return _cache;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    _cache = raw ? JSON.parse(raw) : {};
    return _cache!;
  } catch {
    _cache = {};
    return _cache;
  }
}

async function saveAll(configs: ConfigMap): Promise<void> {
  _cache = configs;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

/**
 * Get the notification config for a specific habit.
 * Returns defaults if no custom config is set.
 */
export async function getHabitNotificationConfig(
  habitId: string
): Promise<HabitNotificationConfig> {
  const all = await loadAll();
  return all[habitId] ?? { ...DEFAULT_CONFIG };
}

/**
 * Update the notification config for a specific habit.
 * Pass partial updates — they merge with existing config.
 */
export async function setHabitNotificationConfig(
  habitId: string,
  updates: Partial<HabitNotificationConfig>
): Promise<void> {
  const all = await loadAll();
  const existing = all[habitId] ?? { ...DEFAULT_CONFIG };
  all[habitId] = { ...existing, ...updates };
  await saveAll(all);
}

/**
 * Remove the notification config for a habit (resets to defaults).
 */
export async function removeHabitNotificationConfig(
  habitId: string
): Promise<void> {
  const all = await loadAll();
  delete all[habitId];
  await saveAll(all);
}

/**
 * Get all habit notification configs.
 */
export async function getAllHabitNotificationConfigs(): Promise<ConfigMap> {
  return loadAll();
}

/**
 * Clear the in-memory cache (useful for testing).
 */
export function clearConfigCache(): void {
  _cache = null;
}
