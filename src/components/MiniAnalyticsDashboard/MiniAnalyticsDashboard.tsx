/**
 * MiniAnalyticsDashboard
 *
 * A lightweight analytics preview for free users.
 * Shows today's completions, best streak, weekly rate,
 * a 7-day bar chart, and a CTA to upgrade.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { useQuery } from 'convex/react';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../convex/_generated/api';
import { colors } from '../../theme/colors';

interface MiniAnalyticsDashboardProps {
  onUpgradePress: () => void;
  reduceMotion?: boolean;
}

// Animated bar for the weekly chart
function AnimatedBar({
  height,
  label,
  count,
  isToday,
  delay,
  reduceMotion,
}: {
  height: number;
  label: string;
  count: number;
  isToday: boolean;
  delay: number;
  reduceMotion: boolean;
}) {
  const animHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      animHeight.setValue(height);
      return;
    }
    Animated.timing(animHeight, {
      toValue: height,
      duration: 500,
      delay,
      useNativeDriver: false,
    }).start();
  }, [height, delay, reduceMotion, animHeight]);

  return (
    <View className='flex-1 items-center gap-1'>
      <Text
        className='text-xs font-medium'
        style={{ color: count > 0 ? colors.primary[700] : colors.gray[400] }}
      >
        {count > 0 ? count : ''}
      </Text>
      <View
        className='w-full rounded-t-md'
        style={{
          height: 56,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Animated.View
          className='w-full rounded-md'
          style={{
            height: animHeight,
            backgroundColor: isToday
              ? colors.primary[500]
              : count > 0
                ? colors.primary[300]
                : colors.gray[200],
            minHeight: count > 0 ? 4 : 2,
          }}
        />
      </View>
      <Text
        className='text-xs'
        style={{
          color: isToday ? colors.primary[700] : colors.gray[500],
          fontWeight: isToday ? '700' : '400',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

// Stat pill for the top row
function StatPill({
  emoji,
  value,
  label,
  color,
}: {
  emoji: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View
      className='flex-1 items-center rounded-2xl px-3 py-3'
      style={{ backgroundColor: colors.light.surface }}
    >
      <Text className='text-lg'>{emoji}</Text>
      <Text className='text-xl font-bold' style={{ color }}>
        {value}
      </Text>
      <Text
        className='text-xs font-medium'
        style={{ color: colors.gray[500] }}
      >
        {label}
      </Text>
    </View>
  );
}

export function MiniAnalyticsDashboard({
  onUpgradePress,
  reduceMotion = false,
}: MiniAnalyticsDashboardProps) {
  const stats = useQuery(api.miniAnalytics.getMiniStats);

  // Don't render if no data or loading
  if (!stats) return null;

  const { completionsToday, bestStreak, weeklyRate, dailyCounts, maxCount } =
    stats;

  const maxBarHeight = 48;

  return (
    <View
      className='mx-0 mt-2 rounded-2xl border p-4'
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: colors.gray[200],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      {/* Section title */}
      <View className='mb-3 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <Ionicons
            name='stats-chart'
            size={16}
            color={colors.primary[600]}
          />
          <Text
            className='text-sm font-semibold'
            style={{ color: colors.text.primary }}
          >
            Your Progress
          </Text>
        </View>
        <View
          className='rounded-full px-2 py-0.5'
          style={{ backgroundColor: colors.primary[100] }}
        >
          <Text
            className='text-xs font-medium'
            style={{ color: colors.primary[700] }}
          >
            Free Preview
          </Text>
        </View>
      </View>

      {/* Stat pills row */}
      <View className='mb-4 flex-row gap-2'>
        <StatPill
          emoji='✅'
          value={String(completionsToday)}
          label='Today'
          color={colors.primary[700]}
        />
        <StatPill
          emoji='🔥'
          value={String(bestStreak)}
          label='Best Streak'
          color={colors.streak[600]}
        />
        <StatPill
          emoji='📊'
          value={`${weeklyRate}%`}
          label='This Week'
          color={colors.secondary[500]}
        />
      </View>

      {/* Weekly bar chart */}
      <View className='mb-3'>
        <Text
          className='mb-2 text-xs font-medium'
          style={{ color: colors.gray[500] }}
        >
          Last 7 Days
        </Text>
        <View className='flex-row gap-1.5'>
          {dailyCounts.map((day, i) => {
            const barHeight =
              day.count > 0 ? (day.count / maxCount) * maxBarHeight : 0;
            const isToday = i === dailyCounts.length - 1;
            return (
              <AnimatedBar
                key={day.date}
                height={barHeight}
                label={day.dayLabel}
                count={day.count}
                isToday={isToday}
                delay={i * 60}
                reduceMotion={reduceMotion}
              />
            );
          })}
        </View>
      </View>

      {/* Upgrade CTA */}
      <Pressable
        className='flex-row items-center justify-center rounded-xl py-3'
        style={({ pressed }) => ({
          backgroundColor: pressed
            ? colors.primary[700]
            : colors.primary[600],
          opacity: pressed ? 0.95 : 1,
        })}
        onPress={onUpgradePress}
        accessibilityRole='button'
        accessibilityLabel='See full analytics, opens premium upgrade'
      >
        <Ionicons name='analytics' size={18} color='#FFFFFF' />
        <Text className='ml-2 text-sm font-semibold text-white'>
          See Full Analytics →
        </Text>
      </Pressable>
    </View>
  );
}

export default MiniAnalyticsDashboard;
