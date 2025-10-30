import { useMutation, useQuery } from 'convex/react';
import {
  addDays,
  eachDayOfInterval,
  format,
  startOfDay,
  subMonths,
} from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { api } from '../../../../convex/_generated/api';
import { useMilestoneDetection } from '../../../hooks/useMilestoneDetection';
import type { Habit, HabitId, HabitStatus, ShareCardData } from '../types';

type HabitTrackingEntry = {
  habitId: string;
  date: string;
  completed?: boolean | null;
};

export function useHabitsAppState() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false);
  const [showHabitStrengthPercentage, setShowHabitStrengthPercentage] =
    useState(true);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isHabitCalendarOpen, setIsHabitCalendarOpen] = useState(false);
  const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(
    null
  );
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

  const [lastUpdatedHabit, setLastUpdatedHabit] = useState<{
    id: string;
    name: string;
    strength: number;
  } | null>(null);

  const { milestone, clearMilestone } = useMilestoneDetection(
    lastUpdatedHabit?.id,
    lastUpdatedHabit?.name,
    lastUpdatedHabit?.strength ? lastUpdatedHabit.strength * 100 : undefined
  );

  useEffect(() => {
    if (!milestone) return;
    console.log('🎉 MILESTONE DETECTED!', {
      level: milestone.level,
      strength: milestone.strength + '%',
      habitName: milestone.habitName,
    });
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

  const tracking =
    (useQuery(api.habits.getTracking, { dates: extendedDateStrings }) ?? []) as HabitTrackingEntry[];

  const completedDatesByHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const entry of tracking) {
      if (!entry.completed) continue;
      if (!map.has(entry.habitId)) {
        map.set(entry.habitId, new Set<string>());
      }
      map.get(entry.habitId)!.add(entry.date);
    }
    return map;
  }, [tracking]);

  const getStreak = useCallback(
    (habitId: string) => {
      const completedDates = completedDatesByHabit.get(habitId);
      if (!completedDates) return 0;

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      const todayString = format(todayDate, 'yyyy-MM-dd');
      const currentDate = completedDates.has(todayString)
        ? new Date(todayDate)
        : new Date(todayDate.getTime() - 24 * 60 * 60 * 1000);

      let streak = 0;
      while (true) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        if (completedDates.has(dateString)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    },
    [completedDatesByHabit]
  );

  const handleToggleForm = useCallback(() => {
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

  const getHabitStatus = useCallback<
    (habitId: string, dateString: string) => HabitStatus
  >(
    (habitId, dateString) => {
      const trackingEntry = tracking.find(
        (entry) => entry.habitId === habitId && entry.date === dateString
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
        const habitIds = data.map((habit) => habit._id);
        console.log('Reordering habits:', habitIds);
        await reorderHabits({ habitIds });
        console.log('Reorder successful');
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

  const handleHabitPress = useCallback((habit: Habit) => {
    setSelectedHabit(habit);
    setIsHabitCalendarOpen(true);
  }, []);

  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 96,
    }),
    []
  );

  return {
    habits,
    isHabitsLoading,
    settings,
    toggleHabit,
    updateSettings,
    pauseHabit,
    milestone,
    clearMilestone,
    shareCardData,
    setShareCardData,
    showShareCard,
    setShowShareCard,
    habitToEdit,
    setHabitToEdit,
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
    showHapticTest,
    setShowHapticTest,
    handleToggleForm,
    handleNextWeek,
    handlePreviousWeek,
    canNavigateForward,
    weekDates,
    weekDateStrings,
    handleDragEnd,
    getStreak,
    getHabitStatus,
    handleArchive,
    handleDeleteHabit,
    handleHabitPress,
    contentContainerStyle,
    tracking,
    setLastUpdatedHabit,
  };
}

export type HabitsAppState = ReturnType<typeof useHabitsAppState>;
