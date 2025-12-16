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
import { Toast } from '../components/Toast';
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
  Target,
  MapPin,
  Clock,
  MessageCircle,
  Plus,
  Compass,
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
  // Cue state
  const [isCueEditorOpen, setIsCueEditorOpen] = useState(false);
  const [cueAfterBehaviorDraft, setCueAfterBehaviorDraft] = useState('');
  const [cueLocationDraft, setCueLocationDraft] = useState('');
  const [cueTimeDraft, setCueTimeDraft] = useState('');
  const [cueToastVisible, setCueToastVisible] = useState(false);
  // Affirmations state
  const [isAffirmationEditorOpen, setIsAffirmationEditorOpen] = useState(false);
  const [isAffirmationsListOpen, setIsAffirmationsListOpen] = useState(false);
  const [affirmationTextDraft, setAffirmationTextDraft] = useState('');
  const [affirmationTypeDraft, setAffirmationTypeDraft] = useState<'identity' | 'motivational' | 'instructional' | undefined>(undefined);
  const [affirmationEditingId, setAffirmationEditingId] = useState<Id<'affirmations'> | null>(null);

  type VisionBoardItem = Doc<'visionBoardItems'>;
  type Affirmation = Doc<'affirmations'>;

  const updateHabit = useMutation(api.habits.update);
  const createVisionBoardItem = useMutation(api.visionBoard.create);
  const removeVisionBoardItem = useMutation(api.visionBoard.remove);
  const updateVisionBoardItem = useMutation(api.visionBoard.update);
  const createAffirmation = useMutation(api.affirmations.create);
  const updateAffirmation = useMutation(api.affirmations.update);
  const removeAffirmation = useMutation(api.affirmations.remove);

  const habitCreatedAt = habit?.createdAt;
  const habitId = habit?._id;
  const habitStrength = habit?.strength ?? 0;
  const habitWhy = habit?.why;
  const habitCueAfterBehavior = habit?.cueAfterBehavior;
  const habitCueLocation = habit?.cueLocation;
  const habitCueTime = habit?.cueTime;
  const hasCue = Boolean(habitCueAfterBehavior || habitCueLocation || habitCueTime);

  const habitNotes =
    useQuery(api.notes.search, visible && habitId ? { habitId } : 'skip') ?? [];
  const visionBoardItems =
    useQuery(api.visionBoard.listByHabit, visible && habitId ? { habitId } : 'skip') ?? [];
  const affirmations =
    useQuery(api.affirmations.listByHabit, visible && habitId ? { habitId } : 'skip') ?? [];

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
    setCueAfterBehaviorDraft(habitCueAfterBehavior ?? '');
    setCueLocationDraft(habitCueLocation ?? '');
    setCueTimeDraft(habitCueTime ?? '');
  }, [habitId, habitCueAfterBehavior, habitCueLocation, habitCueTime]);

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
    if (nextWhy.length > 200) {
      Alert.alert('Too long', 'Keep your North Star under 200 characters.', [{ text: 'OK' }]);
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

  // Cue handlers
  const handleOpenCueEditor = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsCueEditorOpen(true);
  };

  const handleSaveCue = async () => {
    const cueAfterBehavior = cueAfterBehaviorDraft.trim();
    const cueLocation = cueLocationDraft.trim();
    const cueTime = cueTimeDraft.trim();

    if (cueAfterBehavior.length > 100) {
      Alert.alert('Too long', 'Keep your cue under 100 characters.', [{ text: 'OK' }]);
      return;
    }

    try {
      await updateHabit({
        cueAfterBehavior: cueAfterBehavior ? cueAfterBehavior : undefined,
        cueLocation: cueLocation ? cueLocation : undefined,
        cueTime: cueTime ? cueTime : undefined,
        habitId: habit._id,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsCueEditorOpen(false);
      setCueToastVisible(true);
    } catch (error) {
      console.error('Failed to update cue:', error);
      Alert.alert('Could not save', 'Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleClearCue = async () => {
    try {
      await updateHabit({
        cueAfterBehavior: undefined,
        cueLocation: undefined,
        cueTime: undefined,
        habitId: habit._id,
      });
      setCueAfterBehaviorDraft('');
      setCueLocationDraft('');
      setCueTimeDraft('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsCueEditorOpen(false);
    } catch (error) {
      console.error('Failed to clear cue:', error);
      Alert.alert('Could not clear', 'Please try again.', [{ text: 'OK' }]);
    }
  };

  // Affirmation handlers
  const handleOpenAffirmationEditor = (item?: Affirmation) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAffirmationEditingId(item?._id ?? null);
    setAffirmationTextDraft(item?.text ?? '');
    setAffirmationTypeDraft(item?.type ?? undefined);
    setIsAffirmationEditorOpen(true);
  };

  const handleSaveAffirmation = async () => {
    const text = affirmationTextDraft.trim();

    if (!text) {
      Alert.alert('Required', 'Write an affirmation.', [{ text: 'OK' }]);
      return;
    }

    if (text.length > 200) {
      Alert.alert('Too long', 'Keep your affirmation under 200 characters.', [{ text: 'OK' }]);
      return;
    }

    try {
      if (affirmationEditingId) {
        await updateAffirmation({
          id: affirmationEditingId,
          text,
          type: affirmationTypeDraft,
        });
      } else {
        if (affirmations.length >= 10) {
          Alert.alert('Limit reached', 'Maximum 10 affirmations per habit. Remove one to add another.', [{ text: 'OK' }]);
          return;
        }
        await createAffirmation({
          habitId: habit._id,
          text,
          type: affirmationTypeDraft,
        });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsAffirmationEditorOpen(false);
      setAffirmationEditingId(null);
      setAffirmationTextDraft('');
      setAffirmationTypeDraft(undefined);
    } catch (error) {
      console.error('Failed to save affirmation:', error);
      Alert.alert('Could not save', 'Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleConfirmDeleteAffirmation = (item: Affirmation) => {
    Alert.alert(
      'Delete affirmation?',
      `"${item.text.slice(0, 50)}${item.text.length > 50 ? '...' : ''}" will be removed.`,
      [
        { style: 'cancel', text: 'Cancel' },
        {
          style: 'destructive',
          text: 'Delete',
          onPress: async () => {
            try {
              await removeAffirmation({ id: item._id });
            } catch (error) {
              console.error('Failed to delete affirmation:', error);
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

          {/* Why Section */}
          <Pressable
            accessibilityLabel={habit.why ? 'Edit your why' : 'Add your why'}
            accessibilityRole="button"
            className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50 active:opacity-80"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              handleOpenWhyEditor();
            }}
          >
            {/* Header */}
            <View className="mb-3 flex-row items-center justify-center gap-2">
              <Compass className="text-stone-500" size={18} />
              <Text className="text-lg font-semibold text-stone-800">
                Your Why
              </Text>
            </View>

            {/* Content */}
            {habit.why ? (
              <View className="items-center rounded-xl border border-stone-100 bg-stone-50/50 p-4">
                {/* Identity Framing */}
                <Text className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-400">
                  I am becoming someone who...
                </Text>

                {/* The Why Statement */}
                <Text className="text-center text-base font-medium leading-relaxed text-stone-700">
                  {habit.why}
                </Text>

                <Text className="mt-3 text-xs text-stone-400">
                  Tap to edit
                </Text>
              </View>
            ) : (
              <View className="items-center rounded-xl bg-stone-50 py-6">
                <Text className="text-center text-sm text-stone-500">
                  What's the deeper reason?
                </Text>
                <Text className="mt-1 text-center text-xs text-stone-400">
                  Tap to add your motivation
                </Text>
              </View>
            )}
          </Pressable>

          {/* Cue Section - Implementation Intention */}
          <Pressable
            accessibilityLabel={hasCue ? 'Edit your cue' : 'Add a cue'}
            accessibilityRole="button"
            className="rounded-2xl bg-amber-50/80 p-5 shadow-sm shadow-stone-200/50 active:opacity-80"
            onPress={handleOpenCueEditor}
          >
            {/* Header */}
            <View className="mb-3 flex-row items-center justify-center gap-2">
              <Target className="text-amber-600" size={18} />
              <Text className="text-lg font-semibold text-amber-900">
                Your Cue
              </Text>
            </View>

            {/* Content */}
            {hasCue ? (
              <View className="items-center rounded-xl border border-amber-200/60 bg-white/80 p-4">
                {/* Full Implementation Intention Sentence */}
                {habitCueAfterBehavior ? (
                  <View className="items-center">
                    <Text className="text-center text-base leading-relaxed text-stone-600">
                      After I{' '}
                      <Text className="font-semibold text-amber-700">
                        {habitCueAfterBehavior}
                      </Text>
                      ,
                    </Text>
                    <Text className="mt-1 text-center text-base leading-relaxed text-stone-600">
                      I will{' '}
                      <Text className="font-semibold text-stone-800">
                        {habit.name}
                      </Text>
                    </Text>
                  </View>
                ) : null}
                {(habitCueLocation || habitCueTime) ? (
                  <View className="mt-3 flex-row flex-wrap items-center justify-center gap-2 border-t border-amber-100 pt-3">
                    {habitCueLocation ? (
                      <View className="flex-row items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
                        <MapPin className="text-amber-500" size={12} />
                        <Text className="text-xs font-medium text-amber-700">{habitCueLocation}</Text>
                      </View>
                    ) : null}
                    {habitCueTime ? (
                      <View className="flex-row items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
                        <Clock className="text-amber-500" size={12} />
                        <Text className="text-xs font-medium text-amber-700">{habitCueTime}</Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}
                <Text className="mt-3 text-xs text-amber-600/70">
                  Tap to edit
                </Text>
              </View>
            ) : (
              <View className="items-center rounded-xl bg-white/60 py-6">
                <Text className="text-center text-sm text-stone-500">
                  When will you do this?
                </Text>
                <Text className="mt-1 text-center text-xs text-stone-400">
                  Tap to set your cue
                </Text>
              </View>
            )}
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

          {/* Motivation Section */}
          <Pressable
            accessibilityLabel={isMotivationExpanded ? 'Collapse motivation section' : 'Expand motivation section'}
            accessibilityRole="button"
            className="flex-row items-center justify-between rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50 active:opacity-80"
            onPress={() => setIsMotivationExpanded((previous) => !previous)}
          >
            <View className="flex-row items-center gap-2">
              <Sparkles className="text-stone-500" size={20} />
              <View>
                <Text className="text-lg font-semibold text-stone-800">
                  Motivation
                </Text>
                <Text className="text-xs text-stone-500">
                  Vision board, affirmations & exercises
                </Text>
              </View>
            </View>
            <ChevronRight
              className={clsx('text-stone-400', isMotivationExpanded && 'rotate-90')}
              size={20}
            />
          </Pressable>

          {isMotivationExpanded ? (
            <Animated.View
              className="gap-4"
              entering={FadeInDown.delay(100).springify()}
            >
              {/* Vision Board */}
              <View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Eye className="text-stone-500" size={18} />
                    <Text className="text-lg font-semibold text-stone-800">
                      Vision Board
                    </Text>
                  </View>
                  <Pressable
                    accessibilityLabel="Add vision board card"
                    accessibilityRole="button"
                    className="rounded-full bg-stone-900 px-3 py-1.5 active:bg-stone-800"
                    onPress={() => handleOpenVisionBoardEditor()}
                  >
                    <Text className="text-xs font-semibold text-white">
                      Add
                    </Text>
                  </Pressable>
                </View>

                {visionBoardItems.length === 0 ? (
                  <View className="items-center rounded-xl bg-stone-50 py-6">
                    <Eye className="mb-2 text-stone-300" size={28} />
                    <Text className="text-center text-sm text-stone-500">
                      What are you building toward?
                    </Text>
                    <Text className="mt-1 text-center text-xs text-stone-400">
                      Tap Add to visualize your goal
                    </Text>
                  </View>
                ) : (
                  <View className="gap-3">
                    {visionBoardItems.slice(0, 2).map((item) => (
                      <Pressable
                        key={item._id}
                        accessibilityLabel={`Open vision card ${item.title}`}
                        accessibilityRole="button"
                        className="rounded-xl border border-stone-100 bg-stone-50/50 p-4 active:opacity-80"
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
                    {visionBoardItems.length > 2 ? (
                      <Pressable
                        accessibilityLabel="View all vision board cards"
                        accessibilityRole="button"
                        className="items-center rounded-xl border border-dashed border-stone-200 bg-white py-3 active:bg-stone-50"
                        onPress={() => setIsVisionBoardListOpen(true)}
                      >
                        <Text className="text-sm font-medium text-stone-600">
                          View all ({visionBoardItems.length})
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                )}
              </View>

              {/* Affirmations */}
              <View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <MessageCircle className="text-stone-500" size={18} />
                    <Text className="text-lg font-semibold text-stone-800">
                      Affirmations
                    </Text>
                  </View>
                  <Pressable
                    accessibilityLabel="Add affirmation"
                    accessibilityRole="button"
                    className="rounded-full bg-stone-900 px-3 py-1.5 active:bg-stone-800"
                    onPress={() => handleOpenAffirmationEditor()}
                  >
                    <Text className="text-xs font-semibold text-white">
                      Add
                    </Text>
                  </Pressable>
                </View>

                {affirmations.length === 0 ? (
                  <View className="items-center rounded-xl bg-stone-50 py-6">
                    <MessageCircle className="mb-2 text-stone-300" size={28} />
                    <Text className="text-center text-sm text-stone-500">
                      What do you tell yourself?
                    </Text>
                    <Text className="mt-1 text-center text-xs text-stone-400">
                      Tap Add for positive self-talk
                    </Text>
                  </View>
                ) : (
                  <View className="gap-3">
                    {affirmations.slice(0, 2).map((item) => (
                      <Pressable
                        key={item._id}
                        accessibilityLabel={`Edit affirmation: ${item.text.slice(0, 30)}`}
                        accessibilityRole="button"
                        className="rounded-xl border border-stone-100 bg-stone-50/50 p-4 active:opacity-80"
                        onLongPress={() => handleConfirmDeleteAffirmation(item)}
                        onPress={() => handleOpenAffirmationEditor(item)}
                      >
                        <Text className="text-sm leading-5 text-stone-700">
                          "{item.text}"
                        </Text>
                        {item.type ? (
                          <View className="mt-2 flex-row">
                            <View className="rounded-full bg-stone-100 px-2 py-0.5">
                              <Text className="text-xs text-stone-600">
                                {item.type}
                              </Text>
                            </View>
                          </View>
                        ) : null}
                      </Pressable>
                    ))}
                    {affirmations.length > 2 ? (
                      <Pressable
                        accessibilityLabel="View all affirmations"
                        accessibilityRole="button"
                        className="items-center rounded-xl border border-dashed border-stone-200 bg-white py-3 active:bg-stone-50"
                        onPress={() => setIsAffirmationsListOpen(true)}
                      >
                        <Text className="text-sm font-medium text-stone-600">
                          View all ({affirmations.length})
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                )}
              </View>

              {/* Mental Exercises */}
              <View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">
                <View className="mb-3 flex-row items-center gap-2">
                  <Brain className="text-stone-500" size={18} />
                  <Text className="text-lg font-semibold text-stone-800">
                    Mental Exercises
                  </Text>
                </View>
                <Text className="mb-4 text-sm text-stone-500">
                  Science-backed techniques to strengthen your resolve.
                </Text>
                <View className="gap-3">
                  <Pressable
                    accessibilityLabel="Open mental contrasting exercise"
                    accessibilityRole="button"
                    className="flex-row items-center justify-between rounded-xl border border-stone-100 bg-stone-50/50 p-4 active:opacity-80"
                    onPress={handleOpenVisualizationExercise}
                  >
                    <View>
                      <Text className="text-sm font-semibold text-stone-800">
                        Mental Contrasting
                      </Text>
                      <Text className="text-xs text-stone-500">
                        Visualize success & obstacles
                      </Text>
                    </View>
                    <ChevronRight className="text-stone-400" size={18} />
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Open visualization guide"
                    accessibilityRole="button"
                    className="flex-row items-center justify-between rounded-xl border border-stone-100 bg-stone-50/50 p-4 active:opacity-80"
                    onPress={handleOpenVisualizationGuide}
                  >
                    <View>
                      <Text className="text-sm font-semibold text-stone-800">
                        Visualization Guide
                      </Text>
                      <Text className="text-xs text-stone-500">
                        Goal achievement techniques
                      </Text>
                    </View>
                    <ChevronRight className="text-stone-400" size={18} />
                  </Pressable>
                </View>
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
          {/* Header */}
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

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Description */}
            <Text className="mb-4 text-sm text-stone-500">
              Your why is the deeper reason that pulls you forward when the path gets hard.
            </Text>

            {/* Identity Framing Label */}
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
              I am becoming someone who...
            </Text>

            {/* Input */}
            <TextInput
              multiline
              accessibilityLabel="Why you are doing this habit"
              className="min-h-[120px] rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900"
              maxLength={200}
              placeholder="is healthy and present for my kids..."
              placeholderTextColor="#a8a29e"
              textAlignVertical="top"
              value={whyDraft}
              onChangeText={setWhyDraft}
            />
            <View className="mt-1 flex-row items-center justify-between">
              <Text className="text-xs text-stone-400">{whyDraft.length} / 200</Text>
              {whyDraft.length > 0 && (
                <Pressable
                  accessibilityLabel="Clear text"
                  accessibilityRole="button"
                  className="rounded-full px-2 py-1 active:bg-stone-100"
                  onPress={() => setWhyDraft('')}
                >
                  <Text className="text-xs text-stone-500">Clear</Text>
                </Pressable>
              )}
            </View>

            {/* Guiding Questions */}
            <View className="mb-4 mt-6 rounded-2xl bg-stone-50 p-4">
              <Text className="mb-3 text-sm font-semibold text-stone-700">
                Dig Deeper — Ask Yourself:
              </Text>
              <View className="gap-2">
                <Text className="text-sm text-stone-600">
                  • Who will benefit when you succeed?
                </Text>
                <Text className="text-sm text-stone-600">
                  • How will your life be different in 1 year?
                </Text>
                <Text className="text-sm text-stone-600">
                  • What kind of person are you becoming?
                </Text>
              </View>
            </View>

            {/* Templates */}
            <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
              Inspiration
            </Text>
            <View className="gap-2">
              {[
                'is fully present for my family',
                'keeps promises to myself',
                'proves I can follow through',
                'deserves to feel strong and healthy',
                'makes my future self proud',
              ].map((template) => (
                <Pressable
                  key={template}
                  accessibilityLabel={`Use template: ${template}`}
                  accessibilityRole="button"
                  className="rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 active:bg-stone-100"
                  onPress={() => {
                    Haptics.selectionAsync();
                    setWhyDraft(template);
                  }}
                >
                  <Text className="text-sm text-stone-700">
                    <Text className="font-medium text-stone-500">I am someone who </Text>
                    {template}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Save Button - Fixed at bottom */}
          <View
            className="border-t border-stone-100 bg-white px-5 pt-4"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <Pressable
              accessibilityLabel="Save why"
              accessibilityRole="button"
              className="items-center rounded-2xl bg-stone-900 py-4 active:bg-stone-800"
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

      {/* Cue Editor Modal */}
      <RNModal
        animationType="slide"
        visible={isCueEditorOpen}
        onRequestClose={() => setIsCueEditorOpen(false)}
      >
        <View className="flex-1 bg-stone-50" style={{ paddingTop: insets.top + 16 }}>
          <View className="flex-row items-center justify-between bg-white px-5 pb-4 shadow-sm shadow-stone-100">
            <View className="flex-row items-center gap-2">
              <View className="rounded-full bg-amber-100 p-1.5">
                <Target className="text-amber-600" size={18} />
              </View>
              <Text className="text-lg font-bold text-stone-900">Set Your Cue</Text>
            </View>
            <Pressable
              accessibilityLabel="Close cue editor"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
              onPress={() => setIsCueEditorOpen(false)}
            >
              <X className="text-stone-600" size={22} />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Live Preview Card */}
            <Animated.View
              className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50"
              entering={FadeIn.delay(100)}
            >
              <View className="h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
              <View className="p-4">
                <Text className="mb-2 text-center text-xs font-semibold uppercase tracking-[2px] text-amber-700">
                  Your Implementation Intention
                </Text>
                <View className="items-center rounded-xl bg-white/80 p-4">
                  <Text className="text-center text-base leading-relaxed text-stone-600">
                    After I{' '}
                    <Text className="font-semibold text-amber-700">
                      {cueAfterBehaviorDraft.trim() || '________'}
                    </Text>
                    ,
                  </Text>
                  <Text className="mt-1 text-center text-base leading-relaxed text-stone-600">
                    I will{' '}
                    <Text className="font-semibold text-stone-800">
                      {habit.name}
                    </Text>
                  </Text>
                  {(cueLocationDraft.trim() || cueTimeDraft.trim()) ? (
                    <View className="mt-2 flex-row flex-wrap items-center justify-center gap-2">
                      {cueLocationDraft.trim() ? (
                        <View className="flex-row items-center gap-1 rounded-full bg-stone-50 px-2 py-0.5">
                          <MapPin className="text-stone-400" size={10} />
                          <Text className="text-xs text-stone-500">{cueLocationDraft.trim()}</Text>
                        </View>
                      ) : null}
                      {cueTimeDraft.trim() ? (
                        <View className="flex-row items-center gap-1 rounded-full bg-stone-50 px-2 py-0.5">
                          <Clock className="text-stone-400" size={10} />
                          <Text className="text-xs text-stone-500">{cueTimeDraft.trim()}</Text>
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </View>
            </Animated.View>

            {/* Explanation */}
            <View className="mb-4 flex-row items-start gap-2 rounded-xl bg-blue-50 p-3">
              <Sparkles className="mt-0.5 text-blue-500" size={14} />
              <Text className="flex-1 text-xs leading-relaxed text-blue-700">
                Link your habit to an existing behavior. Research shows this increases follow-through by{' '}
                <Text className="font-bold">2-3x</Text>.
              </Text>
            </View>

            {/* After I... Input */}
            <Text className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-stone-500">
              After I...
            </Text>
            <TextInput
              accessibilityLabel="After I (cue behavior)"
              className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900"
              maxLength={100}
              placeholder="pour my morning coffee"
              placeholderTextColor="#a8a29e"
              value={cueAfterBehaviorDraft}
              onChangeText={setCueAfterBehaviorDraft}
            />
            <Text className="mt-1 text-xs text-stone-400">{cueAfterBehaviorDraft.length} / 100</Text>

            {/* Suggestions */}
            <View className="mt-4 rounded-xl bg-amber-50/70 p-3">
              <Text className="mb-2 text-xs font-semibold text-amber-800">💡 Suggestions:</Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  'pour my morning coffee',
                  'brush my teeth',
                  'sit down at my desk',
                  'finish lunch',
                  'get home from work',
                  'wake up',
                  'put on my shoes',
                ].map((suggestion) => (
                  <Pressable
                    key={suggestion}
                    accessibilityLabel={`Use suggestion: ${suggestion}`}
                    accessibilityRole="button"
                    className={clsx(
                      'rounded-full border px-3 py-1.5 active:bg-amber-100',
                      cueAfterBehaviorDraft === suggestion
                        ? 'border-amber-400 bg-amber-100'
                        : 'border-transparent bg-white'
                    )}
                    onPress={() => setCueAfterBehaviorDraft(suggestion)}
                  >
                    <Text className="text-xs text-stone-700">{suggestion}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Location Input */}
            <Text className="mb-2 mt-6 text-xs font-semibold uppercase tracking-[2px] text-stone-500">
              Location (optional)
            </Text>
            <TextInput
              accessibilityLabel="Location"
              className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900"
              maxLength={50}
              placeholder="Kitchen, Gym, Office..."
              placeholderTextColor="#a8a29e"
              value={cueLocationDraft}
              onChangeText={setCueLocationDraft}
            />

            {/* Time Input */}
            <Text className="mb-2 mt-6 text-xs font-semibold uppercase tracking-[2px] text-stone-500">
              Time (optional)
            </Text>
            <TextInput
              accessibilityLabel="Time"
              className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900"
              maxLength={20}
              placeholder="7:00 AM or Morning"
              placeholderTextColor="#a8a29e"
              value={cueTimeDraft}
              onChangeText={setCueTimeDraft}
            />

            {/* Clear Cue Button */}
            {hasCue ? (
              <Pressable
                accessibilityLabel="Clear cue"
                accessibilityRole="button"
                className="mt-6 items-center rounded-xl border border-red-200 bg-red-50 py-3 active:bg-red-100"
                onPress={handleClearCue}
              >
                <Text className="text-sm font-medium text-red-600">Clear Cue</Text>
              </Pressable>
            ) : null}
          </ScrollView>

          {/* Save Button */}
          <View className="border-t border-stone-100 bg-white px-5 pb-5 pt-4" style={{ paddingBottom: insets.bottom + 16 }}>
            <Pressable
              accessibilityLabel="Save cue"
              accessibilityRole="button"
              className="items-center rounded-2xl bg-stone-900 py-4 active:bg-stone-800"
              onPress={handleSaveCue}
            >
              <Text className="text-base font-semibold text-white">Save Cue</Text>
            </Pressable>
          </View>
        </View>
      </RNModal>

      {/* Affirmations List Modal */}
      <RNModal
        animationType="slide"
        visible={isAffirmationsListOpen}
        onRequestClose={() => setIsAffirmationsListOpen(false)}
      >
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 16 }}>
          <View className="flex-row items-center justify-between border-b border-stone-100 px-5 pb-4">
            <Text className="text-lg font-bold text-stone-900">Affirmations</Text>
            <Pressable
              accessibilityLabel="Close affirmations"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
              onPress={() => setIsAffirmationsListOpen(false)}
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
                {affirmations.length}/10 affirmations
              </Text>
              <Pressable
                accessibilityLabel="Add affirmation"
                accessibilityRole="button"
                className="rounded-full bg-violet-600 px-4 py-2 active:bg-violet-700"
                onPress={() => handleOpenAffirmationEditor()}
              >
                <Text className="text-sm font-semibold text-white">Add</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              {affirmations.map((item) => (
                <Pressable
                  key={item._id}
                  accessibilityLabel={`Edit affirmation: ${item.text.slice(0, 30)}`}
                  accessibilityRole="button"
                  className="rounded-2xl border border-stone-100 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 active:opacity-80"
                  onLongPress={() => handleConfirmDeleteAffirmation(item)}
                  onPress={() => handleOpenAffirmationEditor(item)}
                >
                  <Text className="text-base italic leading-6 text-stone-800">
                    "{item.text}"
                  </Text>
                  {item.type ? (
                    <View className="mt-3 flex-row">
                      <View className="rounded-full bg-violet-100 px-2.5 py-1">
                        <Text className="text-xs font-medium text-violet-700">
                          {item.type}
                        </Text>
                      </View>
                    </View>
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

      {/* Affirmation Editor Modal */}
      <RNModal
        animationType="slide"
        visible={isAffirmationEditorOpen}
        onRequestClose={() => setIsAffirmationEditorOpen(false)}
      >
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 16 }}>
          <View className="flex-row items-center justify-between border-b border-stone-100 px-5 pb-4">
            <Text className="text-lg font-bold text-stone-900">
              {affirmationEditingId ? 'Edit Affirmation' : 'New Affirmation'}
            </Text>
            <Pressable
              accessibilityLabel="Close affirmation editor"
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
              onPress={() => setIsAffirmationEditorOpen(false)}
            >
              <X className="text-stone-600" size={22} />
            </Pressable>
          </View>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text className="mb-4 text-sm text-stone-500">
              Write a positive statement to counter self-doubt on hard days.
            </Text>

            <TextInput
              multiline
              accessibilityLabel="Affirmation text"
              className="min-h-[100px] rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900"
              maxLength={200}
              placeholder="I am someone who takes care of my body..."
              placeholderTextColor="#a8a29e"
              textAlignVertical="top"
              value={affirmationTextDraft}
              onChangeText={setAffirmationTextDraft}
            />
            <Text className="mt-1 text-xs text-stone-400">{affirmationTextDraft.length} / 200</Text>

            <Text className="mb-3 mt-6 text-xs font-semibold uppercase tracking-[2px] text-stone-500">
              Type (optional)
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {(['identity', 'motivational', 'instructional'] as const).map((type) => (
                <Pressable
                  key={type}
                  accessibilityLabel={`Select type: ${type}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: affirmationTypeDraft === type }}
                  className={clsx(
                    'rounded-full px-4 py-2',
                    affirmationTypeDraft === type
                      ? 'bg-violet-600'
                      : 'bg-stone-100 active:bg-stone-200'
                  )}
                  onPress={() =>
                    setAffirmationTypeDraft(
                      affirmationTypeDraft === type ? undefined : type
                    )
                  }
                >
                  <Text
                    className={clsx(
                      'text-sm font-medium',
                      affirmationTypeDraft === type ? 'text-white' : 'text-stone-700'
                    )}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View className="mt-6 rounded-xl bg-violet-50 p-3">
              <Text className="mb-2 text-xs font-semibold text-violet-800">Templates:</Text>
              <View className="gap-2">
                {[
                  { text: 'I am someone who keeps promises to myself', type: 'identity' as const },
                  { text: 'I can do hard things', type: 'motivational' as const },
                  { text: 'Progress, not perfection', type: 'instructional' as const },
                  { text: 'Showing up imperfectly beats not showing up', type: 'motivational' as const },
                ].map((template) => (
                  <Pressable
                    key={template.text}
                    accessibilityLabel={`Use template: ${template.text}`}
                    accessibilityRole="button"
                    className="rounded-xl bg-white p-3 active:bg-violet-100"
                    onPress={() => {
                      setAffirmationTextDraft(template.text);
                      setAffirmationTypeDraft(template.type);
                    }}
                  >
                    <Text className="text-sm italic text-stone-700">"{template.text}"</Text>
                    <Text className="mt-1 text-xs text-violet-600">{template.type}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
          <View className="px-5 pb-5" style={{ paddingBottom: insets.bottom + 16 }}>
            <Pressable
              accessibilityLabel="Save affirmation"
              accessibilityRole="button"
              className="items-center rounded-2xl bg-stone-900 py-4 active:bg-stone-800"
              onPress={handleSaveAffirmation}
            >
              <Text className="text-base font-semibold text-white">Save</Text>
            </Pressable>
          </View>
        </View>
      </RNModal>

      {/* Success Toast */}
      <Toast
        duration={3000}
        message="Cue saved! You're 2-3x more likely to follow through 🎯"
        variant="success"
        visible={cueToastVisible}
        onDismiss={() => setCueToastVisible(false)}
      />
    </Modal>
  );
}
