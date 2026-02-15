import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

export function SignUpHeader() {
  const { colors } = useThemeColors();

  return (
    <View className='mb-8'>
      <Animated.Text
        entering={FadeInDown.delay(0).springify().damping(18)}
        style={[styles.title, { color: colors.text.primary }]}
      >
        Create account
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(50).springify().damping(18)}
        style={[styles.subtitle, { color: colors.text.secondary }]}
      >
        Start your habit journey today
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
});
