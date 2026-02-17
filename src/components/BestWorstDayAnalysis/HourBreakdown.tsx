/**
 * HourBreakdown Component
 *
 * Displays peak hour and hour-of-day breakdown
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from './BestWorstDayAnalysis.styles';
import { colors } from '../../theme/colors';

const AnimatedView = Animated.createAnimatedComponent(View);

interface HourBreakdownProps {
  peakHour: {
    hour: number;
    completions: number;
  };
  hourStats: Array<{
    hour: number;
    completions: number;
  }>;
  darkMode?: boolean;
}

export function HourBreakdown({
  peakHour,
  hourStats,
  darkMode = false,
}: HourBreakdownProps) {
  const themeColors = darkMode ? colors.dark : colors;

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  const maxCompletions = Math.max(...hourStats.map((h) => h.completions));

  return (
    <AnimatedView
      style={[
        styles.card,
        darkMode && styles.cardDark,
      ]}
      entering={FadeInDown.springify().damping(18)}
    >
      <Text style={[styles.title, darkMode && styles.titleDark]}>
        Peak Completion Hour
      </Text>

      <Text style={[styles.peakHourLabel, darkMode && styles.peakHourLabelDark]}>
        Most Active Time
      </Text>

      <Text style={styles.peakHourValue}>
        {formatHour(peakHour.hour)}
      </Text>

      <Text style={[styles.peakHourSubtext, darkMode && styles.peakHourSubtextDark]}>
        {peakHour.completions} completions
      </Text>

      <View style={{ marginTop: 16 }}>
        <Text style={[styles.title, darkMode && styles.titleDark]}>
          Hourly Breakdown
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {hourStats.map((stat) => {
            const height = maxCompletions > 0
              ? (stat.completions / maxCompletions) * 40
              : 0;
            return (
              <View
                key={`hour-${stat.hour}`}
                style={{
                  alignItems: 'center',
                  marginRight: 12,
                  minWidth: 40,
                }}
              >
                <Text
                  style={[
                    styles.dayStatCount,
                    darkMode && styles.dayStatCountDark,
                    { marginBottom: 4 },
                  ]}
                >
                  {stat.completions}
                </Text>
                <View
                  style={{
                    width: 24,
                    height: Math.max(height, 4),
                    backgroundColor: themeColors.primary[500],
                    borderRadius: 4,
                  }}
                />
                <Text
                  style={[
                    styles.dayStatName,
                    darkMode && styles.dayStatNameDark,
                    { marginTop: 4 },
                  ]}
                >
                  {stat.hour % 12 === 0 ? '12' : stat.hour % 12}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </AnimatedView>
  );
}
