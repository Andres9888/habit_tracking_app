import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_HABIT_CREATED_KEY = '@chain_day:first_habit_created_at';
export const PERMISSION_REQUESTED_KEY =
  '@chain_day:notif_permission_requested';

export async function shouldRequestPermission(): Promise<boolean> {
  const alreadyRequested = await AsyncStorage.getItem(
    PERMISSION_REQUESTED_KEY
  );
  if (alreadyRequested === 'true') return true;

  const firstHabitDate = await AsyncStorage.getItem(FIRST_HABIT_CREATED_KEY);
  if (!firstHabitDate) return false;

  const daysSinceFirstHabit = Math.floor(
    (Date.now() - Number.parseInt(firstHabitDate, 10)) /
      (1000 * 60 * 60 * 24)
  );

  return daysSinceFirstHabit >= 3;
}

export async function markFirstHabitCreated(): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(FIRST_HABIT_CREATED_KEY);
    if (!existing) {
      await AsyncStorage.setItem(FIRST_HABIT_CREATED_KEY, String(Date.now()));
    }
  } catch (error) {
    if (__DEV__) {
      console.error('Failed to mark first habit created:', error);
    }
  }
}
