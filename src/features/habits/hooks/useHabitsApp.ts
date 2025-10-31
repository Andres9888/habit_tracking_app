import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addDays, eachDayOfInterval, format, startOfDay, subMonths } from 'date-fns';
import { useMutation, useQuery } from 'convex/react';
import { Platform, Alert } from 'react-native';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useMilestoneDetection } from '../../../hooks/useMilestoneDetection';
import { computeCurrentStreakFromDates } from '../../../utils/streak';
import type {
  Habit,
  HabitStatus,
  ShareCardData,
  HabitSettings,
  HabitSettingsUpdate,
  HabitTrackingEntry,
} from '../types';

interface LastUpdatedHabit {
  id: string;
  name: string;
  strength: number;
}

export interface HabitsListState {
  habits: Habit[];
  isHabitsLoading: boolean;
  weekDates: Date[];
  weekDateStrings: string[];
  canNavigateForward: boolean;
  showHabitStrengthPercentage: boolean;
  contentPadding: { paddingHorizontal: number; paddingTop: number; paddingBottom: number };
  handleDragEnd: (event: { data: Habit[] }) => Promise<void>;
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
  handleHabitPress: (habit: Habit) => void;
  handleNextWeek: () => void;
  handlePreviousWeek: () => void;
  openCreateHabitScreen: () => void;
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  getStreak: (habitId: string) => number;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<void>;
}

export interface HabitsModalsState {
  habits: Habit[];
  settings: HabitSettings | undefined;
  showSettings: boolean;
  showCreateHabit: boolean;
  showHabitCalendar: boolean;
  showHabitDetail: boolean;
  showHapticTest: boolean;
  showShareCard: boolean;
  showPauseModal: boolean;
  showTemplatesScreen: boolean;
  habitToEdit: Habit | null;
  habitToPause: Habit | null;
  selectedHabit: Habit | null;
  shareCardData: ShareCardData | null;
  milestone: ReturnType<typeof useMilestoneDetection>['milestone'];
  tracking: HabitTrackingEntry[];
  showHabitStrengthPercentage: boolean;
  closeSettings: () => void;
  openSettings: () => void;
  setShowHabitStrengthPercentage: (value: boolean) => void;
  closeCreateHabit: () => void;
  closeHabitCalendar: () => void;
  closeHabitDetail: () => void;
  closeShareCard: () => void;
  closePauseModal: () => void;
  openHapticTest: () => void;
  closeHapticTest: () => void;
  openTemplatesScreen: () => void;
  closeTemplatesScreen: () => void;
  openHabitDetail: (habit: Habit) => void;
  openHabitCalendar: (habit: Habit) => void;
  openPauseModal: (habitId: Id<'habits'>) => void;
  setHabitToEdit: (habit: Habit | null) => void;
  onSettingsChange: (updates: Partial<HabitSettingsUpdate>) => Promise<void>;
  onDeleteHabit: (habitId: Id<'habits'>) => Promise<void>;
  onShareMilestone: (data: ShareCardData) => void;
  clearMilestone: () => void;
  confirmPause: () => Promise<void>;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<void>;
  getStreak: (habitId: string) => number;
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
}

export interface UseHabitsAppResult {
  list: HabitsListState;
  modals: HabitsModalsState;
}

