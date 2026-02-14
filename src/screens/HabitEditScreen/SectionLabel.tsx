/** Section label with animation */
import { Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';

interface SectionLabelProps {
  text: string;
  delay: number;
  variant?: 'default' | 'danger';
}

export function SectionLabel({
  text,
  delay,
  variant = 'default',
}: SectionLabelProps) {
  const { colors, isDark } = useThemeColors();

  const textColor =
    variant === 'danger'
      ? isDark
        ? '#FCA5A5'
        : '#F87171'
      : colors.text.tertiary;

  return (
    <Animated.View
      className='mb-4 mt-8'
      entering={FadeInUp.delay(delay).springify().damping(18)}
    >
      <Text
        className='text-center font-semibold'
        style={{ fontSize: 13, letterSpacing: 0.5, lineHeight: 18, color: textColor }}
      >
        {text}
      </Text>
    </Animated.View>
  );
}
