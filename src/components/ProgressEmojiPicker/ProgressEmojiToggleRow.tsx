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
          className='flex-row items-center'
          style={{ gap: 8 }}
          onPress={onToggle}
        >
          {STRENGTH_LEVEL_KEYS.map((k) => (
            <View
              key={k}
              className='items-center justify-center'
              style={{
                backgroundColor: themeColors.gray[50],
                borderColor: themeColors.border,
                borderRadius: 12,
                borderWidth: 1,
                height: 34,
                width: 34,
              }}
            >
              <Text style={{ fontSize: 18, lineHeight: 22 }}>
                {resolved[k]}
              </Text>
            </View>
          ))}
        </Pressable>
        <Pressable
          accessibilityLabel={
            expanded ? 'Collapse picker' : 'Customize growth icons'
          }
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
