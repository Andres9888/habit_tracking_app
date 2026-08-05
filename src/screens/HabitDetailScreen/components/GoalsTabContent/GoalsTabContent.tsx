/**
 * GoalsTabContent — Streak target card. Weekly time lives under its own
 * "Time" tab in HabitDetailContent.
 */
import { View } from 'react-native';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import { StreakGoalSection } from './StreakGoalSection';
import type { GoalsTabContentProps } from './GoalsTabContent.types';

export function GoalsTabContent({
  habit,
  completionRate,
}: GoalsTabContentProps) {
  return (
    <View>
      <ErrorBoundary>
        <StreakGoalSection completionRate={completionRate} habit={habit} />
      </ErrorBoundary>
    </View>
  );
}
