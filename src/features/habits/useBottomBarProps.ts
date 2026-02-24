/**
 * useBottomBarProps — computes props for the BottomActionBar.
 *
 * Centralises the add-habit and action callbacks so HabitsApp stays under
 * the line limit.
 */

import { useCallback } from 'react';
import type { HabitsModalsState } from './hooks/types';

interface UseBottomBarPropsOptions {
  modals: HabitsModalsState;
  handleCreateHabitRequest: () => void | Promise<void>;
}

export function useBottomBarProps({
  modals,
  handleCreateHabitRequest,
}: UseBottomBarPropsOptions) {
  const onAddHabitPress = useCallback((): void => {
    void handleCreateHabitRequest();
  }, [handleCreateHabitRequest]);

  return {
    onAddHabit: onAddHabitPress,
    onOpenSettings: modals.openSettings,
    onOpenTemplates: modals.openTemplatesScreen,
  };
}
