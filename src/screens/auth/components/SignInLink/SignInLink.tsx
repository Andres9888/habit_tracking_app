import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface SignInLinkProps {
  disabled?: boolean;
  onPress: () => void;
  className?: string;
}

export function SignInLink({
  disabled,
  onPress,
  className = 'mt-2',
}: SignInLinkProps) {
  return (
    <View className={`flex-row items-center justify-center ${className}`}>
      <Text className='text-sm text-stone-600'>Already have an account? </Text>
      <AnimatedPressable
        accessibilityLabel='Sign in to existing account'
        accessibilityRole='link'
        accessibilityState={{ disabled }}
        disableAnimation={disabled}
        disabled={disabled}
        onPress={onPress}
      >
        <Text className='text-sm font-semibold text-emerald-700'>Sign in</Text>
      </AnimatedPressable>
    </View>
  );
}
