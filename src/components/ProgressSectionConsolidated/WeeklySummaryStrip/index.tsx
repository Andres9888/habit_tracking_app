/**
 * WeeklySummaryStrip Component
 *
 * Provides a visual 7-day view of the current week's habit completion progress.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { Springs } from '../../../constants/motion';

import type { WeeklySummaryStripProps } from '../WeeklySummaryStripTypes';
import { getTrendDirection } from './WeeklySummaryStripUtils';
import { CardContent } from './CardContent';
import { styles } from './WeeklySummaryStripStyles';

/** Animation timing constants */
const ENTRANCE_DURATION = 300;

export const WeeklySummaryStrip = React.memo(function WeeklySummaryStrip({
  lastWeekCompleted,
  onTodayPress,
  weekData,
}: WeeklySummaryStripProps) {
  const reduceMotion = useReduceMotion();
  const today = useMemo(() => new Date(), []);

  const currentWeekCompleted = useMemo(
    () => weekData.filter((d) => d.completed).length,
    [weekData]
  );

  const trend = useMemo(
    () => getTrendDirection(currentWeekCompleted, lastWeekCompleted),
    [currentWeekCompleted, lastWeekCompleted]
  );

  const isPerfectWeek = currentWeekCompleted === 7;

  const scale = useSharedValue(reduceMotion ? 1 : 0.95);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    scale.value = withSpring(1, Springs.gentle);
    opacity.value = withTiming(1, {
      duration: ENTRANCE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [reduceMotion, scale, opacity]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const accessibilityLabel = useMemo(() => {
    const completionText = `${currentWeekCompleted} of 7 days completed this week`;
    const trendText =
      trend === 'up'
        ? `up from ${lastWeekCompleted} last week`
        : trend === 'down'
          ? `down from ${lastWeekCompleted} last week`
          : `same as last week`;
    return `Weekly summary: ${completionText}, ${trendText}${isPerfectWeek ? '. Perfect week!' : ''}`;
  }, [currentWeekCompleted, lastWeekCompleted, trend, isPerfectWeek]);

  const cardContentProps = {
    currentWeekCompleted,
    isPerfectWeek,
    lastWeekCompleted,
    onTodayPress,
    reduceMotion,
    today,
    trend,
    weekData,
  };

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='summary'
      style={[styles.container, containerAnimatedStyle]}
    >
      {isPerfectWeek ? (
        <LinearGradient
          colors={['#ecfdf5', '#dcfce7']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.cardGradient}
        >
          <CardContent {...cardContentProps} />
        </LinearGradient>
      ) : (
        <View style={styles.card}>
          <CardContent {...cardContentProps} />
        </View>
      )}
    </Animated.View>
  );
});

export default WeeklySummaryStrip;
