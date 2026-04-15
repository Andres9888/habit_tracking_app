/**
 * CategoryPills — horizontal scrolling filter pills for template categories.
 */

import { Pressable, ScrollView, Text } from 'react-native';

import { useThemeColors } from '../../../theme/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';
import {
  TEMPLATE_CATEGORIES,
  type CategoryPillData,
} from '../onboarding.types';
import { styles } from './CategoryPills.styles';

interface CategoryPillsProps {
  selected: CategoryPillData['category'];
  onSelect: (category: CategoryPillData['category']) => void;
}

export function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  const { colors } = useThemeColors();

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {TEMPLATE_CATEGORIES.map((pill) => {
        const isActive = pill.category === selected;
        return (
          <Pressable
            key={pill.category}
            accessibilityLabel={`${pill.label} category`}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            style={[
              styles.pill,
              {
                backgroundColor: isActive
                  ? colors.primary[600]
                  : 'transparent',
                borderColor: isActive
                  ? colors.primary[600]
                  : colors.gray[300],
              },
            ]}
            onPress={() => {
              void triggerHaptic('tap');
              onSelect(pill.category);
            }}
          >
            <Text
              style={[
                styles.pillText,
                { color: isActive ? '#FFFFFF' : colors.text.secondary },
              ]}
            >
              {pill.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
