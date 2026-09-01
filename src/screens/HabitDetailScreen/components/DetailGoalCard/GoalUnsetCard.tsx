/**
 * GoalUnsetCard — the one-tap goal picker.
 *
 * Sending people to settings to choose a target means almost nobody has one,
 * and the ladder — the whole motivational device — never renders. So the
 * presets commit on tap, and the suggestion is derived from the reader's own
 * record so the default is already right.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { GoalPresetRow } from './GoalPresetRow';
import { DETAIL_GOAL_PRESETS, suggestedGoal } from './presets';

interface GoalUnsetCardProps {
  bestStreak: number;
  currentStreak: number;
  palette: InsightPalette;
  onCustom: () => void;
  onPick: (days: number) => void;
}

export function GoalUnsetCard({
  bestStreak,
  currentStreak,
  palette,
  onCustom,
  onPick,
}: GoalUnsetCardProps) {
  const suggested = suggestedGoal(bestStreak);
  const prompt =
    currentStreak > 0
      ? `You're ${currentStreak} days in with a record of ${bestStreak}. Pick a target and the ladder tracks it here.`
      : `Your record is ${bestStreak} days. Pick a target and the ladder tracks it from your next check-in.`;

  return (
    <View
      style={{
        backgroundColor: palette.card,
        borderColor: palette.missedRing,
        borderRadius: borderRadius.large,
        borderStyle: 'dashed',
        borderWidth: 1,
        paddingHorizontal: 18,
        paddingVertical: 16,
      }}
    >
      <Text
        style={{
          color: palette.textTertiary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 12,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        Streak goal
      </Text>
      <Text
        style={{
          color: palette.textPrimary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 17,
          lineHeight: 23,
          marginTop: 8,
        }}
      >
        Give this run a finish line.
      </Text>
      <Text
        style={{
          color: palette.textSecondary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 12.5,
          lineHeight: 19,
          marginTop: 6,
        }}
      >
        {prompt}
      </Text>
      <GoalPresetRow
        palette={palette}
        presets={DETAIL_GOAL_PRESETS}
        suggested={suggested}
        onCustom={onCustom}
        onPick={onPick}
      />
      {suggested > bestStreak ? (
        <Text
          style={{
            color: palette.textTertiary,
            fontFamily: fontFamilies.primary.text,
            fontSize: 12,
            marginTop: 10,
          }}
        >
          {`Suggested: ${suggested} — it clears your record by ${suggested - bestStreak} days.`}
        </Text>
      ) : null}
    </View>
  );
}
