/** Monday-first column headers, on the same 1/7 rhythm as the cells. */
import { Text, View } from 'react-native';
import { fontFamilies } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export function MonthGridHeader({ palette }: { palette: InsightPalette }) {
  return (
    <View style={{ flexDirection: 'row', marginHorizontal: -3, marginTop: 13 }}>
      {WEEKDAYS.map((label, index) => (
        <Text
          key={`${label}-${index}`}
          style={{
            color: palette.textTertiary,
            flexBasis: '14.2857%',
            fontFamily: fontFamilies.primary.text,
            fontSize: 10,
            textAlign: 'center',
          }}
        >
          {label}
        </Text>
      ))}
    </View>
  );
}
