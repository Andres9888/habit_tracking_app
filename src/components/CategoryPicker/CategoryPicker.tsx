/**
 * CategoryPicker — horizontal scrollable category selector for habit create/edit.
 *
 * Displays default categories as tappable chips. Selecting a category assigns
 * it to the habit for filtering on the main list.
 *
 * Design: follows design system (16px border radius, springify().damping(18))
 */

import { memo, useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { DEFAULT_HABIT_CATEGORIES } from '../../constants/habitCategories';
import type { HabitCategoryDef } from '../../constants/habitCategories';

interface CategoryPickerProps {
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
  isPremium?: boolean;
}

function CategoryPickerComponent({
  selectedCategory,
  onSelect,
}: CategoryPickerProps) {
  const { colors, isDark } = useThemeColors();

  const handlePress = useCallback(
    (categoryId: string) => {
      // Toggle: tap again to deselect
      onSelect(selectedCategory === categoryId ? null : categoryId);
    },
    [selectedCategory, onSelect]
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(160).springify().damping(18)}
      style={{ marginBottom: 24 }}
    >
      <Text
        style={{
          color: colors.text.tertiary,
          fontSize: 13,
          fontWeight: '600',
          letterSpacing: 1,
          marginBottom: 12,
          textAlign: 'center',
        }}
      >
        CATEGORY
      </Text>
      <ScrollView
        horizontal
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 4,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {DEFAULT_HABIT_CATEGORIES.map((cat: HabitCategoryDef) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              accessibilityLabel={`Category: ${cat.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => handlePress(cat.id)}
              style={{
                alignItems: 'center',
                backgroundColor: isSelected
                  ? isDark
                    ? `${cat.color}30`
                    : `${cat.color}18`
                  : isDark
                    ? colors.card
                    : colors.gray[50],
                borderColor: isSelected ? cat.color : 'transparent',
                borderRadius: 12,
                borderWidth: 1.5,
                flexDirection: 'row',
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 10,
              }}
            >
              <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
              <Text
                style={{
                  color: isSelected ? cat.color : colors.text.secondary,
                  fontSize: 13,
                  fontWeight: isSelected ? '600' : '500',
                }}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

export const CategoryPicker = memo(CategoryPickerComponent);
export default CategoryPicker;
