/**
 * CardEyebrow — the uppercase green label + muted right-hand note that opens
 * every card in the redesign ("PROGRESS · 2 of 7 this week", "YOUR MONTH ·
 * June 23 – July 20", "YEAR AT A GLANCE · Jan – Jul").
 */
import { Text, View } from 'react-native';
import { fontWeights } from '../../../theme/typography';
import type { InsightPalette } from '../insightPalette';

interface CardEyebrowProps {
  label: string;
  note?: string | null;
  palette: InsightPalette;
}

export function CardEyebrow({ label, note, palette }: CardEyebrowProps) {
  return (
    <View
      style={{
        alignItems: 'baseline',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          color: palette.ctaGreen,
          fontSize: 12,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      {note ? (
        <Text style={{ color: palette.textTertiary, fontSize: 12 }}>
          {note}
        </Text>
      ) : null}
    </View>
  );
}
