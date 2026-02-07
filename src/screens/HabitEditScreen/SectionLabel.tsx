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
      entering={FadeInUp.duration(240).delay(delay)}
    >
      <Text
        className={`text-center text-xs font-semibold ${color}`}
        style={{ letterSpacing: 0.5 }}
      >
        {text}
      </Text>
    </Animated.View>
  );
}
