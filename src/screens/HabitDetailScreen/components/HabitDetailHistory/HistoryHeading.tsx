/**
 * HistoryHeading — "Full history" with the year pill beside it.
 *
 * Stands in for the prototype's History screen header row. There is no back
 * chevron because this is a disclosure inside the detail modal, not a pushed
 * screen — a back button here would be a lie about where you are.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { SectionHeading } from '../NoticingSection/SectionHeading';

interface HistoryHeadingProps {
  palette: InsightPalette;
  year: number;
}

export function HistoryHeading({ palette, year }: HistoryHeadingProps) {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
      <View style={{ flex: 1 }}>
        <SectionHeading palette={palette} title='Full history' />
      </View>
      <Text
        style={{
          backgroundColor: palette.greenTint,
          borderRadius: borderRadius.full,
          color: palette.ctaGreen,
          fontSize: 13,
          fontWeight: fontWeights.semibold,
          overflow: 'hidden',
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
      >
        {year}
      </Text>
    </View>
  );
}
