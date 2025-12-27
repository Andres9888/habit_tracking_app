/**
 * SecondaryLinks - Browse templates and create custom habit links
 *
 * Features:
 * - Centered row with dot separator
 * - Subtle hover state
 * - Minimal touch targets
 */

import { Pressable, Text, View } from 'react-native';

import { COLORS, COPY, TOUCH_TARGETS } from './constants';
import type { SecondaryLinksProps } from './types';

/**
 * Secondary navigation links for templates and custom creation
 */
export function SecondaryLinks({ onBrowseTemplates, onCreateCustom }: SecondaryLinksProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        marginTop: 24,
      }}
    >
      <Pressable
        accessibilityLabel={COPY.browseTemplates}
        accessibilityRole="button"
        accessibilityHint="Opens habit templates screen"
        onPress={onBrowseTemplates}
        style={({ pressed }) => ({
          paddingVertical: 8,
          paddingHorizontal: 4,
          minHeight: TOUCH_TARGETS.minSize,
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.stone400,
          }}
        >
          {COPY.browseTemplates}
        </Text>
      </Pressable>

      {/* Dot separator */}
      <Text
        style={{
          fontSize: 14,
          color: COLORS.stone300,
        }}
      >
        •
      </Text>

      <Pressable
        accessibilityLabel={COPY.createCustom}
        accessibilityRole="button"
        accessibilityHint="Opens full habit creation screen"
        onPress={onCreateCustom}
        style={({ pressed }) => ({
          paddingVertical: 8,
          paddingHorizontal: 4,
          minHeight: TOUCH_TARGETS.minSize,
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: COLORS.stone400,
          }}
        >
          {COPY.createCustom}
        </Text>
      </Pressable>
    </View>
  );
}
