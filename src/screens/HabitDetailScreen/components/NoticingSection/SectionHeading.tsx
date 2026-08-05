/** SectionHeading — serif label followed by a hairline rule. */
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface SectionHeadingProps {
  palette: InsightPalette;
  title: string;
}

export function SectionHeading({ palette, title }: SectionHeadingProps) {
  return (
    <View
      accessibilityRole='header'
      style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}
    >
      <Text
        style={{
          color: palette.textPrimary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 19,
          fontWeight: fontWeights.semibold,
        }}
      >
        {title}
      </Text>
      <View style={{ backgroundColor: palette.divider, flex: 1, height: 1 }} />
    </View>
  );
}
