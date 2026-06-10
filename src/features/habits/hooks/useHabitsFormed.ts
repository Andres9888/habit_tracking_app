/**
 * useHabitsFormed — mark a habit as formed (mastered, retired with honors)
 * via the right-swipe gesture, with an undo toast mirroring archive's UX.
 */
import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { logInteraction } from '../../../lib/analytics/interactions';
import { showGenericError } from '../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

export interface FormedToastState {
  habitId: Id<'habits'>;
  habitName: string;
}

export interface UseHabitsFormedResult {
  handleMarkFormed: (habitId: Id<'habits'>) => Promise<void>;
  formedToast: FormedToastState | null;
  handleUndoFormed: () => Promise<void>;
  dismissFormedToast: () => void;
}

export function useHabitsFormed(habits: Habit[]): UseHabitsFormedResult {
  const markFormedMutation = useMutation(api.habits.markFormed);
  const unmarkFormedMutation = useMutation(api.habits.unmarkFormed);
  const [formedToast, setFormedToast] = useState<FormedToastState | null>(
    null
  );

  const handleMarkFormed = useCallback(
    async (habitId: Id<'habits'>) => {
      const habit = habits.find((h) => h._id === habitId);
      const habitName = habit?.name ?? 'Habit';
      try {
        await markFormedMutation({ habitId });
        setFormedToast({ habitId, habitName });
        logInteraction('habit_formed', { habitId, habitName });
      } catch (error) {
        if (__DEV__)
          console.error('[useHabitsFormed] Mark formed failed:', error);
        showGenericError(ERROR_MESSAGES.DATA_OPS.MARK_FORMED_FAILED);
      }
    },
    [habits, markFormedMutation]
  );

  const handleUndoFormed = useCallback(async () => {
    if (!formedToast) return;
    const { habitId, habitName } = formedToast;
    setFormedToast(null);
    try {
      await unmarkFormedMutation({ habitId });
      logInteraction('habit_formed_undo', { habitId, habitName });
    } catch (error) {
      if (__DEV__) console.error('[useHabitsFormed] Undo failed:', error);
      showGenericError(ERROR_MESSAGES.DATA_OPS.RESTORE_FORMED_FAILED);
    }
  }, [formedToast, unmarkFormedMutation]);

  const dismissFormedToast = useCallback(() => {
    setFormedToast(null);
  }, []);

  return {
    dismissFormedToast,
    formedToast,
    handleMarkFormed,
    handleUndoFormed,
  };
}
