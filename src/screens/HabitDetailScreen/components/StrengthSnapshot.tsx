/**
 * StrengthSnapshot — the one number, with an honest description of it.
 *
 * The caption has to match `convex/habitStrength/momentum.ts`: strength is
 * simulated day by day, growing into the gap on a check-in and decaying
 * PROPORTIONALLY on a miss (strength × (1 − baseDecay)). So recent days really
 * do dominate, and a miss can never take it to zero — but there is no
 * "last two weeks" window and no fixed points-per-miss, which is why the
 * prototype's "weighted to the last two weeks / dips a few points" is not what
 * ships here.
 *
 * The dial stays up in recovery. Streak goes to zero on a miss; strength does
 * not, and that is the point of showing it on the day after.
 */
import { Text, View } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { borderRadius, shadows } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';
import {
  strengthLabel,
  strengthPercent,
} from './DetailHeroBanner/DetailHeroBanner.utils';
import { StrengthDial } from './StrengthDial';

/** Recovery caption: the same truth, said for the day after a miss. */
export const RECOVERY_STRENGTH_CAPTION =
  'Dipped, not reset. Recent days still count most.';

const DEFAULT_STRENGTH_CAPTION =
  'Momentum from every check-in, weighted toward recent days. A miss dips it — it never resets.';

interface StrengthSnapshotProps {
  habit: Habit;
  /** The last scheduled day was missed. Swap the caption; keep the dial. */
  isRecovery?: boolean;
}

export function StrengthSnapshot({
  habit,
  isRecovery = false,
}: StrengthSnapshotProps) {
  const palette = useInsightPalette();
  const percent = strengthPercent(habit);
  const label = strengthLabel(percent);

  return (
    <View
      accessibilityLabel={`Habit strength ${percent} percent, ${label}`}
      accessibilityRole='progressbar'
      accessibilityValue={{ max: 100, min: 0, now: percent }}
      style={{
        alignItems: 'center',
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 11,
        ...shadows.subtle,
      }}
    >
      <StrengthDial
        percent={percent}
        progressColor={palette.green}
        textColor={palette.textPrimary}
        trackColor={palette.dialTrack}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: palette.textPrimary,
            fontSize: 13,
            fontWeight: fontWeights.semibold,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: palette.textTertiary,
            fontSize: 11,
            lineHeight: 16,
            marginTop: 2,
          }}
        >
          {isRecovery ? RECOVERY_STRENGTH_CAPTION : DEFAULT_STRENGTH_CAPTION}
        </Text>
      </View>
    </View>
  );
}
