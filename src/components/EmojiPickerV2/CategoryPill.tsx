import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import { styles } from './CategoryPills.styles';

interface CategoryPillProps {
  icon: string;
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryPill = memo(
  ({ icon, name, isSelected, onPress }: CategoryPillProps) => {
    const { animatedStyle, pressHandlers } = usePressAnimation();

    return (
      <Pressable
        accessibilityLabel={`Filter by ${name} category`}
        accessibilityRole='tab'
        accessibilityState={{ selected: isSelected }}
        onPress={onPress}
        {...pressHandlers}
      >
        <Animated.View
          style={[
            styles.categoryPill,
            isSelected && styles.categoryPillActive,
            animatedStyle,
          ]}
        >
          <Text style={styles.categoryPillIcon}>{icon}</Text>
          <Text
            style={[
              styles.categoryPillText,
              isSelected && styles.categoryPillTextActive,
            ]}
          >
            {name}
          </Text>
        </Animated.View>
      </Pressable>
    );
  }
);

CategoryPill.displayName = 'CategoryPill';
