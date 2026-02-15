import { Text, View, StyleSheet } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';

interface SignUpLinkProps {
  disabled?: boolean;
  onPress: () => void;
}

export function SignUpLink({ disabled, onPress }: SignUpLinkProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mt-6 flex-row items-center justify-center'>
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
        <Text style={[styles.link, { color: colors.primary[600] }]}>
          Sign up
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
