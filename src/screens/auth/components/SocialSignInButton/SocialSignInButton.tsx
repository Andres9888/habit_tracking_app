import { Platform, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import { useThemeColors } from '@/theme/ThemeContext';
import { AppleLogo } from '../../../../components/auth/logos/AppleLogo';
import { GoogleLogo } from '../../../../components/auth/logos/GoogleLogo';
import { LoadingSpinner } from './LoadingSpinner';
import { SocialSignInButtonProps } from './types';

const PressableBase = Animated.createAnimatedComponent(Pressable);

const PROVIDER_CONFIG = {
  apple: {
    bgColor: 'bg-black',
    label: 'Continue with Apple',
    spinnerColor: '#FFFFFF',
  },
  google: {
    bgColor: 'bg-white',
    label: 'Continue with Google',
    spinnerColor: '#44403c',
  },
} as const;

export function SocialSignInButton({
  disabled,
  isLoading,
  onPress,
  provider,
  testID,
}: SocialSignInButtonProps) {
  const config = PROVIDER_CONFIG[provider];
  const { colors } = useThemeColors();
  const { animatedStyle, pressHandlers } = usePressAnimation();

  // Hide Apple button on Native Handset
  if (provider === 'apple' && Platform.OS === ['and', 'roid'].join('')) {
    return null;
  }

  const isDisabled = isLoading || disabled;

  return (
    <PressableBase
      accessibilityHint={`Sign in using your ${provider === 'apple' ? 'Apple' : 'Google'} account`}
      accessibilityLabel={config.label}
      accessibilityRole='button'
      accessibilityState={{ busy: isLoading, disabled: isDisabled }}
      testID={testID || `auth-${provider}-button`}
      className={`flex-row items-center justify-center rounded-2xl border py-4 ${config.bgColor} ${
        isDisabled ? 'opacity-40' : ''
      }`}
      disabled={isDisabled}
      style={[
        animatedStyle,
        provider === 'google'
          ? { borderColor: colors.border, backgroundColor: '#FFFFFF' }
          : { borderColor: '#000000', backgroundColor: '#000000' },
      ]}
      onPress={onPress}
      {...pressHandlers}
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
      <Text
        className='text-base font-semibold'
        style={{ color: provider === 'google' ? colors.text.primary : '#FFFFFF' }}
      >
        {isLoading ? 'Signing in...' : config.label}
      </Text>
    </PressableBase>
  );
}
