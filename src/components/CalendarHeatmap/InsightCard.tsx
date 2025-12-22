/**
 * InsightCard Component
 * Displays pattern detection insights and actionable tips
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Lightbulb, Bell, HelpCircle, X } from 'lucide-react-native';
import type { InsightCardProps } from './types';

export function InsightCard({
  dayOfWeekStats,
  weakestDay,
  onSetReminder,
  onSeeTips,
  onDismiss,
}: InsightCardProps) {
  // Don't render if no weak day detected
  if (!weakestDay) {
    return null;
  }

  // Find the average completion rate
  const avgRate = dayOfWeekStats.reduce((sum, stat) => sum + stat.rate, 0) / 7;

  return (
    <Animated.View
      className="mt-4 overflow-hidden rounded-xl shadow-sm shadow-stone-200/50"
      entering={FadeInDown.delay(400).springify()}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={`Insight: ${weakestDay.day}s are your challenge day at ${weakestDay.rate}% completion`}
    >
      {/* Gradient Background */}
      <View className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-white to-purple-50/50" />

      <View className="p-4">
        {/* Header with icon and dismiss button */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-row items-center gap-2 flex-1">
            <View className="h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
              <Lightbulb className="text-violet-500" size={14} />
            </View>
            <Text className="text-sm font-semibold text-stone-800 flex-1">
              {weakestDay.day}s need focus
            </Text>
          </View>

          {onDismiss && (
            <Pressable
              onPress={onDismiss}
              className="p-1 rounded-lg active:bg-stone-100"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Dismiss insight"
              accessibilityHint="Hide this insight card"
            >
              <X className="text-stone-400" size={16} />
            </Pressable>
          )}
        </View>

        {/* Pattern message */}
        <Text className="text-xs text-stone-600 mb-3">
          You complete habits on {weakestDay.day}s only {weakestDay.rate}% of the time
          {avgRate > 0 && ` (${Math.round(avgRate - weakestDay.rate)}% below average)`}
        </Text>

        {/* Mini day-of-week bar chart */}
        <View className="mb-4">
          <View className="flex-row justify-between mb-1">
            {dayOfWeekStats.map((stat) => (
              <View
                key={stat.day}
                className="flex-1 items-center"
                accessible={true}
                accessibilityRole="none"
                accessibilityLabel={`${stat.day}: ${stat.rate}% completion rate`}
              >
                <Text className="text-[10px] text-stone-400 mb-1">
                  {stat.day.charAt(0)}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-row justify-between items-end h-12">
            {dayOfWeekStats.map((stat) => {
              const isWeakest = stat.day === weakestDay.day;
              const height = Math.max(stat.rate, 5); // Minimum 5% height for visibility

              return (
                <View
                  key={stat.day}
                  className="flex-1 items-center px-0.5"
                  accessible={true}
                  accessibilityRole="none"
                  accessibilityLabel={`${stat.day}: ${stat.rate}% completion rate`}
                >
                  <View
                    className={`w-full rounded-t ${
                      isWeakest ? 'bg-violet-400' : 'bg-emerald-300'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </View>
              );
            })}
          </View>

          <View className="flex-row justify-between mt-1">
            {dayOfWeekStats.map((stat) => (
              <View key={stat.day} className="flex-1 items-center">
                <Text
                  className={`text-[9px] font-medium ${
                    stat.day === weakestDay.day ? 'text-violet-600' : 'text-stone-400'
                  }`}
                  importantForAccessibility="no-hide-descendants"
                >
                  {stat.rate}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action buttons */}
        <View className="flex-row gap-2">
          {onSetReminder && (
            <Pressable
              onPress={() => onSetReminder(weakestDay.day)}
              className="flex-1 flex-row items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-violet-100 active:bg-violet-200"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Set reminder for ${weakestDay.day}s`}
              accessibilityHint="Opens time picker to set a reminder"
            >
              <Bell className="text-violet-600" size={14} />
              <Text className="text-xs font-medium text-violet-600">
                Set Reminder
              </Text>
            </Pressable>
          )}

          {onSeeTips && (
            <Pressable
              onPress={() => onSeeTips(weakestDay.day)}
              className="flex-1 flex-row items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-violet-100 active:bg-violet-200"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`See tips for ${weakestDay.day}s`}
              accessibilityHint="Opens tips modal with strategies"
            >
              <HelpCircle className="text-violet-600" size={14} />
              <Text className="text-xs font-medium text-violet-600">Tips</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

export default InsightCard;
