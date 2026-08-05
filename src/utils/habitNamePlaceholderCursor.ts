import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@habit_app:habit_name_placeholder_cursor';

export type HabitNamePlaceholderCursor = {
  libraryTemplateId: string | null;
  staticName: string | null;
};

export const EMPTY_HABIT_NAME_PLACEHOLDER_CURSOR: HabitNamePlaceholderCursor = {
  libraryTemplateId: null,
  staticName: null,
};

function sanitizeCursor(value: unknown): HabitNamePlaceholderCursor {
  if (!value || typeof value !== 'object') {
    return EMPTY_HABIT_NAME_PLACEHOLDER_CURSOR;
  }

  const record = value as Record<string, unknown>;
  return {
    libraryTemplateId:
      typeof record.libraryTemplateId === 'string'
        ? record.libraryTemplateId
        : null,
    staticName:
      typeof record.staticName === 'string' ? record.staticName : null,
  };
}

export async function getHabitNamePlaceholderCursor(): Promise<HabitNamePlaceholderCursor> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return EMPTY_HABIT_NAME_PLACEHOLDER_CURSOR;
    return sanitizeCursor(JSON.parse(stored) as unknown);
  } catch (error) {
    if (__DEV__)
      console.error('Error reading habit name placeholder cursor:', error);
    return EMPTY_HABIT_NAME_PLACEHOLDER_CURSOR;
  }
}

export async function setHabitNamePlaceholderCursor(
  cursor: HabitNamePlaceholderCursor
): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cursor));
  } catch (error) {
    if (__DEV__)
      console.error('Error saving habit name placeholder cursor:', error);
  }
}
