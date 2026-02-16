/**
 * InlineHint - Vertical stack with navigation buttons
 *
 * Features:
 * - Vertical layout that never overflows horizontally
 * - Two pill buttons side-by-side below "or explore" text
 * - Works on all screen sizes (320pt minimum)
 */

import { Pressable, Text, View } from 'react-native';

import type { InlineHintProps } from './types';
import { useEmptyStateColors } from './useEmptyStateColors';

/**
 * Hint section with navigation links in a vertical stack layout
 *
 * Layout:
 *   "or explore"
 *   [📋 templates]  [✨ custom]
 */
export function InlineHint({
  onBrowseTemplates,
  onCreateCustom,
}: InlineHintProps) {
  const colors = useEmptyStateColors();
  return (
    <View
      style={{
        alignItems: 'center',
        marginTop: 16,
        width: '100%',
      }}
    >
      {/* Row 1: "or explore" text */}
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 13,
          lineHeight: 18,
          marginBottom: 10,
          textAlign: 'center',
        }}
      >
        or explore
      </Text>

      {/* Row 2: Buttons side-by-side with gap */}
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          justifyContent: 'center',
        }}
      >
        <Pressable
          accessibilityHint='Opens screen with pre-made habit templates'
          accessibilityLabel='Browse habit templates'
          accessibilityRole='button'
          style={({ pressed }) => ({
            alignItems: 'center',
            backgroundColor: pressed
              ? colors.linkBackgroundPressed
              : colors.linkBackground,
            borderColor: colors.linkBorder,
            borderRadius: 9999,
            borderWidth: 1,
            justifyContent: 'center',
            minHeight: 44,
            opacity: pressed ? 0.9 : 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
          })}
          onPress={onBrowseTemplates}
        >
          <Text
            style={{
              color: colors.linkText,
              fontSize: 13,
              fontWeight: '600',
              lineHeight: 18,
            }}
          >
            📋 templates
          </Text>
        </Pressable>

        <Pressable
          accessibilityHint='Opens full habit creation screen'
          accessibilityLabel='Create custom habit'
          accessibilityRole='button'
          style={({ pressed }) => ({
            alignItems: 'center',
            backgroundColor: pressed
              ? colors.linkBackgroundPressed
              : colors.linkBackground,
            borderColor: colors.linkBorder,
            borderRadius: 9999,
            borderWidth: 1,
            justifyContent: 'center',
            minHeight: 44,
            opacity: pressed ? 0.9 : 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
          })}
          onPress={onCreateCustom}
        >
          <Text
            style={{
              color: colors.linkText,
              fontSize: 13,
              fontWeight: '600',
              lineHeight: 18,
            }}
          >
            ✨ custom habit
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
