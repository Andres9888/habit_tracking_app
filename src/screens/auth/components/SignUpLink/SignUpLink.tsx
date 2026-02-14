import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface SignUpLinkProps {
  disabled?: boolean;
  onPress: () => void;
}

export function SignUpLink({ disabled, onPress }: SignUpLinkProps) {
  const { colors } = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text.secondary }]}>
        Don't have an account?{' '}
      </Text>
      <AnimatedPressable
        accessibilityLabel='Create a new account'
        accessibilityRole='link'
        accessibilityState={{ disabled }}
        disableAnimation={disabled}
        disabled={disabled}
        onPress={onPress}
      >
        <Text style={styles.link}>Sign up</Text>
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
