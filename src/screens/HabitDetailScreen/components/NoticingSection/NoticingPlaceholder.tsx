/**
 * NoticingPlaceholder — the dashed slot the design specifies for "What we're
 * noticing" before the PHASE 2 cards can render.
 *
 * The design's MVP note says to hide the cards until there is real pattern
 * detection, "dashed placeholder: 'patterns appear around day 10'". An earlier
 * revision rendered a bare line of text that disappeared entirely once the habit
 * had enough history but no detectable pattern — so the section silently
 * vanished and the screen looked unfinished. This keeps the slot visible and
 * says which of the two situations you're in.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface NoticingPlaceholderProps {
  /** Inclusive days of history behind this habit. */
  daysOfData: number;
  /** Days needed before pattern detection runs at all. */
  minDays: number;
  palette: InsightPalette;
}

export function NoticingPlaceholder({
  daysOfData,
  minDays,
  palette,
}: NoticingPlaceholderProps) {
  const tooEarly = daysOfData < minDays;
  const day = Math.max(1, daysOfData);

  return (
    <View
      accessibilityRole='summary'
      style={{
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderStyle: 'dashed',
        borderWidth: 1.5,
        paddingHorizontal: 18,
        paddingVertical: 16,
      }}
    >
      <Text
        style={{
          color: palette.textTertiary,
          fontSize: 11,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        {tooEarly ? 'Still gathering' : 'Nothing to flag'}
      </Text>
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 13,
          lineHeight: 20,
          marginTop: 8,
        }}
      >
        {tooEarly
          ? `Patterns appear around day ${minDays} — you're on day ${day}.`
          : 'No weekday or time-of-day pattern stands out yet. That usually means it is going evenly, which is the point.'}
      </Text>
    </View>
  );
}
