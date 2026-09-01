import { useCallback, useEffect, useRef, useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import { getLocalDateString } from '../../utils/getLocalDateString';

import {
  getNextCompletionToast,
  type CompletionToastSnapshot,
} from './completionToast';

interface UseCompletionToastProps {
  /** Post-toggle streak derived from the completion log, not the habit doc. */
  currentStreak: number;
  habitId: Id<'habits'> | string | undefined;
  isCompletedToday: boolean;
}

const INITIAL_TOAST: CompletionToastSnapshot = {
  date: null,
  streak: 1,
  visible: false,
};

export function useCompletionToast({
  currentStreak,
  habitId,
  isCompletedToday,
}: UseCompletionToastProps) {
  const [toast, setToast] = useState(INITIAL_TOAST);
  const previousHabitIdRef =
    useRef<UseCompletionToastProps['habitId']>(habitId);
  const previousCompletedTodayRef = useRef<boolean | null>(null);

  useEffect(() => {
    const didHabitChange = previousHabitIdRef.current !== habitId;
    setToast((current) =>
      getNextCompletionToast({
        currentStreak,
        didHabitChange,
        isCompletedToday,
        date: current.date,
        previousCompletedToday: previousCompletedTodayRef.current,
        streak: current.streak,
        today: getLocalDateString(),
        visible: current.visible,
      })
    );
    previousHabitIdRef.current = habitId;
    previousCompletedTodayRef.current = isCompletedToday;
  }, [currentStreak, habitId, isCompletedToday]);

  const hideCompletionToast = useCallback(() => {
    setToast((current) =>
      current.visible ? { ...current, visible: false } : current
    );
  }, []);

  return {
    completionToastDate: toast.date,
    completionToastStreak: toast.streak,
    completionToastVisible: toast.visible,
    hideCompletionToast,
  };
}
