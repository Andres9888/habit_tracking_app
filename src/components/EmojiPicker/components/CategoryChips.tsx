import { memo } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { HABIT_CATEGORIES } from '../../../constants/habitEmojis';

interface CategoryChipsProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export const CategoryChips = memo(
  ({ selectedCategory, onCategorySelect }: CategoryChipsProps) => (
    <ScrollView
      horizontal
      className='border-b border-stone-200'
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
                alignItems: 'center',
                backgroundColor: isSelected ? '#1c1917' : 'white',
                borderRadius: 9999,
                elevation: 1,
                flexDirection: 'row',
                gap: 4,
                paddingHorizontal: 12,
                paddingVertical: 8,
                shadowColor: '#000',
                shadowOffset: { height: 1, width: 0 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
              },
            ]}
            onPress={() => onCategorySelect(category.id)}
          >
            <Text style={{ fontSize: 14 }}>{category.icon}</Text>
            <Text
              style={[
                {
                  color: isSelected ? 'white' : '#1c1917',
                  fontSize: 14,
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
  )
);

CategoryChips.displayName = 'CategoryChips';
