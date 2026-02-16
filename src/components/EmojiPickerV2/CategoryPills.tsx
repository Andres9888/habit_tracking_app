import { memo, useCallback } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { HABIT_CATEGORIES } from '../../constants/habitEmojis';
import { styles } from './CategoryPills.styles';

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

export const CategoryPill = memo(
  ({ icon, name, isSelected, onPress }: CategoryPillProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.95, { damping: 18, stiffness: 150 });
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 18, stiffness: 150 });
    }, [scale]);

    return (
      <Pressable
        accessibilityLabel={`Filter by ${name} category`}
        accessibilityRole='tab'
        accessibilityState={{ selected: isSelected }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.categoryPill,
            isSelected && styles.categoryPillActive,
            animatedStyle,
          ]}
        >
          <Text style={styles.categoryPillIcon}>{icon}</Text>
          <Text
            style={[
              styles.categoryPillText,
              isSelected && styles.categoryPillTextActive,
            ]}
          >
            {name}
          </Text>
        </Animated.View>
      </Pressable>
    );
  }
);

CategoryPill.displayName = 'CategoryPill';

interface CategoryPillsProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  categories?: Category[];
}

/**
 * PERF: Memoized category pills with optimized press handlers
 */
function CategoryPillsComponent({
  selectedCategory,
  onCategorySelect,
  categories = HABIT_CATEGORIES,
}: CategoryPillsProps) {
  // PERF: Create stable handler factory
  const createPressHandler = useCallback(
    (categoryId: string) => () => onCategorySelect(categoryId),
    [onCategorySelect]
  );

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.categoriesContent}
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesScroll}
    >
      {categories.map((category) => (
        <CategoryPill
          key={category.id}
          icon={category.icon}
          isSelected={selectedCategory === category.id}
          name={category.name}
          onPress={createPressHandler(category.id)}
        />
      ))}
    </ScrollView>
  );
}

export const CategoryPills = memo(CategoryPillsComponent);

CategoryPills.displayName = 'CategoryPills';
export default CategoryPills;
