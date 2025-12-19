import { memo, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { HABIT_CATEGORIES } from '../../constants/habitEmojis';

export interface Category {
  id: string;
  name: string;
  icon: string;
  emojis: string[];
}

interface CategoryPillProps {
  icon: string;
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

/**
 * Individual category pill button with active state styling
 */
export const CategoryPill = memo(({ icon, name, isSelected, onPress }: CategoryPillProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  return (
    <Pressable
      accessibilityLabel={`Filter by ${name} category`}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[styles.categoryPill, isSelected && styles.categoryPillActive, animatedStyle]}
      >
        <Text style={styles.categoryPillIcon}>{icon}</Text>
        <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
          {name}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

CategoryPill.displayName = 'CategoryPill';

interface CategoryPillsProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  categories?: Category[];
}

/**
 * Horizontal scrolling category pills for filtering emojis
 *
 * Features:
 * - Horizontal scroll with hidden scrollbar
 * - Active state with dark background and shadow
 * - Press animation (scale 0.95 on press)
 * - Accessible with tab role and selected state
 */
export const CategoryPills = memo(
  ({
    selectedCategory,
    onCategorySelect,
    categories = HABIT_CATEGORIES,
  }: CategoryPillsProps) => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
        style={styles.categoriesScroll}
      >
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            icon={category.icon}
            name={category.name}
            isSelected={selectedCategory === category.id}
            onPress={() => onCategorySelect(category.id)}
          />
        ))}
      </ScrollView>
    );
  }
);

CategoryPills.displayName = 'CategoryPills';

const styles = StyleSheet.create({
  categoriesScroll: {
    flexGrow: 0,
    marginBottom: 12,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: '#f3f4f6',
  },
  categoryPillActive: {
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryPillIcon: {
    fontSize: 14,
  },
  categoryPillText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  categoryPillTextActive: {
    color: '#ffffff',
  },
});

export default CategoryPills;
