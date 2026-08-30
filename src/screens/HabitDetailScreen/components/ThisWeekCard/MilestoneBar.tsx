/**
 * MilestoneBar — current streak measured against the next thing worth beating.
 *
 * The numbers themselves live in WeekStatsRow directly above, so per the Habit
 * Flow Prototype this is just a hairline track and a centred caption — no
 * numeral prefix.
 *
 * The target is the personal best while one is ahead of you; once you match or
 * pass it the bar re-aims at the next round milestone so it never sits full.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import type { InsightPalette } from '../../insightPalette';
import { milestoneTarget, milestoneCaption } from './milestoneTarget';

interface MilestoneBarProps {
  bestStreak: number;
  currentStreak: number;
  goalDuration?: number;
  palette: InsightPalette;
}

export function MilestoneBar({
  bestStreak,
  currentStreak,
  goalDuration,
  palette,
}: MilestoneBarProps) {
  const { target, isBest } = milestoneTarget(currentStreak, bestStreak);
  const fillPct =
    target === 0 ? 0 : Math.min(100, (currentStreak / target) * 100);
  const caption = milestoneCaption(currentStreak, target, isBest, goalDuration);

  return (
    <View
      accessibilityLabel={`Current streak ${currentStreak} of ${target}. ${caption}`}
      accessibilityRole='progressbar'
    >
      <View
        style={{
          backgroundColor: palette.cellEmpty,
          borderRadius: borderRadius.full,
          height: 7,
          marginTop: 4,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            backgroundColor: palette.amberBar,
            borderRadius: borderRadius.full,
            height: '100%',
            width: `${fillPct}%`,
          }}
        />
      </View>
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 13,
          marginTop: 8,
          textAlign: 'center',
        }}
      >
        {caption}
      </Text>
    </View>
  );
}
