/**
 * HabitDetailScreen Component
 * Habit Detail Page - Simplified
 *
 * Features:
 * - Hero section with icon, name, and description
 * - Manage habit actions
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Alert, ScrollView, Modal as RNModal, TextInput } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Modal } from '../components/Modal';
import { VisualizationGuide } from '../components/NotesSection/VisualizationGuide';
import { VisualizationExercise } from '../components/VisualizationExercise';
import { HabitStrengthSection } from '../components/HabitStrengthSection';
import { QuickCompleteButton } from '../components/QuickCompleteButton/QuickCompleteButton';
import { StreakChainSection } from '../components/StreakChainSection/StreakChainSection';
import { CalendarHeatmap } from '../components/CalendarHeatmap/CalendarHeatmap';
import { StatsGrid } from '../components/StatsGrid/StatsGrid';
import { NotesSection } from '../components/NotesSection/NotesSection';
import NotesList from '../components/StatsNotesModal/NotesList';
import NoteEditor from '../components/StatsNotesModal/NoteEditor';
import { format, parseISO } from 'date-fns';
import {
  X,
  Edit3,
  Pause,
  Archive,
  Trash2,
  Calendar,
  ChevronRight,
  Eye,
  Brain,
  Sparkles,
} from 'lucide-react-native';
import type { Id } from '../../convex/_generated/dataModel';
import type { Doc } from '../../convex/_generated/dataModel';
import type { Habit as HabitDoc, HabitTrackingEntry } from '../features/habits/types';
import * as Haptics from 'expo-haptics';
import { clsx } from 'clsx';

// Types
type Habit = HabitDoc & {
  successRate?: number;
  totalCompletions?: number;
  totalMisses?: number;
};

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
 * Hero Section - Icon, Name, Notes
 */
function HeroSection({ habit }: { habit: Habit }) {
  return (
    <Animated.View
      className="items-center rounded-2xl bg-white/90 py-6 shadow-sm shadow-stone-200/50"
      entering={FadeInDown.delay(100).springify()}
    >
      {/* Icon */}
      {habit.icon && (
        <View
          className="mb-3 h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
          style={{
            backgroundColor: habit.iconColor || '#fef3c7',
          }}
        >
          <Text className="text-4xl">{habit.icon}</Text>
        </View>
      )}

      {/* Name */}
      <Text className="text-2xl font-bold text-stone-900">
        {habit.name}
      </Text>

      {/* Notes/Description */}
      {habit.notes ? (
        <Text className="mt-1 px-6 text-center text-base text-stone-500">
          {habit.notes}
        </Text>
      ) : null}
    </Animated.View>
  );
}

/**
 * Action Button Component
 */
