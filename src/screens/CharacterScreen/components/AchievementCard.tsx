import { View, Text, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies, typography, fontWeights } from '../../../theme/typography';
import { spacing, borderRadius, shadows } from '../../../theme/spacing';
import type { Achievement } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
  delay?: number;
}

export function AchievementCard({
  achievement,
  delay = 0,
}: AchievementCardProps) {
  const { colors } = useThemeColors();
  const badgeBgColor = colors.streak[100];
  const trophyColor = colors.streak[700];

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          shadowColor: colors.text.primary,
        },
      ]}
    >
      <View
        style={[styles.badge, { backgroundColor: badgeBgColor }]}
      >
        <Trophy color={trophyColor} size={iconSizes.large} />
      </View>
      <View style={styles.textCol}>
        <Text
          style={[styles.title, { color: colors.text.primary }]}
        >
          {achievement.title}
        </Text>
        <Text
          style={[styles.description, { color: colors.text.secondary }]}
        >
          {achievement.description}
        </Text>
      </View>
      <Text style={styles.icon}>{achievement.icon}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  card: {
    ...shadows.subtle,
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  description: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    letterSpacing: -0.08,
    lineHeight: 18,
  },
  icon: {
    fontSize: typography.heading2.fontSize,
  },
  textCol: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.41,
    lineHeight: 22,
  },
});
