import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import { useInsightPalette } from '../../insightPalette';
import { InsightCard } from '../InsightCard';

interface EvidenceStatStripProps {
  items: { label: string; value: string }[];
}

export function EvidenceStatStrip({ items }: EvidenceStatStripProps) {
  const palette = useInsightPalette();

  return (
    <InsightCard palette={palette} padding={14}>
      <View style={{ flexDirection: 'row' }}>
        {items.map((item, index) => (
          <View
            key={item.label}
            style={{
              borderLeftColor: palette.divider,
              borderLeftWidth: index === 0 ? 0 : 1,
              flex: 1,
              paddingLeft: index === 0 ? 0 : 12,
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
              {item.value}
            </Text>
            <Text
              style={{
                color: palette.textTertiary,
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </InsightCard>
  );
}