function ActionButton({
  icon: Icon,
  label,
  onPress,
  showChevron = false,
  subtitle,
  variant = 'default',
}: {
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  subtitle?: string;
  variant?: 'default' | 'destructive' | 'boost';
}) {
  const isDestructive = variant === 'destructive';
  const isBoost = variant === 'boost';

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className={clsx(
        'flex-row items-center gap-3 rounded-xl border px-4 py-3.5 active:opacity-70',
        isDestructive && 'border-red-200/60 bg-red-50/50',
        isBoost && 'border-violet-200/60 bg-gradient-to-r from-violet-50 to-indigo-50',
        !isDestructive && !isBoost && 'border-stone-200 bg-white/80'
      )}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View
        className={clsx(
          'h-9 w-9 items-center justify-center rounded-lg',
          isBoost && 'bg-gradient-to-br from-violet-500 to-indigo-600',
          isDestructive && 'bg-red-100',
          !isBoost && !isDestructive && 'bg-stone-100'
        )}
      >
        <Icon
          className={clsx(
            isDestructive && 'text-red-500',
            isBoost && 'text-white',
            !isDestructive && !isBoost && 'text-stone-600'
          )}
          size={18}
          strokeWidth={2.25}
        />
      </View>
      <View className="flex-1">
        <Text
          className={clsx(
            'text-base font-medium',
            isDestructive && 'text-red-600',
            isBoost && 'text-violet-900',
            !isDestructive && !isBoost && 'text-stone-800'
          )}
        >
          {label}
        </Text>
        {subtitle && (
          <Text className={clsx(
            'text-xs',
            isBoost ? 'text-violet-600' : 'text-stone-500'
          )}>
            {subtitle}
          </Text>
        )}
      </View>
      {showChevron && (
        <ChevronRight
          className={clsx(
            isDestructive && 'text-red-400',
            isBoost && 'text-violet-400',
            !isDestructive && !isBoost && 'text-stone-400'
          )}
          size={20}
        />
      )}
    </Pressable>
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
  const [showVisualizationGuide, setShowVisualizationGuide] = useState(false);
  const [showVisualizationExercise, setShowVisualizationExercise] = useState(false);
  const [isMotivationExpanded, setIsMotivationExpanded] = useState(false);
  const [isManageExpanded, setIsManageExpanded] = useState(false);
  const [isStrengthExpanded, setIsStrengthExpanded] = useState(false);
  const [isWhyEditorOpen, setIsWhyEditorOpen] = useState(false);
  const [whyDraft, setWhyDraft] = useState('');
  const [isNotesEditorOpen, setIsNotesEditorOpen] = useState(false);
  const [isNotesListOpen, setIsNotesListOpen] = useState(false);
  const [isVisionBoardEditorOpen, setIsVisionBoardEditorOpen] = useState(false);
  const [isVisionBoardListOpen, setIsVisionBoardListOpen] = useState(false);
  const [optimisticTodayCompleted, setOptimisticTodayCompleted] = useState<boolean | null>(null);
  const [visionBoardBodyDraft, setVisionBoardBodyDraft] = useState('');
  const [visionBoardEditingId, setVisionBoardEditingId] = useState<Id<'visionBoardItems'> | null>(null);
  const [visionBoardTitleDraft, setVisionBoardTitleDraft] = useState('');

  type VisionBoardItem = Doc<'visionBoardItems'>;

  const updateHabit = useMutation(api.habits.update);
  const createVisionBoardItem = useMutation(api.visionBoard.create);
  const removeVisionBoardItem = useMutation(api.visionBoard.remove);
  const updateVisionBoardItem = useMutation(api.visionBoard.update);

  const habitCreatedAt = habit?.createdAt;
  const habitId = habit?._id;
  const habitStrength = habit?.strength ?? 0;
  const habitWhy = habit?.why;

  const habitNotes =
    useQuery(api.notes.search, visible && habitId ? { habitId } : 'skip') ?? [];
  const visionBoardItems =
    useQuery(api.visionBoard.listByHabit, visible && habitId ? { habitId } : 'skip') ?? [];

  const today = new Date().toISOString().split('T')[0];

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

  const completedTodayFromBackend = completedDates.has(today);
  const isCompletedToday = optimisticTodayCompleted ?? completedTodayFromBackend;

  const daysTracking = habitCreatedAt
    ? Math.max(0, Math.floor((Date.now() - habitCreatedAt) / (1000 * 60 * 60 * 24)))
    : 0;

  const totalCompletions = completedDates.size;
  const strengthPercent = Math.max(0, Math.min(100, habitStrength * 100));

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateKey = date.toISOString().split('T')[0];
    if (dateKey === today) {
      return isCompletedToday;
    }
    return completedDates.has(dateKey);
  });

  const lastThirtyDays = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    const dateKey = date.toISOString().split('T')[0];
    return {
      completed: dateKey === today ? isCompletedToday : completedDates.has(dateKey),
      date: dateKey,
    };
  });

  const successRate = useMemo(() => {
    const completedLastThirty = lastThirtyDays.filter((day) => day.completed).length;
    return (completedLastThirty / 30) * 100;
  }, [lastThirtyDays]);

  const recentNote = useMemo(() => {
    const latest = habitNotes[0];
    if (!latest) {
      return undefined;
    }

    const formatted = (() => {
      try {
        return format(parseISO(latest.date), 'MMM d, yyyy');
      } catch {
        return latest.date;
      }
    })();

    return {
      body: latest.body,
      date: formatted,
    };
  }, [habitNotes]);

  useEffect(() => {
    setWhyDraft(habitWhy ?? '');
  }, [habitId, habitWhy]);

  useEffect(() => {
    setOptimisticTodayCompleted(null);
  }, [habitId]);

  useEffect(() => {
    if (optimisticTodayCompleted === null) {
      return;
    }

    if (completedTodayFromBackend === optimisticTodayCompleted) {
      setOptimisticTodayCompleted(null);
      return;
    }

    const timeout = setTimeout(() => setOptimisticTodayCompleted(null), 1200);
    return () => clearTimeout(timeout);
  }, [completedTodayFromBackend, optimisticTodayCompleted]);

  if (!habit) {
    return null;
  }

  // Action handlers
  const handleEdit = () => {
    onEdit?.(habit);
  };

  const handlePause = () => {
    Alert.alert(
      'Pause Habit',
      'This habit will be hidden from your daily list. You can unpause it anytime from Settings.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            onPause?.(habit._id);
            onClose();
          },
          style: 'destructive',
          text: 'Pause',
        },
      ]
    );
  };

  const handleArchive = () => {
    Alert.alert(
      'Archive Habit',
      'Archived habits are moved to your archive but keep their history.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            onArchive?.(habit._id);
            onClose();
          },
          style: 'destructive',
          text: 'Archive',
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      'This will permanently delete this habit and all its history. This cannot be undone.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => {
            onDelete?.(habit._id);
            onClose();
          },
          style: 'destructive',
          text: 'Delete',
        },
      ]
    );
  };

  const handleOpenCalendar = () => {
    onOpenCalendar?.(habit);
    onClose();
  };

  const handleOpenVisualizationGuide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowVisualizationGuide(true);
  };

  const handleCloseVisualizationGuide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowVisualizationGuide(false);
  };

  const handleOpenVisualizationExercise = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowVisualizationExercise(true);
  };

  const handleCloseVisualizationExercise = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowVisualizationExercise(false);
  };

  const handleSaveVisualization = (data: { habitName: string; positiveVisualization: string; negativeVisualization: string; timestamp: number }) => {
    const body = `Success:\n${data.positiveVisualization}\n\nIf I don’t follow through:\n${data.negativeVisualization}`;

    createVisionBoardItem({
      body,
      habitId: habit._id,
      title: 'Mental Contrasting',
    })
      .then(() => {
        Alert.alert(
          'Saved to Vision Board ✨',
          'Your mental contrasting exercise is now saved in your vision board.',
          [{ text: 'Got it' }]
        );
      })
      .catch((error) => {
        console.error('Failed to save visualization:', error);
        Alert.alert(
          'Could not save',
          'Please try again.',
          [{ text: 'OK' }]
        );
      });
  };

  const handleOpenWhyEditor = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsWhyEditorOpen(true);
  };

  const handleSaveWhy = async () => {
    const nextWhy = whyDraft.trim();
    if (nextWhy.length > 120) {
      Alert.alert('Too long', 'Keep your why under 120 characters.', [{ text: 'OK' }]);
      return;
    }

    try {
      await updateHabit({
        habitId: habit._id,
        why: nextWhy ? nextWhy : undefined,
      });
      setIsWhyEditorOpen(false);
    } catch (error) {
      console.error('Failed to update why:', error);
      Alert.alert('Could not save', 'Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleOpenVisionBoardEditor = (item?: VisionBoardItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVisionBoardEditingId(item?._id ?? null);
    setVisionBoardTitleDraft(item?.title ?? '');
    setVisionBoardBodyDraft(item?.body ?? '');
    setIsVisionBoardEditorOpen(true);
  };

  const handleSaveVisionBoardItem = async () => {
    const title = visionBoardTitleDraft.trim();
    const body = visionBoardBodyDraft.trim();

    if (!title) {
      Alert.alert('Title required', 'Add a short title for this card.', [{ text: 'OK' }]);
      return;
    }

    try {
      if (visionBoardEditingId) {
        await updateVisionBoardItem({
          body: body ? body : undefined,
          id: visionBoardEditingId,
          title,
        });
      } else {
        if (visionBoardItems.length >= 6) {
          Alert.alert('Vision board is full', 'Limit is 6 cards for now. Remove one to add another.', [{ text: 'OK' }]);
          return;
        }
        await createVisionBoardItem({
          body: body ? body : undefined,
          habitId: habit._id,
          title,
        });
      }

      setIsVisionBoardEditorOpen(false);
      setVisionBoardEditingId(null);
      setVisionBoardTitleDraft('');
      setVisionBoardBodyDraft('');
    } catch (error) {
      console.error('Failed to save vision board item:', error);
      Alert.alert('Could not save', 'Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleConfirmDeleteVisionBoardItem = (item: VisionBoardItem) => {
    Alert.alert(
      'Delete card?',
      `"${item.title}" will be removed from your vision board.`,
      [
        { style: 'cancel', text: 'Cancel' },
        {
          style: 'destructive',
          text: 'Delete',
          onPress: async () => {
            try {
              await removeVisionBoardItem({ id: item._id });
            } catch (error) {
              console.error('Failed to delete vision board item:', error);
              Alert.alert('Could not delete', 'Please try again.', [{ text: 'OK' }]);
            }
          },
        },
      ]
    );
  };

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
        {/* Navigation Bar */}
        <View className="flex-row items-center justify-between px-5 pb-3">
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm shadow-stone-200/50 active:bg-stone-50"
            onPress={onClose}
          >
            <X className="text-stone-700" size={24} strokeWidth={2.25} />
          </Pressable>

          <Pressable
            accessibilityLabel="Edit habit"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm shadow-stone-200/50 active:bg-stone-50"
            onPress={handleEdit}
          >
            <Edit3 className="text-stone-700" size={20} strokeWidth={2.25} />
          </Pressable>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          bounces
          className="flex-1"
          contentContainerClassName="gap-4 px-5 pb-8"
          nestedScrollEnabled
          scrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <HeroSection habit={habit} />

          {/* Why (always visible) */}
          <Pressable
            accessibilityLabel={habit.why ? 'Edit why' : 'Add your why'}
            accessibilityRole="button"
            className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50 active:opacity-80"
            onPress={handleOpenWhyEditor}
          >
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-stone-500">
              WHY
            </Text>
            <Text
              className={clsx(
                'mt-2 text-base leading-6',
                habit.why ? 'text-stone-800' : 'text-stone-400'
              )}
              numberOfLines={2}
            >
              {habit.why ? habit.why : 'Add why you’re doing this habit'}
            </Text>
          </Pressable>

          {/* Primary Action (Quick Complete) */}
          <Animated.View
            className="rounded-2xl bg-white/90 p-4 shadow-sm shadow-stone-200/50"
            entering={FadeInDown.delay(150).springify()}
          >
            <QuickCompleteButton
              completedToday={isCompletedToday}
              habitId={habit._id}
              habitName={habit.name}
              onComplete={() => setOptimisticTodayCompleted(true)}
              onUncomplete={() => setOptimisticTodayCompleted(false)}
            />
          </Animated.View>

          {/* Progress (Stats) */}
          <StreakChainSection
            bestStreak={habit.bestStreak ?? 0}
            currentStreak={habit.currentStreak ?? 0}
            lastSevenDays={lastSevenDays}
            todayCompleted={isCompletedToday}
          />

          <Pressable
            accessibilityLabel={isStrengthExpanded ? 'Collapse habit strength section' : 'Expand habit strength section'}
            accessibilityRole="button"
            className="flex-row items-center justify-between rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50 active:opacity-80"
            onPress={() => setIsStrengthExpanded((previous) => !previous)}
          >
            <View>
              <Text className="text-lg font-semibold text-stone-800">Habit Strength</Text>
              <Text className="text-sm text-stone-500">
                {Math.round(strengthPercent)}% · {habit.strengthLevel ?? 'starting'}
              </Text>
            </View>
            <ChevronRight
              className={clsx('text-stone-400', isStrengthExpanded && 'rotate-90')}
              size={20}
            />
          </Pressable>

          {isStrengthExpanded ? (
            <HabitStrengthSection
              currentStreak={habit.currentStreak ?? 0}
              daysTracking={daysTracking}
              onInfoPress={() => {
                Alert.alert(
                  'What is Habit Strength?',
                  'Habit strength measures how automatic your habit has become. It\'s calculated based on:\n\n' +
                  '🔥 Current Streak - Consecutive days completed\n\n' +
                  '📊 Success Rate - % of days you\'ve completed\n\n' +
                  '📅 Consistency - How regular your habit is\n\n' +
                  'The stronger your habit, the easier it becomes to maintain!',
                  [{ text: 'Got it' }]
                );
              }}
              strength={strengthPercent}
              successRate={successRate}
            />
          ) : null}

          <CalendarHeatmap
            data={lastThirtyDays}
            onDayPress={(date, completed) => {
              Alert.alert(
                date,
                completed ? 'Completed ✅' : 'Not completed',
                [{ text: 'OK' }]
              );
            }}
          />

          <StatsGrid
            currentStreak={habit.currentStreak ?? 0}
            daysTracking={daysTracking}
            successRate={successRate}
            totalCompletions={totalCompletions}
          />

          {/* Motivational Boosters */}
          <Pressable
            accessibilityLabel={isMotivationExpanded ? 'Collapse motivation section' : 'Expand motivation section'}
            accessibilityRole="button"
            className="flex-row items-center justify-between rounded-2xl bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/80 p-5 shadow-sm shadow-violet-200/30 active:opacity-80"
            onPress={() => setIsMotivationExpanded((previous) => !previous)}
          >
            <View className="flex-row items-center gap-2">
              <Sparkles className="text-violet-500" size={20} />
              <View>
                <Text className="text-lg font-semibold text-violet-900">
                  Motivation
                </Text>
                <Text className="text-xs text-violet-700">
                  Vision + why + mental boost
                </Text>
              </View>
            </View>
            <ChevronRight
              className={clsx('text-violet-400', isMotivationExpanded && 'rotate-90')}
              size={20}
            />
          </Pressable>

          {isMotivationExpanded ? (
            <Animated.View
              className="rounded-2xl bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/80 p-5 shadow-sm shadow-violet-200/30"
              entering={FadeInDown.delay(200).springify()}
            >
              {/* Vision Board Preview */}
              <View className="mb-5 rounded-2xl border border-violet-100 bg-white/80 p-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-stone-800">
                    Vision Board
                  </Text>
                  <Pressable
                    accessibilityLabel="Add vision board card"
                    accessibilityRole="button"
                    className="rounded-full bg-violet-600 px-3 py-1.5 active:bg-violet-700"
                    onPress={() => handleOpenVisionBoardEditor()}
                  >
                    <Text className="text-xs font-semibold text-white">
                      Add
                    </Text>
                  </Pressable>
                </View>

                {visionBoardItems.length === 0 ? (
                  <Text className="text-sm text-stone-500">
                    Add 1–2 cards that remind you what you’re building toward.
                  </Text>
                ) : (
                  <View className="gap-3">
                    {visionBoardItems.slice(0, 2).map((item) => (
                      <Pressable
                        key={item._id}
                        accessibilityLabel={`Open vision card ${item.title}`}
                        accessibilityRole="button"
                        className="rounded-xl bg-stone-50 p-4 active:opacity-80"
                        onLongPress={() => handleConfirmDeleteVisionBoardItem(item)}
                        onPress={() => handleOpenVisionBoardEditor(item)}
                      >
                        <Text className="text-sm font-semibold text-stone-800">
                          {item.title}
                        </Text>
                        {item.body ? (
                          <Text className="mt-1 text-sm leading-5 text-stone-600" numberOfLines={3}>
                            {item.body}
                          </Text>
                        ) : null}
                      </Pressable>
                    ))}
                    {visionBoardItems.length > 0 ? (
                      <Pressable
                        accessibilityLabel="View all vision board cards"
                        accessibilityRole="button"
                        className="items-center rounded-xl border border-stone-200 bg-white py-3 active:bg-stone-50"
                        onPress={() => setIsVisionBoardListOpen(true)}
                      >
                        <Text className="text-sm font-semibold text-stone-700">
                          View all ({visionBoardItems.length})
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                )}
              </View>

              <Text className="mb-4 text-sm text-violet-700">
                Science-backed techniques from Andrew Huberman to strengthen your motivation.
              </Text>
              <View className="gap-3">
                <ActionButton
                  icon={Brain}
                  label="Mental Contrasting"
                  onPress={handleOpenVisualizationExercise}
                  showChevron
                  subtitle="Visualize success & failure"
                  variant="boost"
                />
                <ActionButton
                  icon={Eye}
                  label="Visualization Guide"
                  onPress={handleOpenVisualizationGuide}
                  showChevron
                  subtitle="Goal achievement techniques"
                  variant="boost"
                />
              </View>
            </Animated.View>
          ) : null}

          {/* Notes (preview → drill-in) */}
          <NotesSection
            onAddNote={() => setIsNotesEditorOpen(true)}
            onViewAllNotes={habitNotes.length > 1 ? () => setIsNotesListOpen(true) : undefined}
            recentNote={recentNote}
            totalNotes={habitNotes.length}
          />

          {/* Manage Habit */}
          <Pressable
            accessibilityLabel={isManageExpanded ? 'Collapse manage habit section' : 'Expand manage habit section'}
            accessibilityRole="button"
            className="flex-row items-center justify-between rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50 active:opacity-80"
            onPress={() => setIsManageExpanded((previous) => !previous)}
          >
            <View>
              <Text className="text-lg font-semibold text-stone-800">
                Manage Habit
              </Text>
              <Text className="text-sm text-stone-500">
                Pause, archive, or delete
              </Text>
            </View>
            <ChevronRight
              className={clsx('text-stone-400', isManageExpanded && 'rotate-90')}
              size={20}
            />
          </Pressable>

          {isManageExpanded ? (
            <Animated.View
              className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50"
              entering={FadeInDown.delay(300).springify()}
            >
              <View className="gap-3">
                <ActionButton
                  icon={Calendar}
                  label="View Full Calendar"
                  onPress={handleOpenCalendar}
                  showChevron
                />
                <ActionButton
                  icon={Pause}
                  label="Pause Habit"
                  onPress={handlePause}
                />
                <ActionButton
                  icon={Archive}
                  label="Archive"
                  onPress={handleArchive}
                />
                <ActionButton
                  icon={Trash2}
                  label="Delete"
                  onPress={handleDelete}
                  variant="destructive"
                />
              </View>
            </Animated.View>
          ) : null}
        </ScrollView>
      </View>

      {/* Visualization Guide Modal */}
      <RNModal
        animationType="slide"
        visible={showVisualizationGuide}
        onRequestClose={handleCloseVisualizationGuide}
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <Animated.View
            className="flex-row items-center justify-between border-b border-stone-100 bg-white px-5 pb-4"
            entering={FadeIn.delay(100)}
            style={{ paddingTop: insets.top + 8 }}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
                <Eye className="text-white" size={20} />
              </View>
              <View>
                <Text className="text-lg font-bold text-stone-900">
                  Visualization Guide
                </Text>
                <Text className="text-xs text-stone-500">
                  Science-backed goal techniques
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityLabel="Close visualization guide"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
              onPress={handleCloseVisualizationGuide}
            >
              <X className="text-stone-600" size={22} />
            </Pressable>
          </Animated.View>

          {/* Scrollable Content */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
          >
            <VisualizationGuide
              habitName={habit.name}
              onClose={handleCloseVisualizationGuide}
            />
          </ScrollView>
        </View>
      </RNModal>

      {/* Why Editor Modal */}
      <RNModal
        animationType="slide"
        visible={isWhyEditorOpen}
        onRequestClose={() => setIsWhyEditorOpen(false)}
      >
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 16 }}>
          <View className="flex-row items-center justify-between border-b border-stone-100 px-5 pb-4">
            <Text className="text-lg font-bold text-stone-900">Your Why</Text>
            <Pressable
              accessibilityLabel="Close why editor"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
              onPress={() => setIsWhyEditorOpen(false)}
            >
              <X className="text-stone-600" size={22} />
            </Pressable>
          </View>
          <View className="flex-1 gap-4 px-5 pt-4" style={{ paddingBottom: insets.bottom + 16 }}>
            <Text className="text-sm text-stone-500">
              Keep it short. This should pull you forward on hard days.
            </Text>
            <TextInput
              accessibilityLabel="Why you are doing this habit"
              className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900"
              maxLength={120}
              placeholder="Because I want to…"
              placeholderTextColor="#a8a29e"
              value={whyDraft}
              onChangeText={setWhyDraft}
            />
            <Text className="text-xs text-stone-400">{whyDraft.length} / 120</Text>
            <Pressable
              accessibilityLabel="Save why"
              accessibilityRole="button"
              className="mt-auto items-center rounded-2xl bg-stone-900 py-4 active:bg-stone-800"
              onPress={handleSaveWhy}
            >
              <Text className="text-base font-semibold text-white">Save</Text>
            </Pressable>
          </View>
        </View>
      </RNModal>

      {/* Vision Board List Modal */}
      <RNModal
        animationType="slide"
        visible={isVisionBoardListOpen}
        onRequestClose={() => setIsVisionBoardListOpen(false)}
      >
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 16 }}>
          <View className="flex-row items-center justify-between border-b border-stone-100 px-5 pb-4">
            <Text className="text-lg font-bold text-stone-900">Vision Board</Text>
            <Pressable
              accessibilityLabel="Close vision board"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
              onPress={() => setIsVisionBoardListOpen(false)}
            >
              <X className="text-stone-600" size={22} />
            </Pressable>
          </View>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-sm text-stone-500">
                {visionBoardItems.length}/6 cards
              </Text>
              <Pressable
                accessibilityLabel="Add vision board card"
                accessibilityRole="button"
                className="rounded-full bg-violet-600 px-4 py-2 active:bg-violet-700"
                onPress={() => handleOpenVisionBoardEditor()}
              >
                <Text className="text-sm font-semibold text-white">Add</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {visionBoardItems.map((item) => (
                <Pressable
                  key={item._id}
                  accessibilityLabel={`Open vision card ${item.title}`}
                  accessibilityRole="button"
                  className="rounded-2xl border border-stone-100 bg-stone-50 p-4 active:opacity-80"
                  onLongPress={() => handleConfirmDeleteVisionBoardItem(item)}
                  onPress={() => handleOpenVisionBoardEditor(item)}
                >
                  <Text className="text-base font-semibold text-stone-900">
                    {item.title}
                  </Text>
                  {item.body ? (
                    <Text className="mt-2 text-sm leading-6 text-stone-600">
                      {item.body}
                    </Text>
                  ) : null}
                  <Text className="mt-3 text-xs text-stone-400">
                    Long press to delete
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </RNModal>

      {/* Vision Board Editor Modal */}
      <RNModal
        animationType="slide"
        visible={isVisionBoardEditorOpen}
        onRequestClose={() => setIsVisionBoardEditorOpen(false)}
      >
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 16 }}>
          <View className="flex-row items-center justify-between border-b border-stone-100 px-5 pb-4">
            <Text className="text-lg font-bold text-stone-900">
              {visionBoardEditingId ? 'Edit Card' : 'New Card'}
            </Text>
            <Pressable
              accessibilityLabel="Close vision board editor"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
              onPress={() => setIsVisionBoardEditorOpen(false)}
            >
              <X className="text-stone-600" size={22} />
            </Pressable>
          </View>
          <View className="flex-1 gap-4 px-5 pt-4" style={{ paddingBottom: insets.bottom + 16 }}>
            <TextInput
              accessibilityLabel="Vision card title"
              className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900"
              maxLength={60}
              placeholder="Title"
              placeholderTextColor="#a8a29e"
              value={visionBoardTitleDraft}
              onChangeText={setVisionBoardTitleDraft}
            />
            <TextInput
              multiline
              accessibilityLabel="Vision card body"
              className="min-h-[140px] rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900"
              maxLength={600}
              placeholder="Write what you want to remember…"
              placeholderTextColor="#a8a29e"
              textAlignVertical="top"
              value={visionBoardBodyDraft}
              onChangeText={setVisionBoardBodyDraft}
            />
            <Text className="text-xs text-stone-400">{visionBoardBodyDraft.length} / 600</Text>
            <Pressable
              accessibilityLabel="Save vision card"
              accessibilityRole="button"
              className="mt-auto items-center rounded-2xl bg-stone-900 py-4 active:bg-stone-800"
              onPress={handleSaveVisionBoardItem}
            >
              <Text className="text-base font-semibold text-white">Save</Text>
            </Pressable>
          </View>
        </View>
      </RNModal>

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
        onRequestClose={() => setIsNotesEditorOpen(false)}
      >
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 16 }}>
          <View className="flex-row items-center justify-between border-b border-stone-100 px-5 pb-4">
            <Text className="text-lg font-bold text-stone-900">New Note</Text>
            <Pressable
              accessibilityLabel="Close note editor"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
              onPress={() => setIsNotesEditorOpen(false)}
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
              initialHabitId={habit._id}
              onCancel={() => setIsNotesEditorOpen(false)}
              onSave={() => setIsNotesEditorOpen(false)}
            />
          </ScrollView>
        </View>
      </RNModal>

      {/* Visualization Exercise Modal */}
      <RNModal
        animationType="slide"
        visible={showVisualizationExercise}
        onRequestClose={handleCloseVisualizationExercise}
      >
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 16 }}>
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-stone-100 px-5 pb-4">
            <Text className="text-lg font-bold text-stone-900">
              Mental Contrasting
            </Text>
            <Pressable
              accessibilityLabel="Close visualization exercise"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
              onPress={handleCloseVisualizationExercise}
            >
              <X className="text-stone-600" size={22} />
            </Pressable>
          </View>

          {/* Exercise Content */}
          <View
            className="flex-1 px-5 pt-4"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <VisualizationExercise
              habitName={habit.name}
              onClose={handleCloseVisualizationExercise}
              onSave={handleSaveVisualization}
            />
          </View>
        </View>
      </RNModal>
    </Modal>
  );
}
