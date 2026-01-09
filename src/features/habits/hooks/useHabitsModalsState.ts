import { useCallback, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSettings, ShareCardData } from '../types';
import { useHabitMutations } from './useHabitMutations';
import { useHabitMilestones } from './useHabitMilestones';
import { useHabitsTracking } from './useHabitsTracking';
import { useHabitStateSync } from './useHabitStateSync';
import { useHabitsModalsHandlers } from './useHabitsModalsHandlers';
import type { HabitsModalsState } from './types';

interface UseHabitsModalsStateProps {
  habits: Habit[];
  showHabitStrengthPercentage: boolean;
}

export function useHabitsModalsState({
  habits,
  showHabitStrengthPercentage,
}: UseHabitsModalsStateProps): HabitsModalsState {
  // Modal visibility states
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
  const [showActivationModal, setShowActivationModal] = useState(false);

  // Habit states for modals
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habitToPause, setHabitToPause] = useState<Habit | null>(null);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [quickActionsHabit, setQuickActionsHabit] = useState<Habit | null>(
    null
  );
  const [activationModalHabit, setActivationModalHabit] =
    useState<Habit | null>(null);

  // Other states
  const [habitDetailInitialTab, setHabitDetailInitialTab] = useState<
    'progress' | 'motivation' | 'manage'
  >('progress');
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(
    null
  );

  // Hooks
  const { pauseHabit, removeHabit, updateSettings, toggleHabit, archiveHabit } =
    useHabitMutations();
  const { milestone, clearMilestone } = useHabitMilestones(habits, false);

  const settingsQuery = useQuery(api.settings.get);
  const settings = (settingsQuery ?? undefined) as HabitSettings | undefined;
  const celebrationsEnabled = settings?.showMotivationalMessages ?? true;
  const reduceMotionPreference = settings?.reduceMotion ?? false;

  // Tracking
  const extendedDateStrings = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { tracking, getStreak } = useHabitsTracking(extendedDateStrings, today);

  // Sync habit snapshots with source of truth
  useHabitStateSync(habits, selectedHabit, setSelectedHabit, 'selectedHabit');
  useHabitStateSync(habits, habitToEdit, setHabitToEdit);
  useHabitStateSync(habits, habitToPause, setHabitToPause);
  useHabitStateSync(habits, quickActionsHabit, setQuickActionsHabit);
  useHabitStateSync(habits, activationModalHabit, setActivationModalHabit);

  // Handlers from extracted hook
  const handlers = useHabitsModalsHandlers(
    {
      setHabitDetailInitialTab,
      setHabitToEdit,
      setHabitToPause,
      setIsCreateHabitOpen,
      setIsHabitCalendarOpen,
      setIsHabitDetailOpen,
      setQuickActionsHabit,
      setActivationModalHabit,
      setSelectedHabit,
      setShareCardData,
      setShowActivationModal,
      setShowEditScreen,
      setShowShareCard,
      setShowPauseModal,
      setShowQuickActions,
      setShowVisualizationExercise,
    },
    {
      clearMilestone,
      habits,
      habitToPause,
      pauseHabit,
      removeHabit,
      settings,
      updateSettings,
    }
  );

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  const onChangeCelebrationsEnabled = useCallback(
    async (value: boolean) => {
      await handlers.onSettingsChange({ showMotivationalMessages: value });
    },
    [handlers]
  );

  const handleToggleHabit = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      await toggleHabit(args);
    },
    [toggleHabit]
  );

  return {
    // State
    celebrationsEnabled,
    habitDetailInitialTab,
    habits,
    settings,
    showCreateHabit: isCreateHabitOpen,
    showEditScreen,
    showActivationModal,
    showHabitCalendar: isHabitCalendarOpen,
    activationModalHabit,
    showHabitDetail: isHabitDetailOpen,
    habitToEdit,
    showHapticTest,
    habitToPause,
    showSettings: isSettingsOpen,
    milestone,
    quickActionsHabit,
    showPauseModal,
    // Handlers
    closeSettings: () => setIsSettingsOpen(false),

    showQuickActions,

    openCreateHabitScreen: handlers.openCreateHabitScreen,

    showShareCard,

    onChangeCelebrationsEnabled,

    showTemplatesScreen,

    closeCreateHabit: handlers.closeCreateHabit,

    showVisualizationExercise,

    closeEditScreen: handlers.closeEditScreen,

    closeHabitCalendar: () => setIsHabitCalendarOpen(false),
    selectedHabit,
    closeHabitDetail: () => setIsHabitDetailOpen(false),
    shareCardData,
    closeHapticTest: () => setShowHapticTest(false),
    showHabitStrengthPercentage,
    closePauseModal: () => {
      setShowPauseModal(false);
      setHabitToPause(null);
    },
    tracking,
    closeShareCard: handlers.closeShareCard,
    reduceMotionPreference,
    closeTemplatesScreen: () => setShowTemplatesScreen(false),
    openSettings: () => setIsSettingsOpen(true),
    closeQuickActions: handlers.closeQuickActions,
    closeVisualizationExercise: handlers.closeVisualizationExercise,
    setShowHabitStrengthPercentage: () => {},
    openActivationModal: handlers.openActivationModal,
    closeActivationModal: handlers.closeActivationModal,
    openEditHabit: handlers.openEditHabit,
    onDeleteHabit: handlers.onDeleteHabit,
    openHabitCalendar: handlers.openHabitCalendar,
    clearMilestone,
    openHapticTest: () => {
      setIsSettingsOpen(false);
      setShowHapticTest(true);
    },
    confirmPause: handlers.confirmPause,
    openTemplatesScreen: () => setShowTemplatesScreen(true),
    getStreak,
    openHabitDetail: handlers.openHabitDetail,
    handleArchive,
    openPauseModal: handlers.openPauseModal,
    onSettingsChange: handlers.onSettingsChange,
    openQuickActions: handlers.openQuickActions,
    onShareMilestone: handlers.onShareMilestone,
    openVisualizationExercise: handlers.openVisualizationExercise,
    openActivationModalById: handlers.openActivationModalById,
    toggleHabit: handleToggleHabit,
  };
}
