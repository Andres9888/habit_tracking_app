import { Platform, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AppleLogo } from '../../../../components/auth/logos/AppleLogo';
import { GoogleLogo } from '../../../../components/auth/logos/GoogleLogo';
import { LoadingSpinner } from './LoadingSpinner';
import { SocialSignInButtonProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PROVIDER_CONFIG = {
  apple: {
    bgColor: 'bg-black',
    borderColor: 'border-black',
    label: 'Continue with Apple',
    spinnerColor: '#FFFFFF',
    textColor: 'text-white',
  },
  google: {
    bgColor: 'bg-white',
    borderColor: 'border-stone-200',
    label: 'Continue with Google',
    spinnerColor: '#44403c',
    textColor: 'text-stone-800',
  },
} as const;

export function SocialSignInButton({
  disabled,
  isLoading,
  onPress,
  provider,
}: SocialSignInButtonProps) {
  const config = PROVIDER_CONFIG[provider];
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(0.97, { damping: 18, stiffness: 240 });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, { damping: 18, stiffness: 240 });
    }
  };

  // Hide Apple button on Android
  if (provider === 'apple' && Platform.OS === 'android') {
    return null;
  }

  const isDisabled = isLoading || disabled;

  return (
    <AnimatedPressable
      accessibilityHint={`Sign in using your ${provider === 'apple' ? 'Apple' : 'Google'} account`}
      accessibilityLabel={config.label}
      accessibilityRole='button'
      accessibilityState={{ busy: isLoading, disabled: isDisabled }}
      className={`flex-row items-center justify-center rounded-2xl border py-4 ${config.borderColor} ${config.bgColor} ${
        isDisabled ? 'opacity-40' : ''
      }`}
      disabled={isDisabled}
      style={animatedStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        className='mr-2 h-5 w-5 items-center justify-center'
        testID={isLoading ? 'social-button-spinner' : `${provider}-logo`}
      >
        {isLoading ? (
          <LoadingSpinner color={config.spinnerColor} />
        ) : provider === 'google' ? (
          <GoogleLogo size={20} />
        ) : (
          <AppleLogo color='#FFFFFF' size={20} />
        )}
      </View>
      <Text className={`text-[15px] font-semibold ${config.textColor}`}>
        {isLoading ? 'Signing in...' : config.label}
      </Text>
    </AnimatedPressable>
  );
}
