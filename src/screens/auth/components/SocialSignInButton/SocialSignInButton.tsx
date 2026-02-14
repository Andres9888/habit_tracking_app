import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { useThemeColors } from '../../../../theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SocialSignInButton({
  disabled,
  isLoading,
  onPress,
  provider,
}: SocialSignInButtonProps) {
  const { colors, isDark } = useThemeColors();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(0.97, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, { damping: 15 });
    }
  };

  // Hide Apple button on Android
  if (provider === 'apple' && Platform.OS === 'android') {
    return null;
  }

  const isDisabled = isLoading || disabled;

  // Apple button: always dark bg, white text
  // Google button: adapts to theme
  const isApple = provider === 'apple';
  const bgColor = isApple
    ? isDark ? '#E5E7EB' : '#000000'
    : isDark ? colors.card : '#ffffff';
  const borderColor = isApple
    ? isDark ? '#E5E7EB' : '#000000'
    : colors.border;
  const textColor = isApple
    ? isDark ? '#111827' : '#ffffff'
    : colors.text.primary;
  const spinnerColor = isApple
    ? isDark ? '#111827' : '#FFFFFF'
    : colors.text.secondary;
  const appleLogoColor = isDark ? '#111827' : '#FFFFFF';
  const labelText = isApple ? 'Continue with Apple' : 'Continue with Google';

  return (
    <AnimatedPressable
      accessibilityHint={`Sign in using your ${isApple ? 'Apple' : 'Google'} account`}
      accessibilityLabel={labelText}
      accessibilityRole='button'
      accessibilityState={{ busy: isLoading, disabled: isDisabled }}
      disabled={isDisabled}
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          borderColor,
          opacity: isDisabled ? 0.4 : 1,
        },
        animatedStyle,
      ]}
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
        ) : isApple ? (
          <AppleLogo color={appleLogoColor} size={20} />
        ) : (
          <GoogleLogo size={20} />
        )}
      </View>
      <Text style={[styles.label, { color: textColor }]}>
        {isLoading ? 'Signing in...' : labelText}
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
