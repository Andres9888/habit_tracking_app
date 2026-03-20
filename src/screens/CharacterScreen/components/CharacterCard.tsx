import { View, Text, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing, borderRadius } from '../../../theme/spacing';
import { AVATAR_GRADIENT, XP_GRADIENT, TROPHY_GRADIENT } from '../constants';
import type { CharacterData } from '../types';

interface CharacterCardProps {
  data: CharacterData;
}

export function CharacterCard({ data }: CharacterCardProps) {
  const xpToNextLevel = data.xpToNextLevel || 1;
  const xpProgress = (data.xp / xpToNextLevel) * 100;
  const xpRemaining = xpToNextLevel - data.xp;
  const { colors } = useThemeColors();

  return (
    <Animated.View
      entering={FadeInDown.delay(60).springify().damping(18)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          shadowColor: colors.text.primary,
        },
      ]}
    >
      <View style={styles.cardInner}>
        <View style={styles.headerRow}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={AVATAR_GRADIENT}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarEmoji}>🦸</Text>
              </LinearGradient>
            </View>
            <View style={styles.levelCol}>
              <View style={styles.levelRow}>
                <Text style={[styles.levelText, { color: colors.text.primary }]}>
                  Level {data.level}
                </Text>
                <Text style={styles.sparkleEmoji}>✨</Text>
              </View>
              <Text style={[styles.titleText, { color: colors.text.secondary }]}>
                {data.title}
              </Text>
            </View>
          </View>
          <View style={styles.trophyBadge}>
            <LinearGradient
              colors={TROPHY_GRADIENT}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={styles.trophyGradient}
            >
              <Trophy color='white' size={20} />
              <Text style={styles.trophyText}>{data.recentAchievements.length}</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.xpSection}>
          <View style={styles.xpLabelRow}>
            <Text style={[styles.xpLabel, { color: colors.text.secondary }]}>
              Experience
            </Text>
            <Text style={[styles.xpValue, { color: colors.text.primary }]}>
              {data.xp}/{data.xpToNextLevel} XP
            </Text>
          </View>
          <View style={[styles.xpBarTrack, { backgroundColor: colors.gray[200] }]}>
            <View style={{ width: `${xpProgress}%` }}>
              <LinearGradient
                colors={XP_GRADIENT}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={styles.xpBarFill}
              />
            </View>
          </View>
          <Text style={[styles.xpRemaining, { color: colors.text.tertiary }]}>
            {xpRemaining} XP to Level {data.level + 1}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 80,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 80,
  },
  avatarEmoji: {
    fontSize: 34,
    lineHeight: 41,
  },
  avatarGradient: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  avatarRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  cardInner: {
    flexDirection: 'column',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelCol: {
    flexDirection: 'column',
  },
  levelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  levelText: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
  sparkleEmoji: {
    fontSize: 17,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.15,
    lineHeight: 20,
  },
  trophyBadge: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  trophyGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  trophyText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
  xpBarFill: {
    borderRadius: borderRadius.full,
    height: '100%',
    width: '100%',
  },
  xpBarTrack: {
    borderRadius: borderRadius.full,
    height: 12,
    overflow: 'hidden',
    width: '100%',
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.15,
    lineHeight: 20,
  },
  xpLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpRemaining: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'center',
  },
  xpSection: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  xpValue: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.15,
    lineHeight: 20,
  },
});
