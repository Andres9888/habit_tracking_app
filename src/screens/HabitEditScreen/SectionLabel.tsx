/** Section label with animation */
import { Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

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
  const color = variant === 'danger' ? 'text-red-400' : 'text-stone-500';
  return (
    <Animated.View
      className='mb-4 mt-8'
      entering={FadeInUp.delay(delay).springify().damping(18)}
    >
      <Text
        className={`text-center font-semibold ${color}`}
        style={{ fontSize: 13, letterSpacing: 0.5, lineHeight: 18 }}
      >
        {text}
      </Text>
    </Animated.View>
  );
}
