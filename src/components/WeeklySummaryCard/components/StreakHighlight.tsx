import { View, Text } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

interface StreakHighlightProps {
  streak: number;
}

export function StreakHighlight({ streak }: StreakHighlightProps) {
  const { colors, isDark } = useThemeColors();

  if (streak < 3) return null;

  return (
    <View
      className='mt-3 flex-row items-center justify-center gap-2 rounded-full py-2'
      style={{ backgroundColor: isDark ? colors.gray[100] : '#fef3c7' }}
    >
      <Text className='text-base'>🔥</Text>
      <Text className='text-sm font-bold' style={{ color: isDark ? colors.primary[400] : '#b45309' }}>
        {streak} day streak! Keep it going!
      </Text>
    </View>
  );
}
