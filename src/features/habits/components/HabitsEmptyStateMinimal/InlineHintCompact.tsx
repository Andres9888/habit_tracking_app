/**
 * InlineHintCompact - Compact template CTA for keyboard-open state
 */

import { Pressable, Text, View } from 'react-native';

import { COLORS } from './constants';

interface InlineHintCompactProps {
  onBrowseTemplates: () => void;
}

export function InlineHintCompact({
  onBrowseTemplates,
}: InlineHintCompactProps) {
  return (
    <View style={{ alignItems: 'center', marginTop: 8, width: '100%' }}>
      <Pressable
        accessibilityHint='Opens screen with pre-made habit templates'
        accessibilityLabel='Browse templates'
        accessibilityRole='button'
        style={({ pressed }) => ({
          backgroundColor: pressed ? COLORS.emerald700 : '#059669',
          borderRadius: 12,
          opacity: pressed ? 0.9 : 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
        })}
        onPress={onBrowseTemplates}
      >
        <Text
          style={{
            color: '#ffffff',
            fontSize: 15,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          Browse templates
        </Text>
      </Pressable>
    </View>
  );
}
