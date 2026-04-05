/**
 * WeeklyPatternChart Component
 *
 * Compact 7-day bar chart showing completion patterns.
 * Highlights best and worst performing days.
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { DayBar } from './DayBar';
import { PatternLegend } from './PatternLegend';
import { useWeeklyPatternData } from './useWeeklyPatternData';

import type { WeeklyPatternChartProps } from './types';
import { iconSizes } from '@/theme/iconSizes';

const CHART_HEIGHT = 56;

export const WeeklyPatternChart = React.memo(function WeeklyPatternChart({
  dayStats,
  onSeeAllPress,
}: WeeklyPatternChartProps) {
  const reduceMotion = useReduceMotion();
  const { colors } = useThemeColors();
  const { bestDayIndex, worstDayIndex, maxRate, accessibilitySummary } =
    useWeeklyPatternData(dayStats);

  return (
    <View className='mb-4'>
      <View className='mb-2 flex-row items-center justify-between'>
        <Text
          className='text-sm font-semibold'
          style={{ color: colors.text.primary }}
        >
          Weekly Pattern
        </Text>
        {onSeeAllPress ? <Pressable
            accessibilityLabel='See all weekly patterns'
            accessibilityRole='button'
            className='flex-row items-center gap-0.5 active:opacity-70'
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={{ justifyContent: 'center', minHeight: 44, minWidth: 44 }}
            onPress={onSeeAllPress}
          >
            <Text className='text-xs font-medium' style={{ color: colors.status.premiumText }}>Details</Text>
            <ChevronRight color={colors.status.premium} size={iconSizes.small} />
          </Pressable> : null}
      </View>

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

      <PatternLegend />
    </View>
  );
});

export default WeeklyPatternChart;
