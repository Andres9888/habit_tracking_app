/**
 * GoalSetCard — the active target, its ladder, and the plan in dates.
 */
import { Text, View } from 'react-native';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { fontFamilies } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { GoalCardHeader } from './GoalCardHeader';
import { buildLadder } from './goalLadder';
import { GoalLadderTrack } from './GoalLadderTrack';
import { goalPlanSentence } from './goalPlan';

interface GoalSetCardProps {
  bestStreak: number;
  currentStreak: number;
  goal: number;
  loggedToday: boolean;
  palette: InsightPalette;
  onChange: () => void;
}

export function GoalSetCard({
  bestStreak,
  currentStreak,
  goal,
  loggedToday,
  palette,
  onChange,
}: GoalSetCardProps) {
  const marks = buildLadder(currentStreak, bestStreak, goal);
  const plan = goalPlanSentence({
    bestStreak,
    currentStreak,
    goal,
    loggedToday,
  });

  return (
    <View
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        paddingHorizontal: 18,
        paddingVertical: 16,
        ...shadows.subtle,
      }}
    >
      <GoalCardHeader palette={palette} onChange={onChange} />
      <Text
        style={{
          color: palette.textPrimary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 18,
          lineHeight: 24,
          marginTop: 9,
        }}
      >
        {currentStreak === 0
          ? `${goal} days — day 1 starts today.`
          : `${goal} days — you're ${currentStreak} in.`}
      </Text>
      <GoalLadderTrack
        fillPct={Math.min(100, (currentStreak / goal) * 100)}
        marks={marks}
        palette={palette}
      />
      <Text
        style={{
          borderTopColor: palette.divider,
          borderTopWidth: 1,
          color: palette.textSecondary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 12.5,
          lineHeight: 19,
          marginTop: 8,
          paddingTop: 11,
        }}
      >
        {plan}
      </Text>
    </View>
  );
}
