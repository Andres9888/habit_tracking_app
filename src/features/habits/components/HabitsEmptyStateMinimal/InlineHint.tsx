/** InlineHint - Template discovery with category chips and dual CTAs */
import { Pressable, Text, View } from 'react-native';

import { COLORS } from './constants';
import { InlineHintCompact } from './InlineHintCompact';
import type { InlineHintProps } from './types';

const CATEGORIES = [
  { emoji: '🌅', label: 'Morning' },
  { emoji: '💪', label: 'Health' },
  { emoji: '🧠', label: 'Mindful' },
];

const CTA_STYLE = { maxWidth: 343, width: '100%' as const };
const CHIP_TEXT = {
  color: COLORS.emerald700,
  fontSize: 13,
  fontWeight: '500' as const,
};
const BTN_TEXT = {
  color: '#fff',
  fontSize: 17,
  fontWeight: '600' as const,
  textAlign: 'center' as const,
};
const OUTLINE_BTN_TEXT = { ...BTN_TEXT, color: '#059669' };
const HINT_TEXT = { color: COLORS.stone500, fontSize: 13, marginTop: 16 };

const chipStyle = (pressed: boolean) => ({
  backgroundColor: pressed ? 'rgba(209,250,229,0.8)' : 'rgba(209,250,229,0.4)',
  borderColor: 'rgba(167,243,208,0.6)',
  borderRadius: 9999,
  borderWidth: 1,
  paddingHorizontal: 12,
  paddingVertical: 6,
});

const browseStyle = (pressed: boolean) => ({
  backgroundColor: pressed ? COLORS.emerald700 : '#059669',
  borderRadius: 12,
  paddingVertical: 14,
});

const outlineStyle = (pressed: boolean) => ({
  backgroundColor: pressed ? 'rgba(209,250,229,0.6)' : 'transparent',
  borderColor: '#059669',
  borderRadius: 12,
  borderWidth: 1.5,
  marginTop: 10,
  paddingVertical: 14,
});

export function InlineHint({
  compact = false,
  onBrowseTemplates,
  onCreateCustom,
}: InlineHintProps) {
  if (compact)
    return <InlineHintCompact onBrowseTemplates={onBrowseTemplates} />;

  return (
    <View style={{ alignItems: 'center', marginTop: 16, width: '100%' }}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.label}
            accessibilityLabel={`${c.label} templates`}
            accessibilityRole='button'
            style={({ pressed }) => chipStyle(pressed)}
            onPress={onBrowseTemplates}
          >
            <Text style={CHIP_TEXT}>
              {c.emoji} {c.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={CTA_STYLE}>
        <Pressable
          accessibilityLabel='Browse templates'
          accessibilityRole='button'
          style={({ pressed }) => browseStyle(pressed)}
          onPress={onBrowseTemplates}
        >
          <Text style={BTN_TEXT}>Browse templates</Text>
        </Pressable>
        <Pressable
          accessibilityLabel='Create your own'
          accessibilityRole='button'
          style={({ pressed }) => outlineStyle(pressed)}
          onPress={onCreateCustom}
        >
          <Text style={OUTLINE_BTN_TEXT}>Create your own</Text>
        </Pressable>
      </View>
      <Text style={HINT_TEXT}>or type a habit above to get started</Text>
    </View>
  );
}
