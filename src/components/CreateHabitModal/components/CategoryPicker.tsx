import { memo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { DEFAULT_HABIT_CATEGORIES } from '../../../constants/habitCategories';
import type { HabitCategoryDef } from '../../../constants/habitCategories';

interface CategoryPickerProps {
  selectedCategory?: string;
  onSelectCategory: (categoryId: string | undefined) => void;
  hideLabel?: boolean;
}

/**
 * Category picker for habits - allows selecting one of the default categories
 * Premium users can create custom categories (future feature)
 */
const CategoryPickerComponent = ({
  selectedCategory,
  onSelectCategory,
  hideLabel = false,
}: CategoryPickerProps) => {
  const { colors } = useThemeColors();

  const handleCategoryPress = (categoryId: string) => {
    // Toggle: if already selected, deselect
    if (selectedCategory === categoryId) {
      onSelectCategory(undefined);
    } else {
      onSelectCategory(categoryId);
    }
  };

  return (
    <View style={{ marginBottom: 32 }}>
      {!hideLabel && (
        <Text
          className='mb-4 text-base font-semibold'
          style={{ color: colors.text.primary }}
        >
          Category (Optional)
        </Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24 }}
      >
        {DEFAULT_HABIT_CATEGORIES.map((category: HabitCategoryDef) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              accessible
              accessibilityHint={`Select ${category.name} category`}
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
                borderRadius: 16,
                borderWidth: 2,
                marginRight: 12,
                minWidth: 100,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text style={{ fontSize: 24, marginBottom: 4 }}>
                {category.icon}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  color: isSelected
                    ? '#FFFFFF'
                    : colors.text.primary,
                  fontSize: 13,
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

export const CategoryPicker = memo(CategoryPickerComponent);
