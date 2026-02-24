/**
 * Sort dropdown filter control component
 */

import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import {
  SORT_LABELS,
  SORT_OPTIONS,
  type SortOption,
} from '../../templates/constants';
import { styles } from '../../templates/templatesScreenStyles';

interface FilterControlsProps {
  onResearchToggle: () => void;
  onSelectSort: (option: SortOption) => void;
  onToggleSortOptions: () => void;
  researchOnly: boolean;
  showSortOptions: boolean;
  sortOption: SortOption;
}

export function FilterControls({
  onSelectSort,
  onToggleSortOptions,
  showSortOptions,
  sortOption,
}: FilterControlsProps) {
  const { colors, isDark } = useThemeColors();
  const defaultIconColor = colors.text.primary;
  const iconColor = showSortOptions ? '#fff' : defaultIconColor;

  return (
    <View style={styles.sortButtonWrapper}>
      <AnimatedPressable
        accessibilityLabel='Open sort options'
        accessibilityRole='button'
        style={[
          styles.controlButton,
          showSortOptions && styles.controlButtonActive,
        ]}
        onPress={onToggleSortOptions}
      >
        <SlidersHorizontal color={iconColor} size={16} />
        <Text
          style={[
            styles.controlButtonText,
            { color: defaultIconColor },
            showSortOptions && { color: '#fff' },
          ]}
        >
          {SORT_LABELS[sortOption]}
        </Text>
        <ChevronDown
          color={iconColor}
          size={14}
          style={{
            transform: [{ rotate: showSortOptions ? '180deg' : '0deg' }],
          }}
        />
      </AnimatedPressable>
      {showSortOptions && (
        <Animated.View
          entering={FadeIn.duration(150)}
          style={[
            styles.sortDropdown,
            isDark && { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {SORT_OPTIONS.map((opt) => {
            const selected = sortOption === opt.value;
            return (
              <AnimatedPressable
                key={opt.value}
                accessible
                accessibilityLabel={`Sort by ${opt.label}`}
                accessibilityRole='button'
                accessibilityState={{ selected }}
                style={[
                  styles.sortDropdownOption,
                  selected && styles.sortDropdownOptionSelected,
                ]}
                onPress={() => onSelectSort(opt.value)}
              >
                <Text
                  style={[
                    styles.sortDropdownOptionText,
                    selected && styles.sortDropdownOptionTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
                {selected && (
                  <Check color='#10B981' size={16} strokeWidth={2.5} />
                )}
              </AnimatedPressable>
            );
          })}
        </Animated.View>
      )}
    </View>
  );
}
