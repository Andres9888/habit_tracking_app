import { memo } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { shadows } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { HABIT_CATEGORIES } from '../../../constants/habitEmojis';

interface CategoryChipsProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export const CategoryChips = memo(
  ({ selectedCategory, onCategorySelect }: CategoryChipsProps) => {
    const { colors } = useThemeColors();

    return (
      <ScrollView
        horizontal
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {HABIT_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <Pressable
              key={category.id}
              accessibilityLabel={`Filter by ${category.name} category`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              style={[
                {
                  ...shadows.subtle,
                  alignItems: 'center',
                  backgroundColor: isSelected ? colors.gray[900] : colors.card,
                  borderRadius: 9999,
                  flexDirection: 'row',
                  gap: 4,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                },
              ]}
              onPress={() => onCategorySelect(category.id)}
            >
              <Text style={{ fontSize: typography.bodySmall.fontSize }}>
                {category.icon}
              </Text>
              <Text
                style={[
                  {
                    color: isSelected ? colors.text.inverse : colors.text.primary,
                    fontSize: typography.bodySmall.fontSize,
                    fontWeight: '500',
                  },
                ]}
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  }
);

CategoryChips.displayName = 'CategoryChips';
