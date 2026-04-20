/**
 * Single pill chip used by ProgressEmojiPresetRow.
 */
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { fontWeights, typography } from '../../theme/typography';
import type { ProgressEmojiPreset } from '../../utils/progressEmojis';

interface Props {
  preset: ProgressEmojiPreset;
  isActive: boolean;
  onPress: () => void;
}

export function ProgressEmojiPresetChip({ preset, isActive, onPress }: Props) {
  const { colors: themeColors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={`Apply ${preset.label} preset`}
      accessibilityRole='button'
      accessibilityState={{ selected: isActive }}
      className='rounded-2xl px-3 py-2'
      style={{
        backgroundColor: isActive
          ? themeColors.primary[500]
          : themeColors.surface,
        borderWidth: 1,
        borderColor: isActive
          ? themeColors.primary[500]
          : themeColors.cardBorder,
      }}
      onPress={onPress}
    >
      <View className='flex-row items-center gap-2'>
        <Text style={{ fontSize: 16 }}>
          {preset.emojis.starting}
          {preset.emojis.developing}
          {preset.emojis.automatic}
        </Text>
        <Text
          style={{
            ...typography.caption,
            fontWeight: fontWeights.semibold,
            color: isActive
              ? themeColors.text.inverse
              : themeColors.text.primary,
          }}
        >
          {preset.label}
        </Text>
      </View>
    </Pressable>
  );
}
