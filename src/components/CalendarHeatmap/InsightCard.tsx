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
      accessible
      accessibilityLabel={`Insight: ${weakestDay.day}s are your challenge day at ${weakestDay.rate}% completion`}
      accessibilityRole='none'
      className='mt-4 overflow-hidden rounded-xl shadow-sm shadow-stone-200/50'
      entering={FadeInDown.delay(400).springify()}
    >
      {/* Gradient Background */}
      <View className='absolute inset-0 bg-gradient-to-br from-violet-50/50 via-white to-purple-50/50' />

      <View className='p-4'>
        {/* Header with icon and dismiss button */}
        <View className='mb-3 flex-row items-start justify-between'>
          <View className='flex-1 flex-row items-center gap-2'>
            <View className='h-7 w-7 items-center justify-center rounded-lg bg-violet-100'>
              <Lightbulb className='text-violet-500' size={14} />
            </View>
            <Text className='flex-1 text-sm font-semibold text-stone-800'>
              {weakestDay.day}s need focus
            </Text>
          </View>

          {onDismiss && (
            <Pressable
              accessible
              accessibilityHint='Hide this insight card'
              accessibilityLabel='Dismiss insight'
              accessibilityRole='button'
              className='rounded-lg p-1 active:bg-stone-100'
              onPress={onDismiss}
            >
              <X className='text-stone-400' size={16} />
            </Pressable>
          )}
        </View>

        {/* Pattern message */}
        <Text className='mb-3 text-xs text-stone-600'>
          You complete habits on {weakestDay.day}s only {weakestDay.rate}% of
          the time
          {avgRate > 0 &&
            ` (${Math.round(avgRate - weakestDay.rate)}% below average)`}
        </Text>

        {/* Mini day-of-week bar chart */}
        <View className='mb-4'>
          <View className='mb-1 flex-row justify-between'>
            {dayOfWeekStats.map((stat) => (
              <View
                key={stat.day}
                className='flex-1 items-center'
                importantForAccessibility='no-hide-descendants'
              >
                <Text className='mb-1 text-[10px] text-stone-400'>
                  {stat.day.charAt(0)}
                </Text>
              </View>
            ))}
          </View>

          <View className='h-12 flex-row items-end justify-between'>
            {dayOfWeekStats.map((stat) => {
              const isWeakest = stat.day === weakestDay.day;
              const height = Math.max(stat.rate, 5); // Minimum 5% height for visibility

              return (
                <View
                  key={stat.day}
                  accessible
                  accessibilityLabel={`${stat.day}: ${stat.rate}% completion rate`}
                  accessibilityRole='none'
                  className='flex-1 items-center px-0.5'
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

          <View className='mt-1 flex-row justify-between'>
            {dayOfWeekStats.map((stat) => (
              <View key={stat.day} className='flex-1 items-center'>
                <Text
                  className={`text-[9px] font-medium ${
                    stat.day === weakestDay.day
                      ? 'text-violet-600'
                      : 'text-stone-400'
                  }`}
                  importantForAccessibility='no-hide-descendants'
                >
                  {stat.rate}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action buttons */}
        <View className='flex-row gap-2'>
          {onSetReminder && (
            <Pressable
              accessible
              accessibilityHint='Opens time picker to set a reminder'
              accessibilityLabel={`Set reminder for ${weakestDay.day}s`}
              accessibilityRole='button'
              className='flex-1 flex-row items-center justify-center gap-1.5 rounded-lg bg-violet-100 px-3 py-2.5 active:bg-violet-200'
              onPress={() => onSetReminder(weakestDay.day)}
            >
              <Bell className='text-violet-600' size={14} />
              <Text className='text-xs font-medium text-violet-600'>
                Set Reminder
              </Text>
            </Pressable>
          )}

          {onSeeTips && (
            <Pressable
              accessible
              accessibilityHint='Opens tips modal with strategies'
              accessibilityLabel={`See tips for ${weakestDay.day}s`}
              accessibilityRole='button'
              className='flex-1 flex-row items-center justify-center gap-1.5 rounded-lg bg-violet-100 px-3 py-2.5 active:bg-violet-200'
              onPress={() => onSeeTips(weakestDay.day)}
            >
              <HelpCircle className='text-violet-600' size={14} />
              <Text className='text-xs font-medium text-violet-600'>Tips</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

export default InsightCard;
