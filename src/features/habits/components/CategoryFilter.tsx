import { memo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getAllCategories } from '../../../constants/habitCategories';
import type { HabitCategoryDef } from '../../../constants/habitCategories';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

/**
 * Category filter for habits list - horizontal scrollable filter chips
 * Includes "All" option to show all habits
 */
const CategoryFilterComponent = ({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  const { colors } = useThemeColors();
  const categories = getAllCategories();

  return (
    <View style={{ marginBottom: 16, marginTop: 8 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 4 }}
      >
        {categories.map((category: HabitCategoryDef) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              accessible
              accessibilityHint={`Filter habits by ${category.name}`}
              accessibilityLabel={`${category.icon} ${category.name}`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              activeOpacity={0.7}
              style={{
                alignItems: 'center',
                backgroundColor: isSelected
                  ? colors.primary[600]
                  : colors.card,
                borderColor: isSelected ? colors.primary[600] : colors.border,
                borderRadius: 20,
                borderWidth: 2,
                flexDirection: 'row',
                marginRight: 10,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
              onPress={() => onSelectCategory(category.id)}
            >
              <Text style={{ fontSize: 18, marginRight: 6 }}>
                {category.icon}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  color: isSelected
                    ? '#FFFFFF'
                    : colors.text.primary,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export const CategoryFilter = memo(CategoryFilterComponent);
