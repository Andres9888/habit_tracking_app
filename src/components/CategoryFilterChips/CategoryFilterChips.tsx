/**
 * CategoryFilterChips — horizontal filter bar for the habits list.
 *
 * Renders "All" + each default category as scrollable chips.
 * Tapping a chip filters the habit list to only show habits in that category.
 * Uncategorized habits appear under "All" only.
 *
 * Design: 12px border radius buttons, springify().damping(18), 60ms stagger
 */

import { memo, useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { CATEGORY_FILTER_OPTIONS } from '../../constants/habitCategories';

interface CategoryFilterChipsProps {
  selectedFilter: string;
  onFilterChange: (categoryId: string) => void;
  /** Category counts: { health: 3, fitness: 2, ... } */
  categoryCounts?: Record<string, number>;
}

function CategoryFilterChipsComponent({
  selectedFilter,
  onFilterChange,
  categoryCounts,
}: CategoryFilterChipsProps) {
  const { colors, isDark } = useThemeColors();

  const handlePress = useCallback(
    (id: string) => {
      onFilterChange(id);
    },
    [onFilterChange]
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(60).springify().damping(18)}
      style={{ marginBottom: 8, marginTop: 4 }}
    >
      <ScrollView
        horizontal
        contentContainerStyle={{
          gap: 6,
          paddingHorizontal: 4,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {CATEGORY_FILTER_OPTIONS.map((option) => {
          const isSelected = selectedFilter === option.id;
          const count =
            option.id === 'all' ? undefined : categoryCounts?.[option.id];

          return (
            <Pressable
              key={option.id}
              accessibilityLabel={`Filter by ${option.label}${count != null ? `, ${count} habits` : ''}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => handlePress(option.id)}
              style={{
                alignItems: 'center',
                backgroundColor: isSelected
                  ? isDark
                    ? '#047857'
                    : '#059669'
                  : isDark
                    ? colors.card
                    : colors.gray[50],
                borderColor: isSelected
                  ? isDark
                    ? '#059669'
                    : '#047857'
                  : colors.border,
                borderRadius: 12,
                borderWidth: 1,
                flexDirection: 'row',
                gap: 4,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Text style={{ fontSize: 14 }}>{option.icon}</Text>
              <Text
                style={{
                  color: isSelected ? '#ffffff' : colors.text.secondary,
                  fontSize: 13,
                  fontWeight: isSelected ? '600' : '500',
                }}
              >
                {option.label}
              </Text>
              {count != null && count > 0 && (
                <View
                  style={{
                    backgroundColor: isSelected
                      ? 'rgba(255,255,255,0.25)'
                      : isDark
                        ? colors.gray[50]
                        : '#e7e5e4',
                    borderRadius: 8,
                    minWidth: 20,
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? '#ffffff' : colors.text.tertiary,
                      fontSize: 11,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

export const CategoryFilterChips = memo(CategoryFilterChipsComponent);
export default CategoryFilterChips;
