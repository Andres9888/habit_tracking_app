/** Section label with animation — dark mode aware */
import { Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { typography } from '../../theme/typography';

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
  const { colors } = useThemeColors();
  const color = variant === 'danger' ? '#F87171' : colors.text.tertiary;

  return (
    <Animated.View
      className='mb-4 mt-8'
      entering={FadeInUp.delay(delay).springify().damping(18)}
    >
      <Text
        className={`text-center font-semibold ${color}`}
        style={[typography.caption, { letterSpacing: 0.5 }]}
      >
        {text}
      </Text>
    </Animated.View>
  );
}
