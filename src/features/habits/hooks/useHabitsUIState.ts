import { useCallback, useState } from 'react';
import type { Habit } from '../types';

export function useHabitsUIState() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false);
  const [showHabitStrengthPercentage, setShowHabitStrengthPercentage] =
    useState(true);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isHabitCalendarOpen, setIsHabitCalendarOpen] = useState(false);
  const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [habitToPause, setHabitToPause] = useState<Habit | null>(null);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [showHapticTest, setShowHapticTest] = useState(false);

  const openCreateHabit = useCallback(() => {
    setIsCreateHabitOpen(true);
  }, []);

  return {
    isSettingsOpen,
    setIsSettingsOpen,
    isCreateHabitOpen,
    setIsCreateHabitOpen,
    showHabitStrengthPercentage,
    setShowHabitStrengthPercentage,
    selectedHabit,
    setSelectedHabit,
    isHabitCalendarOpen,
    setIsHabitCalendarOpen,
    isHabitDetailOpen,
    setIsHabitDetailOpen,
    showPauseModal,
    setShowPauseModal,
    habitToPause,
    setHabitToPause,
    habitToEdit,
    setHabitToEdit,
    showHapticTest,
    setShowHapticTest,
    openCreateHabit,
  };
}
