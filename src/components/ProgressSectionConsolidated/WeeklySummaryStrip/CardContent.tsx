/**
 * CardContent Component
 *
 * Inner content of the weekly summary card.
 */

import React from 'react';
import { View, Text } from 'react-native';
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
          <Text style={styles.headerTitle}>
            This Week {isPerfectWeek && '🏆'}
          </Text>
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
