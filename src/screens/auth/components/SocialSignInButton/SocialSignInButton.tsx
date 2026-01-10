import { useEffect } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { SocialSignInButtonProps } from './types';

const PROVIDER_CONFIG = {
  apple: {
    bgColor: 'bg-black',
    borderColor: 'border-black',
    icon: '',
    label: 'Continue with Apple',
    spinnerColor: '#FFFFFF',
    textColor: 'text-white',
  },
  google: {
    bgColor: 'bg-white',
    borderColor: 'border-stone-200',
    icon: '🔵',
    label: 'Continue with Google',
    spinnerColor: '#44403c',
    textColor: 'text-stone-800',
  },
} as const;

function LoadingSpinner({ color }: { color: string }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(rotation);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          borderColor: color,
          borderRadius: 10,
          borderTopColor: 'transparent',
          borderWidth: 2,
          height: 20,
          width: 20,
        },
      ]}
    />
  );
}

export function SocialSignInButton({
  disabled,
  isLoading,
  onPress,
  provider,
}: SocialSignInButtonProps) {
  const config = PROVIDER_CONFIG[provider];

  // Hide Apple button on Android
  if (provider === 'apple' && Platform.OS === 'android') {
    return null;
  }

  const isDisabled = isLoading || disabled;

  return (
    <TouchableOpacity
      accessibilityHint={`Sign in using your ${provider === 'apple' ? 'Apple' : 'Google'} account`}
      accessibilityLabel={config.label}
      accessibilityRole='button'
      accessibilityState={{ busy: isLoading, disabled: isDisabled }}
      className={`flex-row items-center justify-center rounded-3xl border py-4 ${config.borderColor} ${config.bgColor} ${
        isDisabled ? 'opacity-40' : ''
      }`}
      disabled={isDisabled}
      onPress={onPress}
    >
      <View className='mr-2 h-5 w-5 items-center justify-center'>
        {isLoading ? (
          <LoadingSpinner color={config.spinnerColor} />
        ) : (
          <Text className='text-lg'>{config.icon}</Text>
        )}
      </View>
      <Text className={`text-[15px] font-semibold ${config.textColor}`}>
        {isLoading ? 'Signing in...' : config.label}
      </Text>
    </TouchableOpacity>
  );
}
