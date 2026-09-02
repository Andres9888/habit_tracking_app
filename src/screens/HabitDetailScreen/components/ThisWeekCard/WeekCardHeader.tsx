/** WeekCardHeader — "This week", its date range, and the logged count. */
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface WeekCardHeaderProps {
  loggedLabel: string;
  palette: InsightPalette;
  rangeLabel: string;
  /** `accent` is the forward-looking "N days left" framing before any log. */
  tone?: 'muted' | 'accent';
}

export function WeekCardHeader({
  loggedLabel,
  palette,
  rangeLabel,
  tone = 'muted',
}: WeekCardHeaderProps) {
  return (
    <View
      style={{
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 2,
      }}
    >
      <View>
        <Text
          style={{
            color: palette.textPrimary,
            fontFamily: fontFamilies.primary.text,
            fontSize: 14,
            fontWeight: fontWeights.semibold,
            lineHeight: 17,
          }}
        >
          This week
        </Text>
        <Text
          style={{
            color: palette.textTertiary,
            fontFamily: fontFamilies.primary.text,
            fontSize: 11,
            marginTop: 2,
          }}
        >
          {rangeLabel}
        </Text>
      </View>
      <Text
        style={{
          color: tone === 'accent' ? palette.ctaGreen : palette.textTertiary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 12,
          fontWeight: tone === 'accent' ? fontWeights.semibold : undefined,
          paddingTop: 1,
        }}
      >
        {loggedLabel}
      </Text>
    </View>
  );
}
