/**
 * Sort dropdown filter control component
 */

import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { ChevronDown, SlidersHorizontal } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { SORT_LABELS, type SortOption } from '../../templates/constants';
import { styles } from '../../templates/templatesScreenStyles';
import { SortDropdown } from './SortDropdown';
import { iconSizes } from '@/theme/iconSizes';

interface FilterControlsProps {
  onSelectSort: (option: SortOption) => void;
  onToggleSortOptions: () => void;
  showSortOptions: boolean;
  sortOption: SortOption;
}

export function FilterControls({
  onSelectSort,
  onToggleSortOptions,
  showSortOptions,
  sortOption,
}: FilterControlsProps) {
  const { colors } = useThemeColors();
  const defaultIconColor = colors.text.primary;
  const activeColor = colors.primary[600];
  const iconColor = showSortOptions ? colors.text.inverse : defaultIconColor;

  return (
    <View style={styles.sortButtonWrapper}>
      <AnimatedPressable
        accessibilityLabel='Open sort options'
        accessibilityRole='button'
        style={[
          styles.controlButton,
          { borderColor: colors.border },
          showSortOptions && {
            backgroundColor: activeColor,
            borderColor: activeColor,
          },
        ]}
        onPress={onToggleSortOptions}
      >
        <SlidersHorizontal color={iconColor} size={iconSizes.small} />
        <Text
          style={[
            styles.controlButtonText,
            { color: defaultIconColor },
            showSortOptions && { color: colors.text.inverse },
          ]}
        >
          {SORT_LABELS[sortOption]}
        </Text>
        <ChevronDown
          color={iconColor}
          size={iconSizes.small}
          style={{
            transform: [{ rotate: showSortOptions ? '180deg' : '0deg' }],
          }}
        />
      </AnimatedPressable>
      {showSortOptions ? <SortDropdown
          colors={colors}
          sortOption={sortOption}
          onSelectSort={onSelectSort}
        /> : null}
    </View>
  );
}
