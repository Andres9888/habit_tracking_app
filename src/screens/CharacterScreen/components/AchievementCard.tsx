import { View, Text } from 'react-native';
import { Trophy } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { Achievement } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
  delay?: number;
}

export function AchievementCard({
  achievement,
  delay = 0,
}: AchievementCardProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <Animated.View
      className='flex-row items-center gap-4 rounded-3xl px-6 py-6'
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
      <View
        className='h-12 w-12 items-center justify-center rounded-full shadow-sm'
        style={{ backgroundColor: isDark ? '#78350F' : '#FFF7ED' }}
      >
        <Trophy color='#f59e0b' size={24} />
      </View>
      <View className='flex-1 flex-col'>
        <Text
          className='font-semibold'
          style={{
            color: colors.text.primary,
            fontSize: 17,
            letterSpacing: -0.41,
            lineHeight: 22,
          }}
        >
          {achievement.title}
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 13,
            letterSpacing: -0.08,
            lineHeight: 18,
          }}
        >
          {achievement.description}
        </Text>
      </View>
      <Text className='text-2xl'>{achievement.icon}</Text>
    </Animated.View>
  );
}
