/**
 * StreakChainSection Component
 * Enhanced streak visualization for the Habit Detail page
 *
 * Features:
 * - Visual chain of last 7 days with fire/checkmark icons
 * - Current streak count prominently displayed
 * - Best streak badge with trophy
 * - New record celebration
 * - Staggered entrance animations
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  FadeIn,
  SlideInLeft,
} from 'react-native-reanimated';
import { Flame, Check, Circle, Trophy } from 'lucide-react-native';

export interface StreakChainSectionProps {
  bestStreak: number;
  currentStreak: number;
  lastSevenDays: boolean[]; // [oldest...newest] - true = completed, false = missed
  todayCompleted: boolean;
}

interface ChainLinkProps {
  completed: boolean;
  index: number;
  isToday: boolean;
}

function ChainLink({ completed, index, isToday }: ChainLinkProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animation
    const delay = index * 60;
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className={`
        h-10 w-10 items-center justify-center rounded-full
        ${completed
          ? 'bg-emerald-500'
          : isToday
            ? 'border-2 border-dashed border-amber-400 bg-amber-50'
            : 'bg-stone-200'
        }
        ${isToday && !completed ? 'animate-pulse' : ''}
      `}
      style={animatedStyle}
    >
      {completed ? (
        <Flame className="text-white" fill="#fff" size={20} />
      ) : isToday ? (
        <Circle className="text-amber-400" size={16} />
      ) : (
        <Circle className="text-stone-400" size={16} />
      )}
    </Animated.View>
  );
}

function ChainConnector({ active, index }: { active: boolean; index: number }) {
  const width = useSharedValue(0);

  useEffect(() => {
    const delay = index * 60 + 30;
    width.value = withDelay(delay, withSpring(16, { damping: 15 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <Animated.View
      className={`h-1 rounded-full ${active ? 'bg-emerald-300' : 'bg-stone-200'}`}
      style={animatedStyle}
    />
  );
}

export function StreakChainSection({
  bestStreak,
  currentStreak,
  lastSevenDays,
  todayCompleted,
}: StreakChainSectionProps) {
  const isNewRecord = currentStreak > 0 && currentStreak >= bestStreak;
  const trophyScale = useSharedValue(1);

  // Celebration animation when new record
  useEffect(() => {
    if (isNewRecord && currentStreak > 1) {
      trophyScale.value = withSequence(
        withSpring(1.3, { damping: 6 }),
        withSpring(1, { damping: 10 })
      );
    }
  }, [isNewRecord, currentStreak]);

  const trophyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  // Ensure we have exactly 7 days, padding with false if needed
  const days = [...Array(7 - lastSevenDays.length).fill(false), ...lastSevenDays];

  // Build chain data with today as the last item
  const chainData = days.map((completed, idx) => ({
    completed,
    isToday: idx === 6,
  }));

  // Override today's status with actual prop
  chainData[6].completed = todayCompleted;

  return (
    <View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">
      {/* Header Row */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Flame className="text-amber-500" fill="#f59e0b" size={22} />
          <Text className="text-lg font-semibold text-stone-800">
            Current Streak
          </Text>
        </View>

        <View className="flex-row items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5">
          <Text className="text-xl font-bold text-amber-700">
            {currentStreak}
          </Text>
          <Text className="text-sm font-medium text-amber-600">
            {currentStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>

      {/* Chain Visualization */}
      <View className="mb-4 flex-row items-center justify-center gap-1">
        {chainData.map((day, idx) => (
          <React.Fragment key={idx}>
            <ChainLink
              completed={day.completed}
              index={idx}
              isToday={day.isToday}
            />
            {idx < chainData.length - 1 && (
              <ChainConnector
                active={day.completed && chainData[idx + 1].completed}
                index={idx}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Day Labels */}
      <View className="mb-4 flex-row items-center justify-center gap-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
          <View key={idx} className="w-10 items-center">
            <Text className={`text-xs font-medium ${
              idx === 6 ? 'text-amber-600' : 'text-stone-400'
            }`}>
              {idx === 6 ? 'Today' : day}
            </Text>
          </View>
        ))}
      </View>

      {/* Best Streak */}
      {bestStreak > 0 && (
        <Animated.View
          className={`flex-row items-center justify-center gap-2 rounded-xl py-2 ${
            isNewRecord ? 'bg-gradient-to-r from-amber-100 to-yellow-100' : 'bg-stone-100'
          }`}
          entering={FadeIn.delay(500)}
          style={isNewRecord ? trophyAnimatedStyle : undefined}
        >
          <Trophy
            className={isNewRecord ? 'text-amber-500' : 'text-stone-400'}
            fill={isNewRecord ? '#fbbf24' : 'transparent'}
            size={18}
          />
          {isNewRecord && currentStreak > 1 ? (
            <Text className="font-semibold text-amber-700">
              🎉 New Personal Record!
            </Text>
          ) : (
            <Text className="text-sm text-stone-500">
              Personal Best: <Text className="font-semibold text-stone-700">{bestStreak} days</Text>
            </Text>
          )}
        </Animated.View>
      )}

      {/* Zero Streak State */}
      {currentStreak === 0 && (
        <View className="items-center rounded-xl bg-stone-50 py-3">
          <Text className="text-sm text-stone-500">
            🌱 Complete today to start your streak!
          </Text>
        </View>
      )}
    </View>
  );
}

export default StreakChainSection;










