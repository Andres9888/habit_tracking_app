import { useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, ShareCardData } from '../types';

export interface CompletionNoteContext {
  habitId: Id<'habits'>;
  habitName: string;
  date: string;
}

export interface HabitSelectionState {
  selectedHabit: Habit | null;
  setSelectedHabit: (h: Habit | null) => void;
  habitToPause: Habit | null;
  setHabitToPause: (h: Habit | null) => void;
  habitToEdit: Habit | null;
  setHabitToEdit: (h: Habit | null) => void;
  quickActionsHabit: Habit | null;
  setQuickActionsHabit: (h: Habit | null) => void;
  activationModalHabit: Habit | null;
  setActivationModalHabit: (h: Habit | null) => void;
  habitDetailInitialTab: 'progress' | 'motivation' | 'manage';
  setHabitDetailInitialTab: (t: 'progress' | 'motivation' | 'manage') => void;
  shareCardData: ShareCardData | null;
  setShareCardData: (d: ShareCardData | null) => void;
  completionNoteContext: CompletionNoteContext | null;
  setCompletionNoteContext: (c: CompletionNoteContext | null) => void;
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
  const [activationModalHabit, setActivationModalHabit] =
    useState<Habit | null>(null);
  const [habitDetailInitialTab, setHabitDetailInitialTab] = useState<
    'progress' | 'motivation' | 'manage'
  >('progress');
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(
    null
  );
  const [completionNoteContext, setCompletionNoteContext] =
    useState<CompletionNoteContext | null>(null);

  return {
    activationModalHabit,
    completionNoteContext,
    habitDetailInitialTab,
    habitToEdit,
    habitToPause,
    quickActionsHabit,
    selectedHabit,
    setActivationModalHabit,
    setCompletionNoteContext,
    setHabitDetailInitialTab,
    setHabitToEdit,
    setHabitToPause,
    setQuickActionsHabit,
    setSelectedHabit,
    setShareCardData,
    shareCardData,
  };
}
