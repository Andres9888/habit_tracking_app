import { View, Text, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '../../../theme/typography';
import { spacing, borderRadius } from '../../../theme/spacing';
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
  const badgeBgColor = isDark ? '#333D2B' : '#FEF3C7';
  const trophyColor = '#F59E0B';

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
        <Trophy color={trophyColor} size={24} />
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
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.base,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  description: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    letterSpacing: -0.08,
    lineHeight: 18,
  },
  icon: {
    fontSize: 24,
  },
  textCol: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    lineHeight: 22,
  },
});
