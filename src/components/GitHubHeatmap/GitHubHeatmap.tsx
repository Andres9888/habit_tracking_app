/**
 * GitHubHeatmap Component
 *
 * Displays a GitHub-style contribution heatmap showing habit completion rates
 * over the last 16 weeks (112 days). Similar to GitHub's contribution graph.
 */

import React from 'react';
import { View, Pressable, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { GitHubHeatmapProps } from './GitHubHeatmap.types';
import { styles, darkStyles } from './GitHubHeatmap.styles';
import { HeatmapCell } from './HeatmapCell';
import { DayLabels } from './DayLabels';
import { Legend } from './Legend';
import { MonthLabels } from './MonthLabels';
import { EmptyState } from './EmptyState';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GitHubHeatmap({
  data,
  onDayPress,
  darkMode = false,
}: GitHubHeatmapProps) {
  const themeStyles = darkMode ? darkStyles : styles;

  if (!data || data.length === 0) {
    return <EmptyState darkMode={darkMode} />;
  }

  // Organize data by weeks
  const weeks: GitHubHeatmapData[][] = [];
  const currentWeek: GitHubHeatmapData[] = [];
  let currentWeekIndex = -1;

  for (const day of data) {
    if (day.weekIndex !== currentWeekIndex) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeekIndex = day.weekIndex;
      weeks.push([day]);
    } else {
      currentWeek.push(day);
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Calculate month labels
  const monthLabels = data
    .reduce((acc: { month: string; weekIndex: number }[], day) => {
      const date = new Date(day.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const lastMonth = acc[acc.length - 1];

      if (!lastMonth || lastMonth.month !== month) {
        acc.push({ month, weekIndex: day.weekIndex });
      }
      return acc;
    }, [])
    .filter((label, index, arr) => {
      // Only show month label every 4 weeks to avoid crowding
      const prevLabel = arr[index - 1];
      return !prevLabel || label.weekIndex - prevLabel.weekIndex >= 4;
    });

  return (
    <View style={themeStyles.container}>
      <DayLabels darkMode={darkMode} />
      <View style={themeStyles.gridContainer}>
        <View style={themeStyles.weeksContainer}>
          {weeks.map((week, weekIdx) => (
            <Animated.View
              key={`week-${weekIdx}`}
              style={themeStyles.weekColumn}
              entering={FadeInDown.delay(weekIdx * 30).springify().damping(18)}
            >
              {Array.from({ length: 7 }, (_, dayIdx) => {
                const dayData = week.find((d) => d.dayOfWeek === dayIdx);
                return (
                  <HeatmapCell
                    key={`day-${weekIdx}-${dayIdx}`}
                    data={dayData}
                    onPress={() => {
                      if (dayData && onDayPress) {
                        onDayPress(dayData);
                      }
                    }}
                    darkMode={darkMode}
                  />
                );
              })}
            </Animated.View>
          ))}
        </View>
        <MonthLabels labels={monthLabels} darkMode={darkMode} />
      </View>
      <Legend darkMode={darkMode} />
    </View>
  );
}

export default GitHubHeatmap;
