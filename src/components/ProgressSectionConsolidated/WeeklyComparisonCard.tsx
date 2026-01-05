/**
 * WeeklyComparisonCard Component
 *
 * Displays week-over-week comparison with visual trend indicator.
 * Shows "↑X% vs last week" or "↓X% vs last week" with color coding.
 *
 * Value: Makes progress feel tangible by showing concrete week-over-week gains.
 * Research shows comparison metrics increase user engagement and retention.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import type { WeekOverWeekTrend } from '../../utils/trendCalculations';

export interface WeeklyComparisonCardProps {
  /** Week-over-week trend data */
  trend: WeekOverWeekTrend;
  /** Optional callback when info button is pressed */
  onInfoPress?: () => void;
}

/**
 * Get trend color and icon based on rate change
 */
function getTrendStyle(rateChange: number): {
  bgColor: string;
  textColor: string;
  icon: typeof TrendingUp;
  label: string;
} {
  if (rateChange > 0) {
    return {
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      icon: TrendingUp,
      label: 'improvement',
    };
  } else if (rateChange < 0) {
    return {
      bgColor: 'bg-red-50',
      textColor: 'text-red-500',
      icon: TrendingDown,
      label: 'decline',
    };
  }
  return {
    bgColor: 'bg-stone-50',
    textColor: 'text-stone-500',
    icon: Minus,
    label: 'no change',
  };
}

/**
 * Get encouraging message based on trend
 */
function getMessage(rateChange: number, thisWeekRate: number): string {
  if (rateChange > 15) {
    return "Amazing progress! You're crushing it this week.";
  } else if (rateChange > 5) {
    return "Great improvement! Keep the momentum going.";
  } else if (rateChange > 0) {
    return "Slight improvement. Every bit counts!";
  } else if (rateChange === 0) {
    if (thisWeekRate >= 80) {
      return "Maintaining excellent consistency!";
    }
    return "Staying steady. Push for more next week!";
  } else if (rateChange > -10) {
    return "Small dip. You can bounce back!";
  } else {
    return "Tough week. Tomorrow is a fresh start.";
  }
}

export const WeeklyComparisonCard = React.memo(function WeeklyComparisonCard({
  trend,
  onInfoPress,
}: WeeklyComparisonCardProps) {
  const {
    thisWeekCompleted,
    thisWeekTotal,
    thisWeekRate,
    lastWeekCompleted,
    lastWeekRate,
    rateChange,
  } = trend;

  const trendStyle = useMemo(() => getTrendStyle(rateChange), [rateChange]);
  const message = useMemo(
    () => getMessage(rateChange, thisWeekRate),
    [rateChange, thisWeekRate]
  );

  const TrendIcon = trendStyle.icon;
  const absoluteChange = Math.abs(rateChange);

  // Animation for the trend badge
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleInfoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onInfoPress?.();
  };

  const accessibilityLabel = `Weekly comparison: ${thisWeekCompleted} of ${thisWeekTotal} days this week, ${rateChange >= 0 ? 'up' : 'down'} ${absoluteChange} percent from last week. ${message}`;

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(100)}
      className="bg-white rounded-2xl p-4 border border-stone-200"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="summary"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-semibold text-stone-900">
            Weekly Comparison
          </Text>
          {onInfoPress && (
            <Pressable
              onPress={handleInfoPress}
              hitSlop={8}
              accessibilityLabel="Learn more about weekly comparison"
              accessibilityRole="button"
            >
              <View className="w-4 h-4 rounded-full bg-stone-100 items-center justify-center">
                <Info size={10} className="text-stone-400" />
              </View>
            </Pressable>
          )}
        </View>

        {/* Trend Badge */}
        <Animated.View style={animatedStyle}>
          <View
            className={`flex-row items-center gap-1 px-2 py-1 rounded-full ${trendStyle.bgColor}`}
          >
            <TrendIcon size={12} className={trendStyle.textColor} />
            <Text className={`text-xs font-semibold ${trendStyle.textColor}`}>
              {rateChange > 0 ? '+' : ''}
              {rateChange}%
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Comparison Stats */}
      <View className="flex-row items-center gap-4 mb-3">
        {/* This Week */}
        <View className="flex-1 bg-lime-50 rounded-xl p-3">
          <Text className="text-xs text-lime-700 mb-1">This Week</Text>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-xl font-bold text-lime-900">
              {thisWeekCompleted}
            </Text>
            <Text className="text-xs text-lime-600">/ {thisWeekTotal}</Text>
          </View>
          <Text className="text-xs text-lime-600 mt-0.5">{thisWeekRate}%</Text>
        </View>

        {/* VS Indicator */}
        <View className="items-center">
          <Text className="text-xs text-stone-400 font-medium">vs</Text>
        </View>

        {/* Last Week */}
        <View className="flex-1 bg-stone-50 rounded-xl p-3">
          <Text className="text-xs text-stone-500 mb-1">Last Week</Text>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-xl font-bold text-stone-700">
              {lastWeekCompleted}
            </Text>
            <Text className="text-xs text-stone-500">/ 7</Text>
          </View>
          <Text className="text-xs text-stone-500 mt-0.5">{lastWeekRate}%</Text>
        </View>
      </View>

      {/* Message */}
      <View className="pt-3 border-t border-stone-100">
        <Text className="text-xs text-stone-500">{message}</Text>
      </View>
    </Animated.View>
  );
});

export default WeeklyComparisonCard;
