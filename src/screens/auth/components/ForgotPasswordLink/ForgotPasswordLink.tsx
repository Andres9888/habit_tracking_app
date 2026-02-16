import { StyleSheet, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface ForgotPasswordLinkProps {
  onPress: () => void;
}

export function ForgotPasswordLink({ onPress }: ForgotPasswordLinkProps) {
  const { colors } = useThemeColors();

  return (
    <AnimatedPressable
      accessibilityHint='Navigate to password reset screen'
      accessibilityLabel='Forgot password?'
      accessibilityRole='button'
      hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: colors.primary[500] }]}>
        Forgot?
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
