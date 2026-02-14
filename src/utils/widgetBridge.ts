/**
 * Widget Data Bridge
 *
 * Syncs habit data to iOS WidgetKit via App Group shared UserDefaults.
 * Uses @react-native-async-storage/async-storage for the App Group container,
 * or expo-shared-preferences if available.
 *
 * This module writes a JSON payload to the shared App Group so the native
 * WidgetKit extension can read today's habits and their completion status.
 *
 * Required setup:
 * - App Group "group.com.chainday.app" configured in both main app and widget extension
 * - react-native-shared-group-preferences (or similar) installed
 */

import { Platform, NativeModules } from 'react-native';

const APP_GROUP_ID = 'group.com.chainday.app';
const WIDGET_DATA_KEY = 'widgetData';

export interface WidgetHabit {
  id: string;
  name: string;
  icon: string | undefined;
  iconColor: string | undefined;
  completed: boolean;
}

export interface WidgetPayload {
  habits: WidgetHabit[];
  date: string; // YYYY-MM-DD
  updatedAt: number; // Unix timestamp ms
}

/**
 * Format today's date as YYYY-MM-DD in local timezone
 */
function todayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Write widget data to shared App Group UserDefaults.
 *
 * Uses the SharedGroupPreferences native module if available,
 * otherwise falls back to a no-op on non-iOS platforms.
 */
async function writeToAppGroup(key: string, value: string): Promise<void> {
  if (Platform.OS !== 'ios') return;

  try {
    // Try react-native-shared-group-preferences
    const SharedGroupPreferences =
      NativeModules.SharedGroupPreferences ||
      NativeModules.RNSharedGroupPreferences;

    if (SharedGroupPreferences?.setItem) {
      await SharedGroupPreferences.setItem(key, value, APP_GROUP_ID);
      return;
    }

    // Try expo-shared-preferences
    // @ts-ignore - optional dependency
    const ExpoShared = await import('expo-shared-preferences').catch(() => null);
    if (ExpoShared?.setItemAsync) {
      await ExpoShared.setItemAsync(key, value, { group: APP_GROUP_ID });
      return;
    }

    console.warn('[WidgetBridge] No shared preferences module available. Widget data not synced.');
  } catch (error) {
    console.warn('[WidgetBridge] Failed to write widget data:', error);
  }
}

/**
 * Request WidgetKit to reload all timelines.
 */
async function reloadWidgetTimelines(): Promise<void> {
  if (Platform.OS !== 'ios') return;

  try {
    const WidgetKit = NativeModules.WidgetKitModule || NativeModules.RNWidgetKit;
    if (WidgetKit?.reloadAllTimelines) {
      WidgetKit.reloadAllTimelines();
    }
  } catch {
    // Silent - widget reload is best-effort
  }
}

/**
 * Sync current habit state to the iOS widget.
 *
 * Call this after:
 * - Habits list loads
 * - A habit is toggled
 * - Habits are created/deleted
 *
 * @param habits - Array of habits from Convex
 * @param tracking - Array of tracking records for today
 */
export async function syncWidgetData(
  habits: Array<{ _id: any; name: string; icon?: string; iconColor?: string }>,
  tracking: Array<{ habitId: any; date: string; completed: boolean }>
): Promise<void> {
  if (Platform.OS !== 'ios') return;

  const today = todayString();
  const todayTracking = new Map(
    tracking
      .filter((t) => t.date === today)
      .map((t) => [String(t.habitId), t.completed])
  );

  const payload: WidgetPayload = {
    habits: habits.map((h) => ({
      id: String(h._id),
      name: h.name,
      icon: h.icon,
      iconColor: h.iconColor,
      completed: todayTracking.get(String(h._id)) ?? false,
    })),
    date: today,
    updatedAt: Date.now(),
  };

  await writeToAppGroup(WIDGET_DATA_KEY, JSON.stringify(payload));
  await reloadWidgetTimelines();
}
