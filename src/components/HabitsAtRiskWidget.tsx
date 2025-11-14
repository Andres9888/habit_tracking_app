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

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAppTheme } from '../theme';
import type { Id } from '../../convex/_generated/dataModel';

type HabitsAtRiskWidgetProps = {
  onHabitPress: (habitId: Id<'habits'>) => void;
  onViewAllPredictions?: (habits: AtRiskHabit[]) => void;
};

export type AtRiskHabit = {
  _id: Id<'habits'>;
  accessibility: number;
  icon: string;
  name: string;
  predictedProbability: number;
  riskLevel: string;
  strength: number;
};

/**
 * Get intervention suggestion based on habit strength
 * Lower strength = more intensive intervention needed
 */
const getInterventionSuggestion = (strength: number): string => {
  if (strength < 0.3) return 'Needs intensive support';
  if (strength < 0.5) return 'Gentle reminder recommended';
  return 'Quick check-in suggested';
};

/**
 * HabitsAtRiskWidget
 *
 * Shows habits with <40% predicted completion probability.
 * Provides proactive alerts to help users maintain consistency.
 */
export const HabitsAtRiskWidget = ({
  onHabitPress,
  onViewAllPredictions,
}: HabitsAtRiskWidgetProps) => {
  const theme = useAppTheme();

  // Query habits with low prediction probability (default threshold: 0.4)
  const atRiskHabits = useQuery(api.predictions.getHabitsAtRisk, {
    threshold: 0.4, // <40% completion probability
  });

  if (!atRiskHabits || atRiskHabits.length === 0) {
    return null;
  }

  const handleHabitPress = useCallback(
    (habitId: Id<'habits'>) => {
      onHabitPress(habitId);
    },
    [onHabitPress],
  );

  const handleHabitKeyDown = useCallback(
    (habitId: Id<'habits'>, name: string) =>
      (event: { nativeEvent: { key?: string } }) => {
        const key = event.nativeEvent.key;
        if (key === 'Enter' || key === ' ') {
          event.preventDefault?.();
          handleHabitPress(habitId);
        } else if (!key && __DEV__) {
          console.debug(`Unhandled key event for habit ${name}`);
        }
      },
    [handleHabitPress],
  );

  const handleViewAll = useCallback(() => {
    onViewAllPredictions?.(atRiskHabits);
  }, [atRiskHabits, onViewAllPredictions]);

  return (
    <View className='mx-4 my-4 rounded-3xl border border-[#FCD34D] bg-white p-4 shadow-sm'>
      <View className='mb-4 gap-1'>
        <Text
          className='text-lg font-semibold text-[#B45309]'
          accessibilityRole='text'
        >
          ⚠️ Habits at Risk
        </Text>
        <Text
          className='text-sm text-[#4B5563]'
          accessibilityRole='text'
        >
          {atRiskHabits.length} {atRiskHabits.length === 1 ? 'habit needs' : 'habits need'} attention
        </Text>
      </View>

      {atRiskHabits.map((habit) => (
        <Pressable
          accessibilityHint={`This habit has ${Math.round(habit.predictedProbability * 100)} percent chance of completion tomorrow`}
          accessibilityLabel={`View ${habit.name} habit details`}
          accessibilityRole='button'
          className='mb-3 rounded-2xl bg-[#FFFBEB] px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCD34D]'
          key={habit._id}
          onKeyDown={handleHabitKeyDown(habit._id, habit.name)}
          onPress={() => handleHabitPress(habit._id)}
          tabIndex={0}
        >
          <View className='mb-2'>
            <Text className='text-base font-medium text-[#111827]'>
              {habit.icon} {habit.name}
            </Text>
            <Text className='text-sm font-medium text-[#B45309]'>
              {Math.round(habit.predictedProbability * 100)}% chance tomorrow
            </Text>
          </View>

          <View className='rounded-full bg-white/80 px-3 py-1'>
            <Text className='text-xs font-semibold text-[#B45309]'>
              {getInterventionSuggestion(habit.strength)}
            </Text>
          </View>
        </Pressable>
      ))}

      <Pressable
        accessibilityLabel='View all predictions'
        accessibilityRole='button'
        className='mt-2 flex-row items-center justify-start rounded-full px-2 py-1'
        onKeyDown={handleHabitKeyDown(atRiskHabits[0]._id, atRiskHabits[0].name)}
        onPress={handleViewAll}
        tabIndex={0}
      >
        <Text className='text-sm font-semibold text-[#0F172A]'>
          View All Predictions →
        </Text>
      </Pressable>
    </View>
  );
};

export default HabitsAtRiskWidget;
