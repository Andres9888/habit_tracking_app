/**
 * CharacterCard — progress-ring avatar + Literata tier heading + XP pill.
 * Replaces the prior horizontal-XP-bar layout; level progress is now conveyed
 * visually by the ring around the avatar so the numbers tell the story instead.
 */
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { tierForLevel } from '../tiers';
import type { CharacterData } from '../types';
import { AvatarProgressRing } from './AvatarProgressRing';
import { styles } from './CharacterCard.styles';

interface CharacterCardProps {
  data: CharacterData;
}

const ENTERING = FadeInDown.delay(60).springify().damping(18);

function formatXP(xp: number): string {
  return xp.toLocaleString();
}

export function CharacterCard({ data }: CharacterCardProps) {
  const { colors } = useThemeColors();
  const xpToNext = Math.max(1, data.xpToNextLevel);
  const progress = data.xp / xpToNext;
  const xpRemaining = Math.max(0, xpToNext - data.xp);
  const tier = data.title?.trim() ? data.title : tierForLevel(data.level);

  return (
    <Animated.View
      entering={ENTERING}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          shadowColor: colors.text.primary,
        },
      ]}
    >
      <AvatarProgressRing emoji='🦸' progress={progress} />
      <Text style={[styles.heading, { color: colors.text.primary }]}>
        Level {data.level} · {tier}
      </Text>
      <Text style={[styles.caption, { color: colors.text.secondary }]}>
        {xpRemaining} XP to Level {data.level + 1}
      </Text>
      <View
        accessibilityLabel={`${formatXP(data.xp)} experience points earned`}
        style={[styles.xpPill, { backgroundColor: colors.streak[100] }]}
      >
        <Text style={styles.xpPillEmoji}>🏆</Text>
        <Text style={[styles.xpPillText, { color: colors.streak[700] }]}>
          {formatXP(data.xp)} XP
        </Text>
      </View>
    </Animated.View>
  );
}
