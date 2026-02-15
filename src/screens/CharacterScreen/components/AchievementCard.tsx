import { View, Text, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Achievement } from '../types';
import { useThemeColors } from '@/theme/ThemeContext';

interface AchievementCardProps {
  achievement: Achievement;
  delay?: number;
}

export function AchievementCard({
  achievement,
  delay = 0,
}: AchievementCardProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <View className='h-12 w-12 items-center justify-center rounded-full bg-orange-100 shadow-sm'>
        <Trophy color='#f59e0b' size={24} />
      </View>
      <View className='flex-1 flex-col'>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {achievement.title}
        </Text>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          {achievement.description}
        </Text>
      </View>
      <Text className='text-2xl'>{achievement.icon}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  description: {
    fontSize: 13,
    letterSpacing: -0.08,
    lineHeight: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    lineHeight: 22,
  },
});
