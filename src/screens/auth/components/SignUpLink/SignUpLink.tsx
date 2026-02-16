import { Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface SignUpLinkProps {
  disabled?: boolean;
  onPress: () => void;
}

export function SignUpLink({ disabled, onPress }: SignUpLinkProps) {
  return (
    <View className='mt-6 flex-row items-center justify-center'>
      <Text className='text-sm text-stone-600'>Don't have an account? </Text>
      <AnimatedPressable
        accessibilityLabel='Create a new account'
        accessibilityRole='link'
        accessibilityState={{ disabled }}
        disableAnimation={disabled}
        disabled={disabled}
        onPress={onPress}
      >
        <Text className='text-sm font-semibold text-emerald-700'>Sign up</Text>
      </AnimatedPressable>
    </View>
  );
}
