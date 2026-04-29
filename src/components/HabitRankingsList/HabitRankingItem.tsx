/**
 * HabitRankingItem Component
 * Individual habit item in the rankings list
 */

import React, { memo, useCallback } from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle, Flame, Trophy } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import HabitStrengthIndicator from '../HabitStrengthIndicator/HabitStrengthIndicator';
import { colors } from '../../theme/colors';
import { itemStyles as styles } from './itemStyles';
import type { HabitRanking, RankBadge } from './types';

interface HabitRankingItemProps {
  item: HabitRanking;
  rank: number;
  rankBadge: RankBadge | null;
  onPress: (id: string) => void;
}

export const HabitRankingItem = memo(function HabitRankingItem({
  item,
  rank,
  rankBadge,
  onPress,
}: HabitRankingItemProps) {
  const handlePress = useCallback(() => onPress(item.id), [onPress, item.id]);
  return (
    <AnimatedPressable
      accessibilityHint='Opens habit detail'
      accessibilityLabel={`${item.emoji} ${item.name}, rank ${rank}, ${Math.round(item.strength)}% strength, ${item.currentStreak} day streak${item.isAtRisk ? ', at risk' : ''}`}
      accessibilityRole='button'
      style={styles.habitItem}
      onPress={handlePress}
    >
      <View style={styles.habitItemLeft}>
        <View style={styles.rankContainer}>
          {rankBadge ? (
            <Text style={styles.rankBadge}>{rankBadge.icon}</Text>
          ) : (
            <Text style={styles.rankNumber}>#{rank}</Text>
          )}
        </View>

        <View style={styles.habitInfo}>
          <View style={styles.habitHeader}>
            <Text style={styles.habitEmoji}>{item.emoji}</Text>
            <Text numberOfLines={1} style={styles.habitName}>
              {item.name}
            </Text>
            {item.isAtRisk ? <View style={styles.riskBadge}>
                <AlertTriangle color={colors.error} size={iconSizes.micro} />
                <Text style={styles.riskText}>At Risk</Text>
              </View> : null}
          </View>

          <View style={styles.habitStats}>
            <View style={styles.statItem}>
              <Flame color={colors.text.tertiary} size={iconSizes.small} />
              <Text style={styles.statText}>{item.currentStreak} days</Text>
            </View>
            <View style={styles.statItem}>
              <Trophy color={colors.text.tertiary} size={iconSizes.small} />
              <Text style={styles.statText}>Best: {item.longestStreak}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.habitItemRight}>
        <Text style={styles.strengthPercentage}>
          {Math.round(item.strength)}%
        </Text>
        <HabitStrengthIndicator
          showLabel={false}
          strength={item.strength}
          variant='compact'
        />
      </View>
    </AnimatedPressable>
  );
});
