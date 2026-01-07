/**
 * HabitDetailScreen Component
 * Calendar-focused Habit Detail Page
 *
 * Features:
 * - Hero section with icon, name, and Quick Complete button (sticky)
 * - HabitStrengthHistory - Strength metrics, chart, and historical comparison
 * - MonthlyCalendarGrid - Monthly calendar view with tap-to-toggle
 * - Stats summary with streak badges
 */

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, Pressable, Alert, ScrollView, Modal as RNModal } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring, withTiming, Easing, interpolate, Extrapolation, type SharedValue, LinearTransition } from 'react-native-reanimated';
import { Modal } from '../components/Modal';
import { MonthlyCalendarGrid } from '../components/BinaryHeatmap';
import { HabitStrengthSection } from '../components/HabitStrengthSection';
import NotesList from '../components/StatsNotesModal/NotesList';
import NoteEditor from '../components/StatsNotesModal/NoteEditor';
import { HeaderCompleteToggle } from '../components/HeaderCompleteToggle';
import { X, Edit3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Id } from '../../convex/_generated/dataModel';
import type { Doc } from '../../convex/_generated/dataModel';
import type { Habit as HabitDoc, HabitTrackingEntry } from '../features/habits/types';
import * as Haptics from 'expo-haptics';
import { clsx } from 'clsx';
import { DeleteUndoToast } from '../components/DeleteUndoToast';
import { ArchiveUndoToast } from '../components/ArchiveUndoToast';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { CompletionCheckmark } from '../components/animations';

// Types
type Habit = HabitDoc & {
  successRate?: number;
  totalCompletions?: number;
  totalMisses?: number;
};

interface WeekDayData {
  completed: boolean;
  date: string;
  isToday: boolean;
}

interface HabitDetailScreenProps {
  habit: Habit | null;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  onEdit?: (habit: Habit) => void;
  onOpenCalendar?: (habit: Habit) => void;
  onPause?: (habitId: Id<'habits'>) => void;
  tracking?: HabitTrackingEntry[];
  visible: boolean;
}

/**
 * Hero Section - Icon, Name, Description, Why Teaser (sticky portion)
 */
