/**
 * HabitDetailScreen Component
 * Habit Detail Page - Simplified
 *
 * Features:
 * - Hero section with icon, name, and description
 * - Manage habit actions
 */

import React, { useState } from 'react';
import { View, Text, Pressable, Alert, ScrollView, Modal as RNModal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Modal } from '../components/Modal';
import { VisualizationGuide } from '../components/NotesSection/VisualizationGuide';
import { VisualizationExercise } from '../components/VisualizationExercise';
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
import * as Haptics from 'expo-haptics';
import { clsx } from 'clsx';

// Types
interface Habit {
  _id: Id<'habits'>;
  archived?: boolean;
  createdAt: number;
  icon?: string;
  iconColor?: string;
  name: string;
  notes?: string;
}

interface HabitDetailScreenProps {
  habit: Habit | null;
  onArchive?: (habitId: Id<'habits'>) => void;
  onClose: () => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  onEdit?: (habit: Habit) => void;
  onOpenCalendar?: (habit: Habit) => void;
  onPause?: (habitId: Id<'habits'>) => void;
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
      {habit.notes && (
        <Text className="mt-1 px-6 text-center text-base text-stone-500">
          {habit.notes}
        </Text>
      )}
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
  visible,
}: HabitDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const safeTop = insets.top || 44;
  const [showVisualizationGuide, setShowVisualizationGuide] = useState(false);
  const [showVisualizationExercise, setShowVisualizationExercise] = useState(false);

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
    // TODO: Save visualization data to backend
    console.log('Visualization saved:', data);
    Alert.alert(
      'Visualization Saved! ✨',
      'Your mental contrasting exercise has been saved. Review it when you need motivation.',
      [{ text: 'Got it' }]
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

          {/* Motivational Boosters */}
          <Animated.View
            className="rounded-2xl bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/80 p-5 shadow-sm shadow-violet-200/30"
            entering={FadeInDown.delay(200).springify()}
          >
            <View className="mb-4 flex-row items-center gap-2">
              <Sparkles className="text-violet-500" size={20} />
              <Text className="text-lg font-semibold text-violet-900">
                Motivational Boosters
              </Text>
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

          {/* Manage Habit */}
          <Animated.View
            className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50"
            entering={FadeInDown.delay(300).springify()}
          >
            <Text className="mb-4 text-lg font-semibold text-stone-800">
              Manage Habit
            </Text>
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
