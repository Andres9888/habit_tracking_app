import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import HabitStrengthIndicator from './HabitStrengthIndicator/HabitStrengthIndicator';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface HabitRanking {
  id: string;
  name: string;
  emoji: string;
  strength: number;
  currentStreak: number;
  longestStreak: number;
  isAtRisk: boolean;
}

interface Props {
  habits: HabitRanking[];
  onHabitPress?: (habitId: string) => void;
}

const getRankBadge = (rank: number) => {
  if (rank === 1) return { color: '#FFD700', icon: '🥇' };
  if (rank === 2) return { color: '#C0C0C0', icon: '🥈' };
  if (rank === 3) return { color: '#CD7F32', icon: '🥉' };
  return null;
};

export default function HabitRankingsList({ habits, onHabitPress }: Props) {
  // const navigation = useNavigation();

  const handleHabitPress = (habitId: string) => {
    if (onHabitPress) {
      onHabitPress(habitId);
    } else {
      // navigation.navigate('HabitDetail', { habitId });
      console.log('Navigate to habit detail:', habitId);
    }
  };

  const renderHabitItem = ({
    item,
    index,
  }: {
    item: HabitRanking;
    index: number;
  }) => {
    const rankBadge = getRankBadge(index + 1);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.habitItem}
        onPress={() => handleHabitPress(item.id)}
      >
        <View style={styles.habitItemLeft}>
          {/* Rank number or badge */}
          <View style={styles.rankContainer}>
            {rankBadge ? (
              <Text style={styles.rankBadge}>{rankBadge.icon}</Text>
            ) : (
              <Text style={styles.rankNumber}>#{index + 1}</Text>
            )}
          </View>

          {/* Habit info */}
          <View style={styles.habitInfo}>
            <View style={styles.habitHeader}>
              <Text style={styles.habitEmoji}>{item.emoji}</Text>
              <Text numberOfLines={1} style={styles.habitName}>
                {item.name}
              </Text>
              {item.isAtRisk && (
                <View style={styles.riskBadge}>
                  <Ionicons color={colors.error} name='warning' size={12} />
                  <Text style={styles.riskText}>At Risk</Text>
                </View>
              )}
            </View>

            <View style={styles.habitStats}>
              <View style={styles.statItem}>
                <Ionicons color={colors.text.tertiary} name='flame' size={14} />
                <Text style={styles.statText}>{item.currentStreak} days</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons
                  color={colors.text.tertiary}
                  name='trophy'
                  size={14}
                />
                <Text style={styles.statText}>Best: {item.longestStreak}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Strength indicator */}
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
      </TouchableOpacity>
    );
  };

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons color={colors.text.tertiary} name='list-outline' size={48} />
        <Text style={styles.emptyText}>No habits to rank yet</Text>
        <Text style={styles.emptySubtext}>
          Complete some habits to see your rankings
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={habits}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item) => item.id}
      nestedScrollEnabled
      renderItem={renderHabitItem}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  habitEmoji: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  habitHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  habitInfo: {
    flex: 1,
  },
  habitItem: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  habitItemLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  habitItemRight: {
    alignItems: 'flex-end',
    marginLeft: spacing.md,
  },
  habitName: {
    ...typography.bodyBold,
    color: colors.text.primary,
    flex: 1,
  },
  habitStats: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  listContainer: {
    paddingVertical: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    justifyContent: 'center',
  },
  rankBadge: {
    fontSize: 24,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  rankContainer: {
    alignItems: 'center',
    width: 32,
    marginRight: spacing.md,
  },
  emptyText: {
    ...typography.h3,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  rankNumber: {
    ...typography.bodyBold,
    color: colors.text.tertiary,
    fontSize: 14,
  },
  riskBadge: {
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
    flexDirection: 'row',
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  riskText: {
    ...typography.caption,
    color: colors.error,
    fontSize: 10,
    marginLeft: 2,
  },
  separator: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: spacing.xs,
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: spacing.md,
  },
  statText: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginLeft: spacing.xxs,
  },
  strengthPercentage: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
});
