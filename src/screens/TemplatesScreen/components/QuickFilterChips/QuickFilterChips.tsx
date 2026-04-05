/**
 * QuickFilterChips — horizontally scrollable category filter pills
 *
 * Renders "All" + curated category chips for one-tap filtering.
 * Active chip uses primary green; inactive uses warm stone surface.
 */

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';
import { fontWeights } from '@/theme/typography';

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
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ selected: active }}
      style={[
        s.chip,
        {
          backgroundColor: active ? colors.primary[600] : colors.card,
          borderColor: active ? colors.primary[700] : colors.border,
        },
      ]}
      onPress={() => {
        void triggerHaptic('selection');
        onPress();
      }}
    >
      <Text
        style={[
          s.chipText,
          { color: active ? colors.text.inverse : colors.text.secondary },
        ]}
      >
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
  const { colors, isDark } = useThemeColors();
  const fadeBg = isDark ? 'rgba(17,24,39,1)' : 'rgba(250,250,248,1)';
  const fadeTransparent = isDark
    ? 'rgba(17,24,39,0)'
    : 'rgba(250,250,248,0)';

  return (
    <View style={s.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.container}
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
      <LinearGradient
        colors={[fadeTransparent, fadeBg]}
        end={{ x: 1, y: 0 }}
        pointerEvents='none'
        start={{ x: 0, y: 0 }}
        style={s.fade}
      />
    </View>
  );
}

const s = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipText: { fontSize: 13, fontWeight: fontWeights.semibold, lineHeight: 16 },
  container: {
    minHeight: 44,
  },
  fade: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 32,
  },
  row: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingRight: 40,
    paddingVertical: 4,
  },
  wrapper: {
    position: 'relative',
  },
});
