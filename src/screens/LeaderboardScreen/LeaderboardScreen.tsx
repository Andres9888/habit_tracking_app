/**
 * LeaderboardScreen - Habit Streaks Leaderboard
 * Shows a ranked list of habits sorted by current streak length
 * Gold/silver/bronze medals for top 3
 * Includes best streak comparison
 */

import React, { useMemo } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useQuery } from 'convex/react';
import { Trophy, Medal, Flame, TrendingUp } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../../../convex/_generated/api';
import { colors } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';
import type { Id } from '../../../convex/_generated/dataModel';

interface LeaderboardItem {
  _creationTime: number;
  _id: Id<'habits'>;
  name: string;
  icon?: string;
  iconColor?: string;
  currentStreak?: number;
  bestStreak?: number;
}

interface LeaderboardScreenProps {
  onBack: () => void;
}

function LeaderboardHeader({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      className='flex-row items-center justify-between px-4 pb-4'
      style={{ paddingTop: insets.top + 12 }}
    >
      <Pressable
        className='rounded-full p-2'
        onPress={onBack}
        style={{ backgroundColor: themeColors.surface }}
      >
        <Text style={{ color: themeColors.text.primary }}>← Back</Text>
      </Pressable>
      <View className='flex-row items-center gap-2'>
        <Trophy color='#f59e0b' size={24} />
        <Text className='text-xl font-bold' style={{ color: themeColors.text.primary }}>
          Streak Leaderboard
        </Text>
      </View>
      <View style={{ width: 60 }} />
    </View>
  );
}

function MedalIcon({ rank }: { rank: number }) {
  const medalConfig = {
    0: { icon: Medal, color: '#ffd700', label: '🥇', shadow: '#b8860b' }, // Gold
    1: { icon: Medal, color: '#c0c0c0', label: '🥈', shadow: '#808080' }, // Silver
    2: { icon: Medal, color: '#cd7f32', label: '🥉', shadow: '#8b4513' }, // Bronze
  };

  if (rank > 2) return null;

  const config = medalConfig[rank as 0 | 1 | 2];
  const Icon = config.icon;

  return (
    <View
      className='h-10 w-10 items-center justify-center rounded-full'
      style={{
        backgroundColor: config.color + '20',
        shadowColor: config.shadow,
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}
    >
      <Text className='text-xl'>{config.label}</Text>
    </View>
  );
}

function LeaderboardRow({
  habit,
  rank,
}: {
  habit: LeaderboardItem;
  rank: number;
}) {
  const { colors: themeColors } = useThemeColors();
  const currentStreak = habit.currentStreak ?? 0;
  const bestStreak = habit.bestStreak ?? 0;
  const isTopThree = rank < 3;

  return (
    <Animated.View
      entering={FadeInDown.delay(rank * 80).springify().damping(18)}
      className='mx-4 mb-3 flex-row items-center rounded-2xl p-4'
      style={{
        backgroundColor: themeColors.card,
        borderWidth: isTopThree ? 1 : 0,
        borderColor: rank === 0 ? '#ffd700' : rank === 1 ? '#c0c0c0' : '#cd7f32',
        shadowColor: '#000',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      }}
    >
      <View className='w-12 items-center'>
        {rank < 3 ? (
          <MedalIcon rank={rank} />
        ) : (
          <Text
            className='text-lg font-bold'
            style={{ color: themeColors.text.secondary }}
          >
            #{rank + 1}
          </Text>
        )}
      </View>

      <View className='ml-3 flex-1'>
        <Text
          className='text-base font-semibold'
          style={{ color: themeColors.text.primary }}
          numberOfLines={1}
        >
          {habit.name}
        </Text>
        <View className='mt-1 flex-row items-center gap-3'>
          <View className='flex-row items-center gap-1'>
            <Flame color='#f59e0b' size={14} />
            <Text
              className='text-sm font-medium'
              style={{ color: themeColors.text.primary }}
            >
              {currentStreak} day{currentStreak !== 1 ? 's' : ''}
            </Text>
          </View>
          {bestStreak > currentStreak && (
            <View className='flex-row items-center gap-1'>
              <TrendingUp color='#10b981' size={12} />
              <Text
                className='text-xs'
                style={{ color: themeColors.text.secondary }}
              >
                Best: {bestStreak}
              </Text>
            </View>
          )}
        </View>
      </View>

      {rank === 0 && currentStreak > 0 && (
        <View
          className='rounded-full px-3 py-1'
          style={{ backgroundColor: '#fef3c7' }}
        >
          <Text className='text-xs font-bold' style={{ color: '#92400e' }}>
            🔥 HOT
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

function EmptyState({ onBack }: { onBack: () => void }) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='flex-1 items-center justify-center px-8'>
      <Trophy color={themeColors.text.secondary} size={64} />
      <Text
        className='mt-4 text-center text-lg font-semibold'
        style={{ color: themeColors.text.primary }}
      >
        No Habits Yet
      </Text>
      <Text
        className='mt-2 text-center'
        style={{ color: themeColors.text.secondary }}
      >
        Create some habits and start building streaks to see them on the leaderboard!
      </Text>
      <Pressable
        className='mt-6 rounded-xl px-6 py-3'
        style={{ backgroundColor: colors.primary[500] }}
        onPress={onBack}
      >
        <Text className='font-semibold text-white'>Go Back</Text>
      </Pressable>
    </View>
  );
}

export default function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const habitsQuery = useQuery(api.habits.list);
  const habits = habitsQuery ?? [];
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useThemeColors();

  const sortedHabits = useMemo(() => {
    return [...habits]
      .filter((h) => h.archived !== true && h.paused !== true)
      .sort((a, b) => (b.currentStreak ?? 0) - (a.currentStreak ?? 0));
  }, [habits]);

  const renderItem = ({ item, index }: { item: LeaderboardItem; index: number }) => (
    <LeaderboardRow habit={item} rank={index} />
  );

  return (
    <View className='flex-1' style={{ backgroundColor: themeColors.background }}>
      <LeaderboardHeader onBack={onBack} />

      {sortedHabits.length === 0 ? (
        <EmptyState onBack={onBack} />
      ) : (
        <FlatList
          data={sortedHabits}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
