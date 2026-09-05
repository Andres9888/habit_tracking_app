import { useMemo, useState } from 'react';
import type { Habit, ShareCardData } from '../types';

export interface HabitSelectionState {
  selectedHabit: Habit | null;
  setSelectedHabit: (h: Habit | null) => void;
  habitToPause: Habit | null;
  setHabitToPause: (h: Habit | null) => void;
  habitToEdit: Habit | null;
  setHabitToEdit: (h: Habit | null) => void;
  quickActionsHabit: Habit | null;
  setQuickActionsHabit: (h: Habit | null) => void;
  habitDetailInitialTab: 'progress' | 'motivation' | 'manage';
  setHabitDetailInitialTab: (t: 'progress' | 'motivation' | 'manage') => void;
  shareCardData: ShareCardData | null;
  setShareCardData: (d: ShareCardData | null) => void;
}

/**
 * Manages habit selection states for modal interactions.
 * Extracted from useHabitsModalsState for decomposition.
 */
export function useHabitSelectionState(): HabitSelectionState {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habitToPause, setHabitToPause] = useState<Habit | null>(null);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [quickActionsHabit, setQuickActionsHabit] = useState<Habit | null>(
    null
  );
  const [habitDetailInitialTab, setHabitDetailInitialTab] = useState<
    'progress' | 'motivation' | 'manage'
  >('progress');
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(
    null
  );

  // Memoised: the modals state object built on top of this is only stable if
  // this one is, and `useState` setters already have stable identities.
  return useMemo(
    () => ({
      habitDetailInitialTab,
      habitToEdit,
      habitToPause,
      quickActionsHabit,
      selectedHabit,
      setHabitDetailInitialTab,
      setHabitToEdit,
      setHabitToPause,
      setQuickActionsHabit,
      setSelectedHabit,
      setShareCardData,
      shareCardData,
    }),
    [
      habitDetailInitialTab,
      habitToEdit,
      habitToPause,
      quickActionsHabit,
      selectedHabit,
      shareCardData,
    ]
  );
}
