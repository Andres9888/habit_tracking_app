import type { ComponentType } from 'react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { ShareCardData } from '../../types';
import type { HabitsModalsState } from '../../hooks/useHabitsApp';

/** Props for the main HabitsModals orchestrator component */
export interface HabitsModalsProps {
  state: HabitsModalsState;
  onPremiumUpsell?: () => void;
}

/** Props for the SettingsModalSection component */
export interface SettingsModalSectionProps {
  archivedHabitsCount: number;
  settings: HabitsModalsState['settings'];
  showSettings: boolean;
  closeSettings: () => void;
  onSettingsChange: HabitsModalsState['onSettingsChange'];
  onPremiumUpsell?: () => void;
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
  openHabitCalendar: HabitsModalsState['openHabitCalendar'];
  handleArchive: (habitId: Id<'habits'>) => void | Promise<void>;
  onDeleteHabit: (habitId: Id<'habits'>) => void | Promise<void>;
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
  habits: HabitsModalsState['habits'];
  showTemplatesScreen: boolean;
  closeTemplatesScreen: () => void;
  clearPendingFocusHabit: HabitsModalsState['clearPendingFocusHabit'];
  commitFocusHabitOnHome: HabitsModalsState['commitFocusHabitOnHome'];
  prepareFocusHabitOnHome: HabitsModalsState['prepareFocusHabitOnHome'];
  openHabitDetail: HabitsModalsState['openHabitDetail'];
  reduceMotionPreference: boolean;
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
  onDeleteHabit: (habitId: Id<'habits'>) => void | Promise<void>;
}

/** Props for the VisualizationModalSection component */
export interface VisualizationModalSectionProps {
  selectedHabit: HabitsModalsState['selectedHabit'];
  showVisualizationExercise: boolean;
  closeVisualizationExercise: () => void;
}

/** Lazy-loaded ShareCardGenerator component type */
export type ShareCardGeneratorComponent = ComponentType<{
  data: ShareCardData;
  visible: boolean;
  onClose: () => void;
}>;
