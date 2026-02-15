import { Platform, Pressable, Text, View, StyleSheet } from 'react-native';
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
import { useThemeColors } from '@/theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PROVIDER_CONFIG = {
  apple: {
    label: 'Continue with Apple',
    spinnerColor: '#FFFFFF',
  },
  google: {
    label: 'Continue with Google',
  },
} as const;

export function SocialSignInButton({
  disabled,
  isLoading,
  onPress,
  provider,
  testID,
}: SocialSignInButtonProps) {
  const { colors } = useThemeColors();
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
  
  // Apple uses black bg, Google uses card color
  const bgColor = provider === 'apple' ? '#000000' : colors.surface;
  const textColor = provider === 'apple' ? '#FFFFFF' : colors.text.primary;
  const borderColor = provider === 'apple' ? '#000000' : colors.cardBorder;
  const spinnerColor = provider === 'apple' ? '#FFFFFF' : colors.text.primary;

  return (
    <AnimatedPressable
      accessibilityHint={`Sign in using your ${provider === 'apple' ? 'Apple' : 'Google'} account`}
      accessibilityLabel={config.label}
      accessibilityRole='button'
      accessibilityState={{ busy: isLoading, disabled: isDisabled }}
      disabled={isDisabled}
      style={[
        animatedStyle,
        styles.button,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
        },
        isDisabled && styles.disabled,
      ]}
      testID={testID || `auth-${provider}-button`}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        style={styles.iconContainer}
        testID={isLoading ? 'social-button-spinner' : `${provider}-logo`}
      >
        {isLoading ? (
          <LoadingSpinner color={spinnerColor} />
        ) : provider === 'google' ? (
          <GoogleLogo size={20} />
        ) : (
          <AppleLogo color='#FFFFFF' size={20} />
        )}
      </View>
      <Text style={[styles.label, { color: textColor }]}>
        {isLoading ? 'Signing in...' : config.label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  disabled: {
    opacity: 0.4,
  },
  iconContainer: {
    alignItems: 'center',
    height: 20,
    justifyContent: 'center',
    marginRight: 8,
    width: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
