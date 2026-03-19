import { memo } from 'react';
import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';

interface NoIconButtonProps {
  isSelected: boolean;
  onPress: () => void;
}

export const NoIconButton = memo(
  ({ isSelected, onPress }: NoIconButtonProps) => {
    const { colors } = useThemeColors();

    return (
      <View className='border-t bg-white px-4 py-3' style={{ borderColor: colors.border }}>
        <AnimatedPressable
          accessibilityLabel='Select no icon for this habit'
          accessibilityRole='button'
          className='flex-row items-center justify-center rounded-xl py-3'
          style={{ backgroundColor: isSelected ? colors.text.primary : colors.background }}
          onPress={onPress}
        >
          <Text
            className='text-base font-semibold'
            style={{ color: isSelected ? colors.text.inverse : colors.text.primary }}
          >
            No Icon
          </Text>
        </AnimatedPressable>
      </View>
    );
  }
);

NoIconButton.displayName = 'NoIconButton';
