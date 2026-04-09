/**
 * Settings Section Preferences Utility
 *
 * Manages per-section expand/collapse state for the Settings modal.
 * Persists preferences to AsyncStorage so accordion state
 * survives app restarts and modal re-opens.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@habit_app:settings_section_preferences';

interface SectionPreferences {
  [sectionId: string]: {
    isExpanded: boolean;
    updatedAt: number;
  };
}

export async function getSettingsSectionPreferences(): Promise<SectionPreferences> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as SectionPreferences;
      }
    }
    return {};
  } catch (error_) {
    if (__DEV__) console.error('Error reading settings section preferences:', error_);
    return {};
  }
}

export async function getSettingsSectionExpanded(
  sectionId: string
): Promise<boolean | null> {
  try {
    const preferences = await getSettingsSectionPreferences();
    const entry = preferences[sectionId];
    return entry ? entry.isExpanded : null;
  } catch (error_) {
    if (__DEV__) console.error('Error getting section expanded state:', error_);
    return null;
  }
}

export async function setSettingsSectionExpanded(
  sectionId: string,
  isExpanded: boolean
): Promise<void> {
  try {
    const current = await getSettingsSectionPreferences();
    const updated = {
      ...current,
      [sectionId]: {
        isExpanded,
        updatedAt: Date.now(),
      },
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error_) {
    if (__DEV__) console.error('Error saving section expanded state:', error_);
  }
}
