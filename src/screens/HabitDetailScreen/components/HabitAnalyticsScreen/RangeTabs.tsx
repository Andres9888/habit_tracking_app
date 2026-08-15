import { Pressable, Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import { useInsightPalette } from '../../insightPalette';

export type ChartRange = 'monthly' | 'weekly';

interface RangeTabsProps {
  range: ChartRange;
  onChange: (range: ChartRange) => void;
}

function Tab({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  const palette = useInsightPalette();

  return (
    <Pressable
      accessibilityRole='tab'
      accessibilityState={{ selected: active }}
      style={{
        backgroundColor: active ? palette.greenTint : 'transparent',
        borderRadius: borderRadius.full,
        flex: 1,
        minHeight: 40,
        justifyContent: 'center',
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: active ? palette.ctaGreen : palette.textSecondary,
          fontSize: 14,
          fontWeight: fontWeights.semibold,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function RangeTabs({ onChange, range }: RangeTabsProps) {
  const palette = useInsightPalette();

  return (
    <View
      accessibilityRole='tablist'
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        flexDirection: 'row',
        padding: 4,
      }}
    >
      <Tab
        active={range === 'weekly'}
        label='Weekly'
        onPress={() => onChange('weekly')}
      />
      <Tab
        active={range === 'monthly'}
        label='Monthly'
        onPress={() => onChange('monthly')}
      />
    </View>
  );
}
