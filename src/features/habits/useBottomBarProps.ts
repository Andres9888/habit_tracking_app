/**
 * useBottomBarProps — computes props for the BottomActionBar.
 *
 * Centralises the completed-today calculation, template badge state,
 * and the add-habit callback so HabitsApp stays under the line limit.
 */

import { useCallback, useMemo } from 'react';
import { getLocalDateString } from '../../utils/getLocalDateString';
import { useTemplateBadge } from './hooks/useTemplateBadge';
import type { HabitsListState } from './hooks/useHabitsApp';
import type { HabitsModalsState } from './hooks/types';

interface UseBottomBarPropsOptions {
  list: HabitsListState;
  modals: HabitsModalsState;
  handleCreateHabitRequest: () => void | Promise<void>;
}

export function useBottomBarProps({
  list,
  modals,
  handleCreateHabitRequest,
}: UseBottomBarPropsOptions) {
  const { showBadge, dismissBadge } = useTemplateBadge({
    totalHabits: list.habits.length,
  });

  const onAddHabitPress = useCallback((): void => {
    void handleCreateHabitRequest();
  }, [handleCreateHabitRequest]);

  const onDismissTemplateBadge = useCallback((): void => {
    void dismissBadge();
  }, [dismissBadge]);

  const completedToday = useMemo(() => {
    const todayString = getLocalDateString();
    return list.habits.filter(
      (h) => list.getHabitStatus(h._id, todayString) === 'done'
    ).length;
  }, [list.habits, list.getHabitStatus]);

  return {
    completedToday,
    onAddHabit: onAddHabitPress,
    onDismissTemplateBadge,
    onOpenSettings: modals.openSettings,
    onOpenTemplates: modals.openTemplatesScreen,
    showTemplateBadge: showBadge,
    totalHabits: list.habits.length,
  };
}
