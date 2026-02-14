import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface SignInLinkProps {
  disabled?: boolean;
  onPress: () => void;
  className?: string;
}

export function SignInLink({
  disabled,
  onPress,
  className: _className,
}: SignInLinkProps) {
  const { colors } = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text.secondary }]}>
        Already have an account?{' '}
      </Text>
      <AnimatedPressable
        accessibilityLabel='Sign in to existing account'
        accessibilityRole='link'
        accessibilityState={{ disabled }}
        disableAnimation={disabled}
        disabled={disabled}
        onPress={onPress}
      >
        <Text style={styles.link}>Sign in</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  link: {
    color: '#047857',
    fontSize: 14,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
  },
});
