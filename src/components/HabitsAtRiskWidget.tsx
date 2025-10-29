/**
 * HabitsAtRiskWidget Component
 * Phase 4: Retention Engine - Predictive Intelligence
 *
 * Displays habits with low predicted completion probability (<40%).
 * Provides intervention suggestions and quick actions to improve retention.
 *
 * UX Spec Reference: Section 2.1 - Habits at Risk Widget (Premium)
 * PRD Reference: Epic 3 - Adaptive Interventions
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAppTheme } from '../theme';
import type { Id } from '../../convex/_generated/dataModel';

interface HabitsAtRiskWidgetProps {
  onHabitPress: (habitId: Id<'habits'>) => void;
}

/**
 * At-risk habit type from predictions query
 * Matches the return type from api.predictions.getHabitsAtRisk
 */
interface AtRiskHabit {
  _id: Id<'habits'>;
  name: string;
  icon: string;
  strength: number;
  accessibility: number;
  predictedProbability: number;
  riskLevel: string; // 'high' or 'medium' from query
}

/**
 * Get intervention suggestion based on habit strength
 * Lower strength = more intensive intervention needed
 */
function getInterventionSuggestion(strength: number): string {
  if (strength < 0.3) return 'Needs intensive support';
  if (strength < 0.5) return 'Gentle reminder recommended';
  return 'Quick check-in suggested';
}

/**
 * HabitsAtRiskWidget
 *
 * Shows habits with <40% predicted completion probability.
 * Provides proactive alerts to help users maintain consistency.
 */
export function HabitsAtRiskWidget({ onHabitPress }: HabitsAtRiskWidgetProps) {
  const theme = useAppTheme();

  // Query habits with low prediction probability (default threshold: 0.4)
  const atRiskHabits = useQuery(api.predictions.getHabitsAtRisk, {
    threshold: 0.4, // <40% completion probability
  });

  // Don't show widget if loading or no at-risk habits
  if (!atRiskHabits || atRiskHabits.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { borderColor: '#FCD34D' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[styles.title, { color: theme.custom.colors.warning[700] }]}
        >
          ⚠️ Habits at Risk
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.custom.colors.gray[600] }]}
        >
          {atRiskHabits.length}{' '}
          {atRiskHabits.length === 1 ? 'habit needs' : 'habits need'} attention
        </Text>
      </View>

      {/* At-Risk Habit Cards */}
      {atRiskHabits.map((habit: AtRiskHabit) => (
        <Pressable
          key={habit._id}
          accessibilityHint={`This habit has ${Math.round(habit.predictedProbability * 100)}% chance of completion tomorrow`}
          accessibilityLabel={`View ${habit.name} habit details`}
          accessibilityRole='button'
          style={({ pressed }) => [
            styles.habitCard,
            { backgroundColor: '#FFFBEB' },
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => onHabitPress(habit._id)}
        >
          <View style={styles.habitInfo}>
            <Text
              style={[
                styles.habitName,
                { color: theme.custom.colors.gray[900] },
              ]}
            >
              {habit.icon} {habit.name}
            </Text>
            <Text
              style={[
                styles.prediction,
                { color: theme.custom.colors.warning[700] },
              ]}
            >
              {Math.round(habit.predictedProbability * 100)}% chance tomorrow
            </Text>
          </View>

          <View style={styles.interventionBadge}>
            <Text
              style={[
                styles.interventionText,
                { color: theme.custom.colors.warning[700] },
              ]}
            >
              {getInterventionSuggestion(habit.strength)}
            </Text>
          </View>
        </Pressable>
      ))}

      {/* View All Link */}
      <Pressable
        accessibilityLabel='View all predictions'
        accessibilityRole='button'
        style={styles.viewAllButton}
      >
        <Text
          style={[
            styles.viewAllText,
            { color: theme.custom.colors.primary[600] },
          ]}
        >
          View All Predictions →
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
  },
  habitCard: {
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  habitInfo: {
    marginBottom: 6,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  header: {
    marginBottom: 12,
  },
  interventionBadge: {
    alignSelf: 'flex-start',
  },
  interventionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  prediction: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  viewAllButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HabitsAtRiskWidget;
