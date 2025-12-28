import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage key for grid theme preference
 * Using consistent namespacing pattern with other preferences in this codebase
 */
const STORAGE_KEY = '@habit_app:grid_theme_selection';

/**
 * Valid theme names that can be persisted
 * This must match GridThemeName type from CalendarHeatmap/types.ts
 */
const VALID_THEMES = ['github', 'tiles', 'dots', 'pixels'] as const;
type GridThemeName = (typeof VALID_THEMES)[number];

/**
 * Type guard to validate theme name
 */
function isValidThemeName(value: unknown): value is GridThemeName {
  return (
    typeof value === 'string' && VALID_THEMES.includes(value as GridThemeName)
  );
}

/**
 * Retrieves the saved grid theme selection from AsyncStorage
 *
 * @returns Promise resolving to the theme name or null if none saved/invalid
 *
 * @example
 * ```ts
 * const savedTheme = await getSelectedGridTheme();
 * const themeToUse = savedTheme ?? 'github';
 * ```
 */
export async function getSelectedGridTheme(): Promise<GridThemeName | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);

    if (stored === null) {
      return null;
    }

    // Validate the stored value is a valid theme name
    if (isValidThemeName(stored)) {
      return stored;
    }

    // Invalid value stored - clear it and return null
    console.warn(
      `Invalid grid theme stored in AsyncStorage: "${stored}". Clearing preference.`
    );
    await AsyncStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (error) {
    console.error('Error reading grid theme preference:', error);
    return null;
  }
}

/**
 * Saves the selected grid theme to AsyncStorage
 *
 * @param theme - The theme name to save (must be a valid GridThemeName)
 *
 * @example
 * ```ts
 * await saveSelectedGridTheme('dots');
 * ```
 */
export async function saveSelectedGridTheme(
  theme: GridThemeName
): Promise<void> {
  try {
    // Validate before saving (cast to string for the warning message since type narrowing
    // would make theme 'never' after this check)
    if (!isValidThemeName(theme)) {
      console.warn(
        `Invalid theme name for saveSelectedGridTheme: "${String(theme)}"`
      );
      return;
    }

    await AsyncStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.error('Error saving grid theme preference:', error);
  }
}

/**
 * Clears the saved grid theme preference, reverting to default on next load
 *
 * @example
 * ```ts
 * await clearSelectedGridTheme(); // Will use default 'github' next time
 * ```
 */
export async function clearSelectedGridTheme(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing grid theme preference:', error);
  }
}
