/**
 * NextMilestonePill — prominent gold card showing the next milestone.
 * Pulls the first "current" milestone from the dashboard list.
 */
import React from 'react';
import { Text, View } from 'react-native';
import { compactStyles as s } from './styles/compact.styles';
import type { DashboardMilestone } from './StreakGoalCard.types';

interface NextMilestonePillProps {
  milestone: DashboardMilestone | null;
}

export const NextMilestonePill = React.memo(function NextMilestonePill({
  milestone,
}: NextMilestonePillProps) {
  if (!milestone) return null;

  return (
    <View style={s.nextCard}>
      <Text style={s.nextBadge}>{milestone.badge}</Text>
      <View style={s.nextTextGroup}>
        <Text style={s.nextLabel}>Next milestone</Text>
        <Text style={s.nextName}>{milestone.name}</Text>
      </View>
      <View>
        <Text style={s.nextDays}>{milestone.daysAway}d</Text>
        <Text style={s.nextDaysLabel}>to go</Text>
      </View>
    </View>
  );
});
