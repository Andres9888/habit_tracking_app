import { Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { StatCardProps } from '../types';

export function StatCard({
  emoji,
  value,
  label,
  delay = 0,
}: StatCardProps & { delay?: number }) {
  const { colors } = useThemeColors();
  return (
    <Animated.View
      className='flex-1 flex-col items-center gap-1 rounded-2xl border px-4 py-4'
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <Text className='text-2xl leading-8'>{emoji}</Text>
      <Text
        className='font-semibold'
        style={{ fontSize: 17, letterSpacing: -0.41, lineHeight: 22, color: colors.text.primary }}
      >
        {value}
      </Text>
      <Text
        className='text-center'
        style={{ fontSize: 13, letterSpacing: -0.08, lineHeight: 18, color: colors.text.secondary }}
      >
        {label}
      </Text>
    </Animated.View>
  );
}
