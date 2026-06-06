/** Compact strength tier picker inside AdvancedSheet. */
import { Pressable, Text, View } from 'react-native';
import { ALGORITHM_ORDER } from '@/components/AlgorithmPicker';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { TierPickerTile } from '@/screens/StrengthCurvePicker/TierPickerTile';
import { MODE_STYLES } from '@/screens/StrengthCurvePicker/strengthCurveModeStyles';
import { TIER_COPY } from '@/screens/StrengthCurvePicker/StrengthCurvePicker.copy';

interface Props {
  selected: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
  onLearnMore: () => void;
}

export function StrengthCurveSheetBody({
  selected,
  onSelect,
  onLearnMore,
}: Props) {
  const { colors } = useThemeColors();
  const tier = TIER_COPY[selected];

  return (
    <View>
      <View className='flex-row' style={{ gap: 10 }}>
        {ALGORITHM_ORDER.map((mode) => (
          <View key={mode} className='flex-1'>
            <TierPickerTile
              isSelected={mode === selected}
              mode={mode}
              style={MODE_STYLES[mode]}
              tier={TIER_COPY[mode]}
              onSelect={onSelect}
            />
          </View>
        ))}
      </View>
      <Text
        style={{
          ...typography.caption,
          color: colors.text.secondary,
          lineHeight: 18,
          marginTop: 14,
        }}
      >
        {tier.description}
      </Text>
      <Pressable
        accessibilityHint='Opens detailed strength curve visualization'
        accessibilityLabel='See how strength builds'
        accessibilityRole='button'
        hitSlop={8}
        onPress={onLearnMore}
      >
        <Text
          style={{
            ...typography.bodySmall,
            color: colors.primary[600],
            fontWeight: fontWeights.semibold,
            marginTop: 16,
            textDecorationLine: 'underline',
          }}
        >
          See how strength builds
        </Text>
      </Pressable>
    </View>
  );
}
