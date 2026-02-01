import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Id } from '../../convex/_generated/dataModel';

const STORAGE_KEY = '@habit_app:dismissed_insights';

interface DismissedInsights {
  [habitId: string]: {
    dismissedAt: number;
    weakDay: string;
  };
}

/**
 * Retrieves dismissed insight preferences from AsyncStorage
 * @returns Promise resolving to dismissed insights map
 */
export async function getDismissedInsights(): Promise<DismissedInsights> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as DismissedInsights;
      }
    }
    return {};
  } catch (error) {
    if (__DEV__) console.error('Error reading dismissed insights:', error);
    return {};
  }
}

/**
 * Checks if an insight card has been dismissed for a specific habit
 * @param habitId - The habit ID to check
 * @param weakDay - The weak day being shown
 * @returns Promise resolving to true if dismissed, false otherwise
 */
export async function isInsightDismissed(
  habitId: Id<'habits'>,
  weakDay: string
): Promise<boolean> {
  try {
    const dismissed = await getDismissedInsights();
    const entry = dismissed[habitId];

    if (!entry) return false;

    // Consider dismissed if same weak day and dismissed within last 7 days
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return entry.weakDay === weakDay && entry.dismissedAt > sevenDaysAgo;
  } catch (error) {
    if (__DEV__) console.error('Error checking dismissed insight:', error);
    return false;
  }
}

/**
 * Marks an insight card as dismissed for a specific habit
 * @param habitId - The habit ID
 * @param weakDay - The weak day being dismissed
 */
export async function dismissInsight(
  habitId: Id<'habits'>,
  weakDay: string
): Promise<void> {
  try {
    const current = await getDismissedInsights();
    const updated = {
      ...current,
      [habitId]: {
        dismissedAt: Date.now(),
        weakDay,
      },
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (__DEV__) console.error('Error dismissing insight:', error);
  }
}

/**
 * Clears dismissed insight for a specific habit (re-enables the card)
 * @param habitId - The habit ID
 */
export async function clearDismissedInsight(
  habitId: Id<'habits'>
): Promise<void> {
  try {
    const current = await getDismissedInsights();
    const updated = { ...current };
    delete updated[habitId];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (__DEV__) console.error('Error clearing dismissed insight:', error);
  }
}

/**
 * Clears all dismissed insights
 */
export async function clearAllDismissedInsights(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (__DEV__) console.error('Error clearing all dismissed insights:', error);
  }
}
