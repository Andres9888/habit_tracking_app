import { useState } from 'react';

export interface ModalVisibilityState {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (v: boolean) => void;
  isCreateHabitOpen: boolean;
  setIsCreateHabitOpen: (v: boolean) => void;
  isHabitCalendarOpen: boolean;
  setIsHabitCalendarOpen: (v: boolean) => void;
  isHabitDetailOpen: boolean;
  setIsHabitDetailOpen: (v: boolean) => void;
  showShareCard: boolean;
  setShowShareCard: (v: boolean) => void;
  showPauseModal: boolean;
  setShowPauseModal: (v: boolean) => void;
  showEditScreen: boolean;
  setShowEditScreen: (v: boolean) => void;
  showHapticTest: boolean;
  setShowHapticTest: (v: boolean) => void;
  showTemplatesScreen: boolean;
  setShowTemplatesScreen: (v: boolean) => void;
  showQuickActions: boolean;
  setShowQuickActions: (v: boolean) => void;
  showVisualizationExercise: boolean;
  setShowVisualizationExercise: (v: boolean) => void;
}

/**
 * Manages visibility state for all modal dialogs in the habits feature.
 * Extracted from useHabitsModalsState for decomposition.
 */
export function useModalVisibilityState(): ModalVisibilityState {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false);
  const [isHabitCalendarOpen, setIsHabitCalendarOpen] = useState(false);
  const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [showHapticTest, setShowHapticTest] = useState(false);
  const [showTemplatesScreen, setShowTemplatesScreen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showVisualizationExercise, setShowVisualizationExercise] =
    useState(false);

  return {
    isCreateHabitOpen,
    isHabitCalendarOpen,
    isHabitDetailOpen,
    isSettingsOpen,
    setIsCreateHabitOpen,
    setIsHabitCalendarOpen,
    setIsHabitDetailOpen,
    setIsSettingsOpen,
    setShowEditScreen,
    setShowHapticTest,
    setShowPauseModal,
    setShowQuickActions,
    setShowShareCard,
    setShowTemplatesScreen,
    setShowVisualizationExercise,
    showEditScreen,
    showHapticTest,
    showPauseModal,
    showQuickActions,
    showShareCard,
    showTemplatesScreen,
    showVisualizationExercise,
  };
}
