/**
 * InlineHint - Template discovery with category chips and dual CTAs
 */

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

// eslint-disable-next-line max-lines-per-function
export function InlineHint({
  compact = false,
  onBrowseTemplates,
  onCreateCustom,
}: InlineHintProps) {
  if (compact) {
    return <InlineHintCompact onBrowseTemplates={onBrowseTemplates} />;
  }

  return (
    <View style={{ alignItems: 'center', marginTop: 16, width: '100%' }}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.label}
            accessibilityLabel={`${c.label} templates`}
            accessibilityRole='button'
            style={({ pressed }) => ({
              backgroundColor: pressed
                ? 'rgba(209,250,229,0.8)'
                : 'rgba(209,250,229,0.4)',
              borderColor: 'rgba(167,243,208,0.6)',
              borderRadius: 9999,
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 6,
            })}
            onPress={onBrowseTemplates}
          >
            <Text
              style={{
                color: COLORS.emerald700,
                fontSize: 13,
                fontWeight: '500',
              }}
            >
              {c.emoji} {c.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={CTA_STYLE}>
        <Pressable
          accessibilityLabel='Browse templates'
          accessibilityRole='button'
          style={({ pressed }) => ({
            backgroundColor: pressed ? COLORS.emerald700 : '#059669',
            borderRadius: 12,
            paddingVertical: 14,
          })}
          onPress={onBrowseTemplates}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 17,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Browse templates
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel='Create your own'
          accessibilityRole='button'
          style={({ pressed }) => ({
            backgroundColor: pressed ? 'rgba(209,250,229,0.6)' : 'transparent',
            borderColor: '#059669',
            borderRadius: 12,
            borderWidth: 1.5,
            marginTop: 10,
            paddingVertical: 14,
          })}
          onPress={onCreateCustom}
        >
          <Text
            style={{
              color: '#059669',
              fontSize: 17,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Create your own
          </Text>
        </Pressable>
      </View>
      <Text style={{ color: COLORS.stone500, fontSize: 13, marginTop: 16 }}>
        or type a habit above to get started
      </Text>
    </View>
  );
}