export function useHabitsApp(): UseHabitsAppResult {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false);
  const [showHabitStrengthPercentage, setShowHabitStrengthPercentage] = useState(true);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isHabitCalendarOpen, setIsHabitCalendarOpen] = useState(false);
  const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [habitToPause, setHabitToPause] = useState<Habit | null>(null);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [showHapticTest, setShowHapticTest] = useState(false);
  const [showTemplatesScreen, setShowTemplatesScreen] = useState(false);

  const toggleHabit = useMutation(api.habits.toggleHabit);
  const archiveHabit = useMutation(api.habits.archive);
  const pauseHabit = useMutation(api.habits.pause);
  const removeHabit = useMutation(api.habits.remove);
  const reorderHabits = useMutation(api.habits.reorderHabits);
  const updateSettings = useMutation(api.settings.update);

  const habitsQuery = useQuery(api.habits.list);
  const habits = (habitsQuery ?? []) as Habit[];
  const isHabitsLoading = habitsQuery === undefined;
  const settingsQuery = useQuery(api.settings.get);
  const settings = (settingsQuery ?? undefined) as HabitSettings | undefined;

  const [lastUpdatedHabit, setLastUpdatedHabit] = useState<LastUpdatedHabit | null>(null);
  const { milestone, clearMilestone } = useMilestoneDetection(
    lastUpdatedHabit?.id,
    lastUpdatedHabit?.name,
    lastUpdatedHabit?.strength ? lastUpdatedHabit.strength * 100 : undefined
  );

  useEffect(() => {
    if (milestone) {
      console.log('🎉 MILESTONE DETECTED!', {
        level: milestone.level,
        strength: milestone.strength + '%',
        habitName: milestone.habitName,
      });
    }
  }, [milestone]);

  const prevStrengthsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (isHabitsLoading) return;

    habits.forEach((habit) => {
      const prevStrength = prevStrengthsRef.current.get(habit._id) || 0;
      const currentStrength = habit.strength || 0;

      if (currentStrength > prevStrength) {
        console.log('🎯 Strength increased!', {
          habitName: habit.name,
          prevStrength: (prevStrength * 100).toFixed(1) + '%',
          currentStrength: (currentStrength * 100).toFixed(1) + '%',
        });
        setLastUpdatedHabit({
          id: habit._id,
          name: habit.name,
          strength: currentStrength,
        });
      }

      prevStrengthsRef.current.set(habit._id, currentStrength);
    });
  }, [habits, isHabitsLoading]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const [weekAnchor, setWeekAnchor] = useState(today);

  const weekDates = useMemo(
    () => Array.from({ length: 5 }, (_, i) => addDays(weekAnchor, i - 4)),
    [weekAnchor]
  );

  const weekDateStrings = useMemo(
    () => weekDates.map((d) => format(d, 'yyyy-MM-dd')),
    [weekDates]
  );

  const extendedDateRange = useMemo(() => {
    const endDate = today;
    const startDate = subMonths(endDate, 12);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [today]);

  const extendedDateStrings = useMemo(
    () => extendedDateRange.map((d) => format(d, 'yyyy-MM-dd')),
    [extendedDateRange]
  );

  const trackingQuery = useQuery(api.habits.getTracking, { dates: extendedDateStrings });
  const tracking = (trackingQuery ?? []) as HabitTrackingEntry[];

  const completedDatesByHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const t of tracking) {
      if (!t.completed) continue;
      if (!map.has(t.habitId)) {
        map.set(t.habitId, new Set<string>());
      }
      map.get(t.habitId)!.add(t.date);
    }
    return map;
  }, [tracking]);

  const getStreak = useCallback(
    (habitId: string) => {
      const completedDates = completedDatesByHabit.get(habitId);
      if (!completedDates) return 0;
      return computeCurrentStreakFromDates(completedDates, today);
    },
    [completedDatesByHabit, today]
  );

  const openCreateHabitScreen = useCallback(() => {
    setIsCreateHabitOpen(true);
  }, []);

  const handlePreviousWeek = useCallback(() => {
    setWeekAnchor((prev) => addDays(prev, -5));
  }, []);

  const handleNextWeek = useCallback(() => {
    setWeekAnchor((prev) => addDays(prev, 5));
  }, []);

  const canNavigateForward = useMemo(
    () => weekAnchor.getTime() < today.getTime(),
    [weekAnchor, today]
  );

  const getHabitStatus = useCallback(
    (habitId: string, dateString: string): HabitStatus => {
      const trackingEntry = tracking.find(
        (t) => t.habitId === habitId && t.date === dateString
      );

      if (trackingEntry?.completed) return 'done';

      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);

      if (date < today) return 'missed';
      return 'planned';
    },
    [tracking, today]
  );

  const handleDragEnd = useCallback(
    async ({ data }: { data: Habit[] }) => {
      try {
        const habitIds = data.map((h) => h._id);
        await reorderHabits({ habitIds });
      } catch (error) {
        console.error('Failed to reorder habits:', error);
      }
    },
    [reorderHabits]
  );

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  const handleDeleteHabit = useCallback(
    async (habitId: Id<'habits'>) => {
      if (Platform.OS === 'web') {
        if (!confirm('Are you sure you want to delete this habit? This cannot be undone.')) {
          return;
        }
        await removeHabit({ habitId });
        setIsHabitDetailOpen(false);
        setSelectedHabit(null);
      } else {
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
      }
    },
    [removeHabit]
  );

  const handleHabitPress = useCallback((habit: Habit) => {
    setSelectedHabit(habit);
    setIsHabitCalendarOpen(true);
  }, []);

  const confirmPause = useCallback(async () => {
    if (!habitToPause) return;
    await pauseHabit({ habitId: habitToPause._id });
    setShowPauseModal(false);
    setHabitToPause(null);
    setIsHabitDetailOpen(false);
  }, [habitToPause, pauseHabit]);

  const list: HabitsListState = {
    habits,
    isHabitsLoading,
    weekDates,
    weekDateStrings,
    canNavigateForward,
    showHabitStrengthPercentage,
    contentPadding: { paddingHorizontal: 24, paddingTop: 0, paddingBottom: 96 },
    handleDragEnd,
    handleArchive,
    handleHabitPress,
    handleNextWeek,
    handlePreviousWeek,
    openCreateHabitScreen,
    getHabitStatus,
    getStreak,
    toggleHabit,
  };

  const modals: HabitsModalsState = {
    habits,
    settings,
    showSettings: isSettingsOpen,
    showCreateHabit: isCreateHabitOpen || habitToEdit !== null,
    showHabitCalendar: isHabitCalendarOpen,
    showHabitDetail: isHabitDetailOpen,
    showHapticTest,
    showShareCard,
    showPauseModal,
    showTemplatesScreen,
    habitToEdit,
    habitToPause,
    selectedHabit,
    shareCardData,
    milestone,
    tracking,
    showHabitStrengthPercentage,
    closeSettings: () => setIsSettingsOpen(false),
    openSettings: () => setIsSettingsOpen(true),
    setShowHabitStrengthPercentage,
    closeCreateHabit: () => {
      setIsCreateHabitOpen(false);
      setHabitToEdit(null);
    },
    closeHabitCalendar: () => setIsHabitCalendarOpen(false),
    closeHabitDetail: () => setIsHabitDetailOpen(false),
    closeShareCard: () => {
      setShowShareCard(false);
      setShareCardData(null);
      clearMilestone();
      setLastUpdatedHabit(null);
    },
    closePauseModal: () => {
      setShowPauseModal(false);
      setHabitToPause(null);
    },
    openHapticTest: () => {
      setIsSettingsOpen(false);
      setShowHapticTest(true);
    },
    closeHapticTest: () => setShowHapticTest(false),
    openTemplatesScreen: () => setShowTemplatesScreen(true),
    closeTemplatesScreen: () => setShowTemplatesScreen(false),
    openHabitDetail: (habit: Habit) => {
      setSelectedHabit(habit);
      setIsHabitDetailOpen(true);
    },
    openHabitCalendar: (habit: Habit) => {
      setSelectedHabit(habit);
      setIsHabitCalendarOpen(true);
    },
    openPauseModal: (habitId: Id<'habits'>) => {
      const habit = habits.find((h) => h._id === habitId) || null;
      if (habit) {
        setHabitToPause(habit);
        setShowPauseModal(true);
      }
    },
    setHabitToEdit: (habit) => {
      setHabitToEdit(habit);
      if (habit) {
        setIsCreateHabitOpen(true);
      }
    },
    onSettingsChange: async (updates) => {
      if (!settings) return;
      await updateSettings({
        catTheme: updates.catTheme ?? settings.catTheme,
        darkMode: updates.darkMode ?? settings.darkMode,
        showCalendarView: updates.showCalendarView ?? settings.showCalendarView,
        showCharacterScreen:
          updates.showCharacterScreen ?? settings.showCharacterScreen,
        showConsistency: updates.showConsistency ?? settings.showConsistency,
        showEmojis: updates.showEmojis ?? settings.showEmojis,
        showMotivationalMessages:
          updates.showMotivationalMessages ?? settings.showMotivationalMessages,
        showNotesStats: updates.showNotesStats ?? settings.showNotesStats,
        showStreaks: updates.showStreaks ?? settings.showStreaks,
        appIcon: updates.appIcon ?? settings.appIcon,
        highContrastMode: updates.highContrastMode ?? settings.highContrastMode,
        reduceMotion: updates.reduceMotion ?? settings.reduceMotion,
        useDyslexicFont: updates.useDyslexicFont ?? settings.useDyslexicFont,
      });
    },
    onDeleteHabit: handleDeleteHabit,
    onShareMilestone: (data) => {
      setShareCardData(data);
      setShowShareCard(true);
    },
    clearMilestone: () => {
      clearMilestone();
      setLastUpdatedHabit(null);
    },
    confirmPause,
    toggleHabit,
    getStreak,
    handleArchive,
  };

  return { list, modals };
}
