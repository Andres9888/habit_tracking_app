/** InsightCardHeader — round icon chip plus uppercase eyebrow, then a headline. */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import { BAND_FG } from '../../insightPalette';

interface InsightCardHeaderProps {
  accent: string;
  eyebrow: string;
  glyph: string;
  headline: string;
  headlineColor: string;
}

export function InsightCardHeader({
  accent,
  eyebrow,
  glyph,
  headline,
  headlineColor,
}: InsightCardHeaderProps) {
  return (
    <>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: accent,
            borderRadius: borderRadius.full,
            height: 22,
            justifyContent: 'center',
            width: 22,
          }}
        >
          <Text style={{ color: BAND_FG, fontSize: 12, lineHeight: 15 }}>
            {glyph}
          </Text>
        </View>
        <Text
          style={{
            color: accent,
            fontSize: 11,
            fontWeight: fontWeights.bold,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </Text>
      </View>
      <Text
        style={{
          color: headlineColor,
          fontFamily: fontFamilies.primary.display,
          fontSize: 19,
          lineHeight: 26,
          marginTop: 12,
        }}
      >
        {headline}
      </Text>
    </>
  );
}
