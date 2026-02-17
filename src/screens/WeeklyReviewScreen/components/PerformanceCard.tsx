/**
 * PerformanceCard - Shows best and worst performing habits
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { HabitChange } from '@/components/WeeklyInsightsCard/WeeklyInsightsCard.types';

interface PerformanceCardProps {
  bestHabits: HabitChange[];
  worstHabits: HabitChange[];
}

export function PerformanceCard({ bestHabits, worstHabits }: PerformanceCardProps) {
  const { colors } = useThemeColors();

  const renderHabitList = (habits: HabitChange[], type: 'best' | 'worst') => {
    if (habits.length === 0) {
      return (
        <Text style={[typography.body, { color: colors.text.tertiary, fontStyle: 'italic' }]}>
          No changes this week
        </Text>
      );
    }

    return habits.map((habit, index) => (
      <View key={habit.habitId} style={styles.habitRow}>
        <Text style={[typography.body, { flex: 1 }]}>
          {habit.emoji} {habit.name}
        </Text>
        <Text
          style={[
            typography.body,
            {
              color: type === 'best' ? '#047857' : '#DC2626',
              fontWeight: '600',
            },
          ]}
        >
          {type === 'best' ? '+' : ''}{habit.change} completions
        </Text>
      </View>
    ));
  };

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 4,
        },
      ]}
    >
      <Card.Content>
        <View style={styles.section}>
          <Text style={[typography.heading2, { color: colors.text.primary, marginBottom: spacing.md }]}>
            🌟 Best Performers
          </Text>
          {renderHabitList(bestHabits, 'best')}
        </View>

        {worstHabits.length > 0 && (
          <View style={[styles.section, { marginTop: spacing.lg }]}>
            <Text style={[typography.heading2, { color: colors.text.primary, marginBottom: spacing.md }]}>
              ⚠️ Needs Attention
            </Text>
            {renderHabitList(worstHabits, 'worst')}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  section: {
    // Empty for now
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
});
