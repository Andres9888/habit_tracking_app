/**
 * Header for category/search view mode
 */

import { Pressable, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLORS,
} from '../../templates/constants';
import { useTemplatesStyles } from '../../templates/templatesScreenStyles';
import type { Category } from '../../templates/constants';
import type { CategoryDoc, ViewMode } from '../TemplatesScreen.types';

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
  const { colors: themeColors } = useThemeColors();
  const styles = useTemplatesStyles();
  const catColors =
    CATEGORY_COLORS[selectedCategory] || DEFAULT_CATEGORY_COLORS;
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
          <ArrowLeft
            color={themeColors.text.secondary}
            size={20}
            strokeWidth={2.5}
          />
          <Text style={[styles.backButtonText, { color: themeColors.text.secondary }]}>
            Back
          </Text>
        </Pressable>
      )}
      <View style={styles.categoryHeaderRow}>
        {viewMode === 'category' && (
          <View
            style={[
              styles.categoryHeaderIcon,
              { backgroundColor: catColors.bg },
            ]}
          >
            <Text style={{ fontSize: 24 }}>{categoryIcon}</Text>
          </View>
        )}
        <View>
          <Text
            style={[
              theme.custom.typography.heading1,
              { color: themeColors.text.primary, fontWeight: '700' },
            ]}
          >
            {viewMode === 'search'
              ? 'Search Results'
              : getCategoryLabel(selectedCategory)}
          </Text>
          <Text
            style={[
              theme.custom.typography.bodySmall,
              { color: themeColors.text.secondary, marginTop: 2 },
            ]}
          >
            {filteredCount} template{filteredCount === 1 ? '' : 's'}
          </Text>
        </View>
      </View>
    </View>
  );
}
