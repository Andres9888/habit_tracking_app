/**
 * HabitsAtRiskWidget Component
 * Phase 4: Retention Engine - Predictive Intelligence
 *
 * Displays habits with low predicted completion probability (<40%).
 * Provides intervention suggestions and quick actions to improve retention.
 */

import { View, Text, Pressable } from 'react-native';

import { useQuery } from 'convex/react';

import type { HabitsAtRiskWidgetProps, AtRiskHabit } from './types';
import { HabitCard } from './HabitCard';
import { api } from '../../../convex/_generated/api';
import { styles } from './styles';
import { useAppTheme } from '../../theme';

export function HabitsAtRiskWidget({ onHabitPress }: HabitsAtRiskWidgetProps) {
  const theme = useAppTheme();

  const atRiskHabits = useQuery(api.predictions.getHabitsAtRisk, {
    threshold: 0.4,
  });

  if (!atRiskHabits || atRiskHabits.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { borderColor: '#FCD34D' }]}>
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

      {atRiskHabits.map((habit: AtRiskHabit, index: number) => (
        <HabitCard
          key={`at-risk-${index}`}
          habit={habit}
          onPress={onHabitPress}
        />
      ))}

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

export default HabitsAtRiskWidget;
