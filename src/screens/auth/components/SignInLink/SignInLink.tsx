import { Text, TouchableOpacity, View } from 'react-native';

interface SignInLinkProps {
  disabled?: boolean;
  onPress: () => void;
}

export function SignInLink({ disabled, onPress }: SignInLinkProps) {
  return (
    <View className='mt-2 flex-row items-center justify-center'>
      <Text className='text-sm text-stone-500'>Already have an account? </Text>
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <Text className='text-sm font-semibold text-emerald-600'>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
