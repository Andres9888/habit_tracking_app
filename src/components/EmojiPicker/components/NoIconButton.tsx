import { memo } from 'react';
import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface NoIconButtonProps {
  isSelected: boolean;
  onPress: () => void;
}

export const NoIconButton = memo(
  ({ isSelected, onPress }: NoIconButtonProps) => (
    <View className='border-t border-stone-200 bg-white px-4 py-3'>
      <AnimatedPressable
        accessibilityLabel='Select no icon for this habit'
        accessibilityRole='button'
        className={`flex-row items-center justify-center rounded-xl py-3 ${
          isSelected ? 'bg-stone-800' : 'bg-stone-100'
        }`}
        onPress={onPress}
      >
        <Text
          className={`text-base font-semibold ${
            isSelected ? 'text-white' : 'text-stone-800'
          }`}
        >
          No Icon
        </Text>
      </AnimatedPressable>
    </View>
  )
);

NoIconButton.displayName = 'NoIconButton';
