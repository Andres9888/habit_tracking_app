/**
 * GoalLadderTrack — the goal bar with its milestone dots.
 *
 * Each mark is centred on its position with a fixed-width wrapper: React
 * Native cannot translate by a percentage of the element's own width, so the
 * negative half-width margin is what keeps the dot and its caption centred.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import type { InsightPalette } from '../../insightPalette';
import type { LadderMark } from './goalLadder';
import { LadderMarkDot } from './LadderMarkDot';

const MARK_WIDTH = 40;

interface GoalLadderTrackProps {
  fillPct: number;
  marks: readonly LadderMark[];
  palette: InsightPalette;
}

export function GoalLadderTrack({
  fillPct,
  marks,
  palette,
}: GoalLadderTrackProps) {
  return (
    <View style={{ height: 40, marginTop: 18 }}>
      <View
        style={{
          backgroundColor: palette.cellEmpty,
          borderRadius: borderRadius.full,
          height: 8,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 5,
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
      {marks.map((mark) => (
        <LadderMarkDot
          key={`${mark.kind}-${mark.value}`}
          mark={mark}
          palette={palette}
        />
      ))}
    </View>
  );
}
