import { useCallback, useMemo } from 'react';
import type { ReactElement } from 'react';
import type { Habit } from '../types';
import { useHabitCalendar } from './useHabitCalendar';
import { useHabitData } from './useHabitData';
import { useHabitMutations } from './useHabitMutations';
import { useHabitTracking } from './useHabitTracking';
import { useHabitsUIState } from './useHabitsUIState';
import { useMilestoneCelebrationState } from './useMilestoneCelebrationState';
import { useHabitHandlers } from './useHabitHandlers';
import { useHabitRenderItem } from './useHabitRenderItem';
import { HabitsHeader } from '../components/HabitsHeader';
import { HabitsEmptyState } from '../components/HabitsEmptyState';
import type { HabitsModalsProps } from '../components/HabitsModals';

interface HabitsViewModel {
  data: Habit[];
  renderItem: ReturnType<typeof useHabitRenderItem>;
  onDragEnd: ReturnType<typeof useHabitHandlers>['handleDragEnd'];
  listHeader: ReactElement;
  listEmpty: () => ReactElement;
  contentContainerStyle: { paddingHorizontal: number; paddingTop: number; paddingBottom: number };
  openCreateHabit: () => void;
  modalProps: HabitsModalsProps;
}

export function useHabitsViewModel(): HabitsViewModel {
  const {
    today,
    weekDates,
    weekDateStrings,
    extendedDateStrings,
    handlePreviousWeek,
    handleNextWeek,
    canNavigateForward,
  } = useHabitCalendar();

  const { habits, isHabitsLoading, settings, tracking } =
    useHabitData(extendedDateStrings);

  const mutations = useHabitMutations();

  const uiState = useHabitsUIState();
  const {
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
  } = uiState;

  const { getStreak, getHabitStatus } = useHabitTracking(tracking, today);

  const milestoneState = useMilestoneCelebrationState(habits, isHabitsLoading);

  const handlers = useHabitHandlers({
    reorderHabits: mutations.reorderHabits,
    archiveHabit: mutations.archiveHabit,
    removeHabit: mutations.removeHabit,
    setSelectedHabit,
    setIsHabitCalendarOpen,
    setIsHabitDetailOpen,
  });

  const renderItem = useHabitRenderItem({
    weekDateStrings,
    getHabitStatus,
    getStreak,
    showHabitStrengthPercentage,
    toggleHabit: mutations.toggleHabit,
    handleArchive: handlers.handleArchive,
    handleHabitPress: handlers.handleHabitPress,
  });

  const handleSelectHabitById = useCallback(
    (habitId: string) => {
      const habit = habits.find((h) => h._id === habitId);
      if (habit) {
        handlers.handleHabitPress(habit);
      }
    },
    [habits, handlers]
  );

  const contentContainerStyle = useMemo(
    () => ({ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 96 }),
    []
  );

  const listHeader = useMemo(
    () => (
      <HabitsHeader
        canNavigateForward={canNavigateForward}
        dates={weekDates}
        onNextWeek={handleNextWeek}
        onPreviousWeek={handlePreviousWeek}
        onOpenCreateHabit={openCreateHabit}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSelectHabitById={handleSelectHabitById}
      />
    ),
    [
      canNavigateForward,
      handleNextWeek,
      handlePreviousWeek,
      handleSelectHabitById,
      openCreateHabit,
      setIsSettingsOpen,
      weekDates,
    ]
  );

  const listEmpty = useCallback(
    () => (
      <HabitsEmptyState
        isLoading={isHabitsLoading}
        onCreateHabit={openCreateHabit}
      />
    ),
    [isHabitsLoading, openCreateHabit]
  );

  const modalProps: HabitsModalsProps = {
    settings,
    showHabitStrengthPercentage,
    onChangeShowHabitStrengthPercentage: setShowHabitStrengthPercentage,
    isSettingsOpen,
    onCloseSettings: () => setIsSettingsOpen(false),
    onOpenHapticTest: () => {
      setIsSettingsOpen(false);
      setShowHapticTest(true);
    },
    updateSettings: mutations.updateSettings,
    isCreateHabitOpen,
    onCloseCreateHabit: () => {
      setIsCreateHabitOpen(false);
      setHabitToEdit(null);
    },
    habitToEdit,
    showHapticTest,
    onCloseHapticTest: () => setShowHapticTest(false),
    milestone: milestoneState.milestone,
    onCloseMilestone: milestoneState.closeCelebration,
    onShareMilestone: milestoneState.openShareCard,
    showShareCard: milestoneState.showShareCard,
    shareCardData: milestoneState.shareCardData,
    onCloseShareCard: milestoneState.closeShareCard,
    selectedHabit,
    tracking,
    toggleHabit: mutations.toggleHabit,
    isHabitCalendarOpen,
    onCloseHabitCalendar: () => setIsHabitCalendarOpen(false),
    getStreak,
    isHabitDetailOpen,
    onCloseHabitDetail: () => setIsHabitDetailOpen(false),
    onEditHabit: (habit) => {
      setIsHabitDetailOpen(false);
      setHabitToEdit(habit);
    },
    onPauseHabit: (habitId) => {
      const habit = habits.find((h) => h._id === habitId);
      if (habit) {
        setHabitToPause(habit);
        setShowPauseModal(true);
      }
    },
    onArchiveHabit: handlers.handleArchive,
    onDeleteHabit: handlers.handleDeleteHabit,
    onOpenCalendar: handlers.handleHabitPress,
    showPauseModal,
    habitToPause,
    onConfirmPause: async () => {
      if (habitToPause) {
        await mutations.pauseHabit({ habitId: habitToPause._id });
        setShowPauseModal(false);
        setHabitToPause(null);
        setIsHabitDetailOpen(false);
      }
    },
    onCancelPause: () => {
      setShowPauseModal(false);
      setHabitToPause(null);
    },
  };

  return {
    data: habits,
    renderItem,
    onDragEnd: handlers.handleDragEnd,
    listHeader,
    listEmpty,
    contentContainerStyle,
    openCreateHabit: uiState.openCreateHabit,
    modalProps,
  };
}
