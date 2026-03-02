import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSettings, HabitSettingsUpdate, ShareCardData } from '../types';
import { useHabitMutations } from './useHabitMutations';
import { useHabitMilestones } from './useHabitMilestones';
import { useHabitsTracking } from './useHabitsTracking';
import type { HabitsModalsState } from './types';
import { formatDateString } from '../../../utils/dateUtils';

interface UseHabitsModalsStateProps {
  habits: Habit[];
  showHabitStrengthPercentage: boolean;
}

export function useHabitsModalsState({ habits, showHabitStrengthPercentage }: UseHabitsModalsStateProps): HabitsModalsState {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isHabitCalendarOpen, setIsHabitCalendarOpen] = useState(false);
  const [isHabitDetailOpen, setIsHabitDetailOpen] = useState(false);
  const [habitDetailInitialTab, setHabitDetailInitialTab] = useState<'progress' | 'motivation' | 'manage'>('progress');
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [habitToPause, setHabitToPause] = useState<Habit | null>(null);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [showHapticTest, setShowHapticTest] = useState(false);
  const [showTemplatesScreen, setShowTemplatesScreen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [quickActionsHabit, setQuickActionsHabit] = useState<Habit | null>(null);
  const [showVisualizationExercise, setShowVisualizationExercise] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [activationModalHabit, setActivationModalHabit] = useState<Habit | null>(null);

  const { pauseHabit, removeHabit, updateSettings, toggleHabit, archiveHabit } = useHabitMutations();
  const { milestone, clearMilestone } = useHabitMilestones(habits, false);

  const settingsQuery = useQuery(api.settings.get);
  const settings = (settingsQuery ?? undefined) as HabitSettings | undefined;
  const celebrationsEnabled = settings?.showMotivationalMessages ?? true;
  const reduceMotionPreference = settings?.reduceMotion ?? false;

  // Use existing tracking hook for consistency
  const extendedDateStrings = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return formatDateString(date);
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { tracking, getStreak } = useHabitsTracking(extendedDateStrings, today);

  // Keep habit state snapshots in sync with the habits array when it updates
  // This ensures that when a habit is edited, the modals/screens show the updated data
  useEffect(() => {
    if (selectedHabit) {
      const updated = habits.find(h => h._id === selectedHabit._id);
      if (updated) {
        // Check if any key fields changed, not just reference
        const streakChanged = updated.currentStreak !== selectedHabit.currentStreak;
        const strengthChanged = updated.strength !== selectedHabit.strength;
        if (streakChanged || strengthChanged || updated !== selectedHabit) {
          console.log('🔄 Syncing selectedHabit:', {
            habitName: updated.name,
            oldStreak: selectedHabit.currentStreak,
            newStreak: updated.currentStreak,
            streakChanged,
          });
          setSelectedHabit(updated);
        }
      }
    }
  }, [habits, selectedHabit]);

  useEffect(() => {
    if (habitToEdit) {
      const updated = habits.find(h => h._id === habitToEdit._id);
      if (updated && updated !== habitToEdit) {
        setHabitToEdit(updated);
      }
    }
  }, [habits, habitToEdit]);

  useEffect(() => {
    if (habitToPause) {
      const updated = habits.find(h => h._id === habitToPause._id);
      if (updated && updated !== habitToPause) {
        setHabitToPause(updated);
      }
    }
  }, [habits, habitToPause]);

  useEffect(() => {
    if (quickActionsHabit) {
      const updated = habits.find(h => h._id === quickActionsHabit._id);
      if (updated && updated !== quickActionsHabit) {
        setQuickActionsHabit(updated);
      }
    }
  }, [habits, quickActionsHabit]);

  useEffect(() => {
    if (activationModalHabit) {
      const updated = habits.find(h => h._id === activationModalHabit._id);
      if (updated && updated !== activationModalHabit) {
        setActivationModalHabit(updated);
      }
    }
  }, [habits, activationModalHabit]);

  const confirmPause = useCallback(async () => {
    if (!habitToPause) return;
    await pauseHabit({ habitId: habitToPause._id });
    setShowPauseModal(false);
    setHabitToPause(null);
    setIsHabitDetailOpen(false);
  }, [habitToPause, pauseHabit]);

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  const closeCreateHabit = useCallback(() => { setIsCreateHabitOpen(false); setHabitToEdit(null); }, []);
  const closeShareCard = useCallback(() => { setShowShareCard(false); setShareCardData(null); clearMilestone(); }, [clearMilestone]);
  const openHabitDetail = useCallback((habit: Habit, initialTab: 'progress' | 'motivation' | 'manage' = 'progress') => { setSelectedHabit(habit); setHabitDetailInitialTab(initialTab); setIsHabitDetailOpen(true); }, []);
  const openHabitCalendar = useCallback((habit: Habit) => { setSelectedHabit(habit); setIsHabitCalendarOpen(true); }, []);
  const openPauseModal = useCallback((habitId: Id<'habits'>) => { const habit = habits.find(h => h._id === habitId); if (habit) { setHabitToPause(habit); setShowPauseModal(true); } }, [habits]);
  const openEditHabit = useCallback((habit: Habit | null) => {
    console.log('[openEditHabit] habit:', habit?._id, 'name:', habit?.name);
    setHabitToEdit(habit);
    if (habit) {
      console.log('[openEditHabit] Setting showEditScreen to true');
      setShowEditScreen(true);
    }
  }, []);
  const closeEditScreen = useCallback(() => { setShowEditScreen(false); setHabitToEdit(null); }, []);
  const openCreateHabitScreen = useCallback(() => { setIsCreateHabitOpen(true); setHabitToEdit(null); }, []);
  const onSettingsChange = useCallback(async (updates: Partial<HabitSettingsUpdate>) => { if (!settings) return; await updateSettings({ ...settings, ...updates }); }, [settings, updateSettings]);

  // Quick Actions Sheet handlers
  const openQuickActions = useCallback((habit: Habit) => { setQuickActionsHabit(habit); setShowQuickActions(true); }, []);
  const closeQuickActions = useCallback(() => { setShowQuickActions(false); setQuickActionsHabit(null); }, []);

  // Visualization Exercise handlers (Mental Boost)
  const openVisualizationExercise = useCallback((habit: Habit) => { setSelectedHabit(habit); setShowVisualizationExercise(true); }, []);
  const closeVisualizationExercise = useCallback(() => { setShowVisualizationExercise(false); }, []);

  // Activation Modal handlers (T7.8: Trigger from notification tap)
  const openActivationModal = useCallback((habit: Habit) => { setActivationModalHabit(habit); setShowActivationModal(true); }, []);
  const openActivationModalById = useCallback((habitId: string) => {
    const habit = habits.find(h => h._id === habitId);
    if (habit) {
      setActivationModalHabit(habit);
      setShowActivationModal(true);
    }
  }, [habits]);
  const closeActivationModal = useCallback(() => { setShowActivationModal(false); setActivationModalHabit(null); }, []);

  const onChangeCelebrationsEnabled = useCallback(async (value: boolean) => {
    await onSettingsChange({ showMotivationalMessages: value });
  }, [onSettingsChange]);
  const onDeleteHabit = useCallback(async (habitId: Id<'habits'>) => { await removeHabit({ habitId }); setIsHabitDetailOpen(false); setSelectedHabit(null); }, [removeHabit]);

  const handleToggleHabit = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      await toggleHabit(args);
    },
    [toggleHabit]
  );

  return { celebrationsEnabled, habits, settings, showSettings: isSettingsOpen, showCreateHabit: isCreateHabitOpen, showEditScreen, showHabitCalendar: isHabitCalendarOpen, showHabitDetail: isHabitDetailOpen, habitDetailInitialTab, showHapticTest, showShareCard, showPauseModal, showTemplatesScreen, showQuickActions, showVisualizationExercise, showActivationModal, activationModalHabit, habitToEdit, habitToPause, selectedHabit, quickActionsHabit, shareCardData, milestone, tracking, showHabitStrengthPercentage, closeSettings: () => setIsSettingsOpen(false), openSettings: () => setIsSettingsOpen(true), openCreateHabitScreen, onChangeCelebrationsEnabled, setShowHabitStrengthPercentage: () => {}, closeCreateHabit, closeEditScreen, closeHabitCalendar: () => setIsHabitCalendarOpen(false), closeHabitDetail: () => setIsHabitDetailOpen(false), closeShareCard, closePauseModal: () => { setShowPauseModal(false); setHabitToPause(null); }, openHapticTest: () => { setIsSettingsOpen(false); setShowHapticTest(true); }, closeHapticTest: () => setShowHapticTest(false), openTemplatesScreen: () => setShowTemplatesScreen(true), closeTemplatesScreen: () => setShowTemplatesScreen(false), openHabitDetail, openHabitCalendar, openPauseModal, openEditHabit, openQuickActions, closeQuickActions, openVisualizationExercise, closeVisualizationExercise, openActivationModal, openActivationModalById, closeActivationModal, onSettingsChange, onDeleteHabit, onShareMilestone: (data: ShareCardData) => { setShareCardData(data); setShowShareCard(true); }, clearMilestone, confirmPause, toggleHabit: handleToggleHabit, getStreak, handleArchive, reduceMotionPreference };
}
