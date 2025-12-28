import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage key for week start day preference
 * Using consistent namespacing pattern with other preferences in this codebase
 */
const STORAGE_KEY = '@habit_app:week_start_day';

/**
 * Valid week start day values (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * This matches JavaScript's Date.getDay() return values
 */
const VALID_WEEK_START_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;
type WeekStartDay = (typeof VALID_WEEK_START_DAYS)[number];

/**
 * Type guard to validate week start day value
 */
function isValidWeekStartDay(value: unknown): value is WeekStartDay {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 6
  );
}

/**
 * Retrieves the saved week start day preference from AsyncStorage
 *
 * @returns Promise resolving to the week start day (0-6) or null if none saved/invalid
 *
 * @example
 * ```ts
 * const savedDay = await getWeekStartDay();
 * const dayToUse = savedDay ?? 0; // Default to Sunday
 * ```
 */
export async function getWeekStartDay(): Promise<WeekStartDay | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);

    if (stored === null) {
      return null;
    }

    // Parse the stored string as a number
    const parsedValue = parseInt(stored, 10);

    // Validate the stored value is a valid week start day
    if (isValidWeekStartDay(parsedValue)) {
      return parsedValue;
    }

    // Invalid value stored - clear it and return null
    console.warn(
      `Invalid week start day stored in AsyncStorage: "${stored}". Clearing preference.`
    );
    await AsyncStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (error) {
    console.error('Error reading week start day preference:', error);
    return null;
  }
}

/**
 * Saves the selected week start day to AsyncStorage
 *
 * @param day - The week start day to save (0-6, where 0 = Sunday)
 *
 * @example
 * ```ts
 * await saveWeekStartDay(1); // Save Monday as week start
 * ```
 */
export async function saveWeekStartDay(day: WeekStartDay): Promise<void> {
  try {
    // Validate before saving
    if (!isValidWeekStartDay(day)) {
      console.warn(`Invalid week start day for saveWeekStartDay: "${day}"`);
      return;
    }

    await AsyncStorage.setItem(STORAGE_KEY, String(day));
  } catch (error) {
    console.error('Error saving week start day preference:', error);
  }
}

/**
 * Clears the saved week start day preference, reverting to default on next load
 *
 * @example
 * ```ts
 * await clearWeekStartDay(); // Will use default (Sunday) next time
 * ```
 */
export async function clearWeekStartDay(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing week start day preference:', error);
  }
}
