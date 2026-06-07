/** TierDetailCard — explainer card for the currently selected tier (Option B). */
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useThemeColors } from '@/theme/ThemeContext';
import { Text, View } from 'react-native';
import { TIER_COPY } from './StrengthCurvePicker.copy';
import {
  TIER_DETAIL_DESCRIPTION_LINE_HEIGHT,
  tierDetailChipRowMinHeight,
  tierDetailDescriptionMinHeight,
} from './tierDetailLayout';

export function TierDetailCard({
  mode,
  scale = 1,
}: {
  mode: AlgorithmMode;
  scale?: number;
}) {
  const { colors } = useThemeColors();
  const tier = TIER_COPY[mode];
  const descriptionFontSize = 12 * scale;
  const lineHeight = TIER_DETAIL_DESCRIPTION_LINE_HEIGHT * scale;

  return (
    <View
      className='mx-4 rounded-2xl'
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        marginTop: 8 * scale,
        padding: 14 * scale,
      }}
    >
      <View
        style={{
          justifyContent: 'flex-start',
          minHeight: tierDetailDescriptionMinHeight(scale),
        }}
      >
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: descriptionFontSize,
            lineHeight,
          }}
        >
          {tier.description}
        </Text>
      </View>
      <View
        className='flex-row flex-wrap'
        style={{
          gap: 6 * scale,
          marginTop: 8 * scale,
          minHeight: tierDetailChipRowMinHeight(scale),
        }}
      >
        {tier.exampleChips.map((chip) => (
          <View
            key={chip}
            className='rounded-full'
            style={{
              backgroundColor: colors.gray[100],
              borderColor: colors.border,
              borderWidth: 1,
              paddingHorizontal: 8 * scale,
              paddingVertical: 2 * scale,
            }}
          >
            <Text
              className='font-medium'
              style={{ color: colors.text.secondary, fontSize: 11 * scale }}
            >
              {chip}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
