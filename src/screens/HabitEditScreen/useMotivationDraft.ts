import { useCallback, useEffect, useState } from 'react';
import type { Habit } from '../../features/habits/types';
import type { MotivationFieldKey } from '../../../convex/habits/validateMotivationFields';
import {
  motivationFromHabit,
  type MotivationDraft,
} from './motivation/motivationDraft';

export function useMotivationDraft(sourceHabit?: Habit | null) {
  const [motivation, setMotivation] = useState<MotivationDraft>(() =>
    motivationFromHabit(sourceHabit)
  );

  useEffect(() => {
    setMotivation(motivationFromHabit(sourceHabit));
  }, [sourceHabit]);

  const setMotivationField = useCallback(
    (key: MotivationFieldKey, value: string) => {
      setMotivation((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return { motivation, setMotivationField };
}
