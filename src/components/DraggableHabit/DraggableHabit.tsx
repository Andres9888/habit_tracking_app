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
  bestStreak?: number;
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
  const cardScale = useRef(new Animated.Value(1)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;

  const { triggerSelection, triggerWarning } = useHapticFeedback({
    isEnabled: celebrationsEnabled,
    preference: reduceMotionPreference,
  });

  // Calculate if week is complete for visual reward
  const weekCompleteCount = weekStatus.filter(status => status === 'done').length;
  const isWeekComplete = weekCompleteCount === 7;
  const bestStreak = habit.bestStreak || 0;

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

  // Pulse animation for icon when week is complete
  useEffect(() => {
    if (isWeekComplete && !reduceMotionPreference) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconPulse, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(iconPulse, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      iconPulse.setValue(1);
    }
  }, [isWeekComplete, iconPulse, reduceMotionPreference]);

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
        cardBackground: '#fafafa', // Warm off-white for premium feel
        iconContainer: undefined as string | undefined,
        primaryText: '#1a1a1a',
        streakText: '#ea580c', // Richer orange for premium streak badge
        strengthBackground: '#10b981',
      };

  const handleLongPress = () => {
    triggerSelection();
    onLongPress?.(habit);
  };

  const handlePressIn = () => {
    Animated.spring(cardScale, {
      toValue: 0.995,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(cardScale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
    }).start();
  };

  const habitCard = (
    <Pressable
      onLongPress={handleLongPress}
      onPress={() => onPress?.(habit)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='overflow-hidden rounded-2xl'
        style={{
          backgroundColor: isWeekComplete
            ? `${accentColor}08` // 3% accent tint for completion reward
            : colors.cardBackground,
          borderColor: colors.border,
          borderWidth: highContrastMode ? 2 : 0,
          opacity: fade,
          transform: [{ translateY }, { scale: cardScale }],
          // Premium iOS-style shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3, // Android
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
        <View className='p-4'>
          {/* Title row with icon and streak */}
          <View className='mb-2.5 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-2.5'>
              {/* Icon container with pulse animation - colored background based on habit */}
              <Animated.View
                style={{
                  transform: [{ scale: iconPulse }],
                }}
              >
                <View
                  className='h-8 w-8 items-center justify-center rounded-[8px]'
                  style={{
                    backgroundColor: highContrastMode
                      ? colors.iconContainer
                      : accentColor === '#2563eb'
                        ? 'rgba(219, 234, 254, 0.75)' // blue-100 at 75%
                        : accentColor === '#ea580c'
                          ? 'rgba(255, 237, 213, 0.75)' // orange-100 at 75%
                          : accentColor === '#059669'
                            ? 'rgba(209, 250, 229, 0.75)' // emerald-100 at 75%
                            : accentColor === '#7c3aed'
                              ? 'rgba(237, 233, 254, 0.75)' // violet-100 at 75%
                              : accentColor === '#0891b2'
                                ? 'rgba(207, 250, 254, 0.75)' // cyan-100 at 75%
                                : accentColor === '#db2777'
                                  ? 'rgba(252, 231, 243, 0.75)' // pink-100 at 75%
                                  : 'rgba(254, 249, 195, 0.75)', // yellow-100 at 75%
                    borderColor: highContrastMode ? '#111111' : undefined,
                    borderWidth: highContrastMode ? 2 : 0,
                  }}
                >
                  <Text className='text-[18px] leading-[22px]'>{emoji}</Text>
                </View>
              </Animated.View>

              <Text
                className='text-[14px] font-semibold leading-[20px]'
                style={{ color: colors.primaryText, letterSpacing: 0.3 }}
              >
                {name || habit.name}
              </Text>
            </View>

            {/* Streak badges - current and best */}
            {streak > 0 && (
              <View className='flex-row items-center gap-2'>
                {/* Current streak badge */}
                <View
                  className='rounded-full bg-orange-600 px-2.5 py-1'
                  style={{
                    shadowColor: '#ea580c',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text
                    className='text-[11px] font-bold uppercase leading-[16px] tracking-tight text-white'
                  >
                    🔥 {streak}
                  </Text>
                </View>

                {/* Best streak indicator - FOMO driver */}
                {bestStreak > 0 && bestStreak > streak && (
                  <Text
                    className='text-[11px] font-medium uppercase leading-[16px] tracking-tight'
                    style={{ color: '#9ca3af' }}
                  >
                    🏆 Best: {bestStreak}
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Internal divider for premium hierarchy */}
          <View
            className='my-2.5 h-[1px]'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
          />

          {/* Week status visualizer - full width */}
          <HabitChainVisualizer
            accentColor={accentColor}
            celebrationsEnabled={celebrationsEnabled}
            currentStreak={streak}
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

          {/* Completion reward indicator */}
          {isWeekComplete && (
            <View className='mt-2 flex-row items-center justify-center'>
              <Text className='text-[11px] font-semibold uppercase tracking-wide' style={{ color: accentColor }}>
                ✓ Week Complete
              </Text>
            </View>
          )}
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
