/** 5-stage progression strip — New → Strong, captions folded under the end tiles. */
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
  position: 'absolute' as const,
  bottom: -16,
};

export function GrowthStagePreview({ emojis, peakIndex = 3 }: Props) {
  const { colors } = useThemeColors();
  const lastIndex = STRENGTH_LEVEL_KEYS.length - 1;
  return (
    <View
      accessibilityLabel='Growth stage progression preview'
      accessibilityRole='image'
      style={{ flexDirection: 'row', gap: 6, marginBottom: 24 }}
    >
      {STRENGTH_LEVEL_KEYS.map((key, i) => {
        const peak = i === peakIndex;
        const isFirst = i === 0;
        const isLast = i === lastIndex;
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
            {isFirst ? (
              <Text
                style={{ ...stageLabel, left: 0, color: colors.text.tertiary }}
              >
                New
              </Text>
            ) : null}
            {isLast ? (
              <Text
                style={{ ...stageLabel, right: 0, color: colors.primary[700] }}
              >
                Strong
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
