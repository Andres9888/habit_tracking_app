import { useMutation, useQuery } from 'convex/react';
import type { ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Alert, ActivityIndicator, Platform, Pressable, Text, View } from 'react-native';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import { Plus, Settings } from 'lucide-react-native';

import { api } from '../../../../convex/_generated/api';
import type { Habit, HabitId, ShareCardData, SettingsDocument } from '../types';
import DraggableHabit from '../../../components/DraggableHabit';
import { CalendarTimeline } from '../../../components/CalendarTimeline';
import HabitsAtRiskWidget from '../../../components/HabitsAtRiskWidget';
import { useHabitsWeekDates } from './useHabitsWeekDates';
import { useHabitsTracking } from './useHabitsTracking';
import { useHabitMilestones } from './useHabitMilestones';
import type { HabitsModalProps } from '../components/HabitsModals';

export interface HabitsAppController {
  listProps: ReturnType<typeof createListProps>;
  handleToggleForm: () => void;
  modalProps: HabitsModalProps;
}

function createListProps(args: {
  habits: Habit[];
  renderItem: ({ item, drag, isActive }: RenderItemParams<Habit>) => ReactElement;
  handleDragEnd: ({ data }: { data: Habit[] }) => Promise<void> | void;
  renderHeader: () => ReactElement;
  renderEmptyState: () => ReactElement;
  contentContainerStyle: {
    paddingHorizontal: number;
    paddingTop: number;
    paddingBottom: number;
  };
}) {
  return {
    data: args.habits,
    keyExtractor: (habit: Habit) => habit._id,
    renderItem: args.renderItem,
    onDragEnd: args.handleDragEnd,
    ListHeaderComponent: args.renderHeader,
    ListEmptyComponent: args.renderEmptyState,
    contentContainerStyle: args.contentContainerStyle,
    showsVerticalScrollIndicator: false,
    activationDistance: 10,
  } as const;
}

