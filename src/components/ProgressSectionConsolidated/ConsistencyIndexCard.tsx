/**
 * ConsistencyIndexCard Component
 * Shows a rolling average consistency score that's more forgiving than streaks
 *
 * Unlike streaks which reset to zero on a single miss, consistency index
 * uses weighted rolling averages (30/60/90 days) to show true long-term progress.
 * Recent days are weighted slightly higher (0.98 decay factor).
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Activity, Info, TrendingUp, TrendingDown } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import type { ConsistencyIndexResult } from '../CalendarHeatmap/utils';

export interface ConsistencyIndexCardProps {
  /** Consistency index data */
  consistencyIndex: ConsistencyIndexResult;
  /** Previous period's overall score for comparison */
  previousOverall?: number;
  /** Callback when info button is pressed */
  onInfoPress?: () => void;
}

/**
 * Circular progress ring component
 */
function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  color = '#8b5cf6',
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e7e5e4"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {/* Progress circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Get color based on consistency score
 */
function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'; // emerald-500 - excellent
  if (score >= 60) return '#8b5cf6'; // violet-500 - good
  if (score >= 40) return '#f59e0b'; // amber-500 - moderate
  return '#ef4444'; // red-500 - needs work
}

/**
 * Get feedback message based on consistency score
 */
function getFeedbackMessage(score: number): string {
  if (score >= 80) return 'Excellent consistency! Keep it up.';
  if (score >= 60) return 'Good progress! You\'re building a solid habit.';
  if (score >= 40) return 'Making progress. Try to increase frequency.';
  return 'Room to grow. Every day counts!';
}

export function ConsistencyIndexCard({
  consistencyIndex,
  previousOverall,
  onInfoPress,
}: ConsistencyIndexCardProps) {
  const { overall, day30, day60, day90 } = consistencyIndex;

  // Calculate change from previous period
  const change = useMemo(() => {
    if (previousOverall === undefined) return null;
    return overall - previousOverall;
  }, [overall, previousOverall]);

  const scoreColor = getScoreColor(overall);
  const feedbackMessage = getFeedbackMessage(overall);

  const handleInfoPress = () => {
    Haptics.selectionAsync();
    onInfoPress?.();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(150).springify()}
      className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm"
      accessibilityRole="summary"
      accessibilityLabel={`Consistency Index: ${overall} percent overall`}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-lg bg-violet-100 items-center justify-center">
            <Activity size={16} className="text-violet-600" />
          </View>
          <Text className="font-semibold text-stone-800">Consistency Index</Text>
        </View>

        <Pressable
          onPress={handleInfoPress}
          className="p-1 rounded-full"
          accessibilityRole="button"
          accessibilityLabel="Learn more about consistency index"
          accessibilityHint="Opens explanation of how consistency is calculated"
        >
          <Info size={16} className="text-stone-400" />
        </Pressable>
      </View>

      {/* Main Content */}
      <View className="flex-row items-center gap-4">
        {/* Progress Ring */}
        <View className="relative w-20 h-20 items-center justify-center">
          <ProgressRing progress={overall} color={scoreColor} />
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-xl font-bold text-stone-800">{overall}%</Text>
          </View>
        </View>

        {/* Breakdown */}
        <View className="flex-1 space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-sm text-stone-500">30-day avg</Text>
            <Text className="text-sm font-medium text-stone-700">{day30}%</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-stone-500">60-day avg</Text>
            <Text className="text-sm font-medium text-stone-700">{day60}%</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-stone-500">90-day avg</Text>
            <Text className="text-sm font-medium text-stone-700">{day90}%</Text>
          </View>
        </View>
      </View>

      {/* Change indicator */}
      {change !== null && (
        <View className="flex-row items-center justify-center mt-3 pt-3 border-t border-stone-100">
          {change >= 0 ? (
            <TrendingUp size={14} className="text-emerald-500 mr-1" />
          ) : (
            <TrendingDown size={14} className="text-amber-500 mr-1" />
          )}
          <Text
            className={`text-xs font-medium ${
              change >= 0 ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {change >= 0 ? '+' : ''}{change}% vs last period
          </Text>
        </View>
      )}

      {/* Feedback Tip */}
      <View className="mt-3 bg-stone-50 rounded-lg p-2">
        <Text className="text-xs text-stone-500">
          💡 {feedbackMessage}
        </Text>
      </View>
    </Animated.View>
  );
}

export default ConsistencyIndexCard;
