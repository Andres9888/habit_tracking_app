/**
 * MonthGridCardHeader — serif month name, with its completion rate beside it
 * when the month has a settled one. The current month has none: a rate that
 * climbs all month reads as a falling score, so it is simply omitted.
 */
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { MonthRate } from '../../insights';
import type { InsightPalette } from '../../insightPalette';

interface MonthGridCardHeaderProps {
  isBest: boolean;
  label: string;
  palette: InsightPalette;
  rate?: MonthRate;
}

export function MonthGridCardHeader({
  isBest,
  label,
  palette,
  rate,
}: MonthGridCardHeaderProps) {
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
          color: palette.textPrimary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 18,
          fontWeight: fontWeights.semibold,
        }}
      >
        {label}
      </Text>
      {rate ? (
        <Text
          style={{
            color: palette.ctaGreen,
            fontSize: 12,
            fontWeight: fontWeights.semibold,
          }}
        >
          {rate.ratePct}% · {rate.done} of {rate.scheduled}
          {isBest ? ' ★' : ''}
        </Text>
      ) : null}
    </View>
  );
}
