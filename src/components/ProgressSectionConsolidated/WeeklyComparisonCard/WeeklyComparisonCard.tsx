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
import { Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import type { WeeklyComparisonCardProps } from './types';
import { getTrendStyle, getMessage } from './helpers';
import { TrendBadge } from './TrendBadge';
import { ComparisonStats } from './ComparisonStats';

export const WeeklyComparisonCard = React.memo(function WeeklyComparisonCard({
  trend,
  onInfoPress,
}: WeeklyComparisonCardProps) {
  const { thisWeekCompleted, thisWeekTotal, thisWeekRate, rateChange } = trend;

  const trendStyle = useMemo(() => getTrendStyle(rateChange), [rateChange]);
  const message = useMemo(
    () => getMessage(rateChange, thisWeekRate),
    [rateChange, thisWeekRate]
  );

  const absoluteChange = Math.abs(rateChange);

  const handleInfoPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onInfoPress?.();
  };

  const accessibilityLabel = `Weekly comparison: ${thisWeekCompleted} of ${thisWeekTotal} days this week, ${rateChange >= 0 ? 'up' : 'down'} ${absoluteChange} percent from last week. ${message}`;

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='summary'
      className='rounded-2xl border border-stone-200 bg-white p-4'
      entering={FadeInDown.duration(280).delay(100).springify().damping(18)}
    >
      {/* Header */}
      <View className='mb-3 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <Text className='text-sm font-semibold text-stone-900'>
            Weekly Comparison
          </Text>
          {onInfoPress && (
            <Pressable
              accessibilityLabel='Learn more about weekly comparison'
              accessibilityRole='button'
              hitSlop={8}
              onPress={handleInfoPress}
            >
              <View className='h-4 w-4 items-center justify-center rounded-full bg-stone-100'>
                <Info className='text-stone-400' size={10} />
              </View>
            </Pressable>
          )}
        </View>

        <TrendBadge rateChange={rateChange} trendStyle={trendStyle} />
      </View>

      <ComparisonStats trend={trend} />

      {/* Message */}
      <View className='border-t border-stone-100 pt-3'>
        <Text className='text-xs text-stone-500'>{message}</Text>
      </View>
    </Animated.View>
  );
});

export default WeeklyComparisonCard;
