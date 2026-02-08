/**
 * Calendar Collapse Preferences Utility
 *
 * Manages per-habit calendar expand/collapse state.
 * Persists user preferences to AsyncStorage so calendar views
 * remember their state across sessions.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Id } from '../../convex/_generated/dataModel';

const STORAGE_KEY = '@habit_app:calendar_collapse_preferences';

interface CalendarCollapsePreferences {
  [habitId: string]: {
    isExpanded: boolean;
    updatedAt: number;
  };
}

/**
 * Retrieves calendar collapse preferences from AsyncStorage
 * @returns Promise resolving to preferences map
 */
export async function getCalendarCollapsePreferences(): Promise<CalendarCollapsePreferences> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as CalendarCollapsePreferences;
      }
    }
    return {};
  } catch (error) {
    if (__DEV__) console.error('Error reading calendar collapse preferences:', error);
    return {};
  }
}

/**
 * Gets the collapse state for a specific habit's calendar
 * @param habitId - The habit ID to check
 * @returns Promise resolving to boolean (true = expanded, false = collapsed)
 */
export async function getCalendarExpandedState(
  habitId: Id<'habits'>
): Promise<boolean | null> {
  try {
    const preferences = await getCalendarCollapsePreferences();
    const entry = preferences[habitId];
    return entry ? entry.isExpanded : null;
  } catch (error) {
    if (__DEV__) console.error('Error getting calendar expanded state:', error);
    return null;
  }
}

/**
 * Saves the collapse state for a specific habit's calendar
 * @param habitId - The habit ID
 * @param isExpanded - Whether the calendar is expanded
 */
export async function setCalendarExpandedState(
  habitId: Id<'habits'>,
  isExpanded: boolean
): Promise<void> {
  try {
    const current = await getCalendarCollapsePreferences();
    const updated = {
      ...current,
      [habitId]: {
        isExpanded,
        updatedAt: Date.now(),
      },
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (__DEV__) console.error('Error saving calendar expanded state:', error);
  }
}

/**
 * Clears calendar collapse preference for a specific habit
 * @param habitId - The habit ID
 */
export async function clearCalendarCollapsePreference(
  habitId: Id<'habits'>
): Promise<void> {
  try {
    const current = await getCalendarCollapsePreferences();
    const updated = { ...current };
    delete updated[habitId];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (__DEV__) console.error('Error clearing calendar collapse preference:', error);
  }
}

/**
 * Clears all calendar collapse preferences
 */
export async function clearAllCalendarCollapsePreferences(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (__DEV__) console.error('Error clearing all calendar collapse preferences:', error);
  }
}
