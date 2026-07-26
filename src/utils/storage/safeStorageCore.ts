import AsyncStorage from '@react-native-async-storage/async-storage';

function isValidStorageKey(key: unknown): key is string {
  return typeof key === 'string' && key.trim().length > 0;
}

export async function safeGetItem<T>(
  key: string,
  validator: (value: unknown) => value is T,
  fallback: T
): Promise<T> {
  if (!isValidStorageKey(key)) {
    return fallback;
  }

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
  } catch {
    return fallback;
  }
}

export async function safeSetItem<T>(key: string, value: T): Promise<void> {
  if (!isValidStorageKey(key)) {
    throw new TypeError('[safeStorage] Invalid AsyncStorage key');
  }

  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function safeRemoveItem(key: string): Promise<void> {
  if (!isValidStorageKey(key)) {
    return;
  }

  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Removal is best-effort.
  }
}

export async function safeGetString(
  key: string,
  fallback: string
): Promise<string> {
  if (!isValidStorageKey(key)) {
    return fallback;
  }

  try {
    const value = await AsyncStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function safeSetString(key: string, value: string): Promise<void> {
  if (!isValidStorageKey(key)) {
    return;
  }

  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // String persistence is best-effort.
  }
}