function HeroSection({
  currentStreak,
  habit,
  isCompletedToday,
  reduceMotion = false,
}: {
  currentStreak: number;
  habit: Habit;
  isCompletedToday: boolean;
  reduceMotion?: boolean;
}) {
  // Icon bounce animation on load (T1.1)
  // Start at final values if reduce motion is enabled
  const iconScale = useSharedValue(reduceMotion ? 1 : 0.8);
  const iconTranslateY = useSharedValue(reduceMotion ? 0 : -10);

  // Streak badge animation on load (T1.2)
  const showStreakBadge = currentStreak >= 7;
  // Start badge at final values if reduce motion is enabled
  const badgeScale = useSharedValue(reduceMotion && showStreakBadge ? 1 : 0);
  const badgeOpacity = useSharedValue(reduceMotion && showStreakBadge ? 1 : 0);

  useEffect(() => {
    // Skip animations if reduce motion is enabled
    if (reduceMotion) {
      // Set final values immediately without animation
      iconScale.value = 1;
      iconTranslateY.value = 0;
      if (showStreakBadge) {
        badgeScale.value = 1;
        badgeOpacity.value = 1;
      }
      return;
    }

    // Trigger spring bounce animation when component mounts
    iconScale.value = withSpring(1, {
      damping: 8,
      stiffness: 150,
      mass: 1,
    });
    iconTranslateY.value = withSpring(0, {
      damping: 8,
      stiffness: 150,
      mass: 1,
    });

    // Streak badge entrance animation (delayed after icon bounce) (T1.2)
    if (showStreakBadge) {
      // Delay badge animation to appear after icon settles
      setTimeout(() => {
        badgeOpacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) });
        badgeScale.value = withSpring(1, {
          damping: 10,
          stiffness: 200,
          mass: 1,
        });
      }, 400);
    }
  }, [showStreakBadge, reduceMotion]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { translateY: iconTranslateY.value },
    ],
  }));

  // Streak badge animated style (T1.2)
  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value }],
  }));

  // Get streak badge text based on streak length (T1.2)
  const getStreakBadgeText = (streak: number): string => {
    if (streak >= 30) return `🌟 ${streak} day streak!`;
    if (streak >= 14) return `🔥 ${streak} day streak!`;
    return `⚡ ${streak} day streak!`;
  };

  return (
    <View className="items-center pb-4">
      {/* Icon with bounce animation on load */}
      {habit.icon && (
        <Animated.View
          className="mb-3 h-20 w-20 items-center justify-center rounded-2xl shadow-lg"
          style={[
            {
              backgroundColor: habit.iconColor || '#fef3c7',
            },
            iconAnimatedStyle,
          ]}
        >
          <Text className="text-4xl">{habit.icon}</Text>
        </Animated.View>
      )}

      {/* Name */}
      <Text className="text-xl font-bold text-stone-900">
        {habit.name}
      </Text>

      {/* Streak Badge - shown when streak > 7 days (T1.2) */}
      {showStreakBadge && (
        <Animated.View
          accessibilityLabel={`${currentStreak} day streak`}
          className="mt-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1"
          style={badgeAnimatedStyle}
        >
          <Text className="text-xs font-semibold text-orange-600">
            {getStreakBadgeText(currentStreak)}
          </Text>
        </Animated.View>
      )}

      {/* Notes/Description */}
      {habit.notes ? (
        <Text className="mt-1 px-6 text-center text-sm text-stone-500">
          {habit.notes}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Main HabitDetailScreen Component
 */
export default function HabitDetailScreen({
  habit,
  onArchive,
  onClose,
  onDelete,
  onEdit,
  onOpenCalendar,
  onPause,
  tracking = [],
  visible,
}: HabitDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const safeTop = insets.top || 44;

  // Reduce motion accessibility setting (T4.4)
  const reduceMotion = useReduceMotion();

  // Notes modal states
  const [isNotesEditorOpen, setIsNotesEditorOpen] = useState(false);
  const [isNotesListOpen, setIsNotesListOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<Id<'notes'> | null>(null);

  // Delete undo toast state (T3.5: Swipe-to-delete)
  const [pendingDelete, setPendingDelete] = useState(false);
  const [pendingArchive, setPendingArchive] = useState(false);

  const toggleHabitMutation = useMutation(api.habits.toggleHabit);

  const habitCreatedAt = habit?.createdAt;
  const habitId = habit?._id;
  const habitStrength = habit?.strength ?? 0;

  // Debug: Log when habit prop updates
  useEffect(() => {
    if (habit) {
      console.log('🔢 HabitDetailScreen habit updated:', {
        name: habit.name,
        currentStreak: habit.currentStreak,
        timestamp: Date.now(),
      });
    }
  }, [habit, habit?.currentStreak]);

  const habitNotes =
    useQuery(api.notes.search, visible && habitId ? { habitId } : 'skip') ?? [];

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const completedDates = useMemo(() => {
    if (!habitId) {
      return new Set<string>();
    }

    return new Set(
      tracking
        .filter((entry) => entry.habitId === habitId && entry.completed)
        .map((entry) => entry.date)
    );
  }, [habitId, tracking]);

  const isCompletedToday = completedDates.has(today);

  const daysTracking = useMemo(() => {
    return habitCreatedAt
      ? Math.max(0, Math.floor((Date.now() - habitCreatedAt) / (1000 * 60 * 60 * 24)))
      : 0;
  }, [habitCreatedAt]);

  const totalCompletions = useMemo(() => completedDates.size, [completedDates]);
  const strengthPercent = useMemo(() => Math.max(0, Math.min(100, habitStrength * 100)), [habitStrength]);

  // Track toggling state to prevent rapid-fire toggles on calendar
  const [isTogglingCalendar, setIsTogglingCalendar] = useState(false);

  // Handle calendar day press - toggle completion for that date
  const handleCalendarDayPress = useCallback((date: string, wasCompleted: boolean): void => {
    console.log('[Calendar] Day pressed:', date, 'wasCompleted:', wasCompleted);

    // Prevent rapid-fire toggles
    if (isTogglingCalendar || !habit?._id) {
      console.log('[Calendar] Blocked - isToggling:', isTogglingCalendar, 'habitId:', habit?._id);
      return;
    }

    // Don't allow toggling future dates
    const inputDate = new Date(date);
    const todayDate = new Date();
    inputDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);
    if (inputDate > todayDate) {
      return; // Silently ignore future date taps
    }

    setIsTogglingCalendar(true);
    console.log('[Calendar] Calling toggleHabitMutation:', { habitId: habit._id, date });

    toggleHabitMutation({
      habitId: habit._id,
      date,
    })
      .catch((error: unknown) => {
        console.error('Failed to toggle habit:', error);
        Alert.alert('Error', 'Failed to update habit. Please try again.');
      })
      .finally(() => {
        setIsTogglingCalendar(false);
      });
  }, [isTogglingCalendar, habit?._id, toggleHabitMutation]);

  const lastSevenDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const dateKey = date.toISOString().split('T')[0];
      if (dateKey === today) {
        return isCompletedToday;
      }
      return completedDates.has(dateKey);
    });
  }, [today, isCompletedToday, completedDates]);

  const lastThirtyDays = useMemo(() => {
    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - index));
      const dateKey = date.toISOString().split('T')[0];
      return {
        completed: dateKey === today ? isCompletedToday : completedDates.has(dateKey),
        date: dateKey,
      };
    });
  }, [today, isCompletedToday, completedDates]);

  const successRate = useMemo(() => {
    const completedLastThirty = lastThirtyDays.filter((day) => day.completed).length;
    return (completedLastThirty / 30) * 100;
  }, [lastThirtyDays]);

  /**
   * Calculate week data for WeeklySummaryStrip (Phase 1)
   * Returns array of 7 days (Monday to Sunday) for the current week
   */
  const weekData = useMemo<WeekDayData[]>(() => {
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(todayDate);
    monday.setDate(todayDate.getDate() - mondayOffset);
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const dateKey = date.toISOString().split('T')[0];
      const isTodayDate = dateKey === today;

      return {
        completed: isTodayDate ? isCompletedToday : completedDates.has(dateKey),
        date: dateKey,
        isToday: isTodayDate,
      };
    });
  }, [today, isCompletedToday, completedDates]);

  /**
   * Calculate last week's completion count for trend comparison (Phase 1)
   */
  const lastWeekCompleted = useMemo(() => {
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Get last week's Monday
    const lastMonday = new Date(todayDate);
    lastMonday.setDate(todayDate.getDate() - mondayOffset - 7);
    lastMonday.setHours(0, 0, 0, 0);

    let count = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(lastMonday);
      date.setDate(lastMonday.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      if (completedDates.has(dateKey)) {
        count++;
      }
    }
    return count;
  }, [completedDates]);

  // T3.5: Swipe-to-delete handlers (must be before early return to maintain hook order)
  // These trigger the undo toast flow instead of immediate Alert
  const handleSwipeDelete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setPendingDelete(true);
  }, []);

  const handleSwipeArchive = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setPendingArchive(true);
  }, []);

  // Handle delete confirmation (timer expired)
  const handleConfirmDelete = useCallback(() => {
    setPendingDelete(false);
    if (habit) {
      onDelete?.(habit._id);
      onClose();
    }
  }, [habit, onDelete, onClose]);

  // Handle archive confirmation (timer expired)
  const handleConfirmArchive = useCallback(() => {
    setPendingArchive(false);
    if (habit) {
      onArchive?.(habit._id);
      onClose();
    }
  }, [habit, onArchive, onClose]);

  // Handle undo delete
  const handleUndoDelete = useCallback(() => {
    setPendingDelete(false);
  }, []);

  // Handle undo archive
  const handleUndoArchive = useCallback(() => {
    setPendingArchive(false);
  }, []);


  // Early return after all hooks
  if (!habit) {
    return null;
  }

  // Handler functions (non-hook functions can be after early return)
  const handleEdit = () => {
    onEdit?.(habit);
  };

  // Notes handlers - Story 1.9.3
  const handleOpenNotesEditor = () => {
    setEditingNoteId(null);
    setIsNotesEditorOpen(true);
  };

  const handleOpenNotesList = () => {
    setIsNotesListOpen(true);
  };

  const handleEditNote = (note: Doc<'notes'>) => {
    setEditingNoteId(note._id);
    setIsNotesEditorOpen(true);
  };

  const handleCloseNotesEditor = () => {
    setEditingNoteId(null);
    setIsNotesEditorOpen(false);
  };

  // Get the note being edited
  const editingNote = editingNoteId
    ? habitNotes.find((n) => n._id === editingNoteId)
    : null;

  return (
    <Modal
      disableBackdropClose={false}
      disableGestureClose
      onClose={onClose}
      variant="fullScreen"
      visible={visible}
    >
      <View
        className="flex-1 bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100"
        style={{ paddingTop: safeTop }}
      >
        {/* Header with Inline Hero - Compact layout to fit above fold */}
        <View className="flex-row items-center justify-between px-4 pb-3">
          {/* Back button */}
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm shadow-stone-200/50 active:bg-stone-50"
            onPress={onClose}
          >
            <X className="text-stone-700" size={22} strokeWidth={2.25} />
          </Pressable>

          {/* Inline Hero - Icon + Name + Streak */}
          <View className="flex-row items-center gap-2.5">
            {habit.icon && (
              <View
                className="h-11 w-11 items-center justify-center rounded-xl shadow"
                style={{ backgroundColor: habit.iconColor || '#fef3c7' }}
              >
                <Text className="text-2xl">{habit.icon}</Text>
              </View>
            )}
            <View>
              <Text className="text-base font-bold leading-tight text-stone-900">
                {/* Strip leading emoji from name if icon is shown separately */}
                {habit.icon ? habit.name.replace(/^\p{Emoji}\s*/u, '') : habit.name}
              </Text>
              {(habit.currentStreak ?? 0) >= 7 && (
                <Text className="text-xs font-medium text-orange-600">
                  {habit.currentStreak} day streak
                </Text>
              )}
            </View>
          </View>

          {/* Action buttons */}
          <View className="flex-row items-center gap-2">
            <HeaderCompleteToggle
              completedToday={isCompletedToday}
              habitId={habit._id}
              habitName={habit.name}
            />
            <Pressable
              accessibilityLabel="Edit habit"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm shadow-stone-200/50 active:bg-stone-50"
              onPress={handleEdit}
            >
              <Edit3 className="text-stone-700" size={18} strokeWidth={2.25} />
            </Pressable>
          </View>
        </View>

        {/* Calendar Content - full calendar view without collapsible wrapper */}
        <ScrollView
          bounces
          className="flex-1"
          contentContainerClassName="p-4 pb-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Habit Strength Section - strength ring, chart, and stats */}
          {habitCreatedAt && (
            <HabitStrengthSection
              habitId={habit._id}
              completedDates={completedDates}
              habitCreatedAt={habitCreatedAt}
              habitColor={habit.iconColor}
              habitStrength={habit.strength}
            />
          )}

          <MonthlyCalendarGrid
            habitId={habit._id}
            completedDates={completedDates}
            habitCreatedAt={habitCreatedAt}
            habitColor={habit.iconColor ?? '#10b981'}
            onDayPress={handleCalendarDayPress}
          />
        </ScrollView>
      </View>


      {/* Notes List Modal */}
      <RNModal
        animationType="slide"
        visible={isNotesListOpen}
        onRequestClose={() => setIsNotesListOpen(false)}
      >
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 16 }}>
          <View className="flex-row items-center justify-between border-b border-stone-100 px-5 pb-4">
            <Text className="text-lg font-bold text-stone-900">Notes</Text>
            <Pressable
              accessibilityLabel="Close notes"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
              onPress={() => setIsNotesListOpen(false)}
            >
              <X className="text-stone-600" size={22} />
            </Pressable>
          </View>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
          >
            <NotesList hideHabitFilter initialHabitId={habit._id} />
          </ScrollView>
        </View>
      </RNModal>

      {/* Notes Editor Modal */}
      <RNModal
        animationType="slide"
        visible={isNotesEditorOpen}
        onRequestClose={handleCloseNotesEditor}
      >
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 16 }}>
          <View className="flex-row items-center justify-between border-b border-stone-100 px-5 pb-4">
            <Text className="text-lg font-bold text-stone-900">
              {editingNote ? 'Edit Note' : 'New Note'}
            </Text>
            <Pressable
              accessibilityLabel="Close note editor"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
              onPress={handleCloseNotesEditor}
            >
              <X className="text-stone-600" size={22} />
            </Pressable>
          </View>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
          >
            <NoteEditor
              initialBody={editingNote?.body}
              initialDate={editingNote?.date}
              initialHabitId={editingNote?.habitId ?? habit._id}
              noteId={editingNote?._id}
              onCancel={handleCloseNotesEditor}
              onSave={handleCloseNotesEditor}
            />
          </ScrollView>
        </View>
      </RNModal>

      {/* Delete Undo Toast (T3.5: Swipe-to-delete) */}
      <DeleteUndoToast
        visible={pendingDelete}
        itemName={habit.name}
        duration={5000}
        onDismiss={() => setPendingDelete(false)}
        onUndo={handleUndoDelete}
        onConfirm={handleConfirmDelete}
      />

      {/* Archive Undo Toast (T3.5: Swipe-to-archive) */}
      <ArchiveUndoToast
        visible={pendingArchive}
        habitName={habit.name}
        duration={5000}
        onDismiss={handleConfirmArchive}
        onUndo={handleUndoArchive}
      />
    </Modal>
  );
}
