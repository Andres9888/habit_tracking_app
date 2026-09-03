/**
 * MonthGridCardHeader — serif month name, its completion rate when the month
 * has a settled one, and the chevrons that page the card. The current month has
 * no rate: a rate that climbs all month reads as a falling score, so it is
 * simply omitted.
 */
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { MonthRate } from '../../insights';
import type { InsightPalette } from '../../insightPalette';
import { MonthNavButtons, type MonthNavigation } from './MonthNavButtons';

interface MonthGridCardHeaderProps {
  isBest: boolean;
  label: string;
  /** Omitted where the card is not navigable. */
  navigation?: MonthNavigation;
  palette: InsightPalette;
  rate?: MonthRate;
}

export function MonthGridCardHeader({
  isBest,
  label,
  navigation,
  palette,
  rate,
}: MonthGridCardHeaderProps) {
  return (
    <View
      style={{
        alignItems: 'center',
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
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
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
        {navigation ? (
          <MonthNavButtons {...navigation} palette={palette} />
        ) : null}
      </View>
    </View>
  );
}
