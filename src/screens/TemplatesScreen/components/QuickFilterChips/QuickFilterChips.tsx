/**
 * QuickFilterChips — horizontally scrollable category filter pills
 *
 * Renders "✨ All" + curated category chips for one-tap filtering.
 * Active chip uses primary green; inactive uses warm stone surface.
 */

import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../../../../theme/colors';
import { shadows } from '../../../../theme/spacing';

export interface ChipCategory {
  icon: string;
  id: string;
  label: string;
}

interface QuickFilterChipsProps {
  activeCategory: string | null;
  categories: ChipCategory[];
  onSelectCategory: (categoryId: string | null) => void;
}

/** Curated subset of CATEGORY_META with shortened labels for chip display */
export const CHIP_CATEGORIES: ChipCategory[] = [
  { icon: '🌅', id: 'morning_routine', label: 'Morning' },
  { icon: '🧠', id: 'mental_health', label: 'Mental' },
  { icon: '💪', id: 'health_fitness', label: 'Fitness' },
  { icon: '😴', id: 'sleep', label: 'Sleep' },
  { icon: '🧘', id: 'mindfulness', label: 'Mindful' },
  { icon: '📚', id: 'learning', label: 'Learning' },
  { icon: '💰', id: 'financial', label: 'Finance' },
];

function Chip({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ selected: active }}
      style={[s.chip, active ? s.chipActive : s.chipInactive]}
      onPress={onPress}
    >
      <Text style={[s.chipText, active ? s.textActive : s.textInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function QuickFilterChips({
  activeCategory,
  categories,
  onSelectCategory,
}: QuickFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
    >
      <Chip
        active={activeCategory === null}
        label='✨ All'
        onPress={() => onSelectCategory(null)}
      />
      {categories.map((cat) => (
        <Chip
          key={cat.id}
          active={activeCategory === cat.id}
          label={`${cat.icon} ${cat.label}`}
          onPress={() => onSelectCategory(cat.id)}
        />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  chip: {
    ...shadows.card,
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[700],
  },
  chipInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
  },
  chipText: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  row: { gap: 8, paddingHorizontal: 16 },
  textActive: { color: '#FFFFFF' },
  textInactive: { color: colors.text.secondary },
});
