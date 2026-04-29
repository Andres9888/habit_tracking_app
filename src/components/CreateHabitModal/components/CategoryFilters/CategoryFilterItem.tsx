/**
 * CategoryFilterItem Component
 * Individual category filter chip with animation
 */

import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { colors as themeTokens } from '@/theme/colors';
import { useCategoryFilterAnimations } from './useCategoryFilterAnimations';
import type { CategoryFilterItemProps } from './CategoryFilters.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CategoryFilterItem({
  category,
  colors,
  index,
  onSelect,
  selected,
}: CategoryFilterItemProps) {
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});
  const {
    entranceAnimatedStyle,
    pressAnimatedStyle,
    handlePressIn,
    handlePressOut,
  } = useCategoryFilterAnimations(index);

  return (
    <Animated.View style={entranceAnimatedStyle}>
      <AnimatedPressable
        accessibilityLabel={`Filter by ${category.label}`}
        accessibilityRole='button'
        accessibilityState={{ selected }}
        className='flex-row items-center gap-1.5 rounded-full px-4 py-3'
        style={[
          pressAnimatedStyle,
          {
            backgroundColor: selected ? colors.bgSelected : colors.bg,
            borderColor: selected ? colors.bgSelected : colors.border,
            borderWidth: 1.5,
            minHeight: 44,
          },
        ]}
        onPress={() => {
          triggerSelection();
          onSelect(category.id);
        }}
        onPressIn={() => {
          triggerLightImpact();
          handlePressIn();
        }}
        onPressOut={handlePressOut}
      >
        {selected ? null : <View
            className='h-2 w-2 rounded-full'
            style={{ backgroundColor: colors.bgSelected }}
          />}
        <Text className='text-base'>{category.icon}</Text>
        <Text
          className='text-base font-semibold'
          style={{ color: selected ? themeTokens.text.inverse : colors.text }}
        >
          {category.label}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
