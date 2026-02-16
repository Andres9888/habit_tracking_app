import { memo, useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { DEFAULT_HABIT_CATEGORIES } from '../../../../constants/habitCategories';

interface CategoryFilterBarProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

/**
 * Category filter bar for the habits list
 * Shows horizontal scrollable category buttons
 */
const CategoryFilterBarComponent = ({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterBarProps) => {
  const { colors, isDark } = useThemeColors();

  const handleFilterPress = useCallback(
    (categoryId: string | null) => {
      // Toggle off if already selected
      if (selectedCategory === categoryId) {
        onCategoryChange(null);
      } else {
        onCategoryChange(categoryId);
      }
    },
    [selectedCategory, onCategoryChange]
  );

  return (
    <View style={{ paddingVertical: 8, paddingHorizontal: 16 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ gap: 8 }}
      >
        {/* All categories button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleFilterPress(null)}
          style={[
            {
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1.5,
            },
            {
              borderColor:
                selectedCategory === null
                  ? (colors.primary as any)
                  : isDark
                    ? '#334155'
                    : '#e5e7eb',
              backgroundColor:
                selectedCategory === null
                  ? isDark
                    ? 'rgba(5, 150, 105, 0.1)'
                    : 'rgba(5, 150, 105, 0.05)'
                  : 'transparent',
            },
          ]}
        >
          <Text
            style={{
              color:
                selectedCategory === null
                  ? (colors.primary as any)
                  : (colors.text.secondary as any),
              fontSize: 13,
              fontWeight: '600',
            }}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* Category buttons */}
        {DEFAULT_HABIT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.7}
            onPress={() => handleFilterPress(category.id)}
            style={[
              {
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1.5,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              },
              {
                borderColor:
                  selectedCategory === category.id
                    ? category.color
                    : isDark
                      ? '#334155'
                      : '#e5e7eb',
                backgroundColor:
                  selectedCategory === category.id
                    ? isDark
                      ? `${category.color}15`
                      : `${category.color}10`
                    : 'transparent',
              },
            ]}
          >
            <Text style={{ fontSize: 16 }}>{category.icon}</Text>
            <Text
              style={{
                color:
                  selectedCategory === category.id
                    ? category.color
                    : (colors.text.secondary as any),
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export const CategoryFilterBar = memo(CategoryFilterBarComponent);
