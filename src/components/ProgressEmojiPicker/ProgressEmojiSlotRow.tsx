/**
 * Single stage row inside the ProgressEmojiPicker panel.
 * Tap opens the shared EmojiPickerSheet for that slot.
 */
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { fontWeights, typography } from '../../theme/typography';

import type { ProgressEmojiSlotRowProps } from './ProgressEmojiPicker.types';

export function ProgressEmojiSlotRow({
  stageKey,
  stageLabel,
  emoji,
  onPress,
}: ProgressEmojiSlotRowProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <Pressable
      accessibilityHint='Opens emoji picker to change this growth stage'
      accessibilityLabel={`Change ${stageLabel} stage emoji, currently ${emoji}`}
      accessibilityRole='button'
      className='flex-row items-center justify-between rounded-xl px-4 py-3'
      style={{ backgroundColor: themeColors.surface, minHeight: 52 }}
      onPress={() => onPress(stageKey)}
    >
      <View className='flex-row items-center gap-3'>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
        <Text
          style={{
            ...typography.body,
            fontWeight: fontWeights.medium,
            color: themeColors.text.primary,
          }}
        >
          {stageLabel}
        </Text>
      </View>
      <Text
        style={{ ...typography.bodySmall, color: themeColors.text.tertiary }}
      >
        Change
      </Text>
    </Pressable>
  );
}
