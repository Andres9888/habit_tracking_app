import { View, Text } from 'react-native';
import { useThemeColors } from '../../../theme';

interface StreakHighlightProps {
  streak: number;
}

export function StreakHighlight({ streak }: StreakHighlightProps) {
  const { colors, isDark } = useThemeColors();

  if (streak < 3) return null;

  return (
    <View
      className='mt-3 flex-row items-center justify-center gap-2 rounded-full py-2'
      style={{ backgroundColor: isDark ? '#78350f' : '#fef3c7' }}
    >
      <Text className='text-[15px]'>🔥</Text>
      <Text
        className='text-[13px] font-bold'
        style={{ color: isDark ? '#fbbf24' : '#b45309' }}
      >
        {streak} day streak! Keep it going!
      </Text>
    </View>
  );
}
