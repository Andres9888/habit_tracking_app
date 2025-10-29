const COMPACT_KEY = 'habitTrackerSettings.compactMode';

export const getCompactMode = async (): Promise<boolean> => {
  // Prefer web localStorage when available
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(COMPACT_KEY);
      if (raw == null) return false;
      return raw === 'true';
    }
  } catch (error) {
    console.warn('Failed to read compact mode from localStorage', error);
  }

  // Fallback to React Native AsyncStorage
  try {
    const { default: AsyncStorage } = await import(
      '@react-native-async-storage/async-storage'
    );
    const raw = await AsyncStorage.getItem(COMPACT_KEY);
    if (raw == null) return false;
    return raw === 'true';
  } catch {
    return false;
  }
};

export const setCompactMode = async (value: boolean): Promise<void> => {
  // Prefer web localStorage when available
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(COMPACT_KEY, value ? 'true' : 'false');
      return;
    }
  } catch (error) {
    console.warn('Failed to write compact mode to localStorage', error);
  }

  // Fallback to React Native AsyncStorage
  try {
    const { default: AsyncStorage } = await import(
      '@react-native-async-storage/async-storage'
    );
    await AsyncStorage.setItem(COMPACT_KEY, value ? 'true' : 'false');
  } catch {
    // no-op
  }
};
