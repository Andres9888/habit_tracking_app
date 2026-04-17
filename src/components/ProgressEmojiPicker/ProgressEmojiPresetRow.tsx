/**
 * Horizontal scrolling row of preset growth-icon themes.
 */
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { fontWeights, typography } from '../../theme/typography';
import {
  PROGRESS_EMOJI_PRESETS,
  type ProgressEmojiSet,
} from '../../utils/progressEmojis';

interface Props {
  activePresetId: string | null;
  onSelect: (next: ProgressEmojiSet) => void;
}

export function ProgressEmojiPresetRow({ activePresetId, onSelect }: Props) {
  const { colors: themeColors } = useThemeColors();

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{
        gap: 8,
        paddingHorizontal: 4,
        paddingVertical: 4,
      }}
      showsHorizontalScrollIndicator={false}
    >
      {PROGRESS_EMOJI_PRESETS.map((preset) => {
        const isActive = preset.id === activePresetId;
        return (
          <Pressable
            key={preset.id}
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
            onPress={() => onSelect(preset.emojis)}
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
      })}
    </ScrollView>
  );
}
