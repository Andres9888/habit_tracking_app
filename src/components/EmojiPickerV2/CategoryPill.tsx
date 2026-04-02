import { memo, useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { styles } from './CategoryPills.styles';

interface CategoryPillProps {
  icon: string;
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryPill = memo(
  ({ icon, name, isSelected, onPress }: CategoryPillProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.95, springs.button);
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, springs.button);
    }, [scale]);

    return (
      <Pressable
        accessibilityLabel={`Filter by ${name} category`}
        accessibilityRole='tab'
        accessibilityState={{ selected: isSelected }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
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
