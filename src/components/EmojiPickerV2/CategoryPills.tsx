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
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
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

export const CategoryPills = memo(
  ({
    selectedCategory,
    onCategorySelect,
    categories = HABIT_CATEGORIES,
  }: CategoryPillsProps) => (
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
          onPress={() => onCategorySelect(category.id)}
        />
      ))}
    </ScrollView>
  )
);

CategoryPills.displayName = 'CategoryPills';
export default CategoryPills;
