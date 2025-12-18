/**
 * WeeklySummaryCard Component
 *
 * A celebratory summary card shown at the end of the week.
 * Features:
 * - Total completions for the week
 * - Best day highlighting
 * - Streak milestones
 * - Motivational messaging
 * - Animated reveal
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { Trophy, TrendingUp, Star, Calendar, ChevronRight, Sparkles } from 'lucide-react-native';
import { format, parseISO, isThisWeek, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

interface DayStats {
  date: string;
  completed: number;
  total: number;
}

interface WeeklySummaryStats {
  bestDay: DayStats | null;
  bestDayRate: number;
  completionRate: number;
  consecutivePerfectDays: number;
  perfectDays: number;
  totalCompleted: number;
  totalPossible: number;
}

interface WeeklySummaryCardProps {
  /** Stats for each day of the week */
  weekStats: DayStats[];
  /** Current streak across all habits (average or max) */
  currentStreak?: number;
  /** Best streak achieved this week */
  bestStreakThisWeek?: number;
  /** Whether the week is complete (it's Sunday or later) */
  isWeekComplete?: boolean;
  /** Callback when user taps to view details */
  onViewDetails?: () => void;
  /** Whether to reduce motion */
  reduceMotion?: boolean;
  /** Whether to show the card */
  visible?: boolean;
}

