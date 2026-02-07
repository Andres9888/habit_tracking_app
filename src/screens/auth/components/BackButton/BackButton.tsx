import { Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface BackButtonProps {
  onPress: () => void;
  label?: string;
  testID?: string;
}

export function BackButton({
  onPress,
  label = 'Back',
  testID = 'back-button',
}: BackButtonProps) {
  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      className='-ml-2 flex-row items-center p-2'
      hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
      testID={testID}
      onPress={onPress}
    >
      <ChevronLeft color='#44403c' size={20} strokeWidth={2.5} />
      <Text className='ml-1 font-medium text-stone-700'>{label}</Text>
    </AnimatedPressable>
  );
}
