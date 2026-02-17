/**
 * StreakIntervals Component
 *
 * Displays completion streak interval statistics
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from './StreakIntervals.styles';
import type { StreakIntervalsProps } from './StreakIntervals.types';
import { colors } from '../../theme/colors';

const AnimatedView = Animated.createAnimatedComponent(View);

export function StreakIntervals({
  data,
  darkMode = false,
}: StreakIntervalsProps) {
  if (!data) {
    return null;
  }

  const themeColors = darkMode ? colors.dark : colors;

  return (
    <View style={styles.container}>
      <AnimatedView
        entering={FadeInDown.delay(280).springify().damping(18)}
        style={[
          styles.card,
          darkMode && styles.cardDark,
        ]}
      >
        <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
          Current Streak
        </Text>
        <Text style={styles.streakValue}>{data.currentStreak}</Text>
        <Text style={[styles.streakLabel, darkMode && styles.streakLabelDark]}>
          Days in a row
        </Text>
      </AnimatedView>

      <AnimatedView
        entering={FadeInDown.delay(340).springify().damping(18)}
        style={[
          styles.card,
          darkMode && styles.cardDark,
        ]}
      >
        <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
          Average Streak
        </Text>
        <Text style={styles.streakValue}>{data.averageStreak}</Text>
        <Text style={[styles.streakLabel, darkMode && styles.streakLabelDark]}>
          Days per streak
        </Text>
      </AnimatedView>

      <AnimatedView
        entering={FadeInDown.delay(400).springify().damping(18)}
        style={[
          styles.card,
          darkMode && styles.cardDark,
        ]}
      >
        <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
          Longest Streak
        </Text>
        <Text style={[styles.streakValue, styles.longestStreak]}>
          {data.longestStreak}
        </Text>
        <Text style={[styles.streakLabel, darkMode && styles.streakLabelDark]}>
          Personal best
        </Text>
      </AnimatedView>

      <AnimatedView
        entering={FadeInDown.delay(460).springify().damping(18)}
        style={[
          styles.summaryCard,
          darkMode && styles.summaryCardDark,
        ]}
      >
        <Text style={[styles.summaryTitle, darkMode && styles.summaryTitleDark]}>
          {data.activeHabitsCount} Active Habits
        </Text>
        <Text style={[styles.summarySubtitle, darkMode && styles.summarySubtitleDark]}>
          Based on {data.totalStreaks} streak intervals
        </Text>
      </AnimatedView>
    </View>
  );
}

export default StreakIntervals;
