/**
 * ChartHead — stacked title + subtitle used on Analytics cards in the mock.
 */
import { Text, View } from 'react-native';
import { fontWeights } from '../../../theme/typography';
import type { InsightPalette } from '../insightPalette';

interface ChartHeadProps {
  palette: InsightPalette;
  subtitle?: string | null;
  title: string;
}

export function ChartHead({ palette, subtitle, title }: ChartHeadProps) {
  return (
    <View style={{ paddingBottom: 14, paddingHorizontal: 2 }}>
      <Text
        style={{
          color: palette.textPrimary,
          fontSize: 15,
          fontWeight: fontWeights.semibold,
          letterSpacing: -0.1,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            color: palette.textTertiary,
            fontSize: 13,
            marginTop: 3,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
