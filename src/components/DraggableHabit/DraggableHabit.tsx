import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, Text, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type { Id } from '../../../convex/_generated/dataModel';
import { HabitChainVisualizer } from '../HabitChainVisualizer';
import { useDraggableHabitLogic } from './DraggableHabit.hooks';
import { Archive } from 'lucide-react-native';
import type { StrengthLevel } from '../HabitStrengthIndicator';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

type HabitStatus = 'done' | 'missed' | 'planned';

interface Habit {
  _id: Id<'habits'>;
  name: string;
  notes?: string;
  createdAt: number;
  _creationTime: number;
  order?: number;
  tags?: string[];
  userId?: string;
  archived?: boolean;
  archivedAt?: number;
  strength?: number;
  strengthLevel?: StrengthLevel;
  strengthUpdatedAt?: number;
}

interface DraggableHabitProps {
  celebrationsEnabled: boolean;
  habit: Habit;
  isCompactMode?: boolean;
  highContrastMode?: boolean;
  showHabitStrengthPercentage?: boolean;
  streak: number;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  onArchive?: (habitId: Id<'habits'>) => void;
  onLongPress?: ((habit?: Habit) => void) | (() => void);
  onPress?: (habit: Habit) => void;
  onWeekComplete?: (args: { habit: Habit; completedDate: string }) => void;
  reduceMotionPreference: boolean;
}

export default function DraggableHabit({
  celebrationsEnabled,
  habit,
  isCompactMode: _isCompactMode = false,
  highContrastMode = false,
  showHabitStrengthPercentage: _showHabitStrengthPercentage = false,
  streak,
  toggleHabit,
  weekDateStrings,
  weekStatus,
  onArchive,
  onLongPress,
  onPress,
  onWeekComplete,
  reduceMotionPreference,
}: DraggableHabitProps) {
  const { emoji, name, accentColor } = useDraggableHabitLogic(habit);

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const archiveFlash = useRef(new Animated.Value(0)).current;

  const { triggerSelection, triggerWarning } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, translateY]);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      extrapolate: 'clamp',
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    return (
      <Animated.View
        className='flex-row items-center justify-end'
        style={{ transform: [{ translateX: trans }] }}
      >
        <View className='h-full w-[100px] items-center justify-center rounded-r-2xl bg-red-500'>
          <Archive color='white' size={24} />
          <Text className='mt-1 text-xs font-semibold text-white'>Archive</Text>
        </View>
      </Animated.View>
    );
  };

  const handleSwipeableOpen = () => {
    triggerWarning();
    Animated.sequence([
      Animated.timing(archiveFlash, {
        duration: 120,
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: false,
      }),
      Animated.timing(archiveFlash, {
        duration: 220,
        easing: Easing.out(Easing.ease),
        toValue: 0,
        useNativeDriver: false,
      }),
    ]).start();
    if (onArchive) {
      onArchive(habit._id);
    }
  };

  const colors = highContrastMode
    ? {
        border: '#facc15',
        cardBackground: '#111111',
        iconContainer: '#facc15',
        primaryText: '#ffffff',
        streakText: '#facc15',
        strengthBackground: '#10b981',
      }
    : {
        border: '#ffffff',
        cardBackground: '#ffffff',
        iconContainer: undefined as string | undefined,
        primaryText: '#1a1a1a',
        streakText: '#ff6500',
        strengthBackground: '#10b981',
      };

  const handleLongPress = () => {
    triggerSelection();
    onLongPress?.(habit);
  };

  const habitCard = (
    <Pressable
      onLongPress={handleLongPress}
      onPress={() => onPress?.(habit)}
    >
      <Animated.View
        className='overflow-hidden rounded-2xl'
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          borderWidth: highContrastMode ? 2 : 0,
          opacity: fade,
          transform: [{ translateY }],
        }}
      >
        <Animated.View
          pointerEvents='none'
          style={{
            backgroundColor: 'rgba(248, 113, 113, 0.18)',
            borderRadius: 24,
            opacity: archiveFlash,
            position: 'absolute',
            ...StyleSheet.absoluteFillObject,
          }}
        />
        <View className='p-3.5'>
          {/* Header with icon and title */}
          <View className='mb-3.5 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-2.5'>
              {/* Icon container - colored background based on habit */}
              <View
                className='h-11 w-11 items-center justify-center rounded-[11px]'
                style={{
                  backgroundColor: highContrastMode
                    ? colors.iconContainer
                    : accentColor === '#3b82f6'
                      ? '#dbeafe' // blue-100
                      : accentColor === '#f97316'
                        ? '#ffedd5' // orange-100
                        : accentColor === '#10b981'
                          ? '#d1fae5' // emerald-100
                          : accentColor === '#8b5cf6'
                            ? '#ede9fe' // violet-100
                            : accentColor === '#06b6d4'
                              ? '#cffafe' // cyan-100
                              : accentColor === '#ec4899'
                                ? '#fce7f3' // pink-100
                                : '#fef9c3', // yellow-100
                  borderColor: highContrastMode ? '#111111' : undefined,
                  borderWidth: highContrastMode ? 2 : 0,
                }}
              >
                <Text className='text-[22px] leading-[28px]'>{emoji}</Text>
              </View>
              <View className='flex-col'>
                <Text
                  className='text-[16px] font-semibold leading-[24px]'
                  style={{ color: colors.primaryText }}
                >
                  {name || habit.name}
                </Text>
                {/* Always render streak container to prevent layout shift */}
                <View style={{ height: 20, justifyContent: 'flex-end' }}>
                  {streak > 0 && (
                    <Text
                      className='flex-row items-center text-[13px] font-bold uppercase leading-[18px]'
                      style={{ color: colors.streakText }}
                    >
                      🔥 {streak} DAY STREAK
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Week status visualizer */}
          <View>
            <HabitChainVisualizer
              accentColor={accentColor}
              celebrationsEnabled={celebrationsEnabled}
              habitId={habit._id}
              highContrastMode={highContrastMode}
              onWeekComplete={({ completedDate }) =>
                onWeekComplete?.({ completedDate, habit })
              }
              reduceMotionPreference={reduceMotionPreference}
              weekDateStrings={weekDateStrings}
              weekStatus={weekStatus}
              onToggle={toggleHabit}
            />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );

  if (!onArchive) {
    return habitCard;
  }

  return (
    <Swipeable
      friction={2}
      overshootRight={false}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      onSwipeableOpen={handleSwipeableOpen}
    >
      {habitCard}
    </Swipeable>
  );
}
