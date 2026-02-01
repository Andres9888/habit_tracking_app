import { Text, TouchableOpacity } from 'react-native';

interface ForgotPasswordLinkProps {
  onPress: () => void;
}

export function ForgotPasswordLink({ onPress }: ForgotPasswordLinkProps) {
  return (
    <TouchableOpacity
      accessibilityLabel='Forgot password?'
      accessibilityRole='button'
      activeOpacity={0.7}
      hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
      onPress={onPress}
    >
      <Text className='text-sm font-medium text-emerald-600'>Forgot?</Text>
    </TouchableOpacity>
  );
}
