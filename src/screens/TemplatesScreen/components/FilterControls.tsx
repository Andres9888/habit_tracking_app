/**
 * Sort dropdown filter control component
 */

import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react-native';
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
  return (
    <View style={styles.sortButtonWrapper}>
      <Pressable
        accessibilityLabel='Open sort options'
        accessibilityRole='button'
        style={[
          styles.controlButton,
          showSortOptions && styles.controlButtonActive,
        ]}
        onPress={onToggleSortOptions}
      >
        <SlidersHorizontal
          color={showSortOptions ? '#fff' : '#1c1917'}
          size={16}
        />
        <Text
          style={[
            styles.controlButtonText,
            showSortOptions && { color: '#fff' },
          ]}
        >
          {SORT_LABELS[sortOption]}
        </Text>
        <ChevronDown
          color={showSortOptions ? '#fff' : '#1c1917'}
          size={14}
          style={{
            transform: [{ rotate: showSortOptions ? '180deg' : '0deg' }],
          }}
        />
      </Pressable>
      {showSortOptions && (
        <Animated.View
          entering={FadeIn.duration(150)}
          style={styles.sortDropdown}
        >
          {SORT_OPTIONS.map((option) => {
            const isSelected = sortOption === option.value;
            return (
              <Pressable
                key={option.value}
                accessible
                accessibilityLabel={`Sort by ${option.label}`}
                accessibilityRole='button'
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.sortDropdownOption,
                  isSelected && styles.sortDropdownOptionSelected,
                ]}
                onPress={() => onSelectSort(option.value)}
              >
                <Text
                  style={[
                    styles.sortDropdownOptionText,
                    isSelected && styles.sortDropdownOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <Check color='#10B981' size={16} strokeWidth={2.5} />
                )}
              </Pressable>
            );
          })}
        </Animated.View>
      )}
    </View>
  );
}

export { ResearchFilterButton } from './ResearchFilterButton';
