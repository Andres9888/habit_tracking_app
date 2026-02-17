/**
 * LeaderboardScreen - Gamification feature showing streak rankings
 *
 * Features:
 * - User's longest active streak vs global average
 * - "Top Streaker" badge for 30+ day streaks
 * - Personal best records
 * - Local only (no server leaderboard) — compare against milestones
 */

import React from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { useLeaderboardData } from './LeaderboardScreen.hooks';
import { styles } from './LeaderboardScreen.styles';
import { TopStreakerBadge, PersonalRecord, StatsOverview } from './components';

export function LeaderboardScreen() {
  const { colors: themeColors } = useThemeColors();
  const { stats, isLoading } = useLeaderboardData();

  if (isLoading || !stats) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={themeColors.text.primary} />
        </View>
      </View>
    );
  }

  const hasTopStreakers = stats.topStreakers.length > 0;
  const hasRecords =
    stats.personalBests.longestStreak ||
    stats.personalBests.mostConsistent ||
    stats.personalBests.currentBest;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Streak Leaderboard</Text>
          <Text style={styles.headerSubtitle}>
            Your personal achievements and milestones
          </Text>
        </View>

        {/* Top Streakers Section (30+ day badges) */}
        {hasTopStreakers && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Top Streakers</Text>
            {stats.topStreakers.map((habit, index) => (
              <TopStreakerBadge
                key={habit.habitId}
                habitName={habit.habitName}
                streak={habit.currentStreak}
                delay={280 + index * 60}
              />
            ))}
          </View>
        )}

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Overview</Text>
          <StatsOverview stats={stats} delay={hasTopStreakers ? 400 : 280} />
        </View>

        {/* Personal Bests */}
        {hasRecords && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Personal Bests</Text>

            {stats.personalBests.currentBest &&
              stats.personalBests.currentBest.currentStreak > 0 && (
                <PersonalRecord
                  title="CURRENT BEST STREAK"
                  habitName={stats.personalBests.currentBest.habitName}
                  value={`${stats.personalBests.currentBest.currentStreak} days active`}
                  icon="🔥"
                  delay={460}
                />
              )}

            {stats.personalBests.longestStreak &&
              stats.personalBests.longestStreak.longestStreak > 0 && (
                <PersonalRecord
                  title="ALL-TIME LONGEST STREAK"
                  habitName={stats.personalBests.longestStreak.habitName}
                  value={`${stats.personalBests.longestStreak.longestStreak} days`}
                  icon="📈"
                  delay={520}
                />
              )}

            {stats.personalBests.mostConsistent &&
              stats.personalBests.mostConsistent.strength > 0 && (
                <PersonalRecord
                  title="MOST CONSISTENT"
                  habitName={stats.personalBests.mostConsistent.habitName}
                  value={`${Math.round(stats.personalBests.mostConsistent.strength)}% strength`}
                  icon="💪"
                  delay={580}
                />
              )}
          </View>
        )}

        {/* Empty State */}
        {!hasTopStreakers && !hasRecords && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎯</Text>
            <Text style={styles.emptyStateText}>
              Start building streaks to see your achievements here!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
