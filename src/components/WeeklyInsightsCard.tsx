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

export default function WeeklyInsightsCard({
  insights,
  onHabitPress,
  onArchivePress,
}: Props) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'summary'
  );

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

  const renderHabitItem = (
    habit: HabitChange,
    type: 'gained' | 'lost' | 'risk'
  ) => {
    const getChangeIcon = () => {
      if (type === 'gained')
        return { color: colors.success, name: 'trending-up' };
      if (type === 'lost')
        return { color: colors.error, name: 'trending-down' };
      return { color: colors.warning, name: 'warning' };
    };

    const icon = getChangeIcon();

    return (
      <TouchableOpacity
        key={habit.habitId}
        activeOpacity={0.7}
        style={styles.habitItem}
        onPress={() => onHabitPress?.(habit.habitId)}
      >
        <View style={styles.habitItemLeft}>
          <Text style={styles.habitEmoji}>{habit.emoji}</Text>
          <View style={styles.habitInfo}>
            <Text numberOfLines={1} style={styles.habitName}>
              {habit.name}
            </Text>
            <Text style={styles.habitStats}>
              {type === 'risk'
                ? `Only ${habit.thisWeek} completions • ${habit.currentStreak} day streak`
                : `${habit.thisWeek} vs ${habit.lastWeek} last week`}
            </Text>
          </View>
        </View>

        <View style={styles.habitItemRight}>
          <Ionicons color={icon.color} name={icon.name as any} size={20} />
          {type !== 'risk' && (
            <Text
              style={[
                styles.changePercentage,
                { color: type === 'gained' ? colors.success : colors.error },
              ]}
            >
              {habit.percentageChange > 0 ? '+' : ''}
              {Math.round(habit.percentageChange)}%
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Week Overview Section */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.section}
        onPress={() => toggleSection('summary')}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons color={colors.primary} name='calendar' size={20} />
            <Text style={styles.sectionTitle}>This Week's Summary</Text>
          </View>
          <Ionicons
            color={colors.text.tertiary}
            name={expandedSection === 'summary' ? 'chevron-up' : 'chevron-down'}
            size={20}
          />
        </View>

        {expandedSection === 'summary' && (
          <View style={styles.sectionContent}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Overall Change</Text>
                <View style={styles.summaryValueContainer}>
                  <Ionicons
                    color={
                      insights.weekOverWeekChange >= 0
                        ? colors.success
                        : colors.error
                    }
                    name={
                      insights.weekOverWeekChange >= 0
                        ? 'trending-up'
                        : 'trending-down'
                    }
                    size={16}
                  />
                  <Text
                    style={[
                      styles.summaryValue,
                      {
                        color:
                          insights.weekOverWeekChange >= 0
                            ? colors.success
                            : colors.error,
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
                  {insights.totalCompletionsThisWeek} this week •{' '}
                  {insights.totalCompletionsLastWeek} last week
                </Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Gained Strength Section */}
      {insights.gainedStrength.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.section}
          onPress={() => toggleSection('gained')}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons
                color={colors.success}
                name='arrow-up-circle'
                size={20}
              />
              <Text style={styles.sectionTitle}>Habits Gained Strength</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {insights.gainedStrength.length}
                </Text>
              </View>
            </View>
            <Ionicons
              color={colors.text.tertiary}
              name={
                expandedSection === 'gained' ? 'chevron-up' : 'chevron-down'
              }
              size={20}
            />
          </View>

          {expandedSection === 'gained' && (
            <View style={styles.sectionContent}>
              {insights.gainedStrength.map((habit) =>
                renderHabitItem(habit, 'gained')
              )}
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Lost Strength Section */}
      {insights.lostStrength.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.section}
          onPress={() => toggleSection('lost')}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons
                color={colors.error}
                name='arrow-down-circle'
                size={20}
              />
              <Text style={styles.sectionTitle}>Habits Lost Strength</Text>
              <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.badgeText, { color: colors.error }]}>
                  {insights.lostStrength.length}
                </Text>
              </View>
            </View>
            <Ionicons
              color={colors.text.tertiary}
              name={expandedSection === 'lost' ? 'chevron-up' : 'chevron-down'}
              size={20}
            />
          </View>

          {expandedSection === 'lost' && (
            <View style={styles.sectionContent}>
              {insights.lostStrength.map((habit) =>
                renderHabitItem(habit, 'lost')
              )}
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* At Risk Section */}
      {insights.atRisk.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.section}
          onPress={() => toggleSection('risk')}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons color={colors.warning} name='warning' size={20} />
              <Text style={styles.sectionTitle}>Habits at Risk</Text>
              <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.badgeText, { color: colors.warning }]}>
                  {insights.atRisk.length}
                </Text>
              </View>
            </View>
            <Ionicons
              color={colors.text.tertiary}
              name={expandedSection === 'risk' ? 'chevron-up' : 'chevron-down'}
              size={20}
            />
          </View>

          {expandedSection === 'risk' && (
            <View style={styles.sectionContent}>
              {insights.atRisk.map((habit) => renderHabitItem(habit, 'risk'))}

              {/* Suggested Actions */}
              <View style={styles.suggestedActions}>
                <Text style={styles.suggestedActionsTitle}>
                  Suggested Focus
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.actionButton}
                >
                  <Ionicons
                    color={colors.primary}
                    name='notifications'
                    size={16}
                  />
                  <Text style={styles.actionButtonText}>
                    Set reminders for at-risk habits
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.actionButton}
                >
                  <Ionicons color={colors.primary} name='bulb' size={16} />
                  <Text style={styles.actionButtonText}>
                    Review habit difficulty
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Archive Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.archiveButton}
        onPress={onArchivePress}
      >
        <Ionicons color={colors.text.secondary} name='archive' size={20} />
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
  badge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  badgeText: {
    ...typography.caption,
    color: colors.success,
    fontSize: 10,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    padding: spacing.xl,
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
  sectionContent: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  habitItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: spacing.sm,
    borderBottomColor: colors.border,
  },
  sectionHeaderLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  habitInfo: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
  },
  habitItemLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  summaryCompletions: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  changePercentage: {
    ...typography.bodyBold,
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  actionButton: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButtonText: {
    ...typography.body,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  summaryValue: {
    ...typography.h3,
    marginLeft: spacing.xs,
  },
  archiveButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    flexDirection: 'row',
    borderRadius: 12,
    justifyContent: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  summaryValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  archiveButtonText: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  generatedDate: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  habitItemRight: {
    alignItems: 'center',
    flexDirection: 'row',
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
  suggestedActions: {
    backgroundColor: colors.background,
    borderRadius: 8,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  suggestedActionsTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
});
