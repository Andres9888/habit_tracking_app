import { memo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { DEFAULT_HABIT_CATEGORIES } from '../../../constants/habitCategories';

interface CategoryPickerSectionProps {
  selectedCategory?: string;
  onSelectCategory: (categoryId: string) => void;
  hideLabel?: boolean;
}

/**
 * Category picker section for habit creation/editing
 * Shows default habit categories as pill buttons
 */
const CategoryPickerSectionComponent = ({
  selectedCategory,
  onSelectCategory,
  hideLabel = false,
}: CategoryPickerSectionProps) => {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ marginBottom: 32 }}>
      {!hideLabel && (
        <Text
          className='mb-4 text-sm font-semibold'
          style={{ color: colors.text.primary }}
        >
          Category
        </Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        <View className='flex-row gap-3'>
          {/* Uncategorized option */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSelectCategory('')}
            style={[
              {
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                borderWidth: 2,
              },
              {
                borderColor:
                  selectedCategory === ''
                    ? (colors.primary as any)
                    : isDark
                      ? '#334155'
                      : '#e5e7eb',
                backgroundColor:
                  selectedCategory === ''
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
                  selectedCategory === ''
                    ? (colors.primary as any)
                    : (colors.text.secondary as any),
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              None
            </Text>
          </TouchableOpacity>

          {/* Default categories */}
          {DEFAULT_HABIT_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.7}
              onPress={() => onSelectCategory(category.id)}
              style={[
                {
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 20,
                  borderWidth: 2,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
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
              <Text style={{ fontSize: 18 }}>{category.icon}</Text>
              <Text
                style={{
                  color:
                    selectedCategory === category.id
                      ? category.color
                      : (colors.text.secondary as any),
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Category description */}
      {selectedCategory && selectedCategory !== '' && (
        <Text
          style={{
            marginTop: 8,
            fontSize: 12,
            color: colors.text.tertiary,
          }}
        >
          {DEFAULT_HABIT_CATEGORIES.find((c) => c.id === selectedCategory)?.description}
        </Text>
      )}
    </View>
  );
};

export const CategoryPickerSection = memo(CategoryPickerSectionComponent);
