/**
 * Header for category/search view mode
 */

import { Pressable, Text, View } from 'react-native';

import { ArrowLeft } from 'lucide-react-native';

import type { Category } from '../../templates/constants';
import type { CategoryDoc, ViewMode } from '../TemplatesScreen.types';
import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLORS,
} from '../../templates/constants';
import { styles } from '../../templates/templatesScreenStyles';
import { useAppTheme } from '../../../theme';

interface CategoryHeaderProps {
  categories: CategoryDoc[] | undefined;
  filteredCount: number;
  getCategoryLabel: (categoryId: string) => string;
  onBackPress: () => void;
  selectedCategory: Category;
  viewMode: ViewMode;
}

export function CategoryHeader({
  categories,
  filteredCount,
  getCategoryLabel,
  onBackPress,
  selectedCategory,
  viewMode,
}: CategoryHeaderProps) {
  const theme = useAppTheme();
  const colors = CATEGORY_COLORS[selectedCategory] || DEFAULT_CATEGORY_COLORS;
  const categoryIcon =
    categories?.find((c) => c.id === selectedCategory)?.icon || '📌';

  return (
    <View style={styles.header}>
      {viewMode === 'category' && (
        <Pressable
          accessible
          accessibilityLabel='Go back to browse'
          accessibilityRole='button'
          style={styles.backButton}
          onPress={onBackPress}
        >
          <ArrowLeft color='#374151' size={20} strokeWidth={2.5} />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      )}
      <View style={styles.categoryHeaderRow}>
        {viewMode === 'category' && (
          <View
            style={[styles.categoryHeaderIcon, { backgroundColor: colors.bg }]}
          >
            <Text style={{ fontSize: 24 }}>{categoryIcon}</Text>
          </View>
        )}
        <View>
          <Text
            style={[
              theme.custom.typography.heading1,
              { color: '#1c1917', fontWeight: '700' },
            ]}
          >
            {viewMode === 'search'
              ? 'Search Results'
              : getCategoryLabel(selectedCategory)}
          </Text>
          <Text
            style={[
              theme.custom.typography.bodySmall,
              { color: '#78716c', marginTop: 2 },
            ]}
          >
            {filteredCount} template{filteredCount === 1 ? '' : 's'}
          </Text>
        </View>
      </View>
    </View>
  );
}
