/* eslint-disable max-lines */

/**
 * InlineHint - Template discovery section with featured category chips
 *
 * Features:
 * - Featured template category chips for quick discovery
 * - Two prominent full-width CTAs: Browse templates (primary) + Create your own (secondary)
 * - "or explore" divider below the CTAs
 * - Works on all screen sizes (320pt minimum)
 * - Compact mode when keyboard is visible
 * - Violet theme for template-related UI (consistent with header icon)
 */

import { Pressable, Text, View } from 'react-native';

import { COLORS } from './constants';
import { InlineHintCompact } from './InlineHintCompact';
import type { InlineHintProps } from './types';

const FEATURED_CATEGORIES = [
  { emoji: '🌅', label: 'Morning' },
  { emoji: '💪', label: 'Health' },
  { emoji: '🧠', label: 'Mindful' },
];

/**
 * Category chip pressable for featured categories
 */
function CategoryChip({
  category,
  onPress,
}: {
  category: (typeof FEATURED_CATEGORIES)[0];
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`${category.label} templates`}
      accessibilityRole='button'
      style={({ pressed }) => ({
        backgroundColor: pressed
          ? 'rgba(139, 92, 246, 0.15)'
          : 'rgba(139, 92, 246, 0.08)',
        borderColor: 'rgba(139, 92, 246, 0.25)',
        borderRadius: 9999,
        borderWidth: 1,
        opacity: pressed ? 0.9 : 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
      })}
      onPress={onPress}
    >
      <Text
        style={{
          color: '#7c3aed',
          fontSize: 13,
          fontWeight: '500',
        }}
      >
        {category.emoji} {category.label}
      </Text>
    </Pressable>
  );
}

/**
 * Browse templates primary button
 */
function BrowseTemplatesButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityHint='Opens screen with pre-made habit templates'
      accessibilityLabel='Browse templates'
      accessibilityRole='button'
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#6d28d9' : '#7c3aed',
        borderRadius: 12,
        elevation: 4,
        opacity: pressed ? 0.9 : 1,
        paddingVertical: 14,
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        width: '100%',
      })}
      onPress={onPress}
    >
      <Text
        style={{
          color: '#ffffff',
          fontSize: 17,
          fontWeight: '600',
          letterSpacing: 0.2,
          textAlign: 'center',
        }}
      >
        Browse templates
      </Text>
    </Pressable>
  );
}

/**
 * Create your own secondary button
 */
function CreateCustomButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityHint='Opens full habit creation screen'
      accessibilityLabel='Create your own'
      accessibilityRole='button'
      style={({ pressed }) => ({
        backgroundColor: pressed ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
        borderColor: '#7c3aed',
        borderRadius: 12,
        borderWidth: 1.5,
        marginTop: 10,
        opacity: pressed ? 0.9 : 1,
        paddingVertical: 14,
        width: '100%',
      })}
      onPress={onPress}
    >
      <Text
        style={{
          color: '#7c3aed',
          fontSize: 17,
          fontWeight: '600',
          letterSpacing: 0.2,
          textAlign: 'center',
        }}
      >
        Create your own
      </Text>
    </Pressable>
  );
}

/**
 * Compact mode view with single Browse templates button
 */
function CompactView({ onBrowseTemplates }: { onBrowseTemplates: () => void }) {
  return (
    <View style={{ alignItems: 'center', marginTop: 8, width: '100%' }}>
      <Pressable
        accessibilityHint='Opens screen with pre-made habit templates'
        accessibilityLabel='Browse templates'
        accessibilityRole='button'
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#6d28d9' : '#7c3aed',
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

/**
 * Featured category chips row
 */
function CategoryChipsRow({
  onBrowseTemplates,
}: {
  onBrowseTemplates: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        marginBottom: 14,
      }}
    >
      {FEATURED_CATEGORIES.map((cat) => (
        <CategoryChip
          key={cat.label}
          category={cat}
          onPress={onBrowseTemplates}
        />
      ))}
    </View>
  );
}

/**
 * Divider text
 */
function Divider() {
  return (
    <Text
      style={{
        color: COLORS.stone500,
        fontSize: 13,
        lineHeight: 18,
        marginTop: 16,
        textAlign: 'center',
      }}
    >
      or type a habit above to get started
    </Text>
  );
}

/**
 * Template discovery section with category chips and dual CTAs
 */
export function InlineHint({
  compact = false,
  onBrowseTemplates,
  onCreateCustom,
}: InlineHintProps) {
  if (compact) {
    return <CompactView onBrowseTemplates={onBrowseTemplates} />;
  }

  return (
    <View
      style={{
        alignItems: 'center',
        marginTop: 16,
        width: '100%',
      }}
    >
      <CategoryChipsRow onBrowseTemplates={onBrowseTemplates} />

      <View style={{ maxWidth: 343, width: '100%' }}>
        <BrowseTemplatesButton onPress={onBrowseTemplates} />
        <CreateCustomButton onPress={onCreateCustom} />
      </View>

      <Divider />
    </View>
  );
}
