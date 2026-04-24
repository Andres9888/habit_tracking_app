import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '../../../theme/animations';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
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
    <View style={styles.section}>
      <Animated.Text
        entering={FadeInDown.delay(BASE_DELAY).duration(durations.enter).easing(enterEasing)}
        style={[styles.sectionTitle, { color: colors.text.primary }]}
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

const styles = StyleSheet.create({
  section: {
    flexDirection: 'column',
    gap: spacing.md,
    marginBottom: spacing.xl, // 32px ~ mb-8
  },
  sectionTitle: {
    ...typography.button,
    letterSpacing: -0.41,
    lineHeight: 22,
    paddingHorizontal: spacing.xs,
  },
});
