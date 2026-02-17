import { Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';

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
  const { colors } = useThemeColors();
  return (
    <AnimatedPressable
      accessibilityHint='Go back to previous screen'
      accessibilityLabel={label}
      accessibilityRole='button'
      className='-ml-2 flex-row items-center p-2'
      hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
      testID={testID}
      onPress={onPress}
    >
      <ChevronLeft color={colors.text.secondary} size={20} strokeWidth={2.5} />
      <Text className='ml-1 font-medium' style={{ color: colors.text.secondary }}>{label}</Text>
    </AnimatedPressable>
  );
}
