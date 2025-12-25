import { memo } from 'react';
import { ScrollView, Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLORS,
} from '../../screens/templates/constants';

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface SearchCategoryFilterProps {
  categories: Category[];
  resultCounts: Record<string, number>;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const SearchCategoryFilter = memo(function SearchCategoryFilter({
  categories,
  resultCounts,
  selectedCategory,
  onSelectCategory,
}: SearchCategoryFilterProps) {
  // Only show categories that have results
  const categoriesWithResults = categories.filter(
    (cat) => cat.id !== 'all' && (resultCounts[cat.id] || 0) > 0
  );

  if (categoriesWithResults.length === 0) return null;

  const totalResults = Object.values(resultCounts).reduce((a, b) => a + b, 0);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* "All" pill */}
        <CategoryPill
          label="All"
          count={totalResults}
          isSelected={selectedCategory === null}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelectCategory(null);
          }}
        />

        {/* Category pills */}
        {categoriesWithResults.map((category) => {
          const colors = CATEGORY_COLORS[category.id] || DEFAULT_CATEGORY_COLORS;
          return (
            <CategoryPill
              key={category.id}
              label={category.label}
              icon={category.icon}
              count={resultCounts[category.id] || 0}
              color={colors.bgSelected}
              isSelected={selectedCategory === category.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSelectCategory(
                  selectedCategory === category.id ? null : category.id
                );
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
});

interface CategoryPillProps {
  label: string;
  icon?: string;
  count: number;
  color?: string;
  isSelected: boolean;
  onPress: () => void;
}

const CategoryPill = memo(function CategoryPill({
  label,
  icon,
  count,
  color,
  isSelected,
  onPress,
}: CategoryPillProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${label} category, ${count} results`}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
    >
      <Animated.View
        style={[
          styles.pill,
          isSelected && styles.pillSelected,
          isSelected && color && { backgroundColor: color },
          animatedStyle,
        ]}
      >
        {icon && <Text style={styles.pillIcon}>{icon}</Text>}
        <Text
          style={[styles.pillLabel, isSelected && styles.pillLabelSelected]}
          numberOfLines={1}
        >
          {label}
        </Text>
        <View style={[styles.pillCount, isSelected && styles.pillCountSelected]}>
          <Text
            style={[
              styles.pillCountText,
              isSelected && styles.pillCountTextSelected,
            ]}
          >
            {count}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: 'row',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  pillSelected: {
    backgroundColor: '#1C1917',
  },
  pillIcon: {
    fontSize: 14,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#44403C',
  },
  pillLabelSelected: {
    color: '#FFFFFF',
  },
  pillCount: {
    backgroundColor: '#E7E5E4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  pillCountSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  pillCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
  },
  pillCountTextSelected: {
    color: '#FFFFFF',
  },
});
