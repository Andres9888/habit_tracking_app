/**
 * HabitsAtRiskWidget Component
 * Phase 4: Retention Engine - Predictive Intelligence
 *
 * Displays habits with low predicted completion probability (<40%).
 * Provides intervention suggestions and quick actions to improve retention.
 */
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAppTheme } from '../../theme';
import { useThemeColors } from '../../theme/ThemeContext';
import { styles, themedAtRiskStyles } from './styles';
import { HabitCard } from './HabitCard';
import type { HabitsAtRiskWidgetProps, AtRiskHabit } from './types';

export function HabitsAtRiskWidget({ onHabitPress }: HabitsAtRiskWidgetProps) {
  const theme = useAppTheme();

  const atRiskHabits = useQuery(api.predictions.getHabitsAtRisk, {
    threshold: 0.4,
  });

  const isLoading = atRiskHabits === undefined;
  const { colors: themeColors } = useThemeColors();
  const themed = themedAtRiskStyles(themeColors);

  // Show loading indicator while fetching at-risk predictions
  if (isLoading) {
    return (
      <View style={[styles.container, themed.container, { minHeight: 100 }]}>
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: theme.custom.colors.warning[700] }]}
          >
            ⚠️ Habits at Risk
          </Text>
        </View>
        <ActivityIndicator
          color={theme.custom.colors.warning[500]}
          size='small'
          style={{ marginTop: 12 }}
        />
      </View>
    );
  }

  if (!atRiskHabits || atRiskHabits.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, themed.container]}>
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
