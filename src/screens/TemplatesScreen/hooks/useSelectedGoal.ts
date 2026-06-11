/**
 * Persists the library's selected goal for return-visit memory.
 * Follows the AsyncStorage pattern in settingsSectionPreferences.ts.
 */

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@templates:selected_goal';

export async function getSelectedGoalId(): Promise<string | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored || null;
  } catch (error_) {
    if (__DEV__) console.error('Error reading selected goal:', error_);
    return null;
  }
}

export async function persistSelectedGoalId(
  goalId: string | null
): Promise<void> {
  try {
    await (goalId
      ? AsyncStorage.setItem(STORAGE_KEY, goalId)
      : AsyncStorage.removeItem(STORAGE_KEY));
  } catch (error_) {
    if (__DEV__) console.error('Error saving selected goal:', error_);
  }
}

export function useSelectedGoal() {
  const [selectedGoalId, setSelectedGoalIdState] = useState<string | null>(
    null
  );
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    void getSelectedGoalId().then((id) => {
      setSelectedGoalIdState(id);
      setIsRestored(true);
    });
  }, []);

  const setSelectedGoalId = useCallback((goalId: string | null) => {
    setSelectedGoalIdState(goalId);
    void persistSelectedGoalId(goalId);
  }, []);

  return { isRestored, selectedGoalId, setSelectedGoalId };
}
