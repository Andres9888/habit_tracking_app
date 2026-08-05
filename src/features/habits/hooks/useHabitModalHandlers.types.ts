/**
 * Types for useHabitModalHandlers hook
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSettings } from '../types';

export interface HabitModalSetters {
  setIsHabitDetailOpen: (v: boolean) => void;
  setIsHabitCalendarOpen: (v: boolean) => void;
  setSelectedHabit: (h: Habit | null) => void;
  setHabitDetailInitialTab: (t: 'progress' | 'motivation' | 'manage') => void;
  setHabitToPause: (h: Habit | null) => void;
  setShowPauseModal: (v: boolean) => void;
  setHabitToEdit: (h: Habit | null) => void;
  setShowEditScreen: (v: boolean) => void;
  setIsCreateHabitOpen: (v: boolean) => void;
}

export interface HabitModalDeps {
  habits: Habit[];
  settings: HabitSettings | undefined;
  updateSettings: (s: HabitSettings) => Promise<void>;
  removeHabit: (args: { habitId: Id<'habits'> }) => Promise<void>;
  pauseHabit: (args: { habitId: Id<'habits'> }) => Promise<void>;
  habitToPause: Habit | null;
}
