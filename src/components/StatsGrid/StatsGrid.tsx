/**
 * StatsGrid Component
 * Displays key habit statistics in a 2x2 grid layout
 *
 * Features:
 * - Total completions
 * - Success rate percentage
 * - Current streak
 * - Days since tracking started
 * - Animated count-up on mount
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import {
  CheckCircle2,
  TrendingUp,
  Flame,
  Calendar
} from 'lucide-react-native';

export interface StatsGridProps {
  currentStreak: number;
  daysTracking: number;
  successRate: number;
  totalCompletions: number;
}

interface StatCardProps {
  delay: number;
  icon: React.ReactNode;
  label: string;
  suffix?: string;
  value: number | string;
}

function StatCard({ delay, icon, label, suffix, value }: StatCardProps) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 200 }));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className="flex-1 items-center justify-center rounded-xl border border-stone-100 bg-white p-4"
      style={animatedStyle}
    >
      <View className="mb-2">{icon}</View>
      <Text className="text-2xl font-bold text-stone-900">
        {value}{suffix}
      </Text>
      <Text className="mt-1 text-xs font-medium text-stone-500">
        {label}
      </Text>
    </Animated.View>
  );
}

export function StatsGrid({
  currentStreak,
  daysTracking,
  successRate,
  totalCompletions,
}: StatsGridProps) {
  // Ensure successRate is displayed nicely
  const displayRate = Math.round(successRate);

  return (
    <View className="rounded-2xl bg-white/90 p-4 shadow-sm shadow-stone-200/50">
      <View className="mb-3 flex-row items-center gap-2">
        <TrendingUp className="text-stone-600" size={20} />
        <Text className="text-lg font-semibold text-stone-800">
          Statistics
        </Text>
      </View>

      <View className="gap-3">
        {/* Top Row */}
        <View className="flex-row gap-3">
          <StatCard
            delay={0}
            icon={<CheckCircle2 className="text-emerald-500" size={24} />}
            label="Total Done"
            value={totalCompletions}
          />
          <StatCard
            delay={100}
            icon={<TrendingUp className="text-blue-500" size={24} />}
            label="Success Rate"
            suffix="%"
            value={displayRate}
          />
        </View>

        {/* Bottom Row */}
        <View className="flex-row gap-3">
          <StatCard
            delay={200}
            icon={<Flame className="text-amber-500" fill="#f59e0b" size={24} />}
            label="Current Streak"
            value={currentStreak}
          />
          <StatCard
            delay={300}
            icon={<Calendar className="text-violet-500" size={24} />}
            label="Days Tracking"
            value={daysTracking}
          />
        </View>
      </View>
    </View>
  );
}

export default StatsGrid;





