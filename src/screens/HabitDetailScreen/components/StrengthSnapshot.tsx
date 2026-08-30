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

interface StrengthSnapshotProps {
  habit: Habit;
}

export function StrengthSnapshot({ habit }: StrengthSnapshotProps) {
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
          Momentum from every check-in, weighted toward recent days. A miss dips
          it — it never resets.
        </Text>
      </View>
    </View>
  );
}
