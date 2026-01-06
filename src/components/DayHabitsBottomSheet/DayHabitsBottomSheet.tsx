import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format, isSameDay, isBefore } from 'date-fns';

import type { Id } from '../../../convex/_generated/dataModel';
import type { Habit, HabitStatus } from '../../features/habits/types';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { HabitDayToggleRow } from './HabitDayToggleRow';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Spring configuration for bottom sheet animations
 * Matching SortBottomSheet's organic spring feel
 */
const SHEET_SPRING_CONFIG = {
  damping: 18,
  mass: 1,
  stiffness: 120,
};

export interface DayHabitsBottomSheetProps {
  /** The selected date to show habits for */
  date: Date | null;
  /** Whether the sheet is visible */
  visible: boolean;
  /** Callback when the sheet should close */
  onClose: () => void;
  /** List of all habits */
  habits: Habit[];
  /** Get completion status for a habit on a specific date */
  getHabitStatus: (habitId: string, dateString: string) => HabitStatus;
  /** Toggle habit completion for a specific date */
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => Promise<void>;
  /** Whether to reduce motion for animations */
  reduceMotion?: boolean;
}

/**
 * DayHabitsBottomSheet - iOS-style bottom sheet for viewing and toggling habits on a specific day.
 *
 * Features:
 * - Drag handle for visual affordance
 * - Header with formatted date and "Today" badge
 * - Scrollable list of habits with toggle checkboxes
 * - Done button to close
 * - Spring animations for slide up/down
 * - Backdrop fade to 40% black
 * - Dismiss via tap outside, drag down, or Done button
 * - Haptic feedback on toggle
 * - Empty state when no habits exist
 * - Full accessibility support
 */
export function DayHabitsBottomSheet({
  date,
  visible,
  onClose,
  habits,
  getHabitStatus,
  toggleHabit,
  reduceMotion = false,
}: DayHabitsBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});

  // Track which habit is currently being toggled (for loading state)
  const [togglingHabitId, setTogglingHabitId] = useState<string | null>(null);

  // Animation values
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  // Gesture threshold for dismissal
  const DISMISS_THRESHOLD = 100;
  const VELOCITY_THRESHOLD = 800;

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      // Slide up with spring
      backdropOpacity.value = reduceMotion
        ? 0.4
        : withTiming(0.4, { duration: 300, easing: Easing.out(Easing.cubic) });
      translateY.value = reduceMotion ? 0 : withSpring(0, SHEET_SPRING_CONFIG);
    } else {
      // Slide down
      backdropOpacity.value = reduceMotion
        ? 0
        : withTiming(0, { duration: 250, easing: Easing.in(Easing.cubic) });
      translateY.value = reduceMotion
        ? SCREEN_HEIGHT
        : withSpring(SCREEN_HEIGHT, SHEET_SPRING_CONFIG);
    }
  }, [visible, reduceMotion, backdropOpacity, translateY]);

  // Pan gesture for drag-to-dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      // Use Math.round on velocity to avoid precision loss error in Reanimated
      const velocityY = Math.round(event.velocityY);
      if (
        event.translationY > DISMISS_THRESHOLD ||
        velocityY > VELOCITY_THRESHOLD
      ) {
        translateY.value = withSpring(SCREEN_HEIGHT, SHEET_SPRING_CONFIG);
        runOnJS(triggerLightImpact)();
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, SHEET_SPRING_CONFIG);
      }
    });

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Handle backdrop press
  const handleBackdropPress = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [triggerLightImpact, onClose]);

  // Handle Done button press
  const handleDonePress = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [triggerLightImpact, onClose]);

  // Handle habit toggle
  const handleToggleHabit = useCallback(
    async (habitId: Id<'habits'>) => {
      if (!date) return;

      const dateString = format(date, 'yyyy-MM-dd');
      setTogglingHabitId(habitId);
      triggerSelection();

      try {
        await toggleHabit({ date: dateString, habitId });
      } finally {
        setTogglingHabitId(null);
      }
    },
    [date, toggleHabit, triggerSelection]
  );

  // Compute date info
  const dateString = date ? format(date, 'yyyy-MM-dd') : '';
  const displayDate = date ? format(date, 'EEEE, MMM d') : '';
  const isToday = date ? isSameDay(date, new Date()) : false;
  const isPast = date ? isBefore(date, new Date()) : false;

  // Compute completion count for header
  const completedCount = habits.filter(
    (habit) => getHabitStatus(habit._id, dateString) === 'done'
  ).length;

  return (
    <Modal
      accessibilityViewIsModal
      statusBarTranslucent
      transparent
      animationType='none'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-end'>
        {/* Backdrop */}
        <Pressable
          accessible={false}
          className='absolute inset-0'
          onPress={handleBackdropPress}
        >
          <Animated.View className='flex-1 bg-black' style={backdropStyle} />
        </Pressable>

        {/* Sheet container */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className='rounded-t-3xl bg-white'
            style={[
              {
                elevation: 20,
                maxHeight: SCREEN_HEIGHT * 0.75,
                paddingBottom: insets.bottom + 16,
                shadowColor: '#000',
                shadowOffset: { height: -4, width: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
              },
              sheetStyle,
            ]}
          >
            {/* Drag handle */}
            <View className='items-center py-3'>
              <View className='h-1 w-10 rounded-full bg-stone-300' />
            </View>

            {/* Header */}
            <View className='flex-row items-center justify-between px-5 pb-4'>
              <View className='flex-1'>
                <Text className='text-[17px] font-bold text-stone-900'>
                  {displayDate}
                </Text>
                {isToday && (
                  <Text className='text-[13px] font-medium text-amber-600'>
                    Today
                  </Text>
                )}
                {habits.length > 0 && (
                  <Text className='mt-0.5 text-[13px] font-normal text-stone-500'>
                    {completedCount} of {habits.length} completed
                  </Text>
                )}
              </View>
              <Pressable
                accessibilityHint='Close habit list'
                accessibilityLabel='Done'
                accessibilityRole='button'
                className='rounded-lg px-3 py-1.5 active:bg-stone-100'
                onPress={handleDonePress}
              >
                <Text className='text-[14px] font-semibold text-amber-600'>
                  Done
                </Text>
              </Pressable>
            </View>

            {/* Habit List or Empty State */}
            {habits.length === 0 ? (
              <View className='items-center px-6 py-8'>
                <Text className='text-[32px]'>📝</Text>
                <Text className='mt-2 text-center text-[15px] font-medium text-stone-500'>
                  No habits yet
                </Text>
                <Text className='mt-1 text-center text-[13px] font-normal text-stone-400'>
                  Create your first habit to start tracking
                </Text>
              </View>
            ) : (
              <ScrollView
                className='px-4'
                contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
                showsVerticalScrollIndicator={false}
              >
                {habits.map((habit) => {
                  const status = getHabitStatus(habit._id, dateString);
                  const isCompleted = status === 'done';
                  const isLoading = togglingHabitId === habit._id;

                  return (
                    <HabitDayToggleRow
                      key={habit._id}
                      habit={habit}
                      isCompleted={isCompleted}
                      isLoading={isLoading}
                      reduceMotion={reduceMotion}
                      onToggle={() =>
                        handleToggleHabit(habit._id as Id<'habits'>)
                      }
                    />
                  );
                })}
              </ScrollView>
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

export default DayHabitsBottomSheet;
