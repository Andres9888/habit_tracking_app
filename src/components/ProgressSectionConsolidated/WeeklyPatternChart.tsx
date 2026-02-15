/* eslint-disable max-lines */
/**
 * WeeklyPatternChart Component
 *
 * Compact 7-day bar chart showing completion patterns.
 * Highlights best and worst performing days.
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';

import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';

import type { WeeklyPatternChartProps } from './types';
import { DayBar } from './DayBar';
import { findBestDay, findWorstDay } from './WeeklyPatternChart.helpers';
import { useReduceMotion } from '../../hooks/useReduceMotion';

/** Chart container height (px) */
const CHART_HEIGHT = 56;

/**
 * WeeklyPatternChart Component
 *
 * Compact 7-day bar chart showing weekly completion patterns.
 * Highlights best (emerald) and worst (amber) performing days.
 * Memoized to prevent re-renders when parent updates unrelated props.
 */
export const WeeklyPatternChart = React.memo(function WeeklyPatternChart({
  dayStats,
  onSeeAllPress,
}: WeeklyPatternChartProps) {
  const reduceMotion = useReduceMotion();
  const { colors } = useThemeColors();

  // Calculate best and worst days
  const { bestDayIndex, worstDayIndex, maxRate } = useMemo(() => {
    const withData = dayStats.filter((d) => d.total > 0);

    if (withData.length === 0) {
      return { bestDayIndex: -1, maxRate: 1, worstDayIndex: -1 };
    }

    const best = findBestDay(withData);
    const worst = findWorstDay(withData);
    const max = Math.max(...dayStats.map((d) => d.rate), 1);

    // Only mark worst if different from best and below 70%
    const worstIdx =
      best && worst && worst.dayIndex !== best.dayIndex && worst.rate < 70
        ? worst.dayIndex
        : -1;

    return {
      bestDayIndex: best?.dayIndex ?? -1,
      maxRate: max,
      worstDayIndex: worstIdx,
    };
  }, [dayStats]);

  // Build accessibility summary
  const accessibilitySummary = useMemo(() => {
    const bestDay = dayStats.find((d) => d.dayIndex === bestDayIndex);
    const worstDay = dayStats.find((d) => d.dayIndex === worstDayIndex);

    let summary = 'Weekly pattern chart.';
    if (bestDay) {
      summary += ` Best day: ${bestDay.day} at ${bestDay.rate}%.`;
    }
    if (worstDay) {
      summary += ` Focus day: ${worstDay.day} at ${worstDay.rate}%.`;
    }
    return summary;
  }, [dayStats, bestDayIndex, worstDayIndex]);

  return (
    <View className='mb-4'>
      {/* Header */}
      <View className='mb-2 flex-row items-center justify-between'>
        <Text
          className='text-sm font-semibold'
          style={{ color: colors.text.primary }}
        >
          Weekly Pattern
        </Text>
        {onSeeAllPress && (
          <Pressable
            accessibilityLabel='See all weekly patterns'
            accessibilityRole='button'
            className='flex-row items-center gap-0.5 active:opacity-70'
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={{ justifyContent: 'center', minHeight: 44, minWidth: 44 }}
            onPress={onSeeAllPress}
          >
            <Text className='text-xs font-medium text-violet-600'>Details</Text>
            <ChevronRight className='text-violet-400' size={14} />
          </Pressable>
        )}
      </View>

      {/* Chart container */}
      <View
        accessibilityLabel={accessibilitySummary}
        accessibilityRole='image'
        className='flex-row items-end justify-between rounded-xl px-2'
        style={{
          backgroundColor: colors.gray[50],
          height: CHART_HEIGHT,
          paddingBottom: 0,
          paddingTop: 8,
        }}
      >
        {dayStats.map((day, index) => (
          <DayBar
            key={day.dayIndex}
            dayIndex={day.dayIndex}
            index={index}
            isBest={day.dayIndex === bestDayIndex}
            isWorst={day.dayIndex === worstDayIndex}
            maxRate={maxRate}
            rate={day.rate}
            reduceMotion={reduceMotion}
          />
        ))}
      </View>

      {/* Legend */}
      <View className='mt-2 flex-row items-center justify-center gap-4'>
        <View className='flex-row items-center gap-1'>
          <View className='h-2 w-2 rounded-sm bg-emerald-500' />
          <Text className='text-[10px]' style={{ color: colors.text.tertiary }}>
            Best
          </Text>
        </View>
        <View className='flex-row items-center gap-1'>
          <View className='h-2 w-2 rounded-sm bg-amber-400' />
          <Text className='text-[10px]' style={{ color: colors.text.tertiary }}>
            Focus
          </Text>
        </View>
      </View>
    </View>
  );
});

export default WeeklyPatternChart;
