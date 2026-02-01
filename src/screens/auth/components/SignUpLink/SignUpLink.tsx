import { Text, TouchableOpacity, View } from 'react-native';

interface SignUpLinkProps {
  disabled?: boolean;
  onPress: () => void;
}

export function SignUpLink({ disabled, onPress }: SignUpLinkProps) {
  return (
    <View className='mt-6 flex-row items-center justify-center'>
      <Text className='text-sm text-stone-500'>Don't have an account? </Text>
      <TouchableOpacity
        accessibilityLabel='Create a new account'
        accessibilityRole='link'
        accessibilityState={{ disabled }}
        activeOpacity={0.7}
        disabled={disabled}
        onPress={onPress}
      >
        <Text className='text-sm font-semibold text-emerald-700'>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