export function useHabitsAppController(): HabitsAppController {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false);
  const [showHabitStrengthPercentage, setShowHabitStrengthPercentage] =
    useState(true);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isHabitCalendarOpen, setIsHabitCalendarOpen] = useState(false);
  const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [habitToPause, setHabitToPause] = useState<Habit | null>(null);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [showHapticTest, setShowHapticTest] = useState(false);

  const toggleHabit = useMutation(api.habits.toggleHabit);
  const archiveHabit = useMutation(api.habits.archive);
  const pauseHabit = useMutation(api.habits.pause);
  const removeHabit = useMutation(api.habits.remove);
  const reorderHabits = useMutation(api.habits.reorderHabits);
  const updateSettings = useMutation(api.settings.update);

  const habitsQuery = useQuery(api.habits.list);
  const habits = habitsQuery ?? [];
  const isHabitsLoading = habitsQuery === undefined;
  const settings = useQuery(api.settings.get);

  const week = useHabitsWeekDates();
  const { tracking, getHabitStatus, getStreak } = useHabitsTracking(
    week.extendedDateStrings,
    week.today
  );
  const { milestone, clearMilestone } = useHabitMilestones(
    habits,
    isHabitsLoading
  );

  const handleToggleForm = useCallback(() => {
    setIsCreateHabitOpen(true);
  }, []);

  const handleHabitPress = useCallback((habit: Habit) => {
    setSelectedHabit(habit);
    setIsHabitCalendarOpen(true);
  }, []);

  const contentContainerStyle = useMemo(
    () => ({ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 96 }),
    []
  );

  const handleDragEnd = useCallback(
    async ({ data }: { data: Habit[] }) => {
      try {
        await reorderHabits({ habitIds: data.map((habit) => habit._id) });
      } catch (error) {
        console.error('Failed to reorder habits:', error);
      }
    },
    [reorderHabits]
  );

  const handleArchive = useCallback(
    async (habitId: HabitId) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  const handleDeleteHabit = useCallback(
    async (habitId: HabitId) => {
      if (Platform.OS === 'web') {
        if (
          !confirm(
            'Are you sure you want to delete this habit? This cannot be undone.'
          )
        ) {
          return;
        }
        await removeHabit({ habitId });
        setIsHabitDetailOpen(false);
        setSelectedHabit(null);
        return;
      }

      Alert.alert(
        'Delete Habit',
        'Are you sure you want to delete this habit? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await removeHabit({ habitId });
              setIsHabitDetailOpen(false);
              setSelectedHabit(null);
            },
          },
        ]
      );
    },
    [removeHabit]
  );

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Habit>) => {
      const weekStatus = week.weekDateStrings.map((dateString) =>
        getHabitStatus(item._id, dateString)
      );
      const streak = getStreak(item._id);
      return (
        <ScaleDecorator>
          <View className='mb-4' style={{ opacity: isActive ? 0.7 : 1 }}>
            <DraggableHabit
              habit={item}
              showHabitStrengthPercentage={showHabitStrengthPercentage}
              streak={streak}
              toggleHabit={toggleHabit}
              weekDateStrings={week.weekDateStrings}
              weekStatus={weekStatus}
              onArchive={handleArchive}
              onLongPress={drag}
              onPress={handleHabitPress}
            />
          </View>
        </ScaleDecorator>
      );
    },
    [
      getHabitStatus,
      getStreak,
      handleArchive,
      handleHabitPress,
      showHabitStrengthPercentage,
      toggleHabit,
      week.weekDateStrings,
    ]
  );

  const renderEmptyState = useCallback(() => {
    if (isHabitsLoading) {
      return (
        <View className='items-center justify-center gap-3 py-20'>
          <ActivityIndicator color='#101727' size='small' />
          <Text className='text-sm font-medium text-[#475467]'>
            Loading your habits…
          </Text>
        </View>
      );
    }

    return (
      <View className='items-center justify-center gap-4 px-8 py-24'>
        <Text className='text-center text-lg font-semibold text-[#101727]'>
          Create your first habit
        </Text>
        <Text className='text-center text-sm text-[#475467]'>
          Add a habit to start tracking your progress and building streaks.
        </Text>
        <Pressable
          accessibilityHint='Open create habit modal'
          accessibilityLabel='Add habit'
          accessibilityRole='button'
          className='h-11 flex-row items-center gap-2 rounded-full bg-[#101828] px-5'
          onPress={handleToggleForm}
        >
          <Plus color='#ffffff' size={18} strokeWidth={2.25} />
          <Text className='text-base font-medium tracking-tight text-white'>
            New Habit
          </Text>
        </Pressable>
      </View>
    );
  }, [handleToggleForm, isHabitsLoading]);

  const renderHeader = useCallback(() => (
    <View className='gap-4'>
      <View className='mt-3 flex-row items-center justify-between'>
        <Pressable
          accessibilityHint='Open create habit modal'
          accessibilityLabel='Add habit'
          accessibilityRole='button'
          className='h-12 flex-row items-center gap-2 rounded-full bg-[#101828] px-5'
          onPress={handleToggleForm}
        >
          <Plus color='#ffffff' size={18} strokeWidth={2.25} />
          <Text className='text-base font-normal tracking-tight text-white'>
            Habits
          </Text>
        </Pressable>
        <View className='flex-row gap-3'>
          <Pressable
            accessibilityLabel='Open settings'
            accessibilityRole='button'
            className='h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]'
            onPress={() => setIsSettingsOpen(true)}
          >
            <Settings color='#101727' size={20} strokeWidth={2.25} />
          </Pressable>
        </View>
      </View>

      <CalendarTimeline
        showSeparator
        canNavigateForward={week.canNavigateForward}
        dates={week.weekDates}
        onNextWeek={week.handleNextWeek}
        onPreviousWeek={week.handlePreviousWeek}
      />

      <HabitsAtRiskWidget
        onHabitPress={(habitId) => {
          const habit = habits.find((candidate: Habit) => candidate._id === habitId);
          if (habit) {
            handleHabitPress(habit);
          }
        }}
      />
    </View>
  ), [
    habits,
    handleHabitPress,
    handleToggleForm,
    week.canNavigateForward,
    week.handleNextWeek,
    week.handlePreviousWeek,
    week.weekDates,
  ]);

  const applySettingsUpdate = useCallback(
    async (changes: Partial<SettingsDocument>) => {
      if (!settings) {
        return;
      }

      await updateSettings({
        catTheme: settings.catTheme,
        darkMode: settings.darkMode,
        showCalendarView: settings.showCalendarView,
        showCharacterScreen: settings.showCharacterScreen,
        showConsistency: settings.showConsistency,
        showEmojis: settings.showEmojis,
        showMotivationalMessages: settings.showMotivationalMessages,
        showNotesStats: settings.showNotesStats,
        showStreaks: settings.showStreaks,
        appIcon: settings.appIcon,
        highContrastMode: settings.highContrastMode,
        reduceMotion: settings.reduceMotion,
        useDyslexicFont: settings.useDyslexicFont,
        ...changes,
      });
    },
    [settings, updateSettings]
  );

  const handleOpenHapticTest = useCallback(() => {
    setIsSettingsOpen(false);
    setShowHapticTest(true);
  }, []);

  const milestoneShare = useCallback(() => {
    if (!milestone) {
      return;
    }
    setShareCardData({
      habitName: milestone.habitName,
      milestoneLevel: milestone.level,
      strengthPercentage: milestone.strength,
    });
    setShowShareCard(true);
  }, [milestone]);

  const closeShareCard = useCallback(() => {
    setShowShareCard(false);
    setShareCardData(null);
    clearMilestone();
  }, [clearMilestone]);

  const handlePauseHabit = useCallback(
    (habitId: HabitId) => {
      const habit =
        habits.find((candidate: Habit) => candidate._id === habitId) ?? null;
      if (habit) {
        setHabitToPause(habit);
        setShowPauseModal(true);
      }
    },
    [habits]
  );

  const confirmPause = useCallback(async () => {
    if (!habitToPause) {
      return;
    }
    await pauseHabit({ habitId: habitToPause._id });
    setShowPauseModal(false);
    setHabitToPause(null);
    setIsHabitDetailOpen(false);
  }, [habitToPause, pauseHabit]);

  const cancelPause = useCallback(() => {
    setShowPauseModal(false);
    setHabitToPause(null);
  }, []);

  const closeCreateHabit = useCallback(() => {
    setIsCreateHabitOpen(false);
    setHabitToEdit(null);
  }, []);

  const closeHabitDetail = useCallback(() => {
    setIsHabitDetailOpen(false);
  }, []);

  const modalProps: HabitsModalProps = {
    settings,
    showHabitStrengthPercentage,
    isSettingsOpen,
    isCreateHabitOpen,
    habitToEdit,
    showHapticTest,
    selectedHabit,
    isHabitCalendarOpen,
    tracking,
    toggleHabit,
    getStreak,
    isHabitDetailOpen,
    milestone,
    showShareCard,
    shareCardData,
    showPauseModal,
    pauseHabitName: habitToPause?.name ?? '',
    isPremiumUser: process.env.EXPO_PUBLIC_ENABLE_PREMIUM === 'true' || true,
    onCloseSettings: () => setIsSettingsOpen(false),
    onChangeShowHabitStrengthPercentage: setShowHabitStrengthPercentage,
    onChangeShowCharacterScreen: (value) => applySettingsUpdate({
      showCharacterScreen: value,
    }),
    onChangeShowNotesStats: (value) =>
      applySettingsUpdate({ showNotesStats: value }),
    onOpenHapticTest: handleOpenHapticTest,
    onCloseCreateHabit: closeCreateHabit,
    onCloseHapticTest: () => setShowHapticTest(false),
    onCloseHabitCalendar: () => setIsHabitCalendarOpen(false),
    onCloseHabitDetail: closeHabitDetail,
    onEditHabit: (habit) => {
      setIsHabitDetailOpen(false);
      setHabitToEdit(habit);
    },
    onPauseHabit: handlePauseHabit,
    onArchiveHabit: handleArchive,
    onDeleteHabit: handleDeleteHabit,
    onUpgrade: () => console.log('Upgrade to premium'),
    onOpenCalendar: (habit) => {
      setSelectedHabit(habit);
      setIsHabitCalendarOpen(true);
    },
    onCloseMilestone: () => {
      clearMilestone();
    },
    onShareMilestone: milestoneShare,
    onCloseShareCard: closeShareCard,
    onConfirmPause: confirmPause,
    onCancelPause: cancelPause,
  };

  const listProps = createListProps({
    habits,
    renderItem,
    handleDragEnd,
    renderHeader,
    renderEmptyState,
    contentContainerStyle,
  });

  return {
    listProps,
    handleToggleForm,
    modalProps,
  };
}
