/**
 * Data normalization utilities for settings
 */
import {
  DEFAULT_SETTINGS,
  type DarkModePreference,
  type HabitSortMode,
} from './types';

export const normalizeDarkMode = (value: unknown): DarkModePreference => {
  if (value === 'dark' || value === 'light' || value === 'system') {
    return value;
  }
  if (value === true) {
    return 'dark';
  }
  if (value === false) {
    return 'light';
  }
  return DEFAULT_SETTINGS.darkMode;
};

export const normalizeHabitSortMode = (
  value: unknown,
  legacySortHabitsAlphabetically?: unknown
): HabitSortMode => {
  if (
    value === 'manual' ||
    value === 'name_asc' ||
    value === 'name_desc' ||
    value === 'strength_asc' ||
    value === 'strength_desc' ||
    value === 'streak_asc' ||
    value === 'streak_desc'
  ) {
    return value;
  }
  if (legacySortHabitsAlphabetically === true) {
    return 'name_asc';
  }
  return DEFAULT_SETTINGS.habitSortMode;
};
