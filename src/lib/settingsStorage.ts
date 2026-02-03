/**
 * Settings Storage
 *
 * Cross-platform persistence for app settings.
 * Uses localStorage on web, SecureStore on native.
 * Provides fallback handling for environments where storage is unavailable.
 */

const COMPACT_KEY = 'habitTrackerSettings.compactMode';
const TRIAL_PROMPT_KEY = 'habitTrackerSettings.hasShownTrialPrompt';

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

  // Fallback to Expo SecureStore (native only)
  try {
    const SecureStore = await import('expo-secure-store');
    const raw = await SecureStore.getItemAsync(COMPACT_KEY);
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

  // Fallback to Expo SecureStore (native only)
  try {
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync(COMPACT_KEY, value ? 'true' : 'false');
  } catch {
    // no-op
  }
};

export const getHasShownTrialPrompt = async (): Promise<boolean> => {
  // Prefer web localStorage when available
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(TRIAL_PROMPT_KEY);
      if (raw == null) return false;
      return raw === 'true';
    }
  } catch (error) {
    console.warn('Failed to read trial prompt state from localStorage', error);
  }

  // Fallback to Expo SecureStore (native only)
  try {
    const SecureStore = await import('expo-secure-store');
    const raw = await SecureStore.getItemAsync(TRIAL_PROMPT_KEY);
    if (raw == null) return false;
    return raw === 'true';
  } catch {
    return false;
  }
};

export const setHasShownTrialPrompt = async (value: boolean): Promise<void> => {
  // Prefer web localStorage when available
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TRIAL_PROMPT_KEY, value ? 'true' : 'false');
      return;
    }
  } catch (error) {
    console.warn('Failed to write trial prompt state to localStorage', error);
  }

  // Fallback to Expo SecureStore (native only)
  try {
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync(TRIAL_PROMPT_KEY, value ? 'true' : 'false');
  } catch {
    // no-op
  }
};
