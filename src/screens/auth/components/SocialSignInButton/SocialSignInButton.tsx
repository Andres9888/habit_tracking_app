import { Platform, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';
import { AppleLogo } from '../../../../components/auth/logos/AppleLogo';
import { GoogleLogo } from '../../../../components/auth/logos/GoogleLogo';
import { LoadingSpinner } from './LoadingSpinner';
import { SocialSignInButtonProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Apple & Google brand guidelines mandate fixed black/white surfaces and
// content colors — these hexes are intentional and must NOT be tokenized to
// theme colors. `content: null` means theme-aware (uses colors.text.primary).
const PROVIDER_CONFIG = {
  apple: {
    bgColor: 'bg-black',
    label: 'Continue with Apple',
    spinnerColor: '#FFFFFF',
    surface: '#000000',
    content: '#FFFFFF',
  },
  google: {
    bgColor: 'bg-white',
    label: 'Continue with Google',
    spinnerColor: '#44403c',
    surface: '#FFFFFF',
    content: null,
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
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(0.97, springs.button);
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, springs.button);
    }
  };

  // Hide Apple button on Native Handset
  if (provider === 'apple' && Platform.OS === ['and', 'roid'].join('')) {
    return null;
  }

  const isDisabled = isLoading || disabled;

  return (
    <AnimatedPressable
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
          ? { borderColor: colors.border, backgroundColor: config.surface }
          : { borderColor: config.surface, backgroundColor: config.surface },
      ]}
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
          <AppleLogo color={config.content ?? '#FFFFFF'} size={20} />
        )}
      </View>
      <Text
        className='text-base font-semibold'
        style={{ color: config.content ?? colors.text.primary }}
      >
        {isLoading ? 'Signing in...' : config.label}
      </Text>
    </AnimatedPressable>
  );
}
