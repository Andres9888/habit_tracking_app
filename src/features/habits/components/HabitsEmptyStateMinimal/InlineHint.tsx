/**
 * InlineHint - Inline text with embedded link pressables
 *
 * Features:
 * - Natural sentence flow: "or explore X and Y"
 * - Inline pressable links with proper touch targets
 * - Improved contrast and font size
 */

import { Pressable, Text, View } from 'react-native';

import { COLORS } from './constants';
import type { InlineHintProps } from './types';

/**
 * Inline hint with embedded navigation links
 *
 * Displays: "or explore [templates] and [custom options]"
 * where the bracketed words are pressable links
 */
export function InlineHint({
  onBrowseTemplates,
  onCreateCustom,
}: InlineHintProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
      }}
    >
      <Text
        style={{
          color: COLORS.stone600,
          fontSize: 14,
          lineHeight: 21,
          textAlign: 'center',
        }}
      >
        or explore{' '}
      </Text>

      <Pressable
        accessibilityHint='Opens screen with pre-made habit templates'
        accessibilityLabel='Browse habit templates'
        accessibilityRole='button'
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          paddingHorizontal: 6,
          paddingVertical: 6,
        })}
        onPress={onBrowseTemplates}
      >
        <Text
          style={{
            color: COLORS.emerald700,
            fontSize: 14,
            fontWeight: '600',
            lineHeight: 21,
          }}
        >
          templates
        </Text>
      </Pressable>

      <Text
        style={{
          color: COLORS.stone600,
          fontSize: 14,
          lineHeight: 21,
          textAlign: 'center',
        }}
      >
        {' '}
        and{' '}
      </Text>

      <Pressable
        accessibilityHint='Opens full habit creation screen'
        accessibilityLabel='Create custom habit'
        accessibilityRole='button'
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          paddingHorizontal: 6,
          paddingVertical: 6,
        })}
        onPress={onCreateCustom}
      >
        <Text
          style={{
            color: COLORS.emerald700,
            fontSize: 14,
            fontWeight: '600',
            lineHeight: 21,
          }}
        >
          custom options
        </Text>
      </Pressable>
    </View>
  );
}
