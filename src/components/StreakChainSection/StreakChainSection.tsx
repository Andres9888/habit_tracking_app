/**
 * StreakChainSection Component
 * Clean, focused streak visualization
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Flame, Trophy, Check, Zap } from 'lucide-react-native';

export interface StreakChainSectionProps {
  bestStreak: number;
  currentStreak: number;
  lastSevenDays: boolean[];
  todayCompleted: boolean;
}

// Faster progression tiers - early wins matter!
// Milestones: Day 3, 5, 7, 14, 21, 30+
const TIERS = [
  { days: 0, icon: '', textColor: 'text-stone-700', barColor: 'bg-stone-400' },
  { days: 3, icon: '💪', textColor: 'text-orange-600', barColor: 'bg-orange-500' },
  { days: 5, icon: '⚡', textColor: 'text-amber-600', barColor: 'bg-amber-500' },
  { days: 7, icon: '🔥', textColor: 'text-red-600', barColor: 'bg-red-500' },
  { days: 14, icon: '⭐', textColor: 'text-yellow-600', barColor: 'bg-yellow-500' },
  { days: 21, icon: '👑', textColor: 'text-purple-600', barColor: 'bg-purple-500' },
  { days: 30, icon: '💎', textColor: 'text-blue-600', barColor: 'bg-blue-500' },
  { days: 60, icon: '🌟', textColor: 'text-pink-600', barColor: 'bg-pink-500' },
];

const getTierInfo = (streak: number) => {
  let current = TIERS[0];
  let next = TIERS[1];

  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (streak >= TIERS[i].days) {
      current = TIERS[i];
      next = TIERS[i + 1] || null;
      break;
    }
  }

  const daysToNext = next ? next.days - streak : 0;
  const progress = next ? (streak - current.days) / (next.days - current.days) : 1;

  return { current, next, daysToNext, progress };
};

interface DayCircleProps {
  completed: boolean;
  index: number;
  isToday: boolean;
  label: string;
  todayCompleted: boolean;
}

function DayCircle({ completed, index, isToday, label, todayCompleted }: DayCircleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    const delay = index * 35;
    scale.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 200 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 120 }));

    if (isToday && !todayCompleted) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [index, isToday, todayCompleted]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: isToday && !todayCompleted ? scale.value * pulse.value : scale.value }],
  }));

  return (
    <Animated.View className="flex-1 items-center" style={animatedStyle}>
      <View
        className={`
          mb-1.5 h-10 w-10 items-center justify-center rounded-full
          ${completed
            ? 'bg-emerald-500'
            : isToday
              ? 'border-2 border-amber-400 bg-amber-50'
              : 'bg-stone-100'
          }
        `}
      >
        {completed ? (
          <Check className="text-white" size={20} strokeWidth={3} />
        ) : isToday ? (
          <Zap className="text-amber-500" size={18} fill="#f59e0b" />
        ) : null}
      </View>
      <Text
        className={`text-[10px] font-medium ${
          isToday ? 'text-amber-600' : completed ? 'text-emerald-600' : 'text-stone-400'
        }`}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

function ConnectorLine({ active, index }: { active: boolean; index: number }) {
  const scaleX = useSharedValue(0);

  useEffect(() => {
    scaleX.value = withDelay(index * 35 + 15, withSpring(1, { damping: 15 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }],
  }));

  return (
    <Animated.View
      className={`absolute top-5 h-1 rounded-full ${active ? 'bg-emerald-300' : 'bg-stone-200'}`}
      style={[{ left: '55%', right: '-55%' }, animatedStyle]}
    />
  );
}

export function StreakChainSection({
  bestStreak,
  currentStreak,
  lastSevenDays,
  todayCompleted,
}: StreakChainSectionProps) {
  const { current, next, daysToNext, progress } = getTierInfo(currentStreak);
  const isNewRecord = currentStreak > 0 && currentStreak >= bestStreak;

  const numberScale = useSharedValue(1);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    if (currentStreak > 0) {
      numberScale.value = withSequence(
        withSpring(1.08, { damping: 6 }),
        withSpring(1, { damping: 10 })
      );
    }
    barWidth.value = withDelay(150, withSpring(progress, { damping: 15 }));
  }, [currentStreak, progress]);

  const numberAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numberScale.value }],
  }));

  const barAnimatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(barWidth.value * 100, 100)}%`,
  }));

  // Build chain
  const days = [...Array(7 - lastSevenDays.length).fill(false), ...lastSevenDays];
  const chainData = days.map((completed, idx) => ({ completed, isToday: idx === 6 }));
  chainData[6].completed = todayCompleted;

  // Day labels
  const dayLabels = useMemo(() => {
    const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date().getDay();
    const result: string[] = [];
    for (let i = 6; i >= 0; i--) {
      result.push(labels[(today - i + 7) % 7]);
    }
    result[6] = 'Now';
    return result;
  }, []);

  return (
    <View className="rounded-2xl bg-white/90 p-5 shadow-sm shadow-stone-200/50">
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-center gap-2">
        <Flame
          className={currentStreak >= 3 ? 'text-orange-500' : 'text-stone-400'}
          fill={currentStreak >= 3 ? '#f97316' : 'transparent'}
          size={20}
        />
        <Text className="text-lg font-semibold text-stone-800">Streak</Text>
        {current.icon ? (
          <Text className="text-lg">{current.icon}</Text>
        ) : null}
      </View>

      {/* Big Number */}
      <Animated.View className="mb-2 items-center" style={numberAnimatedStyle}>
        <Text className={`text-6xl font-bold tracking-tighter ${current.textColor}`}>
          {currentStreak}
        </Text>
        <Text className="text-sm text-stone-500">
          {currentStreak === 1 ? 'day' : 'days'}
        </Text>
      </Animated.View>

      {/* Progress to Next Tier */}
      {next && (
        <View className="mb-4 px-2">
          <View className="h-2 overflow-hidden rounded-full bg-stone-100">
            <Animated.View
              className={`h-full rounded-full ${next.barColor}`}
              style={barAnimatedStyle}
            />
          </View>
        </View>
      )}

      {/* 7-Day Chain */}
      <View className="mb-4 flex-row items-start">
        {chainData.map((day, idx) => (
          <View key={idx} className="relative flex-1">
            {idx < chainData.length - 1 && (
              <ConnectorLine
                active={day.completed && chainData[idx + 1].completed}
                index={idx}
              />
            )}
            <DayCircle
              completed={day.completed}
              index={idx}
              isToday={day.isToday}
              label={dayLabels[idx]}
              todayCompleted={todayCompleted}
            />
          </View>
        ))}
      </View>

      {/* Best Streak */}
      {bestStreak > 0 && (
        <View
          className={`flex-row items-center justify-center gap-2 rounded-xl py-2.5 ${
            isNewRecord
              ? 'border border-amber-200 bg-amber-50'
              : 'border border-stone-100 bg-stone-50/50'
          }`}
        >
          <Trophy
            className={isNewRecord ? 'text-amber-500' : 'text-stone-400'}
            fill={isNewRecord ? '#fbbf24' : 'transparent'}
            size={16}
          />
          {isNewRecord ? (
            <Text className="text-sm font-semibold text-amber-700">New Best! 🎉</Text>
          ) : (
            <Text className="text-sm text-stone-500">
              Best: <Text className="font-bold text-stone-700">{bestStreak}</Text>
            </Text>
          )}
        </View>
      )}

      {/* Zero State */}
      {currentStreak === 0 && !todayCompleted && (
        <View className="items-center rounded-xl border border-stone-100 bg-stone-50/50 py-3">
          <Text className="text-sm text-stone-500">
            Complete today to start ⚡
          </Text>
        </View>
      )}
    </View>
  );
}

export default StreakChainSection;
