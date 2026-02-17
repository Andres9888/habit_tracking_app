/**
 * Category Chips Component
 * Horizontal scrollable category filter chips
 */

import { View, ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import type { CategoryFilter } from '../types';

const AnimatedView = Animated.createAnimatedComponent(View);

interface CategoryChipsProps {
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

const CATEGORIES: { id: CategoryFilter; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
  { id: 'productivity', label: 'Productivity', icon: '🚀' },
  { id: 'health', label: 'Health', icon: '❤️' },
];

export function CategoryChips({ selectedCategory, onCategoryChange }: CategoryChipsProps) {
  const colors = useThemeColors();

  return (
    <AnimatedView entering={FadeInDown.delay(50).duration(280)} style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <Pressable
              key={category.id}
              onPress={() => onCategoryChange(category.id)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary[500] : colors.card,
                  borderColor: isSelected ? colors.primary[600] : colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.icon}>{category.icon}</Text>
              <Text
                style={[
                  styles.label,
                  { color: isSelected ? '#FFFFFF' : colors.text.primary },
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
