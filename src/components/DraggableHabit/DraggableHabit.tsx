import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, Text, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import type { Id } from '../../../convex/_generated/dataModel';
import { HabitChainVisualizer } from '../HabitChainVisualizer';
import { useDraggableHabitLogic } from './DraggableHabit.hooks';
import { Archive } from 'lucide-react-native';
import type { StrengthLevel } from '../HabitStrengthIndicator';

// UI Constants
const MAX_GRADIENT_HEIGHT = 36; // Maximum height of strength gradient in pixels
const GRADIENT_OPACITY = 0.7; // Opacity of the strength gradient
const GRADIENT_ANIMATION_DURATION = 600; // Duration of gradient height animation in ms

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
  habit: Habit;
  isCompactMode?: boolean;
  showHabitStrengthPercentage?: boolean;
  streak: number;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  onArchive?: (habitId: Id<'habits'>) => void;
  onLongPress?: (habit: Habit) => void;
  onPress?: (habit: Habit) => void;
}

export default function DraggableHabit({
  habit,
  isCompactMode: _isCompactMode = false,
  showHabitStrengthPercentage = false,
  streak,
  toggleHabit,
  weekDateStrings,
  weekStatus,
  onArchive,
  onLongPress,
  onPress,
}: DraggableHabitProps) {
  const { emoji, name, accentColor } = useDraggableHabitLogic(habit);

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

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
    if (onArchive) {
      onArchive(habit._id);
    }
  };

  const strengthPercentage = Math.round((habit.strength || 0) * 100);
  const gradientHeight = useRef(
    new Animated.Value((habit.strength || 0) * MAX_GRADIENT_HEIGHT)
  ).current;

  useEffect(() => {
    Animated.timing(gradientHeight, {
      duration: GRADIENT_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
      toValue: (habit.strength || 0) * MAX_GRADIENT_HEIGHT,
      useNativeDriver: false,
    }).start();
  }, [habit.strength, gradientHeight]);

  const habitCard = (
    <Pressable
      onPress={() => onPress?.(habit)}
      onLongPress={() => onLongPress?.(habit)}
    >
      <Animated.View
        className='overflow-hidden rounded-2xl bg-white'
        style={{
          opacity: fade,
          transform: [{ translateY }],
        }}
      >
        <View className='p-4'>
          {/* Header with icon, title and strength badge */}
          <View className='mb-5 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-4'>
              {/* Icon container - colored background based on habit */}
              <View
                className='h-12 w-12 items-center justify-center rounded-[12px]'
                style={{
                  backgroundColor:
                    accentColor === '#3b82f6'
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
                }}
              >
                <Text className='text-[24px] leading-[32px]'>{emoji}</Text>
              </View>
              <View className='flex-col'>
                <Text className='text-[18px] font-semibold leading-[28px] text-[#1a1a1a]'>
                  {name || habit.name}
                </Text>
                {streak > 0 && (
                  <Text className='mt-1 flex-row items-center text-[14px] font-bold uppercase leading-[20px] text-[#ff6500]'>
                    🔥 {streak} DAY STREAK
                  </Text>
                )}
              </View>
            </View>
            {showHabitStrengthPercentage &&
              habit.strength !== undefined &&
              habit.strength > 0 && (
                <View className='h-7 rounded-full bg-[#10b981] px-3'>
                  <Text className='text-[14px] font-semibold leading-7 text-white'>
                    {strengthPercentage}%
                  </Text>
                </View>
              )}
          </View>

          {/* Week status visualizer */}
          <View>
            <HabitChainVisualizer
              accentColor={accentColor}
              habitId={habit._id}
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
