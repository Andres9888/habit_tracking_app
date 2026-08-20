import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import { useInsightPalette } from '../../insightPalette';
import { InsightCard } from '../InsightCard';
import { INSIGHT_EMPTY } from './insightEvidence';

/** Paper empty — missing id is not a sample-size story. */
export function InsightEmptyCard() {
  const palette = useInsightPalette();

  return (
    <InsightCard palette={palette}>
      <Text
        style={{
          color: palette.ctaGreen,
          fontSize: 11,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        From your log
      </Text>
      <Text
        style={{
          color: palette.textPrimary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 19,
          lineHeight: 26,
          marginTop: 10,
        }}
      >
        {INSIGHT_EMPTY}
      </Text>
      <View
        style={{
          backgroundColor: palette.tileBg,
          borderRadius: 12,
          marginTop: 14,
          padding: 14,
        }}
      >
        <Text
          style={{
            color: palette.textSecondary,
            fontSize: 14,
            lineHeight: 21,
          }}
        >
          Open a pattern from Analytics to see the counts behind it.
        </Text>
      </View>
    </InsightCard>
  );
}
