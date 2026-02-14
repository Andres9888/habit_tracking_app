import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AchievementCard } from './AchievementCard';
import type { Achievement } from '../types';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const STAGGER_DELAY = 60;
const BASE_DELAY = 660;

export function AchievementsSection({
  achievements,
}: AchievementsSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-8 flex-col gap-3'>
      <Animated.Text
        className='px-1 font-semibold'
        entering={FadeInDown.delay(BASE_DELAY).springify().damping(18)}
        style={{
          color: colors.text.primary,
          fontSize: 17,
          letterSpacing: -0.41,
          lineHeight: 22,
        }}
      >
        Recent Achievements
      </Animated.Text>
      {achievements.map((achievement, index) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          delay={BASE_DELAY + STAGGER_DELAY * (index + 1)}
        />
      ))}
    </View>
  );
}
