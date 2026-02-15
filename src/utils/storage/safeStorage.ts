/**
 * Type-Safe AsyncStorage Wrapper
 *
 * Provides centralized error handling, validation, and type safety
 * for all AsyncStorage operations.
 *
 * Benefits:
 * - All operations wrapped in try/catch
 * - JSON.parse errors handled gracefully
 * - TypeScript type guards enforce data shape
 * - Consistent error logging in development
 * - Easier mocking in tests
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Safely get an item from AsyncStorage with type validation
 *
 * @param key - Storage key
 * @param validator - Type guard function to validate parsed data
 * @param fallback - Default value if item doesn't exist or is invalid
 * @returns Promise resolving to validated data or fallback
 *
 * @example
 * ```ts
 * function isStringArray(value: unknown): value is string[] {
 *   return Array.isArray(value) && value.every(item => typeof item === 'string');
 * }
 *
 * const emojis = await safeGetItem(
 *   '@recent_emojis',
 *   isStringArray,
 *   []
 * );
 * ```
 */
export async function safeGetItem<T>(
  key: string,
  validator: (value: unknown) => value is T,
  fallback: T
): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!validator(parsed)) {
      return fallback;
    }

    return parsed;
  } catch (error) {
    return fallback;
  }
}

/**
 * Safely set an item in AsyncStorage
 *
 * @param key - Storage key
 * @param value - Data to store (will be JSON.stringified)
 * @throws Error if storage operation fails (caller should handle)
 *
 * @example
 * ```ts
 * await safeSetItem('@recent_emojis', ['👍', '❤️', '🔥']);
 * ```
 */
export async function safeSetItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw error;
  }
}

/**
 * Safely remove an item from AsyncStorage
 *
 * @param key - Storage key to remove
 * @returns Promise that resolves when removal completes (errors are logged but not thrown)
 *
 * @example
 * ```ts
 * await safeRemoveItem('@recent_emojis');
 * ```
 */
export async function safeRemoveItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    // Don't throw - removal failures are non-critical
  }
}

/**
 * Safely get a simple string value from AsyncStorage
 *
 * @param key - Storage key
 * @param fallback - Default value if key doesn't exist
 * @returns Promise resolving to stored string or fallback
 *
 * @example
 * ```ts
 * const onboardingComplete = await safeGetString('@onboarding_complete', 'false');
 * ```
 */
export async function safeGetString(
  key: string,
  fallback: string
): Promise<string> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

/**
 * Safely set a simple string value in AsyncStorage
 *
 * @param key - Storage key
 * @param value - String value to store
 * @returns Promise that resolves when storage completes (errors are logged but not thrown)
 *
 * @example
 * ```ts
 * await safeSetString('@onboarding_complete', 'true');
 * ```
 */
export async function safeSetString(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    // Don't throw - string storage failures are non-critical for UI state
  }
}

/**
 * Safely get a boolean flag from AsyncStorage
 *
 * @param key - Storage key
 * @param fallback - Default value if key doesn't exist
 * @returns Promise resolving to boolean
 *
 * @example
 * ```ts
 * const notificationsEnabled = await safeGetBoolean('@notifications_enabled', false);
 * ```
 */
export async function safeGetBoolean(
  key: string,
  fallback: boolean
): Promise<boolean> {
  const value = await safeGetString(key, String(fallback));
  return value === 'true';
}

/**
 * Safely set a boolean flag in AsyncStorage
 *
 * @param key - Storage key
 * @param value - Boolean value to store
 *
 * @example
 * ```ts
 * await safeSetBoolean('@notifications_enabled', true);
 * ```
 */
export async function safeSetBoolean(
  key: string,
  value: boolean
): Promise<void> {
  await safeSetString(key, String(value));
}

/**
 * Safely get a number from AsyncStorage
 *
 * @param key - Storage key
 * @param fallback - Default value if key doesn't exist or is invalid
 * @returns Promise resolving to number
 *
 * @example
 * ```ts
 * const completionCount = await safeGetNumber('@completion_count', 0);
 * ```
 */
export async function safeGetNumber(
  key: string,
  fallback: number
): Promise<number> {
  const value = await safeGetString(key, String(fallback));
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * Safely set a number in AsyncStorage
 *
 * @param key - Storage key
 * @param value - Number value to store
 *
 * @example
 * ```ts
 * await safeSetNumber('@completion_count', 42);
 * ```
 */
export async function safeSetNumber(key: string, value: number): Promise<void> {
  await safeSetString(key, String(value));
}
