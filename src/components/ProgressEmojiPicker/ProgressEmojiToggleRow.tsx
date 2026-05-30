/**
 * Always-visible header for the ProgressEmojiPicker: the 5 preview glyphs plus
 * a Customize/Done action. Both control the panel's expanded state.
 */
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { fontWeights, typography } from '../../theme/typography';
import { STRENGTH_LEVEL_KEYS } from '../../utils/progressEmojis';

import type { ProgressEmojiToggleRowProps } from './ProgressEmojiPicker.types';

export function ProgressEmojiToggleRow({
  resolved,
  expanded,
  onToggle,
  toggleRowStyle,
  label,
}: ProgressEmojiToggleRowProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <>
      {label ? (
        <Text
          className='mb-3 text-center uppercase'
          style={{
            ...typography.caption,
            fontWeight: fontWeights.semibold,
            letterSpacing: 0.5,
            color: themeColors.text.tertiary,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        className='flex-row items-center justify-between py-2'
        style={toggleRowStyle}
      >
      <Pressable
        accessibilityHint='Toggle growth icon customization panel'
        accessibilityLabel='Growth icons'
        accessibilityRole='button'
        accessibilityState={{ expanded }}
        className='flex-row items-center gap-1'
        onPress={onToggle}
      >
        {STRENGTH_LEVEL_KEYS.map((k) => (
          <Text key={k} style={{ fontSize: 22 }}>
            {resolved[k]}
          </Text>
        ))}
      </Pressable>
      <Pressable
        accessibilityLabel={expanded ? 'Collapse picker' : 'Customize growth icons'}
        accessibilityRole='button'
        hitSlop={8}
        onPress={onToggle}
      >
        <Text
          style={{
            ...typography.bodySmall,
            color: themeColors.primary[600],
            fontWeight: fontWeights.semibold,
          }}
        >
          {expanded ? 'Done' : 'Customize'}
        </Text>
      </Pressable>
      </View>
    </>
  );
}
