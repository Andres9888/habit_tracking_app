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

  const renderHabitItem = ({ item, index }: { item: HabitRanking; index: number }) => {
    const getRankBadge = (rank: number) => {
      if (rank === 1) return { icon: '🥇', color: '#FFD700' };
      if (rank === 2) return { icon: '🥈', color: '#C0C0C0' };
      if (rank === 3) return { icon: '🥉', color: '#CD7F32' };
      return null;
    };

    const rankBadge = getRankBadge(index + 1);

    return (
      <TouchableOpacity
        style={styles.habitItem}
        onPress={() => handleHabitPress(item.id)}
        activeOpacity={0.7}
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
              <Text style={styles.habitName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.isAtRisk && (
                <View style={styles.riskBadge}>
                  <Ionicons name="warning" size={12} color={colors.error} />
                  <Text style={styles.riskText}>At Risk</Text>
                </View>
              )}
            </View>

            <View style={styles.habitStats}>
              <View style={styles.statItem}>
                <Ionicons name="flame" size={14} color={colors.text.tertiary} />
                <Text style={styles.statText}>{item.currentStreak} days</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={14} color={colors.text.tertiary} />
                <Text style={styles.statText}>Best: {item.longestStreak}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Strength indicator */}
        <View style={styles.habitItemRight}>
          <Text style={styles.strengthPercentage}>{Math.round(item.strength)}%</Text>
          <HabitStrengthIndicator
            strength={item.strength}
            variant="compact"
            showLabel={false}
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="list-outline" size={48} color={colors.text.tertiary} />
        <Text style={styles.emptyText}>No habits to rank yet</Text>
        <Text style={styles.emptySubtext}>
          Complete some habits to see your rankings
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={renderHabitItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: spacing.sm,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.xs,
  },
  habitItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rankNumber: {
    ...typography.bodyBold,
    color: colors.text.tertiary,
    fontSize: 14,
  },
  rankBadge: {
    fontSize: 24,
  },
  habitInfo: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  habitEmoji: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  habitName: {
    ...typography.bodyBold,
    color: colors.text.primary,
    flex: 1,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: spacing.xs,
  },
  riskText: {
    ...typography.caption,
    color: colors.error,
    marginLeft: 2,
    fontSize: 10,
  },
  habitStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statText: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginLeft: spacing.xxs,
  },
  habitItemRight: {
    alignItems: 'flex-end',
    marginLeft: spacing.md,
  },
  strengthPercentage: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.h3,
    color: colors.text.secondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});