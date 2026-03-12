import AsyncStorage from '@react-native-async-storage/async-storage';

function isValidStorageKey(key: unknown): key is string {
  return typeof key === 'string' && key.trim().length > 0;
}

function warnInvalidStorageKey(key: unknown): void {
  if (__DEV__) {
    console.warn('[safeStorage] Invalid AsyncStorage key:', key);
  }
}

export async function safeGetItem<T>(
  key: string,
  validator: (value: unknown) => value is T,
  fallback: T
): Promise<T> {
  if (!isValidStorageKey(key)) {
    warnInvalidStorageKey(key);
    return fallback;
  }

  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!validator(parsed)) {
      if (__DEV__) {
        console.warn(`[safeStorage] Invalid data shape for key "${key}", using fallback`);
      }
      return fallback;
    }

    return parsed;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[safeStorage] Failed to get item "${key}":`, error);
    }
    return fallback;
  }
}

export async function safeSetItem<T>(key: string, value: T): Promise<void> {
  if (!isValidStorageKey(key)) {
    warnInvalidStorageKey(key);
    throw new TypeError('[safeStorage] Invalid AsyncStorage key');
  }

  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (__DEV__) {
      console.error(`[safeStorage] Failed to set item "${key}":`, error);
    }
    throw error;
  }
}

export async function safeRemoveItem(key: string): Promise<void> {
  if (!isValidStorageKey(key)) {
    warnInvalidStorageKey(key);
    return;
  }

  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    if (__DEV__) {
      console.warn(`[safeStorage] Failed to remove item "${key}":`, error);
    }
  }
}

export async function safeGetString(
  key: string,
  fallback: string
): Promise<string> {
  if (!isValidStorageKey(key)) {
    warnInvalidStorageKey(key);
    return fallback;
  }

  try {
    const value = await AsyncStorage.getItem(key);
    return value ?? fallback;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[safeStorage] Failed to get string "${key}":`, error);
    }
    return fallback;
  }
}

export async function safeSetString(key: string, value: string): Promise<void> {
  if (!isValidStorageKey(key)) {
    warnInvalidStorageKey(key);
    return;
  }

  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    if (__DEV__) {
      console.error(`[safeStorage] Failed to set string "${key}":`, error);
    }
  }
}
