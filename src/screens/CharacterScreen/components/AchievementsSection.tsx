import { View, Text } from 'react-native';
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
    <View
      accessible
      accessibilityLabel={`Recent achievements: ${achievements.length} unlocked`}
      accessibilityRole="none"
      style={{ marginBottom: 32, gap: 12 }}
    >
      <Animated.Text
        accessibilityRole="header"
        entering={FadeInDown.delay(BASE_DELAY).springify().damping(18)}
        style={{ paddingHorizontal: 4, fontWeight: '600', fontSize: 17, letterSpacing: -0.41, lineHeight: 22, color: colors.text.primary }}
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
