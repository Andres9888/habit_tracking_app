import { Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface ForgotPasswordLinkProps {
  onPress: () => void;
}

export function ForgotPasswordLink({ onPress }: ForgotPasswordLinkProps) {
  return (
    <AnimatedPressable
      accessibilityLabel='Forgot password?'
      accessibilityRole='button'
      hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
      onPress={onPress}
    >
      <Text className='text-sm font-medium text-emerald-600'>Forgot?</Text>
    </AnimatedPressable>
  );
}
