/**
 * CardContent Component
 *
 * Inner content of the weekly summary card.
 */

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import type { WeekDayData, TrendDirection } from '../WeeklySummaryStripTypes';
import {
  getDayVisualState,
  getTrendIcon,
  getTrendColor,
} from './WeeklySummaryStripUtils';
import { DayCell } from './DayCell';
import { styles } from './WeeklySummaryStripStyles';

interface CardContentProps {
  currentWeekCompleted: number;
  isPerfectWeek: boolean;
  lastWeekCompleted: number;
  onTodayPress?: () => void;
  reduceMotion: boolean;
  today: Date;
  trend: TrendDirection;
  weekData: WeekDayData[];
}

/** Animation timing constants */
const SPARKLE_DURATION = 2000;

/**
 * SparkleEffect Component
 * Renders a subtle sparkle animation for perfect week celebration
 */
const SparkleEffect = React.memo(function SparkleEffect({
  isActive,
  reduceMotion,
}: {
  isActive: boolean;
  reduceMotion: boolean;
}) {
  const sparkleOpacity = useSharedValue(0);
  const sparkleScale = useSharedValue(1);

  useEffect(() => {
    if (isActive && !reduceMotion) {
      // Continuous subtle sparkle animation
      sparkleOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, {
            duration: SPARKLE_DURATION / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.2, {
            duration: SPARKLE_DURATION / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // Infinite repeat
        true // Reverse
      );

      sparkleScale.value = withRepeat(
        withSequence(
          withTiming(1.15, {
            duration: SPARKLE_DURATION / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: SPARKLE_DURATION / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      );
    } else {
      sparkleOpacity.value = 0;
      sparkleScale.value = 1;
    }
  }, [isActive, reduceMotion, sparkleOpacity, sparkleScale]);

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
    transform: [{ scale: sparkleScale.value }],
  }));

  if (!isActive || reduceMotion) return null;

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      pointerEvents='none'
      style={[styles.sparkleContainer, sparkleAnimatedStyle]}
      testID='perfect-week-sparkle'
    >
      <Text style={styles.sparkleEmoji}>✨</Text>
    </Animated.View>
  );
});

export const CardContent = React.memo(function CardContent({
  currentWeekCompleted,
  isPerfectWeek,
  lastWeekCompleted,
  onTodayPress,
  reduceMotion,
  today,
  trend,
  weekData,
}: CardContentProps) {
  return (
    <View style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>
              This Week {isPerfectWeek && '🏆'}
            </Text>
            {/* Sparkle animation for perfect week */}
            <SparkleEffect
              isActive={isPerfectWeek}
              reduceMotion={reduceMotion}
            />
          </View>
          {isPerfectWeek ? (
            <View style={styles.perfectBadge}>
              <Text style={styles.perfectBadgeText}>Perfect!</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.comparisonText}>
            {currentWeekCompleted}/7 vs {lastWeekCompleted}/7
          </Text>
          <Ionicons
            color={getTrendColor(trend)}
            name={getTrendIcon(trend) as any}
            size={14}
            style={styles.trendIcon}
          />
        </View>
      </View>

      {/* Days row */}
      <View style={styles.daysRow}>
        {weekData.map((day, index) => {
          const visualState = getDayVisualState(day, today);
          const canPress = day.isToday && !day.completed && onTodayPress;

          return (
            <DayCell
              key={day.date}
              day={day}
              dayIndex={index}
              reduceMotion={reduceMotion}
              visualState={visualState}
              onPress={canPress ? onTodayPress : undefined}
            />
          );
        })}
      </View>
    </View>
  );
});
