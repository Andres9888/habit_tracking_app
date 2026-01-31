import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@habit_app:last_custom_color';

/**
 * Retrieves the last custom color selected by the user from AsyncStorage
 * @returns Promise resolving to the color hex string or null if none saved
 */
export async function getLastCustomColor(): Promise<string | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored && /^#[0-9A-Fa-f]{6}$/.test(stored)) {
      return stored;
    }
    return null;
  } catch (error) {
    if (__DEV__) {
      console.error('Error reading last custom color:', error);
    }
    return null;
  }
}

/**
 * Saves the last custom color selected by the user
 * @param color - The hex color string to save (e.g., '#FF5733')
 */
export async function saveLastCustomColor(color: string): Promise<void> {
  try {
    if (!color || !/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      if (__DEV__) {
        console.warn('Invalid color format for saveLastCustomColor:', color);
      }
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEY, color.toUpperCase());
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving last custom color:', error);
    }
  }
}

/**
 * Clears the saved last custom color
 */
export async function clearLastCustomColor(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (__DEV__) {
      console.error('Error clearing last custom color:', error);
    }
  }
}
