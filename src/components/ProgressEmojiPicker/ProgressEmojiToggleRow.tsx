/**
 * Always-visible preview for the ProgressEmojiPicker: the 5 growth glyphs
 * spread evenly across the row. Tapping toggles the customization panel; the
 * Customize/Done action lives on the parent settings label row (see SPEC_05).
 */
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { STRENGTH_LEVEL_KEYS } from '../../utils/progressEmojis';

import type { ProgressEmojiToggleRowProps } from './ProgressEmojiPicker.types';

export function ProgressEmojiToggleRow({
  resolved,
  expanded,
  onToggle,
  toggleRowStyle,
}: ProgressEmojiToggleRowProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <Pressable
      accessibilityHint='Toggle growth icon customization panel'
      accessibilityLabel='Growth icons'
      accessibilityRole='button'
      accessibilityState={{ expanded }}
      hitSlop={8}
      style={[
        { flexDirection: 'row', gap: 10, paddingTop: 8, paddingBottom: 8 },
        toggleRowStyle,
      ]}
      onPress={onToggle}
    >
      {STRENGTH_LEVEL_KEYS.map((k) => (
        <View
          key={k}
          style={{
            flex: 1,
            maxWidth: 56,
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: themeColors.gray[50],
            borderColor: themeColors.border,
            borderWidth: 1,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 20, lineHeight: 24 }}>{resolved[k]}</Text>
        </View>
      ))}
    </Pressable>
  );
}
