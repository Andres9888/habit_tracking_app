/**
 * Widget Data Bridge
 *
 * Syncs habit data from the React Native app to the iOS widget
 * via shared App Group UserDefaults storage.
 *
 * Data flow:
 *   Convex → React Native → SharedStorage → WidgetKit → Widget UI
 */

import { Platform } from "react-native";

// Must match the App Group ID in both the main app and widget entitlements
const APP_GROUP_ID = "group.com.chainday.app.shared";
const WIDGET_DATA_KEY = "habitStreaksWidgetData";

// ─── Types ────────────────────────────────────────────────────────

export interface WidgetHabitEntry {
  id: string;
  name: string;
  emoji: string;
  currentStreak: number;
  completedToday: boolean;
  /** ISO date strings (yyyy-MM-dd) for days completed this week */
  completedDays: string[];
}

export interface WidgetData {
  habits: WidgetHabitEntry[];
  totalCompletedToday: number;
  totalHabits: number;
  lastUpdated: string;
  /** 7 ISO date strings for current week (Mon–Sun) */
  weekDates: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────

/**
 * Returns ISO date strings for the current week (Monday–Sunday).
 */
function getCurrentWeekDates(): string[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

/**
 * Format a date as yyyy-MM-dd.
 */
function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

// ─── Shared Storage Access ────────────────────────────────────────

/**
 * Writes data to shared App Group UserDefaults.
 * Uses expo-shared-preferences or react-native-shared-group-preferences.
 *
 * NOTE: Requires one of these native modules to be installed:
 *   - @bittingz/expo-widgets (recommended for Expo)
 *   - react-native-shared-group-preferences
 *
 * For now, this provides the interface. The actual native bridge
 * should be wired when the widget extension is added to the Xcode project.
 */
async function writeToSharedStorage(
  key: string,
  value: string
): Promise<void> {
  if (Platform.OS !== "ios") return;

  try {
    // Try expo-widgets shared storage first
    const ExpoWidgets = require("@bittingz/expo-widgets");
    if (ExpoWidgets?.SharedStorage) {
      await ExpoWidgets.SharedStorage.set(value, {
        key,
        group: APP_GROUP_ID,
      });
      return;
    }
  } catch {
    // Module not available, try fallback
  }

  try {
    const SharedGroupPreferences = require("react-native-shared-group-preferences");
    await SharedGroupPreferences.default.setItem(key, value, APP_GROUP_ID);
  } catch {
    console.warn(
      "[WidgetBridge] No shared storage module available. Install @bittingz/expo-widgets or react-native-shared-group-preferences."
    );
  }
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Transform raw habit data from Convex into the widget format.
 *
 * @param habits - Array of habit objects from the app's data layer
 * @param completionMap - Map of habitId → Set of completed ISO date strings
 */
export function transformHabitsForWidget(
  habits: Array<{
    _id: string;
    name: string;
    emoji?: string;
    currentStreak?: number;
  }>,
  completionMap: Map<string, Set<string>>
): WidgetData {
  const today = toDateKey(new Date());
  const weekDates = getCurrentWeekDates();

  const widgetHabits: WidgetHabitEntry[] = habits.map((h) => {
    const completed = completionMap.get(h._id) ?? new Set();
    return {
      id: h._id,
      name: h.name,
      emoji: h.emoji ?? "🔗",
      currentStreak: h.currentStreak ?? 0,
      completedToday: completed.has(today),
      completedDays: weekDates.filter((d) => completed.has(d)),
    };
  });

  return {
    habits: widgetHabits,
    totalCompletedToday: widgetHabits.filter((h) => h.completedToday).length,
    totalHabits: widgetHabits.length,
    lastUpdated: new Date().toISOString(),
    weekDates,
  };
}

/**
 * Push widget data to shared storage and request a WidgetKit timeline refresh.
 */
export async function updateWidgetData(data: WidgetData): Promise<void> {
  if (Platform.OS !== "ios") return;

  const jsonString = JSON.stringify(data);
  await writeToSharedStorage(WIDGET_DATA_KEY, jsonString);

  // Request WidgetKit timeline reload
  try {
    const ExpoWidgets = require("@bittingz/expo-widgets");
    if (ExpoWidgets?.reloadAllTimelines) {
      ExpoWidgets.reloadAllTimelines();
    }
  } catch {
    // WidgetKit reload not available; widget will refresh on its own schedule
  }
}

/**
 * Convenience function: transform + push in one call.
 * Call this after any habit toggle, completion, or data sync.
 */
export async function syncWidgetData(
  habits: Array<{
    _id: string;
    name: string;
    emoji?: string;
    currentStreak?: number;
  }>,
  completionMap: Map<string, Set<string>>
): Promise<void> {
  const data = transformHabitsForWidget(habits, completionMap);
  await updateWidgetData(data);
}
