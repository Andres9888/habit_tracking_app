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
      accessibilityLabel={`Achievement: ${achievement.title}. ${achievement.description}`}
      accessibilityRole='summary'
      className='flex-row items-center gap-4 rounded-3xl border px-6 py-6'
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
      <View
        className='h-12 w-12 items-center justify-center rounded-full shadow-sm'
        style={{ backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#ffedd5' }}
      >
        <Trophy color='#f59e0b' size={24} />
      </View>
      <View className='flex-1 flex-col'>
        <Text
          className='font-semibold'
          style={{ fontSize: 17, letterSpacing: -0.41, lineHeight: 22, color: colors.text.primary }}
        >
          {achievement.title}
        </Text>
        <Text
          style={{ fontSize: 13, letterSpacing: -0.08, lineHeight: 18, color: colors.text.secondary }}
        >
          {achievement.description}
        </Text>
      </View>
      <Text className='text-2xl'>{achievement.icon}</Text>
    </Animated.View>
  );
}
