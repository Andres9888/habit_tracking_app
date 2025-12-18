/**
 * QuickActionsSheet Component
 * Bottom sheet with quick actions for habit management
 *
 * Features:
 * - Mental Boost (highlighted) - Opens visualization exercise
 * - Complete/Uncomplete habit
 * - View Calendar
 * - Edit habit
 * - Pause habit
 * - Delete habit (destructive)
 *
 * UX Notes:
 * - Slides up from bottom with spring animation
 * - Mental Boost action is visually highlighted with violet gradient
 * - Haptic feedback on open
 * - Tap backdrop or X to dismiss
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import {
  X,
  Check,
  Brain,
  Calendar,
  Edit3,
  FileText,
  Pause,
  Trash2,
  ChevronRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { clsx } from 'clsx';
import type { Id } from '../../../convex/_generated/dataModel';

export interface QuickActionsSheetProps {
  /** Habit data */
  habit: {
    _id: Id<'habits'>;
    name: string;
    icon?: string;
    completed?: boolean;
  } | null;

  /** Is the sheet visible */
  visible: boolean;

  /** Close handler */
  onClose: () => void;

  /** Complete/uncomplete habit */
  onComplete?: () => void;

  /** Open Mental Boost (Visualization Exercise) */
  onMentalBoost?: () => void;

  /** View habit calendar */
  onViewCalendar?: () => void;

  /** View habit detail page */
  onViewDetails?: () => void;

  /** Edit habit */
  onEdit?: () => void;

  /** Pause habit */
  onPause?: () => void;

  /** Delete habit */
  onDelete?: () => void;
}

/**
 * Action Item Component
 */
interface ActionItemProps {
  destructive?: boolean;
  disabled?: boolean;
  highlighted?: boolean;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  subtitle?: string;
  badge?: string;
}

const ActionItem = ({
  badge,
  destructive = false,
  disabled = false,
  highlighted = false,
  icon,
  label,
  onPress,
  showChevron = false,
  subtitle,
}: ActionItemProps) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={clsx(
        'flex-row items-center gap-3 rounded-xl px-4 py-3.5 active:opacity-80',
        highlighted && 'border-2 border-violet-300 bg-gradient-to-r from-violet-50 to-indigo-50',
        destructive && 'bg-red-50',
        !highlighted && !destructive && 'bg-stone-50',
        disabled && 'opacity-50'
      )}
      disabled={disabled}
      onPress={handlePress}
    >
      {/* Icon */}
      <View
        className={clsx(
          'h-10 w-10 items-center justify-center rounded-xl',
          highlighted && 'bg-gradient-to-br from-violet-500 to-indigo-600',
          destructive && 'bg-red-100',
          !highlighted && !destructive && 'bg-stone-100'
        )}
      >
        {icon}
      </View>

      {/* Text */}
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text
            className={clsx(
              'text-base font-semibold',
              highlighted && 'text-violet-900',
              destructive && 'text-red-600',
              !highlighted && !destructive && 'text-stone-800'
            )}
          >
            {label}
          </Text>
          {badge && (
            <View className="rounded-full bg-violet-500 px-2 py-0.5">
              <Text className="text-xs font-bold text-white">{badge}</Text>
            </View>
          )}
        </View>
        {subtitle && (
          <Text
            className={clsx(
              'mt-0.5 text-xs',
              highlighted && 'text-violet-600',
              destructive && 'text-red-500',
              !highlighted && !destructive && 'text-stone-500'
            )}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Chevron */}
      {showChevron && (
        <ChevronRight
          className={clsx(
            highlighted && 'text-violet-400',
            destructive && 'text-red-400',
            !highlighted && !destructive && 'text-stone-400'
          )}
          size={20}
        />
      )}
    </Pressable>
  );
};

/**
 * Main QuickActionsSheet Component
 */
export const QuickActionsSheet = ({
  habit,
  onClose,
  onComplete,
  onDelete,
  onEdit,
  onMentalBoost,
  onPause,
  onViewCalendar,
  onViewDetails,
  visible,
}: QuickActionsSheetProps) => {
  const insets = useSafeAreaInsets();

  // Trigger haptic on open
  React.useEffect(() => {
    if (visible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [visible]);

  if (!habit) {
    return null;
  }

  const handleAction = (action?: () => void) => {
    onClose();
    // Small delay to let sheet close before action
    setTimeout(() => {
      action?.();
    }, 150);
  };

  return (
    <Modal
      animationType="none"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      {/* Backdrop */}
      <Animated.View
        className="absolute inset-0 bg-black/50"
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      >
        <Pressable
          accessibilityLabel="Close quick actions"
          accessibilityRole="button"
          className="flex-1"
          onPress={onClose}
        />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-xl"
        entering={SlideInDown.springify().damping(18).stiffness(150)}
        exiting={SlideOutDown.springify().damping(20).stiffness(200)}
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-stone-100 px-5 py-4">
          <View className="flex-row items-center gap-3">
            {habit.icon && <Text className="text-2xl">{habit.icon}</Text>}
            <View>
              <Text className="text-lg font-bold text-stone-900">
                Quick Actions
              </Text>
              <Text className="text-xs text-stone-500">{habit.name}</Text>
            </View>
          </View>
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 active:bg-stone-200"
            onPress={onClose}
          >
            <X className="text-stone-600" size={20} />
          </Pressable>
        </View>

        {/* Actions */}
        <ScrollView
          bounces={false}
          className="px-5 pt-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-2">
            {/* Complete Action */}
            <ActionItem
              icon={
                <Check
                  className={habit.completed ? 'text-emerald-600' : 'text-stone-600'}
                  size={20}
                  strokeWidth={2.5}
                />
              }
              label={habit.completed ? 'Mark Incomplete' : 'Complete Now'}
              onPress={() => handleAction(onComplete)}
            />

            {/* Mental Boost - HIGHLIGHTED */}
            <ActionItem
              badge="NEW!"
              highlighted
              icon={<Brain className="text-white" size={20} strokeWidth={2} />}
              label="Mental Boost"
              onPress={() => handleAction(onMentalBoost)}
              showChevron
              subtitle="Visualize success & strengthen motivation"
            />

            {/* View Calendar */}
            <ActionItem
              icon={<Calendar className="text-stone-600" size={20} strokeWidth={2} />}
              label="View Calendar"
              onPress={() => handleAction(onViewCalendar)}
              showChevron
            />

            {onViewDetails ? (
              <ActionItem
                icon={<FileText className="text-stone-600" size={20} strokeWidth={2} />}
                label="View Details"
                onPress={() => handleAction(onViewDetails)}
                showChevron
                subtitle="Stats, why, vision board"
              />
            ) : null}

            {/* Divider */}
            <View className="my-2 h-px bg-stone-100" />

            {/* Edit */}
            <ActionItem
              icon={<Edit3 className="text-stone-600" size={20} strokeWidth={2} />}
              label="Edit Habit"
              onPress={() => handleAction(onEdit)}
            />

            {/* Pause */}
            <ActionItem
              icon={<Pause className="text-stone-600" size={20} strokeWidth={2} />}
              label="Pause Habit"
              onPress={() => handleAction(onPause)}
              subtitle="Hide from daily list"
            />

            {/* Delete */}
            <ActionItem
              destructive
              icon={<Trash2 className="text-red-500" size={20} strokeWidth={2} />}
              label="Delete Habit"
              onPress={() => handleAction(onDelete)}
              subtitle="This cannot be undone"
            />
          </View>

          {/* Bottom spacing */}
          <View className="h-4" />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default QuickActionsSheet;
