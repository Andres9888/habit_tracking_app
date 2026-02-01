/**
 * Recent Emojis Utility
 *
 * Manages the list of recently used emojis for the emoji picker.
 * Persists to AsyncStorage for cross-session continuity.
 * Maintains a maximum of 10 recent emojis.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@habit_app:recent_emojis';
const MAX_RECENT = 10;

/**
 * Retrieves the list of recently used emojis from AsyncStorage
 * @returns Promise resolving to an array of emoji strings
 */
export async function getRecentEmojis(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, MAX_RECENT);
      }
    }
    return [];
  } catch (error) {
    console.error('Error reading recent emojis:', error);
    return [];
  }
}

/**
 * Adds an emoji to the recently used list
 * Moves emoji to front if already exists, otherwise adds to front
 * Maintains max of MAX_RECENT emojis
 * @param emoji - The emoji string to add
 */
export async function addRecentEmoji(emoji: string): Promise<void> {
  try {
    const current = await getRecentEmojis();
    // Remove emoji if it already exists to avoid duplicates
    const filtered = current.filter((e) => e !== emoji);
    // Add to front of list
    const updated = [emoji, ...filtered].slice(0, MAX_RECENT);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent emoji:', error);
  }
}

/**
 * Clears all recently used emojis
 */
export async function clearRecentEmojis(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recent emojis:', error);
  }
}
