import { Pressable, ScrollView, Text, View } from 'react-native';
import type { Category, CategoryFilter } from '../types';

// Category color mapping for visual differentiation
const CATEGORY_COLORS: Record<string, { bg: string; bgSelected: string; border: string; text: string }> = {
  all: { bg: '#EEF2FF', bgSelected: '#6366F1', border: '#C7D2FE', text: '#4338CA' },
  andrew_huberman: { bg: '#ECFDF5', bgSelected: '#059669', border: '#A7F3D0', text: '#047857' },
  breathing: { bg: '#E0F2FE', bgSelected: '#0284C7', border: '#BAE6FD', text: '#0369A1' },
  creativity: { bg: '#FDF2F8', bgSelected: '#EC4899', border: '#FBCFE8', text: '#BE185D' },
  financial: { bg: '#ECFDF5', bgSelected: '#10B981', border: '#A7F3D0', text: '#059669' },
  health_fitness: { bg: '#D1FAE5', bgSelected: '#10B981', border: '#6EE7B7', text: '#047857' },
  learning: { bg: '#F3E8FF', bgSelected: '#8B5CF6', border: '#DDD6FE', text: '#7C3AED' },
  longevity: { bg: '#FEF3C7', bgSelected: '#D97706', border: '#FDE68A', text: '#B45309' },
  mental_health: { bg: '#E0E7FF', bgSelected: '#6366F1', border: '#C7D2FE', text: '#4F46E5' },
  mindfulness: { bg: '#F5F3FF', bgSelected: '#8B5CF6', border: '#E9D5FF', text: '#7C3AED' },
  morning_routine: { bg: '#FEF3C7', bgSelected: '#F59E0B', border: '#FDE68A', text: '#D97706' },
  productivity: { bg: '#DBEAFE', bgSelected: '#3B82F6', border: '#BFDBFE', text: '#2563EB' },
  recovery: { bg: '#FCE7F3', bgSelected: '#EC4899', border: '#FBCFE8', text: '#DB2777' },
  sleep: { bg: '#E0E7FF', bgSelected: '#1E3A8A', border: '#C7D2FE', text: '#1E40AF' },
  social: { bg: '#FFE4E6', bgSelected: '#F43F5E', border: '#FECDD3', text: '#E11D48' },
};

const DEFAULT_COLORS = { bg: '#f5f5f4', bgSelected: '#374151', border: '#e7e5e4', text: '#374151' };

interface CategoryFiltersProps {
  categories: CategoryFilter[];
  onSelect: (category: Category) => void;
  selectedCategory: Category;
}

export const CategoryFilters = ({
  categories,
  onSelect,
  selectedCategory,
}: CategoryFiltersProps) => (
  <ScrollView
    horizontal
    className='border-b border-stone-100'
    contentContainerClassName='gap-2 px-3 py-3'
    showsHorizontalScrollIndicator={false}
  >
    {categories.map((category) => {
      const selected = selectedCategory === category.id;
      const colors = CATEGORY_COLORS[category.id] || DEFAULT_COLORS;

      return (
        <Pressable
          key={category.id}
          accessibilityLabel={`Filter by ${category.label}`}
          accessibilityRole='button'
          accessibilityState={{ selected }}
          className='flex-row items-center gap-1.5 rounded-full px-3 py-2'
          style={{
            backgroundColor: selected ? colors.bgSelected : colors.bg,
            borderColor: selected ? colors.bgSelected : colors.border,
            borderWidth: 1.5,
          }}
          onPress={() => onSelect(category.id)}
        >
          {/* Colored dot indicator for quick visual scan */}
          {!selected && (
            <View
              className='h-2 w-2 rounded-full'
              style={{ backgroundColor: colors.bgSelected }}
            />
          )}
          <Text className='text-[15px]'>{category.icon}</Text>
          <Text
            className='text-[15px] font-semibold'
            style={{ color: selected ? '#FFFFFF' : colors.text }}
          >
            {category.label}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);
