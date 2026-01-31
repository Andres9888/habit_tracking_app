import { Text, TouchableOpacity, View } from 'react-native';

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
      <Text className='text-sm text-stone-500'>Already have an account? </Text>
      <TouchableOpacity
        accessibilityLabel='Sign in to existing account'
        accessibilityRole='link'
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
      >
        <Text className='text-sm font-semibold text-emerald-700'>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
