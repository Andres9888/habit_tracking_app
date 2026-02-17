/**
 * StreakHeatmap Component
 *
 * GitHub-style contribution graph for habit streak visualization.
 * Shows a grid of colored cells where intensity represents consistency
 * within a rolling 7-day window around each day.
 *
 * Features:
 * - Color intensity scaling (lighter = sporadic, darker = consistent)
 * - Dark mode support via ThemeContext
 * - Month labels along the top
 * - Legend showing intensity levels
 * - Animated chain links overlay for active streaks
 * - Today highlighted with a border
 *
 * @see Design System: 16px card radius, springify().damping(18), 280ms
 */

import React, { memo, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { format, parseISO } from 'date-fns';

import { useThemeColors } from '../../theme/ThemeContext';
import { useStreakHeatmapData } from './useStreakHeatmapData';
import {
  styles,
  CELL_SIZE,
  CELL_GAP,
  getIntensityColors,
} from './StreakHeatmap.styles';
import type { StreakHeatmapProps } from './StreakHeatmap.types';
import { ChainLinkStreak } from './ChainLinkStreak';

const DEFAULT_COLOR = '#047857';
const ANIMATION_DURATION = 280;

/** Compute month labels with positions for the grid header */
function useMonthLabels(grid: ReturnType<typeof useStreakHeatmapData>) {
  return useMemo(() => {
    const labels: { label: string; position: number }[] = [];
    let lastMonth = '';

    grid.forEach((week, weekIndex) => {
      // Use the first day of the week for month detection
      const firstDay = week[0];
      if (!firstDay) return;
      const month = format(parseISO(firstDay.date), 'MMM');
      if (month !== lastMonth) {
        labels.push({
          label: month,
          position: weekIndex * (CELL_SIZE + CELL_GAP),
        });
        lastMonth = month;
      }
    });

    return labels;
  }, [grid]);
}

const StreakHeatmapComponent: React.FC<StreakHeatmapProps> = ({
  completedDates,
  habitColor = DEFAULT_COLOR,
  weeks = 16,
  showChainLinks = true,
  currentStreak = 0,
  reduceMotion = false,
}) => {
  const { colors, isDark } = useThemeColors();
  const grid = useStreakHeatmapData(completedDates, weeks);
  const monthLabels = useMonthLabels(grid);
  const intensityColors = useMemo(
    () => getIntensityColors(habitColor, isDark),
    [habitColor, isDark]
  );

  const todayBorderColor = isDark ? colors.primary[500] : colors.primary[700];
  const labelColor = isDark ? colors.text.tertiary : colors.gray[400];

  const entering = reduceMotion
    ? undefined
    : FadeIn.duration(ANIMATION_DURATION);

  return (
    <Animated.View entering={entering} style={styles.container}>
      {/* Header: Streak chain + title */}
      <View className='mb-3 flex-row items-center justify-between'>
        <Text
          className='text-[13px] font-semibold tracking-wider'
          style={{ color: labelColor }}
        >
          STREAK MAP
        </Text>
        {showChainLinks && currentStreak > 0 && (
          <ChainLinkStreak
            count={Math.min(currentStreak, 7)}
            color={habitColor}
            reduceMotion={reduceMotion}
          />
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        <View>
          {/* Month labels */}
          <View style={styles.monthLabels}>
            {monthLabels.map(({ label, position }) => (
              <Text
                key={`${label}-${position}`}
                style={[
                  styles.monthLabel,
                  {
                    color: labelColor,
                    position: 'absolute',
                    left: position,
                  },
                ]}
              >
                {label}
              </Text>
            ))}
          </View>

          {/* Grid */}
          <View style={[styles.gridContainer, { marginTop: 16 }]}>
            {grid.map((week, weekIndex) => (
              <Animated.View
                key={`week-${weekIndex}`}
                entering={
                  reduceMotion
                    ? undefined
                    : FadeInRight.delay(weekIndex * 15).duration(200)
                }
                style={styles.weekColumn}
              >
                {week.map((day) => (
                  <View
                    key={day.date}
                    style={[
                      styles.dayCell,
                      {
                        backgroundColor: day.isFuture
                          ? 'transparent'
                          : intensityColors[day.intensity],
                      },
                      day.isToday && [
                        styles.todayCell,
                        { borderColor: todayBorderColor },
                      ],
                    ]}
                  />
                ))}
              </Animated.View>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <Text style={[styles.legendLabel, { color: labelColor }]}>
              Less
            </Text>
            {intensityColors.map((color, i) => (
              <View
                key={`legend-${i}`}
                style={[styles.legendCell, { backgroundColor: color }]}
              />
            ))}
            <Text style={[styles.legendLabel, { color: labelColor }]}>
              More
            </Text>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export const StreakHeatmap = memo(StreakHeatmapComponent);
