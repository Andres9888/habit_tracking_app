/**
 * CatalogChipRail — sticky horizontal category filter chips.
 */

import { Pressable, ScrollView, Text } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles as s } from './CatalogChipRail.styles';

export const CATALOG_ALL_ID = 'all';

export interface CatalogChipItem {
  categoryId: string;
  icon: string;
  label: string;
}

interface CatalogChipRailProps {
  categories: CatalogChipItem[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CatalogChipRail({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CatalogChipRailProps) {
  const { colors } = useThemeColors();
  const allSelected = selectedCategoryId === CATALOG_ALL_ID;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[s.rail, { borderBottomColor: colors.border }]}
      contentContainerStyle={s.content}
    >
      <Pressable
        accessibilityRole='button'
        accessibilityState={{ selected: allSelected }}
        style={[
          s.chip,
          { backgroundColor: colors.card, borderColor: colors.border },
          allSelected ? s.chipSelected : null,
        ]}
        onPress={() => onSelectCategory(CATALOG_ALL_ID)}
      >
        <Text
          style={[
            s.chipLabel,
            { color: colors.text.secondary },
            allSelected ? s.chipLabelSelected : null,
          ]}
        >
          All
        </Text>
      </Pressable>
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.categoryId;
        return (
          <Pressable
            key={category.categoryId}
            accessibilityRole='button'
            accessibilityState={{ selected: isSelected }}
            style={[
              s.chip,
              { backgroundColor: colors.card, borderColor: colors.border },
              isSelected ? s.chipSelected : null,
            ]}
            onPress={() => onSelectCategory(category.categoryId)}
          >
            <Text
              style={[
                s.chipLabel,
                { color: colors.text.secondary },
                isSelected ? s.chipLabelSelected : null,
              ]}
            >
              {category.icon} {category.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
