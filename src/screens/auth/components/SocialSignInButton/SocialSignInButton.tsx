import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { SocialSignInButtonProps } from './types';

const PROVIDER_CONFIG = {
  apple: {
    bgColor: 'bg-black',
    borderColor: 'border-black',
    icon: '', // Apple logo
    label: 'Continue with Apple',
    textColor: 'text-white',
  },
  google: {
    bgColor: 'bg-white',
    borderColor: 'border-stone-200',
    icon: '🔵', // Replace with actual Google icon
    label: 'Continue with Google',
    textColor: 'text-stone-800',
  },
} as const;

export function SocialSignInButton({
  disabled,
  isLoading,
  onPress,
  provider,
}: SocialSignInButtonProps) {
  const { bgColor, borderColor, icon, label, textColor } =
    PROVIDER_CONFIG[provider];

  // Hide Apple button on Android
  if (provider === 'apple' && Platform.OS === 'android') {
    return null;
  }

  const isDisabled = isLoading || disabled;

  return (
    <TouchableOpacity
      accessibilityHint={`Sign in using your ${provider === 'apple' ? 'Apple' : 'Google'} account`}
      accessibilityLabel={label}
      accessibilityRole="button"
      className={`flex-row items-center justify-center rounded-3xl border py-4 ${borderColor} ${bgColor} ${
        isDisabled ? 'opacity-40' : ''
      }`}
      disabled={isDisabled}
      onPress={onPress}
    >
      <View className="mr-2">
        <Text className="text-lg">{icon}</Text>
      </View>
      <Text className={`text-[15px] font-semibold ${textColor}`}>
        {isLoading ? 'Signing in...' : label}
      </Text>
    </TouchableOpacity>
  );
}
