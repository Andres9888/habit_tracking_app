/**
 * Done button for dismissing keyboard
 */
import { Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface DoneButtonProps {
  onPress: () => void;
}

export const DoneButton = ({ onPress }: DoneButtonProps) => {
  return (
    <AnimatedPressable
      accessibilityLabel='Done editing'
      accessibilityRole='button'
      className='h-11 items-center justify-center rounded-full px-5'
      onPress={onPress}
    >
      <Text className='text-base font-semibold' style={{ color: '#059669' }}>
        Done
      </Text>
    </AnimatedPressable>
  );
};
