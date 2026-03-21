import { View, Text } from 'react-native';
import { Flame } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';

interface StreakBadgeProps {
  streak: number;
  bestStreak: number;
}

export function StreakBadge({ streak, bestStreak }: StreakBadgeProps) {
  const { colors } = useThemeColors();

  return (
    <View className='items-end'>
      <View className='flex-row items-center rounded-full px-3 py-1' style={{ backgroundColor: colors.status.streakLight }}>
        <Flame color={colors.status.streak} size={16} />
        <Text className='ml-1 text-xs font-semibold' style={{ color: colors.status.streakText }}>Current streak</Text>
      </View>
      <Text className='mt-2 text-lg font-semibold' style={{ color: colors.text.primary }}>{streak} days</Text>
      <Text className='text-xs' style={{ color: colors.text.tertiary }}>
        Best {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
      </Text>
    </View>
  );
}
