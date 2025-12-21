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
  cancelAnimation,
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
  { barColor: 'bg-stone-400', days: 0, icon: '', textColor: 'text-stone-700' },
  { barColor: 'bg-orange-500', days: 3, icon: '💪', textColor: 'text-orange-600' },
  { barColor: 'bg-amber-500', days: 5, icon: '⚡', textColor: 'text-amber-600' },
  { barColor: 'bg-red-500', days: 7, icon: '🔥', textColor: 'text-red-600' },
  { barColor: 'bg-yellow-500', days: 14, icon: '⭐', textColor: 'text-yellow-600' },
  { barColor: 'bg-purple-500', days: 21, icon: '👑', textColor: 'text-purple-600' },
  { barColor: 'bg-blue-500', days: 30, icon: '💎', textColor: 'text-blue-600' },
  { barColor: 'bg-pink-500', days: 60, icon: '🌟', textColor: 'text-pink-600' },
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

  return { current, daysToNext, next, progress };
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

    // Cleanup animations on unmount
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      cancelAnimation(pulse);
    };
  }, [index, isToday, todayCompleted, scale, opacity, pulse]);

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
          <Zap className="text-amber-500" fill="#f59e0b" size={18} />
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

    return () => {
      cancelAnimation(scaleX);
    };
  }, [index, scaleX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }],
  }));

  return (
    <Animated.View
      className={`absolute top-5 h-1.5 rounded-full ${active ? 'bg-emerald-300' : 'bg-stone-200'}`}
      style={[{ left: '55%', right: '-55%' }, animatedStyle]}
    />
  );
}

interface ContextualMessageProps {
  currentStreak: number;
  bestStreak: number;
  todayCompleted: boolean;
}

function getContextualMessage(
  currentStreak: number,
  bestStreak: number,
  todayCompleted: boolean
): { message: string; emoji: string; type: 'record' | 'motivation' | 'start' | 'celebrate' } {
  // New record achieved
  if (currentStreak > 0 && currentStreak > bestStreak) {
    return { emoji: '🎉', message: 'New personal record!', type: 'record' };
  }

  // Just tied the record
  if (currentStreak > 0 && currentStreak === bestStreak && bestStreak > 1) {
    return { emoji: '🏆', message: 'You matched your best! Keep going!', type: 'celebrate' };
  }

  // Zero streak - encourage starting
  if (currentStreak === 0) {
    if (todayCompleted) {
      return { emoji: '🚀', message: 'Great start! Day 1 begins!', type: 'start' };
    }
    return { emoji: '⚡', message: 'Start a new streak today!', type: 'start' };
  }

  // Has a record to beat - show progress
  const daysToRecord = bestStreak - currentStreak;
  if (daysToRecord > 0 && daysToRecord <= 3) {
    return {
      emoji: '🔥',
      message: `${daysToRecord} more ${daysToRecord === 1 ? 'day' : 'days'} to beat your record!`,
      type: 'motivation',
    };
  }

  if (daysToRecord > 3 && daysToRecord <= 7) {
    return { emoji: '💪', message: `Keep going! ${daysToRecord} days to your best!`, type: 'motivation' };
  }

  // General motivation based on streak milestones
  if (currentStreak === 1) {
    return { emoji: '🌱', message: 'Day 1 complete! Build that momentum!', type: 'motivation' };
  }

  if (currentStreak === 3) {
    return { emoji: '💪', message: '3 days strong! Habit forming!', type: 'celebrate' };
  }

  if (currentStreak === 7) {
    return { emoji: '🔥', message: 'A full week! You\'re on fire!', type: 'celebrate' };
  }

  if (currentStreak === 14) {
    return { emoji: '⭐', message: 'Two weeks! Incredible consistency!', type: 'celebrate' };
  }

  if (currentStreak === 21) {
    return { emoji: '👑', message: 'Three weeks! Habit is forming!', type: 'celebrate' };
  }

  if (currentStreak === 30) {
    return { emoji: '💎', message: 'One month! Legendary streak!', type: 'celebrate' };
  }

  // Default motivation based on distance to record
  if (daysToRecord > 7) {
    return { emoji: '🔗', message: `Keep the chain going!`, type: 'motivation' };
  }

  return { emoji: '✨', message: 'Great progress! Keep it up!', type: 'motivation' };
}

function ContextualMessage({ currentStreak, bestStreak, todayCompleted }: ContextualMessageProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  const { message, emoji, type } = getContextualMessage(currentStreak, bestStreak, todayCompleted);

  useEffect(() => {
    // Animate in after the chain animation completes (7 days * 35ms + buffer)
    const delay = 7 * 35 + 100;
    opacity.value = withDelay(delay, withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 15, stiffness: 150 }));

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateY);
    };
  }, [currentStreak, bestStreak, todayCompleted, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Different background colors based on message type
  const bgColor = {
    celebrate: 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200',
    motivation: 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200',
    record: 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-200',
    start: 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200',
  }[type];

  const textColor = {
    celebrate: 'text-emerald-700',
    motivation: 'text-violet-700',
    record: 'text-amber-700',
    start: 'text-orange-700',
  }[type];

  return (
    <Animated.View
      className={`mb-4 flex-row items-center justify-center gap-2 rounded-xl border px-4 py-2.5 ${bgColor}`}
      style={animatedStyle}
    >
      <Text className="text-base">{emoji}</Text>
      <Text className={`text-sm font-semibold ${textColor}`}>{message}</Text>
    </Animated.View>
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
  const days = [...Array.from({length: 7 - lastSevenDays.length}).fill(false), ...lastSevenDays];
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
    <View className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50">
      {/* Gradient Background */}
      <View className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30" />

      <View className="p-5">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
          <Flame className="text-orange-500" size={16} />
        </View>
        <Text className="text-lg font-bold text-stone-800">Streak</Text>
        {current.icon ? <Text className="text-lg">{current.icon}</Text> : null}
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
          <View className="mb-1.5 flex-row items-center justify-between">
            <Text className="text-xs font-medium text-stone-600">
              Progress to {next.icon} Day {next.days}
            </Text>
            <Text className="text-xs font-bold text-orange-600">
              {daysToNext} {daysToNext === 1 ? 'day' : 'days'}
            </Text>
          </View>
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

      {/* Contextual Streak Message */}
      <ContextualMessage
        bestStreak={bestStreak}
        currentStreak={currentStreak}
        todayCompleted={todayCompleted}
      />

      {/* Best Streak Badge */}
      {bestStreak > 0 && !isNewRecord && currentStreak > 0 && (
        <View className="flex-row items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-2.5">
          <Trophy className="text-amber-500" size={16} />
          <Text className="text-sm text-stone-600">
            Best: <Text className="font-bold text-amber-700">{bestStreak}</Text>
          </Text>
        </View>
      )}
      </View>
    </View>
  );
}

export default StreakChainSection;


