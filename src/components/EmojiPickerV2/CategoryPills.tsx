import { memo, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../theme/ThemeContext';
import { HABIT_CATEGORIES } from '../../constants/habitEmojis';
import { CategoryPill } from './CategoryPill';
import { styles } from './CategoryPills.styles';
import { useHorizontalScrollFade } from './useHorizontalScrollFade';

export type { Category } from './CategoryPill.types';

interface CategoryPillsProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  categories?: typeof HABIT_CATEGORIES;
}

export const CategoryPills = memo(
  ({
    selectedCategory,
    onCategorySelect,
    categories = HABIT_CATEGORIES,
  }: CategoryPillsProps) => {
    const { handleScroll, showLeftFade, showRightFade } =
      useHorizontalScrollFade();
    const { isDark } = useThemeColors();

    const fadeColors = useMemo(
      (): [string, string] =>
        isDark
          ? ['rgba(31,41,55,1)', 'rgba(31,41,55,0)']
          : ['rgba(237,234,229,1)', 'rgba(237,234,229,0)'],
      [isDark]
    );

    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.categoriesContent}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          onScroll={handleScroll}
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

        {showLeftFade ? (
          <LinearGradient
            colors={fadeColors}
            end={{ x: 1, y: 0 }}
            pointerEvents='none'
            start={{ x: 0, y: 0 }}
            style={styles.fadeLeft}
          />
        ) : null}

        {showRightFade ? (
          <LinearGradient
            colors={fadeColors}
            end={{ x: 0, y: 0 }}
            pointerEvents='none'
            start={{ x: 1, y: 0 }}
            style={styles.fadeRight}
          />
        ) : null}
      </View>
    );
  }
);

CategoryPills.displayName = 'CategoryPills';
export { CategoryPill } from './CategoryPill';
export default CategoryPills;
