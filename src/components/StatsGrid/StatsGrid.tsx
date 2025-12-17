/**
 * StatsGrid Component
 * Displays key habit statistics with visual polish
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { CheckCircle2, TrendingUp, Flame, Calendar, BarChart3 } from 'lucide-react-native';

export interface StatsGridProps {
  currentStreak: number;
  daysTracking: number;
  successRate: number;
  totalCompletions: number;
}

interface StatCardProps {
  bgColor: string;
  delay: number;
  icon: React.ReactNode;
  iconBgColor: string;
  label: string;
  suffix?: string;
  value: number | string;
  valueColor: string;
}

function StatCard({
  bgColor,
  delay,
  icon,
  iconBgColor,
  label,
  suffix,
  value,
  valueColor,
}: StatCardProps) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 180 }));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className={`flex-1 rounded-xl p-4 ${bgColor}`}
      style={animatedStyle}
    >
      <View className={`mb-3 h-10 w-10 items-center justify-center rounded-full ${iconBgColor}`}>
        {icon}
      </View>
      <Text className={`text-3xl font-bold ${valueColor}`}>
        {value}
        {suffix && <Text className="text-xl">{suffix}</Text>}
      </Text>
      <Text className="mt-1 text-xs font-medium text-stone-500">{label}</Text>
    </Animated.View>
  );
}

export function StatsGrid({
  currentStreak,
  daysTracking,
  successRate,
  totalCompletions,
}: StatsGridProps) {
  const displayRate = Math.round(successRate);

  return (
    <View className="rounded-2xl bg-white/90 p-4 shadow-sm shadow-stone-200/50">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-center gap-2">
        <BarChart3 className="text-stone-500" size={18} />
        <Text className="text-lg font-semibold text-stone-800">Statistics</Text>
      </View>

      <View className="gap-3">
        {/* Top Row */}
        <View className="flex-row gap-3">
          <StatCard
            bgColor="bg-emerald-50"
            delay={0}
            icon={<CheckCircle2 className="text-emerald-600" size={20} />}
            iconBgColor="bg-emerald-100"
            label="Completed"
            value={totalCompletions}
            valueColor="text-emerald-700"
          />
          <StatCard
            bgColor="bg-blue-50"
            delay={80}
            icon={<TrendingUp className="text-blue-600" size={20} />}
            iconBgColor="bg-blue-100"
            label="Success Rate"
            suffix="%"
            value={displayRate}
            valueColor="text-blue-700"
          />
        </View>

        {/* Bottom Row */}
        <View className="flex-row gap-3">
          <StatCard
            bgColor="bg-amber-50"
            delay={160}
            icon={<Flame className="text-amber-600" fill="#d97706" size={20} />}
            iconBgColor="bg-amber-100"
            label="Current Streak"
            value={currentStreak}
            valueColor="text-amber-700"
          />
          <StatCard
            bgColor="bg-violet-50"
            delay={240}
            icon={<Calendar className="text-violet-600" size={20} />}
            iconBgColor="bg-violet-100"
            label="Days Tracking"
            value={daysTracking}
            valueColor="text-violet-700"
          />
        </View>
      </View>
    </View>
  );
}

export default StatsGrid;