export function WeeklySummaryCard({
  weekStats,
  currentStreak = 0,
  bestStreakThisWeek = 0,
  isWeekComplete = false,
  onViewDetails,
  reduceMotion = false,
  visible = true,
}: WeeklySummaryCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const celebrationScale = useRef(new Animated.Value(1)).current;
  const starRotation = useRef(new Animated.Value(0)).current;

  // Calculate weekly stats
  const stats = useMemo<WeeklySummaryStats>(() => {
    const totalCompleted = weekStats.reduce((sum, day) => sum + day.completed, 0);
    const totalPossible = weekStats.reduce((sum, day) => sum + day.total, 0);
    const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    // Find best day
    let bestDay: DayStats | null = null;
    let bestDayRate = 0;
    weekStats.forEach((day) => {
      const rate = day.total > 0 ? day.completed / day.total : 0;
      if (rate > bestDayRate) {
        bestDayRate = rate;
        bestDay = day;
      }
    });

    // Count perfect days (100% completion)
    const perfectDays = weekStats.filter(
      (day) => day.total > 0 && day.completed === day.total
    ).length;

    // Calculate streak of consecutive perfect days
    let consecutivePerfectDays = 0;
    for (const day of weekStats) {
      if (day.total > 0 && day.completed === day.total) {
        consecutivePerfectDays++;
      } else if (consecutivePerfectDays > 0) {
        break;
      }
    }

    return {
      totalCompleted,
      totalPossible,
      completionRate,
      bestDay,
      bestDayRate: Math.round(bestDayRate * 100),
      perfectDays,
      consecutivePerfectDays,
    };
  }, [weekStats]);

  // Get motivational message based on performance
  const getMessage = () => {
    if (stats.completionRate >= 90) return { text: "Outstanding week! 🌟", type: "excellent" };
    if (stats.completionRate >= 75) return { text: "Great momentum! 💪", type: "great" };
    if (stats.completionRate >= 50) return { text: "Solid progress! 👍", type: "good" };
    if (stats.completionRate >= 25) return { text: "Building habits! 🌱", type: "building" };
    return { text: "Every step counts! 🚀", type: "starting" };
  };

  const message = getMessage();

  // Get colors based on completion rate
  const getColors = () => {
    if (stats.completionRate >= 90) return { bg: '#dcfce7', accent: '#10b981', text: '#047857' };
    if (stats.completionRate >= 75) return { bg: '#dbeafe', accent: '#3b82f6', text: '#1d4ed8' };
    if (stats.completionRate >= 50) return { bg: '#fef3c7', accent: '#f59e0b', text: '#b45309' };
    return { bg: '#f5f5f4', accent: '#78716c', text: '#57534e' };
  };

  const colors = getColors();
  const bestDayLabel = stats.bestDay ? format(parseISO(stats.bestDay.date), 'EEEE') : null;

  // Entrance animation
  useEffect(() => {
    if (!visible) {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      return;
    }

    if (reduceMotion) {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      return;
    }

    const entranceAnim = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]);
    entranceAnim.start();

    // Celebration animations for high completion
    let celebrationAnim: Animated.CompositeAnimation | null = null;
    let rotationAnim: Animated.CompositeAnimation | null = null;

    if (stats.completionRate >= 75) {
      celebrationAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(celebrationScale, {
            toValue: 1.02,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(celebrationScale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      celebrationAnim.start();

      // Star rotation
      rotationAnim = Animated.loop(
        Animated.timing(starRotation, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotationAnim.start();
    }

    // Cleanup function to stop all animations
    return () => {
      entranceAnim.stop();
      if (celebrationAnim) {
        celebrationAnim.stop();
      }
      if (rotationAnim) {
        rotationAnim.stop();
      }
      celebrationScale.setValue(1);
      starRotation.setValue(0);
    };
  }, [visible, reduceMotion, stats.completionRate, fadeAnim, slideAnim, celebrationScale, starRotation]);

  if (!visible || weekStats.length === 0) {
    return null;
  }

  const starRotationInterpolate = starRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: celebrationScale },
        ],
      }}
    >
      <Pressable
        accessibilityLabel={`Weekly summary: ${stats.completionRate}% completion rate`}
        accessibilityRole='button'
        className='overflow-hidden rounded-3xl'
        style={{
          backgroundColor: colors.bg,
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 4,
        }}
        onPress={onViewDetails}
      >
        {/* Header */}
        <View className='flex-row items-center justify-between px-5 pt-5'>
          <View className='flex-row items-center gap-2'>
            <Animated.View
              style={{
                transform: [{ rotate: starRotationInterpolate }],
              }}
            >
              <Star color={colors.accent} fill={colors.accent} size={18} />
            </Animated.View>
            <Text
              className='text-[13px] font-bold uppercase tracking-wider'
              style={{ color: colors.text }}
            >
              Week in Review
            </Text>
          </View>
          {onViewDetails && (
            <View className='flex-row items-center gap-1'>
              <Text className='text-[12px] font-medium' style={{ color: colors.accent }}>
                Details
              </Text>
              <ChevronRight color={colors.accent} size={14} />
            </View>
          )}
        </View>

        {/* Main Stats */}
        <View className='px-5 py-4'>
          {/* Big completion rate */}
          <View className='mb-4 flex-row items-end gap-2'>
            <Text
              className='text-[48px] font-extrabold leading-[52px]'
              style={{ color: colors.text }}
            >
              {stats.completionRate}%
            </Text>
            <Text
              className='mb-2 text-[15px] font-medium'
              style={{ color: colors.accent }}
            >
              completion
            </Text>
          </View>

          {/* Message */}
          <Text
            className='mb-4 text-[16px] font-semibold'
            style={{ color: colors.text }}
          >
            {message.text}
          </Text>

          {/* Stats Grid */}
          <View className='flex-row gap-3'>
            {/* Total Completed */}
            <View
              className='flex-1 rounded-2xl p-3'
              style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
            >
              <View className='mb-1 flex-row items-center gap-1.5'>
                <Trophy color={colors.accent} size={14} />
                <Text className='text-[11px] font-semibold uppercase' style={{ color: colors.accent }}>
                  Completed
                </Text>
              </View>
              <Text className='text-[20px] font-bold' style={{ color: colors.text }}>
                {stats.totalCompleted}
              </Text>
              <Text className='text-[11px] font-medium text-stone-500'>
                of {stats.totalPossible} habits
              </Text>
            </View>

            {/* Perfect Days */}
            <View
              className='flex-1 rounded-2xl p-3'
              style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
            >
              <View className='mb-1 flex-row items-center gap-1.5'>
                <Sparkles color={colors.accent} size={14} />
                <Text className='text-[11px] font-semibold uppercase' style={{ color: colors.accent }}>
                  Perfect Days
                </Text>
              </View>
              <Text className='text-[20px] font-bold' style={{ color: colors.text }}>
                {stats.perfectDays}
              </Text>
              <Text className='text-[11px] font-medium text-stone-500'>
                100% completion
              </Text>
            </View>
          </View>

          {/* Best Day */}
          {bestDayLabel && stats.bestDayRate > 0 && (
            <View
              className='mt-3 flex-row items-center gap-3 rounded-2xl p-3'
              style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
            >
              <View
                className='h-10 w-10 items-center justify-center rounded-xl'
                style={{ backgroundColor: colors.accent + '20' }}
              >
                <Calendar color={colors.accent} size={18} />
              </View>
              <View className='flex-1'>
                <Text className='text-[12px] font-semibold uppercase' style={{ color: colors.accent }}>
                  Best Day
                </Text>
                <Text className='text-[15px] font-bold' style={{ color: colors.text }}>
                  {bestDayLabel}
                </Text>
              </View>
              <View className='items-end'>
                <Text className='text-[18px] font-bold' style={{ color: colors.text }}>
                  {stats.bestDayRate}%
                </Text>
                <Text className='text-[11px] font-medium text-stone-500'>
                  completion
                </Text>
              </View>
            </View>
          )}

          {/* Streak highlight (if significant) */}
          {currentStreak >= 3 && (
            <View className='mt-3 flex-row items-center justify-center gap-2 rounded-full py-2' style={{ backgroundColor: '#fef3c7' }}>
              <Text className='text-[14px]'>🔥</Text>
              <Text className='text-[13px] font-bold' style={{ color: '#b45309' }}>
                {currentStreak} day streak! Keep it going!
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default WeeklySummaryCard;
