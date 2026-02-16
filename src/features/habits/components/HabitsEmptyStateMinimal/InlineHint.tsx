/**
 * InlineHint - Templates bridge and custom habit links
 *
 * Features:
 * - Prominent templates card for better conversion
 * - Secondary custom habit link
 * - Works on all screen sizes (320pt minimum)
 */

import { Pressable, Text, View } from 'react-native';

import { COLORS, COPY } from './constants';
import type { InlineHintProps } from './types';

export function InlineHint({
  onBrowseTemplates,
  onCreateCustom,
}: InlineHintProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
      }}
    >
      {/* Prominent templates card */}
      <Pressable
        accessibilityHint="Opens screen with pre-made habit templates"
        accessibilityLabel="Browse habit templates"
        accessibilityRole="button"
        style={({ pressed }) => ({
          alignItems: 'center',
          backgroundColor: pressed ? COLORS.emerald100 : COLORS.green50,
          borderColor: 'rgba(167, 243, 208, 0.6)',
          borderRadius: 16,
          borderWidth: 1,
          marginBottom: 12,
          opacity: pressed ? 0.9 : 1,
          paddingHorizontal: 20,
          paddingVertical: 14,
          width: '100%',
        })}
        onPress={onBrowseTemplates}
      >
        <Text
          style={{
            color: COLORS.emerald700,
            fontSize: 14,
            fontWeight: '600',
            lineHeight: 20,
            textAlign: 'center',
          }}
        >
          {COPY.browseTemplatesCard}
        </Text>
      </Pressable>

      {/* Secondary custom habit link */}
      <Pressable
        accessibilityHint="Opens full habit creation screen"
        accessibilityLabel="Create custom habit"
        accessibilityRole="button"
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          paddingVertical: 6,
        })}
        onPress={onCreateCustom}
      >
        <Text
          style={{
            color: COLORS.stone500,
            fontSize: 13,
            lineHeight: 18,
            textAlign: 'center',
          }}
        >
          or{' '}
          <Text style={{ color: COLORS.emerald700, fontWeight: '600' }}>
            ✨ create a custom habit
          </Text>
        </Text>
      </Pressable>
    </View>
  );
}
