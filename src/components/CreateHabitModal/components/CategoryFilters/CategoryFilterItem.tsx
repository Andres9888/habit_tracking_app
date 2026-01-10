/**
 * CategoryFilterItem Component
 * Individual category filter chip with animation
 */

import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
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
        {!selected && (
          <View
            className='h-2 w-2 rounded-full'
            style={{ backgroundColor: colors.bgSelected }}
          />
        )}
        <Text className='text-[15px]'>{category.icon}</Text>
        <Text
          className='text-[15px] font-semibold'
          style={{ color: selected ? '#FFFFFF' : colors.text }}
        >
          {category.label}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
