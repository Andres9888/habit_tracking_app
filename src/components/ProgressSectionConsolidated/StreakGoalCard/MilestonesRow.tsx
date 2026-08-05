/**
 * MilestonesRow — horizontal scrollable badge chips, one per milestone.
 * Replaces the full vertical MilestonesList in compact mode.
 */
import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { createCompactStyles, type CompactStyles } from './styles/compact.styles';
import type { DashboardMilestone } from './StreakGoalCard.types';

interface MilestonesRowProps {
  milestones: DashboardMilestone[];
}

function Badge({
  milestone: m,
  s,
}: {
  milestone: DashboardMilestone;
  s: CompactStyles;
}) {
  const style =
    m.status === 'done'
      ? s.badgeDone
      : m.status === 'current'
        ? s.badgeCurrent
        : m.isGoalRow
          ? s.badgeGoal
          : s.badgeFuture;
  return (
    <View style={[s.badge, style]}>
      <Text style={s.badgeText}>{m.badge}</Text>
    </View>
  );
}

export const MilestonesRow = React.memo(function MilestonesRow({
  milestones,
}: MilestonesRowProps) {
  const { colors } = useThemeColors();
  const s = useMemo(() => createCompactStyles(colors), [colors]);
  return (
    <View style={s.milestonesCard}>
      <View style={s.milestonesHeader}>
        <Text style={s.milestonesLabel}>Milestones on path</Text>
      </View>
      <ScrollView
        contentContainerStyle={s.badgeRow}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {milestones.map((m) => (
          <Badge key={`${m.days}-${m.isGoalRow ? 'goal' : 'std'}`} milestone={m} s={s} />
        ))}
      </ScrollView>
    </View>
  );
});
