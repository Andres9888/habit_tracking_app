/** Section label with animation — divider lines match HabitDetailContent style */
import { View, Text } from 'react-native';
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
  const textColor = variant === 'danger' ? 'text-red-400' : 'text-stone-400';
  const lineColor = variant === 'danger' ? 'bg-red-200' : 'bg-stone-200';
  return (
    <Animated.View
      className='mb-3 mt-6 flex-row items-center justify-center gap-2 px-4'
      entering={FadeInUp.delay(delay).springify().damping(18)}
    >
      <View className={`h-px flex-1 ${lineColor}`} />
      <Text
        className={`font-semibold tracking-wider ${textColor}`}
        style={{ fontSize: 13, letterSpacing: 0.5, lineHeight: 18 }}
      >
        {text}
      </Text>
      <View className={`h-px flex-1 ${lineColor}`} />
    </Animated.View>
  );
}
