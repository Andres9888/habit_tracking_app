/**
 * BestWorstDayAnalysis Component
 *
 * Displays best and worst day analysis with hour-of-day breakdown
 */

import React, { useMemo } from 'react';
import { View, ScrollView, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from './BestWorstDayAnalysis.styles';
import { DaySummaryCard } from './DaySummaryCard';
import { HourBreakdown } from './HourBreakdown';
import type { BestWorstDayAnalysisProps } from './BestWorstDayAnalysis.types';

const AnimatedView = Animated.createAnimatedComponent(View);

export function BestWorstDayAnalysis({
  data,
  darkMode = false,
}: BestWorstDayAnalysisProps) {
  const dayNames = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);

  if (!data) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AnimatedView
        entering={FadeInDown.delay(280).springify().damping(18)}
      >
        <DaySummaryCard
          title="Best Day"
          dayName={dayNames[data.bestDay.dayOfWeek]}
          completionRate={data.bestDay.completionRate}
          completions={data.bestDay.totalCompletions}
          period={data.period}
          darkMode={darkMode}
        />
      </AnimatedView>

      <AnimatedView
        entering={FadeInDown.delay(340).springify().damping(18)}
      >
        <DaySummaryCard
          title="Worst Day"
          dayName={dayNames[data.worstDay.dayOfWeek]}
          completionRate={data.worstDay.completionRate}
          completions={data.worstDay.totalCompletions}
          period={data.period}
          darkMode={darkMode}
        />
      </AnimatedView>

      <AnimatedView
        entering={FadeInDown.delay(400).springify().damping(18)}
      >
        <HourBreakdown
          peakHour={data.peakHour}
          hourStats={data.hourStats}
          darkMode={darkMode}
        />
      </AnimatedView>

      <AnimatedView
        entering={FadeInDown.delay(460).springify().damping(18)}
      >
        <DayOfWeekBreakdown
          dayStats={data.dayOfWeekStats}
          dayNames={dayNames}
          darkMode={darkMode}
        />
      </AnimatedView>
    </View>
  );
}

function DayOfWeekBreakdown({
  dayStats,
  dayNames,
  darkMode,
}: {
  dayStats: Array<{
    dayOfWeek: number;
    totalCompletions: number;
    totalTracked: number;
    completionRate: number;
  }>;
  dayNames: string[];
  darkMode: boolean;
}) {
  return (
    <View style={styles.breakdownContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dayStats.map((stat) => (
          <View key={`day-${stat.dayOfWeek}`} style={styles.dayStatItem}>
            <Text style={[styles.dayStatName, darkMode && styles.dayStatNameDark]}>
              {dayNames[stat.dayOfWeek]}
            </Text>
            <Text style={[styles.dayStatRate, darkMode && styles.dayStatRateDark]}>
              {Math.round(stat.completionRate)}%
            </Text>
            <Text style={[styles.dayStatCount, darkMode && styles.dayStatCountDark]}>
              {stat.totalCompletions}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default BestWorstDayAnalysis;
