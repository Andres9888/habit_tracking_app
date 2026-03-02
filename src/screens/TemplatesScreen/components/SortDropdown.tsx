/**
 * Sort dropdown menu with themed options
 */

import { Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { SORT_OPTIONS, type SortOption } from '../../templates/constants';
import { styles } from '../../templates/templatesScreenStyles';
import type { SemanticColors } from '../../../theme/darkColors';

interface SortDropdownProps {
  colors: SemanticColors;
  onSelectSort: (option: SortOption) => void;
  sortOption: SortOption;
}

export function SortDropdown({ colors, onSelectSort, sortOption }: SortDropdownProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      style={[
        styles.sortDropdown,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.text.primary,
        },
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
              selected && { backgroundColor: colors.primary[100] },
            ]}
            onPress={() => onSelectSort(opt.value)}
          >
            <Text
              style={[
                styles.sortDropdownOptionText,
                { color: colors.text.primary },
                selected && { color: colors.primary[600], fontWeight: '600' },
              ]}
            >
              {opt.label}
            </Text>
            {selected && (
              <Check color={colors.primary[500]} size={16} strokeWidth={2.5} />
            )}
          </AnimatedPressable>
        );
      })}
    </Animated.View>
  );
}
