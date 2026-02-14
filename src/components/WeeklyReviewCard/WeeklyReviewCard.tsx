/**
 * WeeklyReviewCard Component
 *
 * A visually appealing in-app card shown on Sunday evening / Monday
 * that celebrates wins, highlights streaks, and gently notes misses.
 *
 * Premium users see detailed per-habit insights.
 * Free users see a basic summary with an upgrade nudge.
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { styles } from './WeeklyReviewCard.styles';

interface CompletionDay {
  day: string;
  count: number;
  total: number;
}

interface HabitStat {
  name: string;
  icon: string;
  thisWeek: number;
  lastWeek: number;
  change: number;
  currentStreak: number;
}

interface PerfectHabit {
  name: string;
  icon: string;
  streak: number;
}

interface StreakHabit {
  name: string;
  icon: string;
  streak: number;
  bestStreak: number;
}

export interface WeeklyReviewData {
  totalCompletions: number;
  totalPossible: number;
  completionRate: number;
  bestDay: string;
  bestDayCount: number;
  weekOverWeekChange: number;
  perfectCount: number;
  streaksMaintainedCount: number;
  activeHabitCount: number;
  completionsByDay: CompletionDay[];
  generatedAt: string;
  weekStartDate: string;
  isPremium: boolean;
  // Premium-only fields
  habitStats?: HabitStat[];
  improved?: HabitStat[];
  declined?: HabitStat[];
  perfectHabits?: PerfectHabit[];
  streaksMaintained?: StreakHabit[];
  topHabit?: HabitStat;
  prevTotalCompletions?: number;
}

interface WeeklyReviewCardProps {
  review: WeeklyReviewData;
  isPremium: boolean;
  onDismiss: () => void;
  onUpgrade?: () => void;
}

function getMotivationalMessage(rate: number): string {
  if (rate >= 90) return 'Absolutely crushing it! 🏆';
  if (rate >= 75) return 'Strong week — keep the momentum! 💪';
  if (rate >= 50) return 'Solid effort — room to grow! 🌱';
  if (rate >= 25) return 'Every step counts — you showed up! 🚶';
  return "Tough week — but you're still here 💙";
}

function getChangeEmoji(change: number): string {
  if (change > 0) return '📈';
  if (change < 0) return '📉';
  return '➡️';
}

/** Mini bar chart for daily completions */
function DayBar({ day, count, total }: CompletionDay) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const isPerfect = count === total && total > 0;

  return (
    <View style={styles.dayBarContainer}>
      <View style={styles.dayBarTrack}>
        <View
          style={[
            styles.dayBarFill,
            { height: `${Math.max(pct, 4)}%` },
            isPerfect && styles.dayBarPerfect,
          ]}
        />
      </View>
      <Text style={[styles.dayBarLabel, isPerfect && styles.dayBarLabelPerfect]}>
        {day}
      </Text>
    </View>
  );
}

export function WeeklyReviewCard({
  review,
  isPremium,
  onDismiss,
  onUpgrade,
}: WeeklyReviewCardProps) {
  const message = getMotivationalMessage(review.completionRate);
  const changeEmoji = getChangeEmoji(review.weekOverWeekChange);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>📊</Text>
          <Text style={styles.headerTitle}>Weekly Review</Text>
        </View>
        <Pressable onPress={onDismiss} hitSlop={12}>
          <Ionicons name="close" size={22} color="#94a3b8" />
        </Pressable>
      </View>

      {/* Motivational message */}
      <Text style={styles.motivational}>{message}</Text>

      {/* Big stat */}
      <View style={styles.bigStatRow}>
        <View style={styles.bigStat}>
          <Text style={styles.bigStatNumber}>{review.completionRate}%</Text>
          <Text style={styles.bigStatLabel}>Completion</Text>
        </View>
        <View style={styles.bigStat}>
          <Text style={styles.bigStatNumber}>
            {review.totalCompletions}/{review.totalPossible}
          </Text>
          <Text style={styles.bigStatLabel}>Habits Done</Text>
        </View>
        <View style={styles.bigStat}>
          <Text style={styles.bigStatNumber}>
            {changeEmoji} {Math.abs(review.weekOverWeekChange)}
          </Text>
          <Text style={styles.bigStatLabel}>vs Last Week</Text>
        </View>
      </View>

      {/* Day chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Daily Breakdown</Text>
        <View style={styles.chartRow}>
          {review.completionsByDay.map((d) => (
            <DayBar key={d.day} {...d} />
          ))}
        </View>
      </View>

      {/* Wins section */}
      <View style={styles.winsSection}>
        {review.bestDayCount > 0 && (
          <View style={styles.winItem}>
            <Text style={styles.winEmoji}>⭐</Text>
            <Text style={styles.winText}>
              Best day: <Text style={styles.bold}>{review.bestDay}</Text> ({review.bestDayCount} habits)
            </Text>
          </View>
        )}
        {review.perfectCount > 0 && (
          <View style={styles.winItem}>
            <Text style={styles.winEmoji}>🔥</Text>
            <Text style={styles.winText}>
              <Text style={styles.bold}>{review.perfectCount}</Text> habit{review.perfectCount !== 1 ? 's' : ''} completed every day!
            </Text>
          </View>
        )}
        {review.streaksMaintainedCount > 0 && (
          <View style={styles.winItem}>
            <Text style={styles.winEmoji}>🔗</Text>
            <Text style={styles.winText}>
              <Text style={styles.bold}>{review.streaksMaintainedCount}</Text> streak{review.streaksMaintainedCount !== 1 ? 's' : ''} maintained (7+ days)
            </Text>
          </View>
        )}
      </View>

      {/* Premium detailed insights */}
      {isPremium && review.improved && review.improved.length > 0 && (
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>📈 Improved This Week</Text>
          {review.improved.map((h) => (
            <View key={h.name} style={styles.habitRow}>
              <Text style={styles.habitIcon}>{h.icon}</Text>
              <Text style={styles.habitName}>{h.name}</Text>
              <Text style={styles.habitChangePositive}>+{h.change}</Text>
            </View>
          ))}
        </View>
      )}

      {isPremium && review.declined && review.declined.length > 0 && (
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>💡 Areas to Improve</Text>
          {review.declined.map((h) => (
            <View key={h.name} style={styles.habitRow}>
              <Text style={styles.habitIcon}>{h.icon}</Text>
              <Text style={styles.habitName}>{h.name}</Text>
              <Text style={styles.habitChangeNegative}>{h.change}</Text>
            </View>
          ))}
          <Text style={styles.gentleNote}>
            No worries — consistency builds over time. Pick one to focus on this week 🎯
          </Text>
        </View>
      )}

      {isPremium && review.streaksMaintained && review.streaksMaintained.length > 0 && (
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>🔗 Active Streaks</Text>
          {review.streaksMaintained.map((h) => (
            <View key={h.name} style={styles.habitRow}>
              <Text style={styles.habitIcon}>{h.icon}</Text>
              <Text style={styles.habitName}>{h.name}</Text>
              <Text style={styles.streakBadge}>
                {h.streak}🔥 {h.streak >= h.bestStreak ? '(Personal Best!)' : ''}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Free user upgrade nudge */}
      {!isPremium && (
        <AnimatedPressable style={styles.upgradeNudge} onPress={onUpgrade}>
          <Text style={styles.upgradeText}>
            ✨ Unlock detailed habit insights, streak analysis & more
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#0d9488" />
        </AnimatedPressable>
      )}

      {/* Footer */}
      <Text style={styles.footer}>
        Week of {new Date(review.weekStartDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}
      </Text>
    </View>
  );
}
