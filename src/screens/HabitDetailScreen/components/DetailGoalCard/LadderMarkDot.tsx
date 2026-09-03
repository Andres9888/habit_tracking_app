/**
 * LadderMarkDot — one milestone on the goal track: the first week already
 * banked, where you are now, the record still to clear, or the goal itself.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import type { LadderMark } from './goalLadder';
import {
  DOT_SIZE,
  ladderLabelStyle,
  ladderMarkContainerStyle,
} from './ladderMarkLayout';

export function LadderMarkDot({
  mark,
  palette,
}: {
  mark: LadderMark;
  palette: InsightPalette;
}) {
  const done = mark.kind === 'past';
  const now = mark.kind === 'now';
  const record = mark.kind === 'record';

  return (
    <View style={ladderMarkContainerStyle(mark.leftPct)}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: now
            ? palette.amberBar
            : done
              ? palette.ctaGreen
              : palette.cellEmpty,
          borderColor: now
            ? palette.bandGradient[0]
            : record
              ? palette.greenSoft
              : palette.missedRing,
          borderRadius: borderRadius.full,
          borderStyle: mark.kind === 'goal' ? 'dashed' : 'solid',
          borderWidth: now ? 2.5 : done ? 0 : 1.5,
          height: DOT_SIZE,
          justifyContent: 'center',
          width: DOT_SIZE,
        }}
      >
        {done ? (
          <Text
            style={{
              color: palette.onGreen,
              fontFamily: fontFamilies.primary.text,
              fontSize: 11,
            }}
          >
            ✓
          </Text>
        ) : null}
      </View>
      <Text
        numberOfLines={1}
        style={{
          ...ladderLabelStyle(mark.leftPct),
          color: now
            ? palette.textPrimary
            : record
              ? palette.ctaGreen
              : palette.textTertiary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 11,
          fontWeight: now ? fontWeights.bold : fontWeights.regular,
        }}
      >
        {mark.label}
      </Text>
    </View>
  );
}
