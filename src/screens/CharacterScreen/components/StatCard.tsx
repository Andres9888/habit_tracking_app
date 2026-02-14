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
  const { colors, isDark } = useThemeColors();

  return (
    <Animated.View
      className='flex-1 flex-col items-center gap-1 rounded-2xl px-4 py-4'
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
        borderWidth: 1,
        shadowColor: isDark ? '#000000' : '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 16,
      }}
    >
      <Text className='text-2xl leading-8'>{emoji}</Text>
      <Text
        className='font-semibold'
        style={{
          color: colors.text.primary,
          fontSize: 17,
          letterSpacing: -0.41,
          lineHeight: 22,
        }}
      >
        {value}
      </Text>
      <Text
        className='text-center'
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          letterSpacing: -0.08,
          lineHeight: 18,
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
}
