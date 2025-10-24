import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface HabitChange {
  habitId: string;
  name: string;
  emoji: string;
  thisWeek: number;
  lastWeek: number;
  change: number;
  percentageChange: number;
  currentStreak: number;
}

interface WeeklyInsights {
  weekOverWeekChange: number;
  totalCompletionsThisWeek: number;
  totalCompletionsLastWeek: number;
  gainedStrength: HabitChange[];
  lostStrength: HabitChange[];
  atRisk: HabitChange[];
  generatedAt: string;
}

interface Props {
  insights: WeeklyInsights | null;
  onHabitPress?: (habitId: string) => void;
  onArchivePress?: () => void;
}

export default function WeeklyInsightsCard({ insights, onHabitPress, onArchivePress }: Props) {
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');

  if (!insights) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Generating insights...</Text>
      </View>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderHabitItem = (habit: HabitChange, type: 'gained' | 'lost' | 'risk') => {
    const getChangeIcon = () => {
      if (type === 'gained') return { name: 'trending-up', color: colors.success };
      if (type === 'lost') return { name: 'trending-down', color: colors.error };
      return { name: 'warning', color: colors.warning };
    };

    const icon = getChangeIcon();

    return (
      <TouchableOpacity
        key={habit.habitId}
        style={styles.habitItem}
        onPress={() => onHabitPress?.(habit.habitId)}
        activeOpacity={0.7}
      >
        <View style={styles.habitItemLeft}>
          <Text style={styles.habitEmoji}>{habit.emoji}</Text>
          <View style={styles.habitInfo}>
            <Text style={styles.habitName} numberOfLines={1}>
              {habit.name}
            </Text>
            <Text style={styles.habitStats}>
              {type === 'risk'
                ? `Only ${habit.thisWeek} completions • ${habit.currentStreak} day streak`
                : `${habit.thisWeek} vs ${habit.lastWeek} last week`
              }
            </Text>
          </View>
        </View>

        <View style={styles.habitItemRight}>
          <Ionicons name={icon.name as any} size={20} color={icon.color} />
          {type !== 'risk' && (
            <Text
              style={[
                styles.changePercentage,
                { color: type === 'gained' ? colors.success : colors.error },
              ]}
            >
              {habit.percentageChange > 0 ? '+' : ''}{Math.round(habit.percentageChange)}%
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Week Overview Section */}
      <TouchableOpacity
        style={styles.section}
        onPress={() => toggleSection('summary')}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>This Week's Summary</Text>
          </View>
          <Ionicons
            name={expandedSection === 'summary' ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.text.tertiary}
          />
        </View>

        {expandedSection === 'summary' && (
          <View style={styles.sectionContent}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Overall Change</Text>
                <View style={styles.summaryValueContainer}>
                  <Ionicons
                    name={insights.weekOverWeekChange >= 0 ? 'trending-up' : 'trending-down'}
                    size={16}
                    color={insights.weekOverWeekChange >= 0 ? colors.success : colors.error}
                  />
                  <Text
                    style={[
                      styles.summaryValue,
                      {
                        color: insights.weekOverWeekChange >= 0 ? colors.success : colors.error,
                      },
                    ]}
                  >
                    {insights.weekOverWeekChange > 0 ? '+' : ''}
                    {Math.round(insights.weekOverWeekChange)}%
                  </Text>
                </View>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Completions</Text>
                <Text style={styles.summaryCompletions}>
                  {insights.totalCompletionsThisWeek} this week • {insights.totalCompletionsLastWeek} last week
                </Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Gained Strength Section */}
      {insights.gainedStrength.length > 0 && (
        <TouchableOpacity
          style={styles.section}
          onPress={() => toggleSection('gained')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="arrow-up-circle" size={20} color={colors.success} />
              <Text style={styles.sectionTitle}>Habits Gained Strength</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{insights.gainedStrength.length}</Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'gained' ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.text.tertiary}
            />
          </View>

          {expandedSection === 'gained' && (
            <View style={styles.sectionContent}>
              {insights.gainedStrength.map(habit => renderHabitItem(habit, 'gained'))}
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Lost Strength Section */}
      {insights.lostStrength.length > 0 && (
        <TouchableOpacity
          style={styles.section}
          onPress={() => toggleSection('lost')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="arrow-down-circle" size={20} color={colors.error} />
              <Text style={styles.sectionTitle}>Habits Lost Strength</Text>
              <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.badgeText, { color: colors.error }]}>
                  {insights.lostStrength.length}
                </Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'lost' ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.text.tertiary}
            />
          </View>

          {expandedSection === 'lost' && (
            <View style={styles.sectionContent}>
              {insights.lostStrength.map(habit => renderHabitItem(habit, 'lost'))}
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* At Risk Section */}
      {insights.atRisk.length > 0 && (
        <TouchableOpacity
          style={styles.section}
          onPress={() => toggleSection('risk')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="warning" size={20} color={colors.warning} />
              <Text style={styles.sectionTitle}>Habits at Risk</Text>
              <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.badgeText, { color: colors.warning }]}>
                  {insights.atRisk.length}
                </Text>
              </View>
            </View>
            <Ionicons
              name={expandedSection === 'risk' ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.text.tertiary}
            />
          </View>

          {expandedSection === 'risk' && (
            <View style={styles.sectionContent}>
              {insights.atRisk.map(habit => renderHabitItem(habit, 'risk'))}

              {/* Suggested Actions */}
              <View style={styles.suggestedActions}>
                <Text style={styles.suggestedActionsTitle}>Suggested Focus</Text>
                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                  <Ionicons name="notifications" size={16} color={colors.primary} />
                  <Text style={styles.actionButtonText}>Set reminders for at-risk habits</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                  <Ionicons name="bulb" size={16} color={colors.primary} />
                  <Text style={styles.actionButtonText}>Review habit difficulty</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Archive Button */}
      <TouchableOpacity
        style={styles.archiveButton}
        onPress={onArchivePress}
        activeOpacity={0.7}
      >
        <Ionicons name="archive" size={20} color={colors.text.secondary} />
        <Text style={styles.archiveButtonText}>View Past Reports</Text>
      </TouchableOpacity>

      {/* Generated Date */}
      <Text style={styles.generatedDate}>
        Generated {new Date(insights.generatedAt).toLocaleDateString()}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  badge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: spacing.xs,
  },
  badgeText: {
    ...typography.caption,
    color: colors.success,
    fontSize: 10,
    fontWeight: '600',
  },
  sectionContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  summaryValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.h3,
    marginLeft: spacing.xs,
  },
  summaryCompletions: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  habitItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  habitStats: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  habitItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changePercentage: {
    ...typography.bodyBold,
    marginLeft: spacing.xs,
    fontSize: 14,
  },
  suggestedActions: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  suggestedActionsTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  actionButtonText: {
    ...typography.body,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  archiveButtonText: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  generatedDate: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});