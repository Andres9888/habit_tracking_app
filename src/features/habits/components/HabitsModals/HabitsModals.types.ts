import type { ComponentType } from 'react';
import type { ShareCardData } from '../../types';
import type { HabitsModalsState } from '../../hooks/useHabitsApp';

/** Props for the main HabitsModals orchestrator component */
export interface HabitsModalsProps {
  state: HabitsModalsState;
}

/** Props for the SettingsModalSection component */
export interface SettingsModalSectionProps {
  settings: HabitsModalsState['settings'];
  showSettings: boolean;
  closeSettings: () => void;
  onSettingsChange: HabitsModalsState['onSettingsChange'];
}

/** Props for the CreateHabitModalSection component */
export interface CreateHabitModalSectionProps {
  showCreateHabit: boolean;
  habitToEdit: HabitsModalsState['habitToEdit'];
  closeCreateHabit: () => void;
}

/** Props for the HapticTestModalSection component */
export interface HapticTestModalSectionProps {
  showHapticTest: boolean;
  closeHapticTest: () => void;
}

/** Props for modals related to calendar and detail screens */
export interface CalendarAndDetailModalsProps {
  selectedHabit: HabitsModalsState['selectedHabit'];
  habitToEdit: HabitsModalsState['habitToEdit'];
  tracking: HabitsModalsState['tracking'];
  showHabitCalendar: boolean;
  showHabitDetail: boolean;
  showEditScreen: boolean;
  getStreak: HabitsModalsState['getStreak'];
  toggleHabit: HabitsModalsState['toggleHabit'];
  closeHabitCalendar: () => void;
  closeHabitDetail: () => void;
  closeEditScreen: () => void;
  openHabitDetail: HabitsModalsState['openHabitDetail'];
  openEditHabit: HabitsModalsState['openEditHabit'];
  openPauseModal: HabitsModalsState['openPauseModal'];
  openHabitCalendar: HabitsModalsState['openHabitCalendar'];
  handleArchive: (habitId: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

/** Props for ShareCard and PauseModal components */
export interface ShareAndPauseModalsProps {
  showShareCard: boolean;
  shareCardData: ShareCardData | null;
  closeShareCard: () => void;
  habitToPause: HabitsModalsState['habitToPause'];
  showPauseModal: boolean;
  closePauseModal: () => void;
  confirmPause: () => void;
}

/** Props for the TemplatesModalSection component */
export interface TemplatesModalSectionProps {
  showTemplatesScreen: boolean;
  closeTemplatesScreen: () => void;
}

/** Props for the QuickActionsSection component */
export interface QuickActionsSectionProps {
  quickActionsHabit: HabitsModalsState['quickActionsHabit'];
  tracking: HabitsModalsState['tracking'];
  showQuickActions: boolean;
  toggleHabit: HabitsModalsState['toggleHabit'];
  closeQuickActions: () => void;
  openHabitDetail: HabitsModalsState['openHabitDetail'];
  openVisualizationExercise: HabitsModalsState['openVisualizationExercise'];
  openHabitCalendar: HabitsModalsState['openHabitCalendar'];
  openEditHabit: HabitsModalsState['openEditHabit'];
  openPauseModal: HabitsModalsState['openPauseModal'];
  onDeleteHabit: (habitId: string) => void;
}

/** Props for the VisualizationModalSection component */
export interface VisualizationModalSectionProps {
  selectedHabit: HabitsModalsState['selectedHabit'];
  showVisualizationExercise: boolean;
  closeVisualizationExercise: () => void;
}

/** Props for the ActivationModalSection component */
export interface ActivationModalSectionProps {
  activationModalHabit: HabitsModalsState['activationModalHabit'];
  showActivationModal: boolean;
  closeActivationModal: () => void;
  toggleHabit: HabitsModalsState['toggleHabit'];
  reduceMotionPreference: boolean;
}

/** Lazy-loaded ShareCardGenerator component type */
export type ShareCardGeneratorComponent = ComponentType<{
  data: ShareCardData;
  visible: boolean;
  onClose: () => void;
}>;
