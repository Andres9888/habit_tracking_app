/**
 * ThisMonthCard Component
 *
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Use `ProgressSectionConsolidated` from `../ProgressSectionConsolidated` instead.
 *
 * Migration Guide:
 * - Import `ProgressSectionConsolidated` from `../ProgressSectionConsolidated`
 * - The new component combines YourProgressCard, PersonalBestsCard, and ThisMonthCard
 *   into a single unified card with improved visual hierarchy
 * - The weekly pattern chart is now a compact 56px-height bar chart (WeeklyPatternChart)
 * - Monthly stats are shown in the InsightChips component
 *
 * Old:
 *   <ThisMonthCard dayStats={...} thisMonthRate={80} lastMonthRate={75} ... />
 *
 * New:
 *   <ProgressSectionConsolidated tracking={...} strength={75} ... />
 *
 * Section 3: Combines Best Days chart + Monthly Trend.
 * Features:
 * - Animated bar chart (7 days, staggered animation)
 * - Best day highlighted (emerald), worst day highlighted (amber)
 * - Summary row: "+X% vs last month" + "Y/Z days completed"
 * - "See All" link for full analytics
 * - Violet/blue gradient theme
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, Pressable, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { BarChart3, TrendingUp, TrendingDown, CheckCircle2, ChevronRight } from 'lucide-react-native';

import type { ThisMonthCardProps, DayStats } from './types';

// Day labels
const DAY_LABELS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * DayBar Component - Individual animated bar
 */
function DayBar({
  dayStats,
  isBest,
  isWorst,
  maxRate,
  index,
  reduceMotion,
}: {
  dayStats: DayStats;
  isBest: boolean;
  isWorst: boolean;
  maxRate: number;
  index: number;
  reduceMotion: boolean;
}) {
  const height = useSharedValue(0);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  const normalizedHeight = maxRate > 0 ? (dayStats.rate / maxRate) * 100 : 0;
  const minHeight = dayStats.rate > 0 ? 15 : 4;
  const finalHeight = Math.max(normalizedHeight, minHeight);

  useEffect(() => {
    if (reduceMotion) {
      height.value = finalHeight;
      return;
    }

    // Staggered animation: 50ms delay between each bar, 600ms duration
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 200 }));
    height.value = withDelay(index * 50, withSpring(finalHeight, { damping: 12, stiffness: 100 }));
  }, [index, finalHeight, reduceMotion]);

  const barStyle = useAnimatedStyle(() => ({
    height: `${height.value}%`,
    opacity: opacity.value,
  }));

  // Color coding based on performance
  const getBgColor = () => {
    if (isBest) return 'bg-emerald-500';
    if (isWorst && dayStats.rate < 70) return 'bg-amber-500';
    if (dayStats.rate >= 70) return 'bg-emerald-500/70';
    if (dayStats.rate >= 50) return 'bg-blue-500/60';
    return 'bg-amber-500/70';
  };

  return (
    <View
      className="flex-1 items-center"
      accessibilityLabel={`${DAY_LABELS_SHORT[dayStats.dayIndex]}: ${dayStats.rate}% completion${isBest ? ', best day' : ''}${isWorst ? ', needs improvement' : ''}`}
    >
      <View className="h-16 w-full items-center justify-end px-0.5">
        <Animated.View
          className={`w-full rounded-t-md ${getBgColor()}`}
          style={barStyle}
        />
      </View>
      <Text
        className={`mt-1 text-xs font-medium ${
          isBest ? 'text-emerald-600' : isWorst ? 'text-amber-600' : 'text-stone-500'
        }`}
      >
        {DAY_LABELS_SHORT[dayStats.dayIndex]}
      </Text>
      <Text
        className={`text-[9px] ${
          isBest ? 'font-bold text-emerald-700' : isWorst ? 'font-medium text-amber-700' : 'text-stone-400'
        }`}
      >
        {dayStats.rate}%
      </Text>
    </View>
  );
}

export function ThisMonthCard({
  dayStats,
  thisMonthRate,
  lastMonthRate,
  completedDays,
  totalDays,
  onSeeAllPress,
}: ThisMonthCardProps) {
  // Track reduce motion preference
  const [reduceMotion, setReduceMotion] = React.useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  // Calculate best and worst days
  const { bestDay, worstDay, maxRate } = useMemo(() => {
    const withData = dayStats.filter((d) => d.total > 0);
    if (withData.length === 0) {
      return { bestDay: null, worstDay: null, maxRate: 1 };
    }

    const best = withData.reduce((best, curr) => (curr.rate > best.rate ? curr : best));
    const worst = withData.reduce((worst, curr) => (curr.rate < worst.rate ? curr : worst));
    const max = Math.max(...dayStats.map((d) => d.rate), 1);

    return { bestDay: best, worstDay: worst, maxRate: max };
  }, [dayStats]);

  const trendChange = thisMonthRate - lastMonthRate;
  const isPositiveTrend = trendChange > 0;
  const isNegativeTrend = trendChange < 0;

  return (
    <View
      className="overflow-hidden rounded-2xl shadow-sm shadow-stone-200/50"
      accessible={true}
      accessibilityLabel={`This month: ${completedDays} of ${totalDays} days completed, ${thisMonthRate}% success rate`}
    >
      {/* Gradient Background */}
      <View className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-blue-50/30" />
      <View className="absolute inset-0 border border-violet-500/20 rounded-2xl" />

      <View className="p-4">
        {/* Header with See All */}
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
              <BarChart3 className="text-violet-500" size={14} />
            </View>
            <Text className="text-sm font-semibold text-stone-600">This Month</Text>
          </View>
          <Pressable
            className="flex-row items-center gap-0.5 active:opacity-70"
            onPress={onSeeAllPress}
            accessibilityLabel="See all analytics"
            accessibilityRole="button"
          >
            <Text className="text-xs font-medium text-violet-600">See All</Text>
            <ChevronRight className="text-violet-400" size={14} />
          </Pressable>
        </View>

        {/* Bar Chart */}
        <Animated.View
          className="mb-4 flex-row items-end justify-between px-1"
          entering={FadeIn.delay(100)}
        >
          {dayStats.map((day, index) => (
            <DayBar
              key={day.dayIndex}
              dayStats={day}
              isBest={bestDay?.dayIndex === day.dayIndex}
              isWorst={worstDay?.dayIndex === day.dayIndex && day.rate < (bestDay?.rate || 100)}
              maxRate={maxRate}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </Animated.View>

        {/* Summary Row */}
        <View className="flex-row items-center justify-between rounded-xl bg-white/60 px-3 py-2.5 border border-violet-100">
          {/* Trend */}
          <View className="flex-row items-center gap-1.5">
            {isPositiveTrend ? (
              <TrendingUp className="text-emerald-500" size={16} />
            ) : isNegativeTrend ? (
              <TrendingDown className="text-red-500" size={16} />
            ) : (
              <TrendingUp className="text-stone-400" size={16} />
            )}
            <Text
              className={`text-xs font-semibold ${
                isPositiveTrend
                  ? 'text-emerald-600'
                  : isNegativeTrend
                    ? 'text-red-600'
                    : 'text-stone-500'
              }`}
            >
              {isPositiveTrend ? '+' : ''}
              {trendChange}% vs last month
            </Text>
          </View>

          {/* Divider */}
          <View className="h-4 w-px bg-stone-200" />

          {/* Completed days */}
          <View className="flex-row items-center gap-1.5">
            <CheckCircle2 className="text-violet-500" size={16} />
            <Text className="text-xs font-semibold text-stone-600">
              {completedDays}/{totalDays} days
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default ThisMonthCard;
