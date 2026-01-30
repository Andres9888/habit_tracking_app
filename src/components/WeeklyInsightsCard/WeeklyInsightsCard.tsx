/**
 * WeeklyInsightsCard Component
 * Shows weekly habit insights and patterns
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TrendingUp, TrendingDown, Flame, Calendar, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { WeeklyInsightsCardProps, WeeklyInsight } from './types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WeeklyInsightsCard({
  completionRate,
  bestDay,
  totalCompleted,
  totalPossible,
  streaksAtRisk,
  trend,
  onPress,
}: WeeklyInsightsCardProps) {
  const trendUp = trend === 'up';
  const TrendIcon = trendUp ? TrendingUp : TrendingDown;
  const trendColor = trendUp ? '#22c55e' : '#ef4444';

  return (
    <Animated.View entering={FadeInDown.delay(200).springify()}>
      <Pressable
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Weekly insights: ${completionRate}% completion rate`}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Calendar size={16} color="#78716c" />
            <Text style={styles.headerTitle}>This Week</Text>
          </View>
          <ChevronRight size={18} color="#a8a29e" />
        </View>

        {/* Main Stats */}
        <View style={styles.mainStats}>
          <View style={styles.completionRate}>
            <Text style={styles.rateNumber}>{completionRate}%</Text>
            <View style={styles.trendBadge}>
              <TrendIcon size={12} color={trendColor} />
              <Text style={[styles.trendText, { color: trendColor }]}>
                {trendUp ? 'Up' : 'Down'}
              </Text>
            </View>
          </View>
          <Text style={styles.rateLabel}>
            {totalCompleted}/{totalPossible} habits completed
          </Text>
        </View>

        {/* Insights Row */}
        <View style={styles.insightsRow}>
          {/* Best Day */}
          <View style={styles.insightItem}>
            <Text style={styles.insightEmoji}>🏆</Text>
            <Text style={styles.insightLabel}>Best Day</Text>
            <Text style={styles.insightValue}>{DAYS[bestDay]}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Streaks at Risk */}
          <View style={styles.insightItem}>
            <View style={styles.streakIcon}>
              <Flame size={16} color={streaksAtRisk > 0 ? '#f59e0b' : '#22c55e'} />
            </View>
            <Text style={styles.insightLabel}>At Risk</Text>
            <Text style={[
              styles.insightValue,
              streaksAtRisk > 0 && styles.atRiskValue
            ]}>
              {streaksAtRisk} streak{streaksAtRisk !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Motivational Message */}
        {completionRate >= 80 && (
          <View style={styles.motivationBanner}>
            <Text style={styles.motivationText}>
              🔥 Great week! Keep the momentum going!
            </Text>
          </View>
        )}
        {completionRate < 50 && completionRate > 0 && (
          <View style={[styles.motivationBanner, styles.encourageBanner]}>
            <Text style={styles.motivationText}>
              💪 Every day is a fresh start. You've got this!
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78716c',
  },
  mainStats: {
    marginBottom: 16,
  },
  completionRate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rateNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1c1917',
    letterSpacing: -1,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f4',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rateLabel: {
    fontSize: 14,
    color: '#78716c',
    marginTop: 4,
  },
  insightsRow: {
    flexDirection: 'row',
    backgroundColor: '#fafaf9',
    borderRadius: 12,
    padding: 12,
  },
  insightItem: {
    flex: 1,
    alignItems: 'center',
  },
  insightEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  streakIcon: {
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 11,
    color: '#a8a29e',
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1917',
  },
  atRiskValue: {
    color: '#f59e0b',
  },
  divider: {
    width: 1,
    backgroundColor: '#e7e5e4',
    marginHorizontal: 12,
  },
  motivationBanner: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
  },
  encourageBanner: {
    backgroundColor: '#fef3c7',
  },
  motivationText: {
    fontSize: 13,
    color: '#1c1917',
    textAlign: 'center',
  },
});

export default WeeklyInsightsCard;
