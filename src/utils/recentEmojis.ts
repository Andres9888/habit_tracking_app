/**
 * Recent Emojis Utility
 *
 * Manages the list of recently used emojis for the emoji picker.
 * Persists to AsyncStorage for cross-session continuity.
 * Maintains a maximum of 10 recent emojis.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAX_RECENT_EMOJIS } from '@/constants';

const STORAGE_KEY = '@habit_app:recent_emojis';

function sanitizeRecentEmojis(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, MAX_RECENT_EMOJIS);
}

/**
 * Retrieves the list of recently used emojis from AsyncStorage
 * @returns Promise resolving to an array of emoji strings
 */
export async function getRecentEmojis(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as unknown;
    return sanitizeRecentEmojis(parsed);
  } catch (error) {
    if (__DEV__) console.error('Error reading recent emojis:', error);
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
  const normalizedEmoji = emoji.trim();
  if (!normalizedEmoji) {
    return;
  }

  try {
    const current = await getRecentEmojis();
    // Remove emoji if it already exists to avoid duplicates
    const filtered = current.filter((e) => e !== normalizedEmoji);
    // Add to front of list
    const updated = [normalizedEmoji, ...filtered].slice(0, MAX_RECENT_EMOJIS);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (__DEV__) console.error('Error saving recent emoji:', error);
  }
}

/**
 * Clears all recently used emojis
 */
export async function clearRecentEmojis(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (__DEV__) console.error('Error clearing recent emojis:', error);
  }
}
