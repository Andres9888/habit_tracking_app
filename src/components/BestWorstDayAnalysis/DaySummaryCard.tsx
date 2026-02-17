/**
 * DaySummaryCard Component
 *
 * Displays a summary card for best or worst day
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from './BestWorstDayAnalysis.styles';
import { colors } from '../../theme/colors';

const AnimatedView = Animated.createAnimatedComponent(View);

interface DaySummaryCardProps {
  title: string;
  dayName: string;
  completionRate: number;
  completions: number;
  period: string;
  darkMode?: boolean;
}

export function DaySummaryCard({
  title,
  dayName,
  completionRate,
  completions,
  period,
  darkMode = false,
}: DaySummaryCardProps) {
  const themeColors = darkMode ? colors.dark : colors;

  const isBestDay = title === 'Best Day';
  const rateColor = isBestDay
    ? themeColors.primary[500]
    : themeColors.text.primary;

  return (
    <AnimatedView
      style={[
        styles.card,
        darkMode && styles.cardDark,
      ]}
      entering={FadeInDown.springify().damping(18)}
    >
      <Text style={[styles.title, darkMode && styles.titleDark]}>{title}</Text>

      <Text style={[styles.dayName, darkMode && styles.dayNameDark]}>
        {dayName}
      </Text>

      <View style={styles.statsRow}>
        <View>
          <Text style={[styles.statValue, { color: rateColor }]}>
            {Math.round(completionRate)}%
          </Text>
          <Text style={[styles.statLabel, darkMode && styles.statLabelDark]}>
            Completion Rate
          </Text>
        </View>

        <View>
          <Text style={[styles.statValue, { color: rateColor }]}>
            {completions}
          </Text>
          <Text style={[styles.statLabel, darkMode && styles.statLabelDark]}>
            Total Completions
          </Text>
        </View>
      </View>

      <Text style={[styles.period, darkMode && styles.periodDark]}>
        Over {period}
      </Text>
    </AnimatedView>
  );
}
