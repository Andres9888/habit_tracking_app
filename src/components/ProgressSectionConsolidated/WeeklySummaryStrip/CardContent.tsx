/**
 * CardContent Component
 *
 * Inner content of the weekly summary card.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

import type { TrendDirection, WeekDayData } from '../WeeklySummaryStripTypes';
import { DayCell } from './DayCell';
import { SparkleEffect } from './SparkleEffect';
import { styles } from './WeeklySummaryStripStyles';
import {
  getDayVisualState,
  getTrendColor,
  getTrendIcon,
} from './WeeklySummaryStripUtils';

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
  const { colors } = useThemeColors();
  const TrendIcon = getTrendIcon(trend);

  return (
    <View style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>
              This Week {isPerfectWeek ? '🏆' : null}
            </Text>
            {/* Sparkle animation for perfect week */}
            <SparkleEffect
              isActive={isPerfectWeek}
              reduceMotion={reduceMotion}
            />
          </View>
          {isPerfectWeek ? (
            <View style={[styles.perfectBadge, { backgroundColor: colors.status.success }]}>
              <Text style={styles.perfectBadgeText}>Perfect!</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.comparisonText}>
            {currentWeekCompleted}/7 vs {lastWeekCompleted}/7
          </Text>
          <TrendIcon
            color={getTrendColor(trend, colors.status.success)}
            size={iconSizes.small}
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
