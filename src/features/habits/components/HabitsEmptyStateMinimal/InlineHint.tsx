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
import { COLORS } from './constants';

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
          color: COLORS.stone600,
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
            backgroundColor: pressed
              ? COLORS.emerald100
              : 'rgba(209, 250, 229, 0.5)',
            borderColor: 'rgba(167, 243, 208, 0.8)',
            borderRadius: 9999,
            borderWidth: 1,
            opacity: pressed ? 0.9 : 1,
            paddingHorizontal: 12,
            paddingVertical: 6,
          })}
          onPress={onBrowseTemplates}
        >
          <Text
            style={{
              color: COLORS.emerald700,
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
            backgroundColor: pressed
              ? COLORS.emerald100
              : 'rgba(209, 250, 229, 0.5)',
            borderColor: 'rgba(167, 243, 208, 0.8)',
            borderRadius: 9999,
            borderWidth: 1,
            opacity: pressed ? 0.9 : 1,
            paddingHorizontal: 12,
            paddingVertical: 6,
          })}
          onPress={onCreateCustom}
        >
          <Text
            style={{
              color: COLORS.emerald700,
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
