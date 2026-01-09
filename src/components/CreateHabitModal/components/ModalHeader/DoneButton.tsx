/**
 * Done button for dismissing keyboard
 */
import { Animated, Text, TouchableOpacity } from 'react-native';
import { useButtonScale } from './useButtonScale';

interface DoneButtonProps {
  onPress: () => void;
}

export const DoneButton = ({ onPress }: DoneButtonProps) => {
  const { scale, handlePressIn, handlePressOut } = useButtonScale();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        accessibilityLabel='Done editing'
        accessibilityRole='button'
        className='h-11 items-center justify-center rounded-full px-5'
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text className='text-base font-semibold text-blue-600'>Done</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
