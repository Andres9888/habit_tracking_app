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
} from 'react-native-reanimated';
import { Info } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

import type { WeeklyComparisonCardProps } from './types';
import { getTrendStyle, getMessage } from './helpers';
import { TrendBadge } from './TrendBadge';
import { ComparisonStats } from './ComparisonStats';
import { triggerHaptic } from '@/utils/haptics';
import { iconSizes } from '@/theme/iconSizes';

export const WeeklyComparisonCard = React.memo(function WeeklyComparisonCard({
  trend,
  onInfoPress,
}: WeeklyComparisonCardProps) {
  const { thisWeekCompleted, thisWeekTotal, thisWeekRate, rateChange } = trend;
  const { colors } = useThemeColors();

  const trendStyle = useMemo(
    () => getTrendStyle(rateChange, { bgNeutral: colors.gray[50], textNeutral: colors.text.secondary, successBg: colors.status.successLight, successText: colors.status.success }),
    [rateChange, colors]
  );
  const message = useMemo(
    () => getMessage(rateChange, thisWeekRate),
    [rateChange, thisWeekRate]
  );

  const absoluteChange = Math.abs(rateChange);

  const handleInfoPress = () => {
    triggerHaptic('tap');
    onInfoPress?.();
  };

  const accessibilityLabel = `Weekly comparison: ${thisWeekCompleted} of ${thisWeekTotal} days this week, ${rateChange >= 0 ? 'up' : 'down'} ${absoluteChange} percent from last week. ${message}`;

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='summary'
      className='rounded-2xl border p-4'
      style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      entering={FadeInDown.duration(300).delay(100)}
    >
      {/* Header */}
      <View className='mb-3 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <Text
            className='text-sm font-semibold'
            style={{ color: colors.text.primary }}
          >
            Weekly Comparison
          </Text>
          {onInfoPress ? <Pressable
              accessibilityLabel='Learn more about weekly comparison'
              accessibilityRole='button'
              hitSlop={8}
              onPress={handleInfoPress}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
                transform: [{ scale: pressed ? 0.92 : 1 }],
              })}
            >
              <View
                className='h-4 w-4 items-center justify-center rounded-full'
                style={{ backgroundColor: colors.gray[100] }}
              >
                <Info color={colors.text.tertiary} size={iconSizes.micro} />
              </View>
            </Pressable> : null}
        </View>

        <TrendBadge rateChange={rateChange} trendStyle={trendStyle} />
      </View>

      <ComparisonStats trend={trend} />

      {/* Message */}
      <View
        className='border-t pt-3'
        style={{ borderColor: colors.cardBorder }}
      >
        <Text className='text-xs' style={{ color: colors.text.tertiary }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
});

export default WeeklyComparisonCard;
