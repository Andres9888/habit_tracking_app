/** Section label with animation — dark mode aware, with separator lines */
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme';

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
  const color = variant === 'danger' ? colors.primary[500] : colors.text.tertiary;
  const borderColor = colors.border;

  return (
    <Animated.View
      className='mb-3 mt-6 flex-row items-center justify-center gap-2 px-4'
      entering={FadeInUp.delay(delay).springify().damping(18)}
    >
      <View className='h-px flex-1' style={{ backgroundColor: borderColor }} />
      <Text
        className='text-[13px] font-semibold tracking-wider'
        style={{ color }}
      >
        {text}
      </Text>
      <View className='h-px flex-1' style={{ backgroundColor: borderColor }} />
    </Animated.View>
  );
}
