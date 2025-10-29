import { Pressable, ScrollView, Text } from 'react-native';
import type { CategoryFilter } from '../types';

interface CategoryFiltersProps {
  categories: CategoryFilter[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryFilters = ({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFiltersProps) => (
  <ScrollView
    horizontal
    className='border-b border-gray-100'
    contentContainerClassName='gap-2 px-3 py-3'
    showsHorizontalScrollIndicator={false}
  >
    {categories.map((category) => {
      const selected = selectedCategory === category.id;
      return (
        <Pressable
          key={category.id}
          accessibilityLabel={`Filter by ${category.label}`}
          accessibilityRole='button'
          accessibilityState={{ selected }}
          className={`flex-row items-center gap-1 rounded-full px-3 py-2 ${
            selected ? 'bg-[#1a1a1a]' : 'bg-gray-100'
          }`}
          onPress={() => onSelect(category.id)}
        >
          <Text className='text-sm'>{category.icon}</Text>
          <Text
            className={`text-sm font-medium ${
              selected ? 'text-white' : 'text-[#1a1a1a]'
            }`}
          >
            {category.label}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);
