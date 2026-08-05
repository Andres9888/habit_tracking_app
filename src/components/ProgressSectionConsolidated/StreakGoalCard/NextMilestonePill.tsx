/**
 * NextMilestonePill — prominent gold card showing the next milestone.
 * Pulls the first "current" milestone from the dashboard list.
 */
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { createCompactStyles } from './styles/compact.styles';
import type { DashboardMilestone } from './StreakGoalCard.types';

interface NextMilestonePillProps {
  milestone: DashboardMilestone | null;
}

export const NextMilestonePill = React.memo(function NextMilestonePill({
  milestone,
}: NextMilestonePillProps) {
  const { colors } = useThemeColors();
  const s = useMemo(() => createCompactStyles(colors), [colors]);
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
