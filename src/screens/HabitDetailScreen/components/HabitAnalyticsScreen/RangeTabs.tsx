import { Pressable, Text, View } from 'react-native';
import { fontWeights } from '../../../../theme/typography';
import { useThemeColors } from '../../../../theme';
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
        backgroundColor: active ? palette.card : 'transparent',
        borderRadius: 10,
        flex: 1,
        height: 42,
        justifyContent: 'center',
        shadowColor: active ? '#3A3024' : 'transparent',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: active ? 0.12 : 0,
        shadowRadius: 2,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: active ? palette.textPrimary : palette.textSecondary,
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
  const { isDark } = useThemeColors();
  const palette = useInsightPalette();

  return (
    <View
      accessibilityRole='tablist'
      style={{
        backgroundColor: isDark ? palette.greenTint : '#E9E3DA',
        borderRadius: 13,
        flexDirection: 'row',
        gap: 3,
        padding: 3,
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
