/**
 * HabitInsightsCard Component
 * Displays personalized habit insights based on completion patterns
 *
 * Premium feature - shows lock overlay for non-premium users
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { HabitInsightsCardProps, HabitInsight } from './HabitInsightsCard.types';
import { styles } from './HabitInsightsCard.styles';
import { InsightCard } from './InsightCard';
import { PremiumLockOverlay } from './PremiumLockOverlay';

/**
 * Get emoji variant for insight type
 */
function getInsightEmoji(type: HabitInsight['type']): string {
  const emojiMap: Record<string, string> = {
    day_consistency: '📅',
    time_pattern: '⏰',
    streak_milestone: '🔥',
    strength_progress: '💪',
  };
  return emojiMap[type] || '💡';
}

/**
 * Get background color for insight type
 */
function getInsightColor(type: HabitInsight['type']): string {
  const colorMap: Record<string, string> = {
    day_consistency: colors.primary[50],
    time_pattern: '#FEF3C7',
    streak_milestone: '#FEE2E2',
    strength_progress: '#DCFCE7',
  };
  return colorMap[type] || colors.neutral[50];
}

export default function HabitInsightsCard({
  insights,
  isPremiumUser = false,
  onUnlockPress,
}: HabitInsightsCardProps) {
  // Show lock overlay for non-premium users
  if (!isPremiumUser) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="bulb" size={24} color={colors.primary[500]} />
          <Text style={styles.title}>Habit Insights</Text>
        </View>
        <PremiumLockOverlay onUnlockPress={onUnlockPress} />
      </View>
    );
  }

  // Handle loading state
  if (!insights) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="bulb" size={24} color={colors.primary[500]} />
          <Text style={styles.title}>Habit Insights</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Analyzing your patterns...</Text>
        </View>
      </View>
    );
  }

  // Show data building state
  if (!insights.hasEnoughData && insights.insights.length === 1) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="bulb" size={24} color={colors.primary[500]} />
          <Text style={styles.title}>Habit Insights</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressIconContainer}>
            <Ionicons name="analytics" size={32} color={colors.primary[500]} />
          </View>
          <Text style={styles.progressTitle}>{insights.insights[0].title}</Text>
          <Text style={styles.progressMessage}>{insights.insights[0].message}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(insights.daysOfData / 7) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {insights.daysOfData} of 7 days of data
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="bulb" size={24} color={colors.primary[500]} />
          <Text style={styles.title}>Habit Insights</Text>
        </View>
        {insights.consistencyScore > 0 && (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{insights.consistencyScore}%</Text>
          </View>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {insights.insights.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            backgroundColor={getInsightColor(insight.type)}
          />
        ))}
      </ScrollView>

      <Text style={styles.generatedText}>
        Based on {insights.daysOfData} days of data · Updated now
      </Text>
    </View>
  );
}
