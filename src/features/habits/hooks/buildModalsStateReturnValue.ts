import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import type { HabitsModalsState } from './types';
import type { ModalVisibilityState } from './useModalVisibilityState';
import type { HabitSelectionState } from './useHabitSelectionState';

interface HandlersReturn {
  closeCreateHabit: () => void;
  closeEditScreen: () => void;
  closeShareCard: () => void;
  closeQuickActions: () => void;
  confirmPause: () => Promise<void>;
  closeVisualizationExercise: () => void;
  onSettingsChange: (u: unknown) => Promise<void>;
  onDeleteHabit: (id: Id<'habits'>) => Promise<void>;
  openEditHabit: (h: Habit | null) => void;
  closeActivationModal: () => void;
  openHabitCalendar: (h: Habit) => void;
  onShareMilestone: (d: unknown) => void;
  openHabitDetail: (h: Habit, t?: 'progress' | 'motivation' | 'manage') => void;
  openActivationModal: (h: Habit) => void;
  openPauseModal: (id: Id<'habits'>) => void;
  openActivationModalById: (id: string) => void;
  openCreateHabitScreen: () => void;
  openQuickActions: (h: Habit) => void;
  openVisualizationExercise: (h: Habit) => void;
}

interface ExtraState {
  celebrationsEnabled: boolean;
  habits: Habit[];
  settings: unknown;
  milestone: unknown;
  showHabitStrengthPercentage: boolean;
  tracking: unknown;
  reduceMotionPreference: boolean;
  handleArchive: (id: Id<'habits'>) => Promise<void>;
  onChangeCelebrationsEnabled: (value: boolean) => Promise<void>;
  handleToggleHabit: (args: {
    habitId: Id<'habits'>;
    date: string;
  }) => Promise<void>;
  clearMilestone: () => void;
  getStreak: unknown;
}

export function buildModalsStateReturnValue(
  v: ModalVisibilityState,
  s: HabitSelectionState,
  h: HandlersReturn,
  extra: ExtraState
): HabitsModalsState {
  return {
    activationModalHabit: s.activationModalHabit,
    // State properties
    celebrationsEnabled: extra.celebrationsEnabled,
    habitDetailInitialTab: s.habitDetailInitialTab,
    habits: extra.habits,
    habitToEdit: s.habitToEdit,
    habitToPause: s.habitToPause,
    milestone: extra.milestone,
    quickActionsHabit: s.quickActionsHabit,
    settings: extra.settings,
    showActivationModal: v.showActivationModal,
    showCreateHabit: v.isCreateHabitOpen,
    showEditScreen: v.showEditScreen,
    selectedHabit: s.selectedHabit,
    showHabitCalendar: v.isHabitCalendarOpen,
    shareCardData: s.shareCardData,
    showHabitDetail: v.isHabitDetailOpen,
    reduceMotionPreference: extra.reduceMotionPreference,
    showHapticTest: v.showHapticTest,
    // Handlers from extracted hook
    closeCreateHabit: h.closeCreateHabit,

    showPauseModal: v.showPauseModal,

    closeEditScreen: h.closeEditScreen,

    showQuickActions: v.showQuickActions,

    closeQuickActions: h.closeQuickActions,

    showSettings: v.isSettingsOpen,

    closeShareCard: h.closeShareCard,

    closeActivationModal: h.closeActivationModal,

    showShareCard: v.showShareCard,
    closeVisualizationExercise: h.closeVisualizationExercise,
    showTemplatesScreen: v.showTemplatesScreen,
    confirmPause: h.confirmPause,
    showVisualizationExercise: v.showVisualizationExercise,
    onDeleteHabit: h.onDeleteHabit,
    showHabitStrengthPercentage: extra.showHabitStrengthPercentage,
    onSettingsChange: h.onSettingsChange,
    tracking: extra.tracking,
    // Extra handlers
    onChangeCelebrationsEnabled: extra.onChangeCelebrationsEnabled,

    onShareMilestone: h.onShareMilestone,

    handleArchive: extra.handleArchive,

    openActivationModal: h.openActivationModal,

    clearMilestone: extra.clearMilestone,

    openActivationModalById: h.openActivationModalById,

    getStreak: extra.getStreak,

    openCreateHabitScreen: h.openCreateHabitScreen,

    // Inline close handlers
    closeSettings: () => v.setIsSettingsOpen(false),

    openEditHabit: h.openEditHabit,

    closeHabitCalendar: () => v.setIsHabitCalendarOpen(false),

    openHabitCalendar: h.openHabitCalendar,

    closeHabitDetail: () => v.setIsHabitDetailOpen(false),

    openHabitDetail: h.openHabitDetail,

    closeHapticTest: () => v.setShowHapticTest(false),

    openPauseModal: h.openPauseModal,

    closePauseModal: () => {
      v.setShowPauseModal(false);
      s.setHabitToPause(null);
    },
    openQuickActions: h.openQuickActions,
    closeTemplatesScreen: () => v.setShowTemplatesScreen(false),
    openVisualizationExercise: h.openVisualizationExercise,
    openHapticTest: () => {
      v.setIsSettingsOpen(false);
      v.setShowHapticTest(true);
    },
    // Inline open handlers
    openSettings: () => v.setIsSettingsOpen(true),

    toggleHabit: extra.handleToggleHabit,

    openTemplatesScreen: () => v.setShowTemplatesScreen(true),
    setShowHabitStrengthPercentage: () => {},
  } as HabitsModalsState;
}
