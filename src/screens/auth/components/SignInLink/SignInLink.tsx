import { Text, View, StyleSheet } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';

interface SignInLinkProps {
  disabled?: boolean;
  onPress: () => void;
  className?: string;
}

export function SignInLink({
  disabled,
  onPress,
  className = 'mt-2',
}: SignInLinkProps) {
  const { colors } = useThemeColors();

  return (
    <View className={`flex-row items-center justify-center ${className}`}>
      <Text style={[styles.text, { color: colors.text.secondary }]}>
        Already have an account?{' '}
      </Text>
      <AnimatedPressable
        accessibilityHint='Navigate to sign in screen'
        accessibilityLabel='Sign in to existing account'
        accessibilityRole='link'
        accessibilityState={{ disabled }}
        disableAnimation={disabled}
        disabled={disabled}
        onPress={onPress}
      >
        <Text style={[styles.link, { color: colors.primary[600] }]}>
          Sign in
        </Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
  },
});
