/** 5-stage progression strip — New → Strong. */
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import {
  STRENGTH_LEVEL_KEYS,
  type ProgressEmojiSet,
} from '@/utils/progressEmojis';
import { chipMicroLabel } from './chipTextStyles';

interface Props {
  emojis: ProgressEmojiSet;
  peakIndex?: number;
}

const stageLabel = {
  ...chipMicroLabel,
  textTransform: 'uppercase' as const,
};

export function GrowthStagePreview({ emojis, peakIndex = 3 }: Props) {
  const { colors } = useThemeColors();
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 2,
          marginBottom: 8,
        }}
      >
        <Text style={{ ...stageLabel, color: colors.text.tertiary }}>New</Text>
        <Text style={{ ...stageLabel, color: colors.primary[700] }}>
          Strong
        </Text>
      </View>
      <View
        accessibilityLabel='Growth stage progression preview'
        accessibilityRole='image'
        style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}
      >
        {STRENGTH_LEVEL_KEYS.map((key, i) => {
          const peak = i === peakIndex;
          return (
            <View
              key={key}
              style={{
                flex: 1,
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 14,
                backgroundColor: peak ? colors.primary[100] : colors.card,
                borderWidth: peak ? 2 : 1,
                borderColor: peak ? colors.primary[500] : colors.cardBorder,
              }}
            >
              <Text style={{ fontSize: 20 }}>{emojis[key]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
