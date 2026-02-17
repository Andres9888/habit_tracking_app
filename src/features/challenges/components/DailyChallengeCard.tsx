/**
 * DailyChallengeCard - Dismissible challenge card for the main habits screen
 *
 * Displays the active daily challenge with progress, XP reward,
 * and a premium badge for exclusive challenges.
 * Follows the design system: 16px border radius, warm palette, SF Pro typography.
 */

import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { CHALLENGES } from '../challengeDefinitions';
import type { ChallengeProgress } from '../types';

interface DailyChallengeCardProps {
  challenge: ChallengeProgress;
  isPremiumUser: boolean;
  reduceMotion: boolean;
  onDismiss: () => void;
  onComplete: (xpReward: number) => void;
}

const SPRING_CONFIG = { damping: 18, stiffness: 180 };

export function DailyChallengeCard({
  challenge,
  isPremiumUser,
  reduceMotion,
  onDismiss,
  onComplete,
}: DailyChallengeCardProps) {
  const { colors, isDark } = useThemeColors();
  const scale = useSharedValue(1);

  const definition = CHALLENGES.find((c) => c.id === challenge.challengeId);
  if (!definition) return null;

  const progressPercent =
    challenge.targetProgress > 0
      ? Math.round((challenge.currentProgress / challenge.targetProgress) * 100)
      : 0;

  const isComplete =
    challenge.currentProgress >= challenge.targetProgress &&
    !challenge.completed;

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const handleComplete = useCallback(() => {
    if (isComplete) {
      onComplete(definition.xpReward);
    }
  }, [isComplete, onComplete, definition.xpReward]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isPremiumChallenge = definition.tier === 'premium';
  const showPremiumBadge = isPremiumChallenge && isPremiumUser;

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(280).springify().damping(18)}
      exiting={reduceMotion ? undefined : FadeOutUp.duration(200)}
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleComplete}
          style={[
            styles.card,
            {
              backgroundColor: isDark ? colors.card : colors.card,
              borderColor: isComplete
                ? colors.primary[500]
                : colors.border,
              shadowColor: isDark ? '#000' : '#8B7355',
            },
          ]}
        >
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <Text style={styles.emoji}>{definition.emoji}</Text>
              <View style={styles.titleBlock}>
                <View style={styles.titleWithBadge}>
                  <Text
                    style={[styles.title, { color: colors.text.primary }]}
                    numberOfLines={1}
                  >
                    {definition.title}
                  </Text>
                  {showPremiumBadge && (
                    <View
                      style={[
                        styles.premiumBadge,
                        { backgroundColor: '#7B52C4' },
                      ]}
                    >
                      <Text style={styles.premiumBadgeText}>PRO</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[styles.description, { color: colors.text.secondary }]}
                  numberOfLines={2}
                >
                  {definition.description}
                </Text>
              </View>
            </View>
            <Pressable
              hitSlop={12}
              onPress={onDismiss}
              style={styles.dismissButton}
            >
              <Text style={[styles.dismissText, { color: colors.text.tertiary }]}>
                ✕
              </Text>
            </Pressable>
          </View>

          {/* Progress bar */}
          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.06)',
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: colors.primary[500],
                },
              ]}
            />
          </View>

          {/* Footer row */}
          <View style={styles.footerRow}>
            <Text style={[styles.progressText, { color: colors.text.secondary }]}>
              {challenge.completed
                ? '✅ Completed!'
                : `${challenge.currentProgress}/${challenge.targetProgress} ${definition.durationDays === 1 ? 'done' : 'days'}`}
            </Text>
            <View style={styles.xpBadge}>
              <Text style={[styles.xpText, { color: '#D4A030' }]}>
                +{definition.xpReward} XP
              </Text>
            </View>
          </View>

          {isComplete && !challenge.completed && (
            <View
              style={[
                styles.claimButton,
                { backgroundColor: colors.primary[600] },
              ]}
            >
              <Text style={styles.claimText}>Claim Reward!</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 0,
    marginVertical: 8,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  claimButton: {
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 12,
    paddingVertical: 10,
  },
  claimText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  dismissButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  premiumBadge: {
    borderRadius: 6,
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressFill: {
    borderRadius: 3,
    height: '100%',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
  },
  progressTrack: {
    borderRadius: 3,
    height: 6,
    marginTop: 14,
    overflow: 'hidden',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  titleBlock: {
    flex: 1,
  },
  titleRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  titleWithBadge: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  xpBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  xpText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
