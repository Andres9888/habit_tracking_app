/**
 * Header for category/search view mode
 */

import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useAppTheme } from '../../../theme';
import { useThemeColors } from '../../../theme/ThemeContext';
import {
  getCategoryColors,
  getDefaultCategoryColors,
} from '../../templates/constants';
import { styles } from '../../templates/templatesScreenStyles';
import type { Category } from '../../templates/constants';
import type { CategoryDoc, ViewMode } from '../TemplatesScreen.types';
import { fontWeights } from '@/theme/typography';
import { iconSizes } from '@/theme/iconSizes';

interface CategoryHeaderProps {
  categories: CategoryDoc[] | undefined;
  filteredCount: number;
  getCategoryLabel: (categoryId: string) => string;
  onBackPress: () => void;
  searchQuery: string;
  selectedCategory: Category;
  viewMode: ViewMode;
}

export function CategoryHeader({
  categories,
  filteredCount,
  getCategoryLabel,
  onBackPress,
  searchQuery,
  selectedCategory,
  viewMode,
}: CategoryHeaderProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { colors: themeColors, isDark } = useThemeColors();
  const catColors =
    getCategoryColors(isDark)[selectedCategory] ||
    getDefaultCategoryColors(isDark);
  const categoryIcon =
    categories?.find((c) => c.id === selectedCategory)?.icon || '📌';
  const trimmedQuery = searchQuery.trim();
  const isSearchView = viewMode === 'search';
  const shouldShowBackButton = viewMode === 'category' || isSearchView;
  const title = isSearchView
    ? `Results for "${trimmedQuery}"`
    : getCategoryLabel(selectedCategory);
  const subtitle = isSearchView
    ? `${filteredCount} match${filteredCount === 1 ? '' : 'es'}${
        selectedCategory !== 'all'
          ? ` in ${getCategoryLabel(selectedCategory)}`
          : ''
      } across names, descriptions, categories, and research`
    : `${filteredCount} habit${filteredCount === 1 ? '' : 's'}`;

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 16) }]}>
      {shouldShowBackButton ? (
        <Pressable
          accessible
          accessibilityLabel='Go back to browse'
          accessibilityRole='button'
          style={styles.backButton}
          onPress={onBackPress}
        >
          <ArrowLeft
            color={themeColors.text.secondary}
            size={iconSizes.medium}
            strokeWidth={2.5}
          />
          <Text
            style={[
              styles.backButtonText,
              { color: themeColors.text.secondary },
            ]}
          >
            Back
          </Text>
        </Pressable>
      ) : null}
      <View style={styles.categoryHeaderRow}>
        {viewMode === 'category' ? (
          <View
            style={[
              styles.categoryHeaderIcon,
              { backgroundColor: catColors.bg },
            ]}
          >
            <Text style={{ fontSize: 22 }}>{categoryIcon}</Text>
          </View>
        ) : null}
        <View>
          <Text
            style={[
              theme.custom.typography.heading1,
              { color: themeColors.text.primary, fontWeight: fontWeights.bold },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              theme.custom.typography.bodySmall,
              { color: themeColors.text.secondary, marginTop: 2 },
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}
